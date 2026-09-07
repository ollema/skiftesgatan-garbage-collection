import {
	BEFINTLIG_STOLPE_DISTANCE,
	GANG_LENGTH,
	GANG_WIDTH,
	INHAGNAD_DEPTH,
	INHAGNAD_OFFSET_X,
	INHAGNAD_OFFSET_Y,
	INHAGNAD_WIDTH,
	PLATT_YTOR,
	PLINT_TOP,
	type Rect,
	SKJUL_DEPTH,
	STAKET,
	STAKET_KLADSEL,
	STOLPAR,
	STOLPE_WIDTH,
	TRALL_GAP,
	TRALL_THICKNESS,
	TRALL_WIDTH
} from './dimensions';

export const PLAN_SCALE = 100;

/** Schaktens kant längs det befintliga staketet, längst bort från skjulet. */
export const SCHAKT_EDGE_X = INHAGNAD_OFFSET_X + INHAGNAD_WIDTH;
export const GANG_END_Y = INHAGNAD_OFFSET_Y + INHAGNAD_DEPTH + GANG_LENGTH;

// Marginalerna ger plats åt måttlinjer: två kolumner till höger och vänster,
// två rader upptill och nedtill.
const PLAN_BOUNDS = {
	xMin: PLATT_YTOR.anslutning.x - 0.75,
	xMax: SCHAKT_EDGE_X + 0.85,
	yMin: -0.7,
	yMax: GANG_END_Y + 0.7
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

// --- Lager: det som kan tändas och släckas per ritning ---

export type Layer =
	| 'markering'
	| 'schakt'
	| 'plinthal'
	| 'plint-topp'
	| 'fiberduk'
	| 'barlager'
	| 'stenmjol'
	| 'plattor'
	| 'stolpar'
	| 'reglar'
	| 'trall'
	| 'karl';

// --- Det befintliga: skjul, asfalt, staket ---

export const SHED = {
	x: PLAN_BOUNDS.xMin,
	y: 0,
	width: -PLAN_BOUNDS.xMin,
	depth: SKJUL_DEPTH
};

export const TILE_FIELDS = {
	enclosure: PLATT_YTOR.inhagnad,
	path: PLATT_YTOR.gang,
	connector: PLATT_YTOR.anslutning
};

export const ASPHALT = {
	x: PLAN_BOUNDS.xMin,
	y: SKJUL_DEPTH,
	width: TILE_FIELDS.connector.x - PLAN_BOUNDS.xMin,
	height: PLAN_BOUNDS.yMax - SKJUL_DEPTH
};

export const EXISTING_FENCE = {
	x1: PLAN_BOUNDS.xMin,
	y1: -0.03,
	x2: STAKET.corner.x + STOLPE_WIDTH / 2 + 0.05,
	y2: -0.03
};

export const EXISTING_STUD = {
	x: BEFINTLIG_STOLPE_DISTANCE,
	y1: -STOLPE_WIDTH,
	y2: 0,
	width: STOLPE_WIDTH
};

export const SHED_STUDS = {
	front: { x1: -STOLPE_WIDTH, x2: 0, y1: SKJUL_DEPTH - STOLPE_WIDTH, y2: SKJUL_DEPTH },
	rear: { x1: -STOLPE_WIDTH, x2: 0, y1: -STOLPE_WIDTH, y2: 0 }
};

export const SHED_FRONT_GUIDE = { x1: PLAN_BOUNDS.xMin, y1: SKJUL_DEPTH, x2: 0, y2: SKJUL_DEPTH };

// --- Det nya staketet ---

/** Reglarna, ritade som en linje i stolpbredd längs varje sida. */
export const NEW_FENCE = {
	far: { x: STAKET.corner.x, y1: 0, y2: STAKET.corner.y },
	front: {
		x1: INHAGNAD_OFFSET_X + GANG_WIDTH,
		x2: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH + STOLPE_WIDTH,
		y: STAKET.corner.y
	}
};

function centeredSquare(center: { x: number; y: number }, size: number): Rect {
	return { x: center.x - size / 2, y: center.y - size / 2, width: size, height: size };
}

/** Plinttopparna sedda uppifrån. */
export const PLINT_TOPP: Rect[] = STOLPAR.map((post) => centeredSquare(post, PLINT_TOP));

/** Brädlägen längs en sida: start och längd för varje bräda, sista kan bli kortare. */
function boardsAlong(from: number, to: number) {
	const pitch = TRALL_WIDTH + TRALL_GAP;
	const count = Math.ceil((to - from) / pitch);
	return Array.from({ length: count }, (_, i) => {
		const start = from + i * pitch;
		return { start, length: Math.min(TRALL_WIDTH, to - start) };
	});
}

/** Trallbrädorna en och en, utanpå reglarna. */
export const TRALL_BOARDS: Rect[] = [
	...boardsAlong(STAKET_KLADSEL.bortre.from, STAKET_KLADSEL.bortre.to).map((b) => ({
		x: STAKET_KLADSEL.bortre.at,
		y: b.start,
		width: TRALL_THICKNESS,
		height: b.length
	})),
	...boardsAlong(STAKET_KLADSEL.framre.from, STAKET_KLADSEL.framre.to).map((b) => ({
		x: b.start,
		y: STAKET_KLADSEL.framre.at,
		width: b.length,
		height: TRALL_THICKNESS
	}))
];

// --- Annoteringar: mått, hänvisningar och etiketter, i meter ---

export type Dimension =
	| {
			kind: 'dimension';
			orientation: 'horizontal';
			from: number;
			to: number;
			at: number;
			label: string;
			/** Texten under linjen istället för ovanför. */
			below?: boolean;
	  }
	| {
			kind: 'dimension';
			orientation: 'vertical';
			from: number;
			to: number;
			at: number;
			label: string;
			/** Texten till vänster om linjen istället för till höger. */
			left?: boolean;
	  };

/** En punkt i ritningen med en förklarande text en bit bort, förbundna med en linje. */
interface Callout {
	kind: 'callout';
	x: number;
	y: number;
	/** Textens läge relativt punkten. Texten ankras bort från punkten. */
	dx: number;
	dy: number;
	label: string;
}

/** Text mitt i ett fält. */
interface FieldLabel {
	kind: 'label';
	x: number;
	y: number;
	label: string;
}

export type Annotation = Dimension | Callout | FieldLabel;
