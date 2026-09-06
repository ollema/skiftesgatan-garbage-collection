import {
	BARLAGER_THICKNESS,
	ENCLOSURE_DEPTH,
	ENCLOSURE_DEPTH_TILES,
	ENCLOSURE_WIDTH,
	ENCLOSURE_WIDTH_TILES,
	GATE,
	GATE_WIDTH,
	POST_WIDTH,
	POSTS,
	SCHAKT_DEPTH,
	STENMJOL_THICKNESS,
	STRIP_LENGTH,
	STRIP_ROWS_TILES,
	STRIP_WIDTH_TILES,
	TILE_PITCH
} from './dimensions';
import { formatKg, formatMeters, formatNumber1 } from './format';

const PRICE = {
	post48: 316.56,
	rail48: 143.76,
	trall45: 85.28,
	plint: 159.0,
	screws: 450,
	hakgangjarn: 259,
	grindklinka: 249,
	gateHolder: 34,
	platta: 24.0,
	plattaFew: 26.9,
	rail24: 72,
	fiberduk: 399,
	fogsand: 199,
	kantsten: 38.8,
	vibrator: 700,
	schakt: 2000,
	bergskross1000: 993.65,
	stenmjol500: 601.3,
	returpall: 279.0,
	pallyftare: 200,
	leverans: 2615.0
};

const BERGSKROSS_SACKS = 2;
const STENMJOL_SACKS = 1;

export interface BomRow {
	label: string;
	quantity: number;
	unitPrice: number;
	cost: number;
	estimated?: boolean;
	url?: string;
}

export interface BomGroup {
	label: string;
	rows: BomRow[];
	sum: number;
}

function bomRow(
	label: string,
	quantity: number,
	unitPrice: number,
	estimated = false,
	url?: string
): BomRow {
	return { label, quantity, unitPrice, cost: Math.round(quantity * unitPrice), estimated, url };
}

function bomGroup(label: string, rows: BomRow[]): BomGroup {
	return { label, rows, sum: rows.reduce((sum, r) => sum + r.cost, 0) };
}

