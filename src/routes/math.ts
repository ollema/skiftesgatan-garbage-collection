// Fysiska mått och prisuppgifter för inhägnaden, se KRAV.md.
// Detta är en ren beräkningsmodul: inget här renderar markup.

// --- Grundmått (meter) --------------------------------------------------

const GAP = 0.06; // luft mellan kärl/stolpar
export const TILE_PITCH = 0.353; // plattmått inkl. fog
const POST_WIDTH = 0.095;
const SHED_DEPTH = 2.67; // cykelskjulets djup

const ENCLOSURE_WIDTH_TILES = 10;
const ENCLOSURE_DEPTH_TILES = 7;
const STRIP_WIDTH_TILES = 4;
const STRIP_ROWS_TILES = 5;

const PLATTA_THICKNESS = 0.05;
const STENMJOL_THICKNESS = 0.03;
const BARLAGER_THICKNESS = 0.1;
const SCHAKT_DEPTH = PLATTA_THICKNESS + STENMJOL_THICKNESS + BARLAGER_THICKNESS;

export const ENCLOSURE_WIDTH = ENCLOSURE_WIDTH_TILES * TILE_PITCH;
export const ENCLOSURE_DEPTH = ENCLOSURE_DEPTH_TILES * TILE_PITCH;
export const STRIP_WIDTH = STRIP_WIDTH_TILES * TILE_PITCH;
export const STRIP_LENGTH = STRIP_ROWS_TILES * TILE_PITCH;
export const GATE_WIDTH = STRIP_WIDTH;
const GATE_LEAF_WIDTH = GATE_WIDTH - 0.04;

export { SHED_DEPTH, POST_WIDTH, GAP };

// --- Kärl -----------------------------------------------------------------

export type BinSize = 'small' | 'large';

export const BIN_SIZES: Record<
	BinSize,
	{ width: number; depth: number; label: string; wheels: [number, number][] }
> = {
	small: {
		width: 0.5,
		depth: 0.55,
		label: '140 l',
		wheels: [
			[0.22, 0.12],
			[0.78, 0.12]
		]
	},
	large: {
		width: 0.76,
		depth: 0.8,
		label: '370 l',
		wheels: [
			[0.2, 0.12],
			[0.8, 0.12],
			[0.2, 0.88],
			[0.8, 0.88]
		]
	}
};

export const BINS: { size: BinSize; x: number; name: [string, string] }[] = [
	{ size: 'small', x: GAP, name: ['Färgat', 'glas'] },
	{ size: 'small', x: GAP + 0.56, name: ['Ofärgat', 'glas'] },
	{ size: 'small', x: GAP + 1.12, name: ['Metall', ''] },
	{ size: 'large', x: 1.74, name: ['Papper', ''] },
	{ size: 'large', x: 1.74 + BIN_SIZES.large.width + GAP, name: ['Plast', ''] }
];

// --- Stolpar --------------------------------------------------------------

const MAX_POST_SPACING = 1.8;

// östra sidan: bakre änden fästs i befintligt staket, resten mellanstolpar + hörnstolpe
const EAST_POST_COUNT = Math.ceil((ENCLOSURE_DEPTH + POST_WIDTH) / MAX_POST_SPACING);
// södra sidan: grindstolpe, mellanstolpar, hörnstolpe
const SOUTH_POST_COUNT = Math.ceil((ENCLOSURE_WIDTH - GATE_WIDTH) / MAX_POST_SPACING) + 1;

// mittpunkt av stolplivet i hörnet mellan öst- och sydsidan
const FENCE_CORNER_X = ENCLOSURE_WIDTH + POST_WIDTH / 2;
const FENCE_CORNER_Y = ENCLOSURE_DEPTH + POST_WIDTH / 2;

const eastPosts = Array.from({ length: EAST_POST_COUNT }, (_, i) => ({
	x: FENCE_CORNER_X,
	y: (FENCE_CORNER_Y * (i + 1)) / EAST_POST_COUNT
}));
const southPosts = Array.from({ length: SOUTH_POST_COUNT - 1 }, (_, i) => ({
	x: GATE_WIDTH + POST_WIDTH / 2 + (i * (ENCLOSURE_WIDTH - GATE_WIDTH)) / (SOUTH_POST_COUNT - 1),
	y: FENCE_CORNER_Y
}));

export const POSTS = [...eastPosts, ...southPosts];
const POST_COUNT = EAST_POST_COUNT + SOUTH_POST_COUNT - 1;

