import {
	ANSLUTNING_HALVPLATTOR,
	BARLAGER_THICKNESS,
	GANG_LENGTH_PLATTOR,
	GANG_WIDTH_PLATTOR,
	GRUS_YTOR,
	INHAGNAD_DEPTH_PLATTOR,
	INHAGNAD_WIDTH_PLATTOR,
	PLATT_YTOR,
	PLINT_DEPTH,
	PLINT_HAL,
	REGLAR_PER_FACK,
	SCHAKT_DEPTH,
	STAKET_HEIGHT,
	STAKET_SIDOR,
	PLINT_HAL_SIZE,
	type Rect,
	STENMJOL_THICKNESS,
	STOLPE_WIDTH,
	TRALL_GAP,
	TRALL_GROUND_GAP,
	TRALL_THICKNESS,
	TRALL_WIDTH
} from './dimensions';
import {
	formatCm,
	formatKg,
	formatMetersTrimmed,
	formatMm,
	formatNumber1,
	formatNumberTrimmed,
	formatSection,
	listJoin
} from './format';

const PRICE = {
	stolpe48: 316.56,
	trall45: 85.28,
	plint: 159.0,
	skruv: 450,
	platta: 24.0,
	plattaFew: 26.9,
	plattaHalf: 17.0,
	fiberduk: 399,
	fogsand: 199,
	markvibrator: 700,
	bergskross500: 601.3,
	stenmjol500: 601.3,
	returpall: 279.0,
	pallyftare: 200,
	leverans: 2615.0
};

// --- Materialegenskaper som inte är platsmått ---

/** Storsäckarna från Stenbolaget. */
const STORSACK_KG = 500;
const BARLAGER_DENSITY = 1800;
const STENMJOL_DENSITY = 1600;
const FOGSAND_KG_PER_M2 = 2.5;
const FOGSAND_BAG_KG = 20;

/**
 * Stenmjölet räknas till ca 590 kg löst, men lagret packas ihop när plattorna
 * knackas ner — en säck räcker.
 */
const STENMJOL_STORSACKAR = 1;

/** Handelslängder virket kapas ur. */
const STOLPE_STOCK = 4.8;
const TRALL_STOCK = 4.5;

interface BomRow {
	label: string;
	quantity: number;
	unitPrice: number;
	cost: number;
	estimated?: boolean;
	url?: string;
}

interface BomGroup {
	label: string;
	rows: BomRow[];
	sum: number;
}

function bomRow(
	label: string,
	quantity: number,
	unitPrice: number,
	{ estimated = false, url }: { estimated?: boolean; url?: string } = {}
): BomRow {
	return { label, quantity, unitPrice, cost: Math.round(quantity * unitPrice), estimated, url };
}

function bomGroup(label: string, rows: BomRow[]): BomGroup {
	return { label, rows, sum: rows.reduce((sum, r) => sum + r.cost, 0) };
}

/**
 * Arean av unionen av axelparallella rektanglar. Rutnätet av alla kanter delar
 * planet i celler som antingen ligger helt i en rektangel eller helt utanför,
 * så överlappande ytor räknas bara en gång.
 */
function unionArea(rects: Rect[]) {
	const xs = [...new Set(rects.flatMap((r) => [r.x, r.x + r.width]))].sort((a, b) => a - b);
	const ys = [...new Set(rects.flatMap((r) => [r.y, r.y + r.height]))].sort((a, b) => a - b);
	let area = 0;
	for (let i = 0; i < xs.length - 1; i++) {
		for (let j = 0; j < ys.length - 1; j++) {
			const inside = rects.some(
				(r) =>
					r.x <= xs[i] && xs[i + 1] <= r.x + r.width && r.y <= ys[j] && ys[j + 1] <= r.y + r.height
			);
			if (inside) area += (xs[i + 1] - xs[i]) * (ys[j + 1] - ys[j]);
		}
	}
	return area;
}

interface Kap {
	singular: string;
	plural: string;
	length: number;
}

/**
 * Kaplista: längsta biten först, i den första längd där den får plats. Ger inte
 * garanterat minsta möjliga spill, men en plan som går att följa med sågen.
 */
function kapa(stockLength: number, pieces: Kap[]) {
	const stockar: { pieces: Kap[]; used: number }[] = [];
	for (const piece of [...pieces].sort((a, b) => b.length - a.length)) {
		let stock = stockar.find((st) => st.used + piece.length <= stockLength + 1e-9);
		if (!stock) stockar.push((stock = { pieces: [], used: 0 }));
		stock.pieces.push(piece);
		stock.used += piece.length;
	}
	return stockar.map((stock, i) => {
		const groups: { kap: Kap; count: number }[] = [];
		for (const piece of stock.pieces) {
			const group = groups.find(
				(g) => g.kap.plural === piece.plural && g.kap.length === piece.length
			);
			if (group) group.count++;
			else groups.push({ kap: piece, count: 1 });
		}
		const parts = groups.map(
			(g) =>
				`${g.count} ${g.count === 1 ? g.kap.singular : g.kap.plural} à ${formatMetersTrimmed(g.kap.length)}`
		);
		return `Längd ${i + 1}: ${listJoin(parts)} (${formatMetersTrimmed(stockLength - stock.used)} över)`;
	});
}

