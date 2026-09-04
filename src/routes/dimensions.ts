// --- Grundmått ------------------------------------------------------------

export const GAP = 0.06;
export const TILE_PITCH = 0.353;
export const POST_WIDTH = 0.095;
export const SHED_DEPTH = 2.67;

export const ENCLOSURE_WIDTH_TILES = 10;
export const ENCLOSURE_DEPTH_TILES = 7;
export const STRIP_WIDTH_TILES = 4;
export const STRIP_ROWS_TILES = 5;

const PLATTA_THICKNESS = 0.05;
export const STENMJOL_THICKNESS = 0.03;
export const BARLAGER_THICKNESS = 0.1;
export const SCHAKT_DEPTH = PLATTA_THICKNESS + STENMJOL_THICKNESS + BARLAGER_THICKNESS;

export const ENCLOSURE_WIDTH = ENCLOSURE_WIDTH_TILES * TILE_PITCH;
export const ENCLOSURE_DEPTH = ENCLOSURE_DEPTH_TILES * TILE_PITCH;
export const STRIP_WIDTH = STRIP_WIDTH_TILES * TILE_PITCH;
export const STRIP_LENGTH = STRIP_ROWS_TILES * TILE_PITCH;
export const GATE_WIDTH = STRIP_WIDTH;
const GATE_LEAF_WIDTH = GATE_WIDTH - 0.04;

// --- Stolpar --------------------------------------------------------------

const MAX_POST_SPACING = 1.8;

const EAST_POST_COUNT = Math.ceil((ENCLOSURE_DEPTH + POST_WIDTH) / MAX_POST_SPACING);
const SOUTH_POST_COUNT = Math.ceil((ENCLOSURE_WIDTH - GATE_WIDTH) / MAX_POST_SPACING) + 1;

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

export const FENCE = {
	corner: { x: FENCE_CORNER_X, y: FENCE_CORNER_Y },
	anchor: { x: FENCE_CORNER_X, y: 0 }
};

// --- Grind ------------------------------------------------------------------

const GATE_OPEN_ANGLE = (80 * Math.PI) / 180;
const GATE_HINGE = { x: 0.03, y: FENCE_CORNER_Y };

export const GATE = {
	hinge: GATE_HINGE,
	closedEnd: { x: GATE_HINGE.x + GATE_LEAF_WIDTH, y: GATE_HINGE.y },
	openEnd: {
		x: GATE_HINGE.x + GATE_LEAF_WIDTH * Math.cos(GATE_OPEN_ANGLE),
		y: GATE_HINGE.y - GATE_LEAF_WIDTH * Math.sin(GATE_OPEN_ANGLE)
	},
	leafWidth: GATE_LEAF_WIDTH
};