export const FENCE = {
	corner: { x: FENCE_CORNER_X, y: FENCE_CORNER_Y },
	// hörnjärn där nya stolpraden möter det befintliga staketet
	anchor: { x: FENCE_CORNER_X, y: 0 }
};

// --- Grind ------------------------------------------------------------------

const GATE_OPEN_ANGLE = (80 * Math.PI) / 180;
const GATE_HINGE = { x: 0.03, y: FENCE_CORNER_Y };

export const GATE = {
	hinge: GATE_HINGE,
	// grinden helt tillsluten, i linje med sydsidans staket
	closedEnd: { x: GATE_HINGE.x + GATE_LEAF_WIDTH, y: GATE_HINGE.y },
	// grinden uppfälld mot skjulväggen (den ritade positionen)
	openEnd: {
		x: GATE_HINGE.x + GATE_LEAF_WIDTH * Math.cos(GATE_OPEN_ANGLE),
		y: GATE_HINGE.y - GATE_LEAF_WIDTH * Math.sin(GATE_OPEN_ANGLE)
	},
	leafWidth: GATE_LEAF_WIDTH
};

// --- Planritningens vy ------------------------------------------------------

export const PLAN_SCALE = 100; // px per meter

const STRIP_END_Y = ENCLOSURE_DEPTH + STRIP_LENGTH;

export const PLAN_BOUNDS = {
	xMin: -2.2,
	xMax: ENCLOSURE_WIDTH + 0.85,
	yMin: -0.55,
	yMax: STRIP_END_Y + 0.75
};

export const PLAN_VIEWBOX = {
	width: (PLAN_BOUNDS.xMax - PLAN_BOUNDS.xMin) * PLAN_SCALE,
	height: (PLAN_BOUNDS.yMax - PLAN_BOUNDS.yMin) * PLAN_SCALE
};

export function planX(x: number) {
	return (x - PLAN_BOUNDS.xMin) * PLAN_SCALE;
}

export function planY(y: number) {
	return (y - PLAN_BOUNDS.yMin) * PLAN_SCALE;
}

export const SHED = {
	x: PLAN_BOUNDS.xMin,
	y: 0,
	width: -PLAN_BOUNDS.xMin,
	depth: SHED_DEPTH
};

export const ASPHALT = {
	x: PLAN_BOUNDS.xMin,
	y: SHED_DEPTH,
	width: -PLAN_BOUNDS.xMin,
	height: PLAN_BOUNDS.yMax - SHED_DEPTH,
	labelAt: { x: PLAN_BOUNDS.xMin / 2, y: SHED_DEPTH + 0.4 }
};

export const TILE_FIELDS = {
	enclosure: { x: 0, y: 0, width: ENCLOSURE_WIDTH, height: ENCLOSURE_DEPTH },
	strip: { x: 0, y: ENCLOSURE_DEPTH, width: STRIP_WIDTH, height: STRIP_LENGTH }
};

export const EXISTING_FENCE = {
	x1: PLAN_BOUNDS.xMin,
	y1: -0.03,
	x2: ENCLOSURE_WIDTH + POST_WIDTH + 0.05,
	y2: -0.03,
	labelAt: { x: PLAN_BOUNDS.xMin, y: -0.14 }
};

// dashad linje som markerar skjulets öppna framsida
export const SHED_FRONT_GUIDE = { x1: PLAN_BOUNDS.xMin, y1: SHED_DEPTH, x2: 0, y2: SHED_DEPTH };

// dashad hjälplinje mellan remsans hörn och asfaltens kant
export const STRIP_CORNER_GUIDE = {
	x1: STRIP_WIDTH,
	y1: STRIP_END_Y,
	x2: ENCLOSURE_WIDTH + 0.4,
	y2: STRIP_END_Y
};

export const NEW_FENCE = {
	east: { x: FENCE_CORNER_X, y1: 0, y2: FENCE_CORNER_Y },
	south: { x1: GATE_WIDTH, x2: ENCLOSURE_WIDTH + POST_WIDTH, y: FENCE_CORNER_Y },
	labelAt: { x: ENCLOSURE_WIDTH - 0.12, y: ENCLOSURE_DEPTH - 0.3 }
};

export const SHED_LABEL_AT = {
	x: PLAN_BOUNDS.xMin + (0 - PLAN_BOUNDS.xMin) / 2,
	y: SHED_DEPTH / 2
};

const meters = (n: number) => n.toFixed(2).replace('.', ',') + ' m';