function computeQuantities() {
	// --- Ytor ---

	const plattorInhagnad = INHAGNAD_WIDTH_PLATTOR * INHAGNAD_DEPTH_PLATTOR;
	const plattorGang = GANG_WIDTH_PLATTOR * GANG_LENGTH_PLATTOR;
	const helaPlattor = plattorInhagnad + plattorGang;

	// Varje grupp räknas som det den lägger till ovanpå de föregående, så den
	// del av plinthålen som ligger inne under plattfältet inte räknas två gånger.
	const platt = Object.values(PLATT_YTOR);
	const grus = Object.values(GRUS_YTOR);
	const plattArea = unionArea(platt);
	const hardgjordArea = unionArea([...platt, ...grus]);
	const totalArea = unionArea([...platt, ...grus, ...PLINT_HAL]);

	// Hela ytan schaktas till plattlagrets djup; plinthålen går vidare ner.
	const plintar = PLINT_HAL.length;
	const plintHalArea = plintar * PLINT_HAL_SIZE * PLINT_HAL_SIZE;
	const schaktM3 = totalArea * SCHAKT_DEPTH + plintHalArea * (PLINT_DEPTH - SCHAKT_DEPTH);

	// --- Plattor och markuppbyggnad ---

	const plattaPrice = helaPlattor >= 90 ? PRICE.platta : PRICE.plattaFew;

	const barlagerKg = hardgjordArea * BARLAGER_THICKNESS * BARLAGER_DENSITY;
	const barlagerSackar = Math.ceil(barlagerKg / STORSACK_KG);
	// Stenmjölet är avjämningslagret direkt under plattorna, grusremsorna får inget.
	const stenmjolKg = plattArea * STENMJOL_THICKNESS * STENMJOL_DENSITY;
	const stenmjolSackar = STENMJOL_STORSACKAR;
	const fogsandBags = Math.max(1, Math.ceil((plattArea * FOGSAND_KG_PER_M2) / FOGSAND_BAG_KG));
	const pallar = barlagerSackar + stenmjolSackar;

	// --- Staketet ---

	const fack = STAKET_SIDOR.flatMap((s) => s.fack);
	const kladselLength = STAKET_SIDOR.reduce((sum, s) => sum + s.kladsel, 0);

	// En stolpe per plint, plus den som skruvas fast i det befintliga staketets
	// stolpe. Hörnstolpen delas mellan de två sidorna.
	const stolpar = plintar + 1;
	const stolpeLength = STAKET_HEIGHT;

	// Stolpar och reglar kapas ur samma handelslängd, så de packas tillsammans.
	const virkeKap = kapa(STOLPE_STOCK, [
		...Array.from({ length: stolpar }, () => ({
			singular: 'stolpe',
			plural: 'stolpar',
			length: stolpeLength
		})),
		...fack.flatMap((f) =>
			Array.from({ length: REGLAR_PER_FACK }, () => ({
				singular: 'regel',
				plural: 'reglar',
				length: f
			}))
		)
	]);
	const stolpeRegelStockar = virkeKap.length;

	const trallPitch = TRALL_WIDTH + TRALL_GAP;
	const bradorPerSida = STAKET_SIDOR.map((s) => ({
		short: s.short,
		brador: Math.ceil(s.kladsel / trallPitch)
	}));
	const brador = bradorPerSida.reduce((sum, b) => sum + b.brador, 0);
	const bradLength = STAKET_HEIGHT - TRALL_GROUND_GAP;
	const bradorPerStock = Math.floor(TRALL_STOCK / bradLength);
	const trallStockar = Math.ceil(brador / bradorPerStock);

	const bomGroups: BomGroup[] = [
		bomGroup('Plattläggning', [
			bomRow('Markplatta Benders Siena 35×35×5 cm grå', helaPlattor, plattaPrice, {
				url: 'https://www.hornbach.se/p/markplatta-benders-siena-slat-fasad-gra-350x350x50mm/8628862/'
			}),
			bomRow(
				'Markplatta Benders Siena 35×17,5×5 cm grå, halv',
				ANSLUTNING_HALVPLATTOR,
				PRICE.plattaHalf,
				{
					url: 'https://www.hornbach.se/p/markplatta-benders-siena-slat-fasad-gra-350x175x50mm/8407799/'
				}
			),
			bomRow('Fiberduk under bärlagret, N1 90 g/m², 1,4×25 m (35 m²)', 1, PRICE.fiberduk, {
				url: 'https://www.hornbach.se/p/markduk-geotex-geotextil-fiberduk-n1-90g-m-1-4x25-m/12124052/'
			}),
			bomRow('Fogsand 20 kg', fogsandBags, PRICE.fogsand, {
				url: 'https://www.hornbach.se/p/fogsand-benders-gra-ograshammande-20-kg/10598223/'
			}),
			bomRow('Bergskross 0–32, storsäck 500 kg', barlagerSackar, PRICE.bergskross500, {
				url: 'https://stenbolaget.se/products/bergskross-0-32-storsack-500kg'
			}),
			bomRow('Stenmjöl 0–8, storsäck 500 kg', stenmjolSackar, PRICE.stenmjol500, {
				url: 'https://stenbolaget.se/products/stenmjol-0-8-storsack-500kg-1'
			}),
			bomRow('Returpall (EUR-pall)', pallar, PRICE.returpall),
			bomRow('Leverans, bergskross och stenmjöl', 1, PRICE.leverans)
		]),
		bomGroup('Staket', [
			bomRow('Betongplint Benders 4" × 700 mm med fast stolpjärn', plintar, PRICE.plint, {
				url: 'https://www.hornbach.se/p/betongplint-benders-4x700mm/5520589/'
			}),
			bomRow(
				`Stolpe/regel ${formatSection(STOLPE_WIDTH, STOLPE_WIDTH)} NTR A, ${formatMetersTrimmed(STOLPE_STOCK)}`,
				stolpeRegelStockar,
				PRICE.stolpe48,
				{ url: 'https://www.hornbach.se/p/tryckimpregnerad-stolpe-ntr-a-95x95x4800-mm/6810575/' }
			),
			bomRow(
				`Trall ${formatSection(TRALL_THICKNESS, TRALL_WIDTH)} NTR AB, ${formatMetersTrimmed(TRALL_STOCK)}`,
				trallStockar,
				PRICE.trall45,
				{ url: 'https://www.hornbach.se/p/tryckimpregnerad-trall-ntr-ab-28x120x4500-mm/6736138/' }
			),
			bomRow(
				'Trallskruv + konstruktionsskruv + bult till befintliga staketet, rostfri',
				1,
				PRICE.skruv,
				{
					estimated: true,
					url: 'https://www.hornbach.se/c/jarnvaror/skruv-bult/trallskruv/S16916/'
				}
			)
		]),
		bomGroup('Maskinhyra', [
			bomRow('Hyra markvibrator, 1 dag', 1, PRICE.markvibrator, { estimated: true }),
			bomRow('Hyra pallyftare, 1 dag', 1, PRICE.pallyftare, { estimated: true })
		])
	];

	const total = bomGroups.reduce((sum, g) => sum + g.sum, 0);

	return {
		helaPlattor,
		fogsandBags,
		plintar,
		plattArea,
		hardgjordArea,
		totalArea,
		schaktM3,
		barlagerKg,
		stenmjolKg,
		fack,
		kladselLength,
		stolpar,
		virkeKap,
		stolpeRegelStockar,
		bradorPerSida,
		brador,
		bradLength,
		bradorPerStock,
		trallStockar,
		bomGroups,
		total
	};
}

