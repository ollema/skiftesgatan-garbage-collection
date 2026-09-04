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
	gateHw: 720,
	gateHolder: 100,
	platta: 24.0,
	plattaFew: 26.9,
	rail24: 72,
	fiberduk: 300,
	fogsand: 75,
	kantstod: 400,
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

const WEIGHT_KG = { platta: 14, plint: 45, trall45: 9, rail48: 12, post48: 26 };

export interface BomRow {
	label: string;
	quantity: number;
	unitPrice: number;
	cost: number;
	estimated?: boolean;
}

export interface BomGroup {
	label: string;
	rows: BomRow[];
	sum: number;
}

function bomRow(label: string, quantity: number, unitPrice: number, estimated = false): BomRow {
	return { label, quantity, unitPrice, cost: quantity * unitPrice, estimated };
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
	const palletKg = BERGSKROSS_SACKS * 1000 + STENMJOL_SACKS * 500;

	const bomGroups: BomGroup[] = [
		bomGroup('Schaktning', [
			bomRow(`Bortforsling av schaktmassor, ca ${formatNumber1(digM3)} m³`, 1, PRICE.schakt, true)
		]),
		bomGroup(
			`Plattläggning, ${formatNumber1(area)} m² (${enclosureTiles} plattor inhägnad + ${stripTiles} remsa + ${spareTiles} reserv)`,
			[
				bomRow('Markplatta Benders Siena 35×35×5 cm grå (Hornbach)', tilesToBuy, plattaPrice),
				bomRow('Fiberduk under bärlagret (Hornbach)', 1, PRICE.fiberduk, true),
				bomRow('Fogsand 20 kg (Hornbach)', fogsandBags, PRICE.fogsand, true),
				bomRow('Kantstöd eller betong till ytterkanterna (Hornbach)', 1, PRICE.kantstod, true),
				bomRow(
					'Bergskross 0–32, storsäck 1 000 kg (stenbolaget.se)',
					BERGSKROSS_SACKS,
					PRICE.bergskross1000
				),
				bomRow('Stenmjöl 0–8, storsäck 500 kg (stenbolaget.se)', STENMJOL_SACKS, PRICE.stenmjol500),
				bomRow('Returpall (EUR-pall, stenbolaget.se)', pallets, PRICE.returpall),
				bomRow('Leverans, stenbolaget.se', 1, PRICE.leverans)
			]
		),
		bomGroup('Staket', [
			bomRow('Betongplint Benders 4" × 700 mm med fast stolpjärn', posts, PRICE.plint),
			bomRow('Stolpe 95×95 mm NTR A, 4,8 m (3 stolpar per längd)', postLen, PRICE.post48),
			bomRow('Regel 45×95 mm NTR AB, 4,8 m (staket + grindram)', railLen, PRICE.rail48),
			bomRow('Trall 28×120 mm NTR AB, 4,5 m (3 brädor per längd)', trallLen, PRICE.trall45),
			bomRow('Grindbeslag: 2 hakgångjärn + klinka', 1, PRICE.gateHw),
			bomRow(
				'Regel 45×95 mm, 2,4 m, fästplanka på skjulväggen (gångjärn) och på befintliga staketet',
				2,
				PRICE.rail24
			),
			bomRow('Krok som håller grinden uppfälld mot väggen', 1, PRICE.gateHolder, true),
			bomRow(
				'Trallskruv + konstruktionsskruv + bult till befintliga staketet, rostfri',
				1,
				PRICE.screws,
				true
			)
		]),
		bomGroup('Maskinhyra', [
			bomRow('Hyra markvibrator, 1 dag', 1, PRICE.vibrator, true),
			bomRow('Hyra pallyftare, 1 dag', 1, PRICE.pallyftare)
		])
	];

	const total = bomGroups.reduce((sum, g) => sum + g.sum, 0);

	const weightPlattor = tilesToBuy * WEIGHT_KG.platta;
	const weightTotal =
		weightPlattor +
		posts * WEIGHT_KG.plint +
		trallLen * WEIGHT_KG.trall45 +
		railLen * WEIGHT_KG.rail48 +
		postLen * WEIGHT_KG.post48 +
		80;

	return {
		posts,
		run,
		area,
		enclosureTiles,
		stripTiles,
		tiles,
		spareTiles,
		tilesToBuy,
		stenmjolKg,
		barlagerTon,
		fogsandBags,
		digM3,
		pallets,
		palletKg,
		bergskrossSacks: BERGSKROSS_SACKS,
		stenmjolSacks: STENMJOL_SACKS,
		bomGroups,
		total,
		weightPlattor,
		weightTotal
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
		description: `${Math.round(SCHAKT_DEPTH * 100)} cm bärlager × ${formatNumber1(quantities.area)} m² ≈ ${formatNumber1(quantities.digM3)} m³`
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