export type Dimension =
	| {
			orientation: 'horizontal';
			from: number;
			to: number;
			at: number;
			label: string;
			below?: boolean;
	  }
	| {
			orientation: 'vertical';
			from: number;
			to: number;
			at: number;
			label: string;
			left?: boolean;
	  };

export const PLAN_DIMENSIONS: Dimension[] = [
	{
		orientation: 'horizontal',
		from: 0,
		to: ENCLOSURE_WIDTH,
		at: -0.32,
		label: `${ENCLOSURE_WIDTH_TILES} plattor = ${meters(ENCLOSURE_WIDTH)}`
	},
	{
		orientation: 'vertical',
		from: 0,
		to: ENCLOSURE_DEPTH,
		at: ENCLOSURE_WIDTH + 0.32,
		label: `${ENCLOSURE_DEPTH_TILES} plattor = ${meters(ENCLOSURE_DEPTH)}`
	},
	{
		orientation: 'vertical',
		from: 0,
		to: SHED_DEPTH,
		at: -0.5,
		label: meters(SHED_DEPTH),
		left: true
	},
	{
		orientation: 'horizontal',
		from: 0,
		to: STRIP_WIDTH,
		at: STRIP_END_Y + 0.28,
		label: `${STRIP_WIDTH_TILES} plattor = ${meters(STRIP_WIDTH)}`,
		below: true
	},
	{
		orientation: 'vertical',
		from: ENCLOSURE_DEPTH,
		to: STRIP_END_Y,
		at: ENCLOSURE_WIDTH + 0.32,
		label: `${STRIP_ROWS_TILES} plattor = ${meters(STRIP_LENGTH)}`
	}
];

// --- Snittritningens lager ----------------------------------------------

export const SECTION_LAYERS = [
	{ heightCm: PLATTA_THICKNESS * 100, name: 'Betongplatta 5 cm', kind: 'platta' as const },
	{ heightCm: STENMJOL_THICKNESS * 100, name: 'Stenmjöl 0–4 mm, 3 cm', kind: 'stenmjol' as const },
	{
		heightCm: BARLAGER_THICKNESS * 100,
		name: `Bärlager 0–32 mm, ${Math.round(BARLAGER_THICKNESS * 100)} cm, packat`,
		kind: 'barlager' as const
	}
];

export const SECTION_TOTAL_DEPTH_CM = SECTION_LAYERS.reduce((sum, l) => sum + l.heightCm, 0);

// --- Priser och vikter ------------------------------------------------------

// kr, hornbach.se Göteborg sept 2026 om inte uppsk.
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
	pallyftare: 200, // stenbolaget.se, storsäck på pall
	leverans: 2615.0 // stenbolaget.se, hemleverans av pallarna
};

const WEIGHT_KG = { platta: 14, plint: 45, trall45: 9, rail48: 12, post48: 26 };

const BERGSKROSS_SACKS = 2;
const STENMJOL_SACKS = 1; // 2 × 1000 kg + 1 × 500 kg, se Materialåtgång

// --- Formattering -----------------------------------------------------------

export const formatKr = (n: number) => Math.round(n).toLocaleString('sv-SE') + ' kr';
export const formatMeters = meters;
export const formatNumber1 = (n: number) => n.toFixed(1).replace('.', ',');
export const formatKg = (n: number) =>
	n >= 1000 ? formatNumber1(n / 1000) + ' ton' : Math.round(n) + ' kg';

// --- Materialåtgång och kostnad -----------------------------------------

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
	const posts = POST_COUNT;
	const run = ENCLOSURE_DEPTH + POST_WIDTH + (ENCLOSURE_WIDTH - GATE_WIDTH);
	const boards = Math.ceil((run / 0.13) * 1.05) + Math.ceil(GATE_LEAF_WIDTH / 0.13);
	const trallLen = Math.ceil(boards / 3);
	const railLen = Math.ceil((3 * run * 1.1 + 2 * GATE_LEAF_WIDTH + 2 * 1.4 + 2.0) / 4.8);
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

export const ORDER_NOTES = {
	weightTotal: formatKg(quantities.weightTotal),
	weightPlattor: formatKg(quantities.weightPlattor),
	bergskrossSacks: BERGSKROSS_SACKS,
	stenmjolSacks: STENMJOL_SACKS,
	pallets: quantities.pallets,
	palletKg: formatKg(quantities.palletKg),
	stenmjolNeeded: formatKg(Math.round(quantities.stenmjolKg)),
	digM3: formatNumber1(quantities.digM3)
};