export const quantities = computeQuantities();

const q = quantities;

export interface Fact {
	term: string;
	description: string;
	items?: string[];
}

export const FACTS: Fact[] = [
	{
		term: 'Total yta',
		description: `Cirka ${formatNumber1(q.totalArea)} m² (plattor, grus och plinthål).`
	},
	{
		term: 'Schaktning',
		description: `Cirka ${formatNumber1(q.schaktM3)} m³`
	},
	{
		term: 'Markplattor',
		description: `${INHAGNAD_WIDTH_PLATTOR} × ${INHAGNAD_DEPTH_PLATTOR} + ${GANG_WIDTH_PLATTOR} × ${GANG_LENGTH_PLATTOR} = ${q.helaPlattor} hela, plus ${ANSLUTNING_HALVPLATTOR} halva.`
	},
	{
		term: 'Bärlager',
		description: `${formatCm(BARLAGER_THICKNESS)} × ${formatNumber1(q.hardgjordArea)} m² plattor och grus, ca ${formatKg(q.barlagerKg)}.`
	},
	{
		term: 'Stenmjöl',
		description: `${formatCm(STENMJOL_THICKNESS)} × ${formatNumber1(q.plattArea)} m² under plattorna, ca ${formatKg(q.stenmjolKg)}.`
	},
	{
		term: 'Fogsand',
		description: `${formatNumberTrimmed(FOGSAND_KG_PER_M2)} kg/m² × ${formatNumber1(q.plattArea)} m², ca ${formatKg(FOGSAND_KG_PER_M2 * q.plattArea)}.`
	},
	{
		term: `Virke ${formatSection(STOLPE_WIDTH, STOLPE_WIDTH)}`,
		description: `${q.stolpeRegelStockar} längder à ${formatMetersTrimmed(STOLPE_STOCK)}:`,
		items: q.virkeKap
	},
	{
		term: `Trall ${formatSection(TRALL_THICKNESS, TRALL_WIDTH)}`,
		description: `${q.trallStockar} längder à ${formatMetersTrimmed(TRALL_STOCK)}:`,
		items: [
			`${q.bradorPerStock} brädor à ${formatMetersTrimmed(q.bradLength)} per längd`,
			`${q.brador} brädor totalt, stående med ${formatMm(TRALL_GAP)} springa`
		]
	}
];