function computeQuantities() {
	const posts = POSTS.length;
	const run = ENCLOSURE_DEPTH + POST_WIDTH + (ENCLOSURE_WIDTH - GATE_WIDTH);
	const boards = Math.ceil((run / 0.13) * 1.05) + Math.ceil(GATE.leafWidth / 0.13);
	const trallLen = Math.ceil(boards / 3);
	const railLen = Math.ceil((3 * run * 1.1 + 2 * GATE.leafWidth + 2 * 1.4 + 2.0) / 4.8);
	const postLen = Math.ceil(posts / 3);

	const enclosureTiles = ENCLOSURE_WIDTH_TILES * ENCLOSURE_DEPTH_TILES;
	const stripTiles = STRIP_WIDTH_TILES * STRIP_ROWS_TILES;
	const tiles = enclosureTiles + stripTiles;
	const spareTiles = Math.ceil(tiles * 0.05);
	const tilesToBuy = tiles + spareTiles;
	const area = tiles * TILE_PITCH * TILE_PITCH;
	const plattaPrice = tilesToBuy >= 90 ? PRICE.platta : PRICE.plattaFew;

	const stenmjolKg = area * STENMJOL_THICKNESS * 1600;
	const barlagerTon = area * BARLAGER_THICKNESS * 1.8;
	const fogsandBags = Math.max(1, Math.ceil((area * 2.5) / 20));
	const digM3 = area * SCHAKT_DEPTH;

	const pallets = BERGSKROSS_SACKS + STENMJOL_SACKS;

	const KANTSTEN_LENGTH = 0.5;
	const kantstenCount = Math.ceil((STRIP_LENGTH * 2) / KANTSTEN_LENGTH);

	const bomGroups: BomGroup[] = [
		bomGroup('Schaktning', [
			bomRow(`Bortforsling av schaktmassor, ca ${formatNumber1(digM3)} m³`, 1, PRICE.schakt, true)
		]),
		bomGroup(
			`Plattläggning, ${formatNumber1(area)} m² (${enclosureTiles} plattor inhägnad + ${stripTiles} remsa + ${spareTiles} reserv)`,
			[
				bomRow(
					'Markplatta Benders Siena 35×35×5 cm grå',
					tilesToBuy,
					plattaPrice,
					false,
					'https://www.hornbach.se/p/markplatta-benders-siena-slat-fasad-gra-350x350x50mm/8628862/'
				),
				bomRow(
					'Fiberduk under bärlagret, N1 90 g/m², 1,4×25 m (35 m²)',
					1,
					PRICE.fiberduk,
					false,
					'https://www.hornbach.se/p/markduk-geotex-geotextil-fiberduk-n1-90g-m-1-4x25-m/12124052/'
				),
				bomRow(
					'Fogsand 20 kg',
					fogsandBags,
					PRICE.fogsand,
					false,
					'https://www.hornbach.se/p/fogsand-benders-gra-ograshammande-20-kg/10598223/'
				),
				bomRow(
					`Kantsten Benders grå 500×250×50 mm, längs gången (2 × ${formatNumber1(STRIP_LENGTH)} m)`,
					kantstenCount,
					PRICE.kantsten,
					false,
					'https://www.hornbach.se/p/kantsten-benders-gra-500x250x50mm/5148862/'
				),
				bomRow(
					'Bergskross 0–32, storsäck 1 000 kg',
					BERGSKROSS_SACKS,
					PRICE.bergskross1000,
					false,
					'https://stenbolaget.se/products/bergskross-0-32-storsack-1000kg'
				),
				bomRow(
					'Stenmjöl 0–8, storsäck 500 kg',
					STENMJOL_SACKS,
					PRICE.stenmjol500,
					false,
					'https://stenbolaget.se/products/stenmjol-0-8-storsack-500kg-1'
				),
				bomRow('Returpall (EUR-pall)', pallets, PRICE.returpall),
				bomRow('Leverans, bergskross och stenmjöl', 1, PRICE.leverans)
			]
		),
		bomGroup('Staket', [
			bomRow(
				'Betongplint Benders 4" × 700 mm med fast stolpjärn',
				posts,
				PRICE.plint,
				false,
				'https://www.hornbach.se/p/betongplint-benders-4x700mm/5520589/'
			),
			bomRow(
				'Stolpe 95×95 mm NTR A, 4,8 m (3 stolpar per längd)',
				postLen,
				PRICE.post48,
				false,
				'https://www.hornbach.se/p/tryckimpregnerad-stolpe-ntr-a-95x95x4800-mm/6810575/'
			),
			bomRow(
				'Regel 45×95 mm NTR AB, 4,8 m (staket + grindram)',
				railLen,
				PRICE.rail48,
				false,
				'https://www.hornbach.se/p/tryckimpregnerad-regel-ntr-ab-45x95x4800-mm/5196591/'
			),
			bomRow(
				'Trall 28×120 mm NTR AB, 4,5 m (3 brädor per längd)',
				trallLen,
				PRICE.trall45,
				false,
				'https://www.hornbach.se/p/tryckimpregnerad-trall-ntr-ab-28x120x4500-mm/6736138/'
			),
			bomRow(
				'Hakgångjärn HABO 104 500 mm (par, 2 st)',
				1,
				PRICE.hakgangjarn,
				false,
				'https://www.hornbach.se/p/hakgangjarn-habo-104-varmgalvaniserat-stal-500mm/10485738/'
			),
			bomRow(
				'Grindklinka Alberts 80×55 mm rostfritt stål',
				1,
				PRICE.grindklinka,
				false,
				'https://www.hornbach.se/p/grindklinka-alberts-80x55mm-rostfritt-stal/3884117/'
			),
			bomRow(
				'Regel 45×95 mm NTR AB, 2,4 m, på skjulväggen/staketet',
				2,
				PRICE.rail24,
				false,
				'https://www.hornbach.se/p/tryckimpregnerad-regel-ntr-ab-45x95x4800-mm/5196591/'
			),
			bomRow(
				'Stormhasp Alberts med ögla, förzinkad, 157×5 mm, håller grinden uppfälld mot väggen',
				1,
				PRICE.gateHolder,
				false,
				'https://www.hornbach.se/p/stormhasp-alberts-med-ogla-forzinkad-157x5mm/8729295/'
			),
			bomRow(
				'Trallskruv + konstruktionsskruv + bult till befintliga staketet, rostfri',
				1,
				PRICE.screws,
				true,
				'https://www.hornbach.se/c/jarnvaror/skruv-bult/trallskruv/S16916/'
			)
		]),
		bomGroup('Maskinhyra', [
			bomRow('Hyra markvibrator, 1 dag', 1, PRICE.vibrator, true),
			bomRow('Hyra pallyftare, 1 dag', 1, PRICE.pallyftare, true)
		])
	];

	const total = bomGroups.reduce((sum, g) => sum + g.sum, 0);

	return {
		posts,
		run,
		area,
		tiles,
		stenmjolKg,
		barlagerTon,
		digM3,
		bomGroups,
		total
	};
}

export const quantities = computeQuantities();

export const FACTS: { term: string; description: string }[] = [
	{
		term: 'Total yta',
		description: `${ENCLOSURE_WIDTH_TILES} × ${ENCLOSURE_DEPTH_TILES} + ${STRIP_WIDTH_TILES} × ${STRIP_ROWS_TILES} = ${quantities.tiles} plattor ≈ ${formatNumber1(quantities.area)} m²`
	},
	{
		term: 'Schaktning',
		description: `${Math.round(SCHAKT_DEPTH * 100)} cm × ${formatNumber1(quantities.area)} m² ≈ ${formatNumber1(quantities.digM3)} m³ ska schaktas bort`
	},
	{
		term: 'Bärlager',
		description: `${Math.round(BARLAGER_THICKNESS * 100)} cm × ${formatNumber1(quantities.area)} m² ≈ ${formatNumber1(quantities.area * BARLAGER_THICKNESS)} m³ × 1 800 kg/m³ ≈ ${formatNumber1(quantities.barlagerTon)} ton`
	},
	{
		term: 'Stenmjöl',
		description: `3 cm × ${formatNumber1(quantities.area)} m² × 1 600 kg/m³ ≈ ${formatKg(Math.round(quantities.stenmjolKg))}`
	},
	{
		term: 'Staket',
		description: `${formatMeters(quantities.run)} långt, 1,5 m högt och ${quantities.posts} stolpar`
	},
	{
		term: 'Grind',
		description: `${formatMeters(GATE_WIDTH)} bred öppning, blad ${formatMeters(GATE.leafWidth)} brett`
	}
];
