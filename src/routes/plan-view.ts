import {
	ENCLOSURE_DEPTH,
	ENCLOSURE_DEPTH_TILES,
	ENCLOSURE_OFFSET_X,
	ENCLOSURE_OFFSET_Y,
	ENCLOSURE_WIDTH,
	ENCLOSURE_WIDTH_TILES,
	EXISTING_STUD_DISTANCE,
	FENCE,
	PATH_CONNECTOR_LENGTH,
	PATH_CONNECTOR_TILES,
	PATH_CONNECTOR_WIDTH,
	POST_HOLE_SIZE,
	POST_WIDTH,
	POSTS,
	SHED_DEPTH,
	STRIP_LENGTH,
	STRIP_ROWS_TILES,
	STRIP_WIDTH,
	STRIP_WIDTH_TILES,
	TRALL_THICKNESS
} from './dimensions';
import { formatMeters } from './format';

export const PLAN_SCALE = 100;

const STRIP_END_Y = ENCLOSURE_OFFSET_Y + ENCLOSURE_DEPTH + STRIP_LENGTH;

const PLAN_BOUNDS = {
	xMin: -2.2,
	xMax: ENCLOSURE_OFFSET_X + ENCLOSURE_WIDTH + 0.85,
	yMin: -0.7,
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

export const TILE_FIELDS = {
	enclosure: {
		x: ENCLOSURE_OFFSET_X,
		y: ENCLOSURE_OFFSET_Y,
		width: ENCLOSURE_WIDTH,
		height: ENCLOSURE_DEPTH
	},
	strip: {
		x: ENCLOSURE_OFFSET_X,
		y: ENCLOSURE_OFFSET_Y + ENCLOSURE_DEPTH,
		width: STRIP_WIDTH,
		height: STRIP_LENGTH
	},
	connector: {
		x: ENCLOSURE_OFFSET_X - PATH_CONNECTOR_WIDTH,
		y: ENCLOSURE_OFFSET_Y + ENCLOSURE_DEPTH + STRIP_LENGTH - PATH_CONNECTOR_LENGTH,
		width: PATH_CONNECTOR_WIDTH,
		height: PATH_CONNECTOR_LENGTH
	}
};

export const ASPHALT = {
	x: PLAN_BOUNDS.xMin,
	y: SHED_DEPTH,
	width: TILE_FIELDS.connector.x - PLAN_BOUNDS.xMin,
	height: PLAN_BOUNDS.yMax - SHED_DEPTH,
	labelAt: { x: (PLAN_BOUNDS.xMin + TILE_FIELDS.connector.x) / 2, y: SHED_DEPTH + 0.4 }
};

export const EXISTING_FENCE = {
	x1: PLAN_BOUNDS.xMin,
	y1: -0.03,
	x2: FENCE.corner.x + POST_WIDTH / 2 + 0.05,
	y2: -0.03,
	labelAt: { x: PLAN_BOUNDS.xMin, y: -0.14 }
};

export const EXISTING_STUD = {
	x: EXISTING_STUD_DISTANCE,
	y1: -POST_WIDTH,
	y2: 0,
	width: POST_WIDTH
};

export const SHED_STUDS = {
	se: { x1: -POST_WIDTH, x2: 0, y1: SHED_DEPTH - POST_WIDTH, y2: SHED_DEPTH },
	ne: { x1: -POST_WIDTH, x2: 0, y1: -POST_WIDTH, y2: 0 }
};

export const SHED_FRONT_GUIDE = { x1: PLAN_BOUNDS.xMin, y1: SHED_DEPTH, x2: 0, y2: SHED_DEPTH };

export const NEW_FENCE = {
	east: { x: FENCE.corner.x, y1: 0, y2: FENCE.corner.y },
	south: {
		x1: ENCLOSURE_OFFSET_X + STRIP_WIDTH,
		x2: ENCLOSURE_OFFSET_X + ENCLOSURE_WIDTH + POST_WIDTH,
		y: FENCE.corner.y
	},
	labelAt: {
		x: ENCLOSURE_OFFSET_X + ENCLOSURE_WIDTH - 0.12,
		y: ENCLOSURE_OFFSET_Y + ENCLOSURE_DEPTH - 0.3
	}
};

const CLADDING_OUTER_X = FENCE.corner.x + POST_WIDTH / 2;
const CLADDING_OUTER_Y = FENCE.corner.y + POST_WIDTH / 2;
export const FENCE_CLADDING = {
	east: {
		x: CLADDING_OUTER_X,
		y1: NEW_FENCE.east.y1,
		y2: CLADDING_OUTER_Y + TRALL_THICKNESS,
		width: TRALL_THICKNESS
	},
	south: {
		x1: NEW_FENCE.south.x1,
		x2: CLADDING_OUTER_X + TRALL_THICKNESS,
		y: CLADDING_OUTER_Y,
		height: TRALL_THICKNESS
	}
};

export const GRAVEL_NORTH = {
	x: 0,
	y: 0,
	width: ENCLOSURE_OFFSET_X + ENCLOSURE_WIDTH,
	height: ENCLOSURE_OFFSET_Y
};
export const GRAVEL_WEST = {
	x: TILE_FIELDS.connector.x,
	y: ENCLOSURE_OFFSET_Y,
	width: ENCLOSURE_OFFSET_X - TILE_FIELDS.connector.x,
	height: TILE_FIELDS.connector.y - ENCLOSURE_OFFSET_Y
};

export const POST_HOLES = POSTS.map((post) => ({
	x: post.x - POST_HOLE_SIZE / 2,
	y: post.y - POST_HOLE_SIZE / 2,
	size: POST_HOLE_SIZE
}));

export const CONNECTOR_LABEL = {
	x: TILE_FIELDS.connector.x - 0.16,
	y: TILE_FIELDS.connector.y + PATH_CONNECTOR_LENGTH / 2,
	text: `${PATH_CONNECTOR_TILES} halvplattor`
};

export const SHED_LABEL_AT = {
	x: PLAN_BOUNDS.xMin + (0 - PLAN_BOUNDS.xMin) / 2,
	y: SHED_DEPTH / 2
};

export type Dimension =
	| {
			orientation: 'horizontal';
			from: number;
			to: number;
			at: number;
			label: string;
			below?: boolean;
			muted?: boolean;
	  }
	| {
			orientation: 'vertical';
			from: number;
			to: number;
			at: number;
			label: string;
			left?: boolean;
			muted?: boolean;
	  };

export const PLAN_DIMENSIONS: Dimension[] = [
	{
		orientation: 'horizontal',
		from: 0,
		to: EXISTING_STUD_DISTANCE,
		at: -0.58,
		label: `Skjul till bef. stolpe = ${formatMeters(EXISTING_STUD_DISTANCE)}`,
		muted: true
	},
	{
		orientation: 'horizontal',
		from: 0,
		to: ENCLOSURE_OFFSET_X,
		at: -0.3,
		label: `${formatMeters(ENCLOSURE_OFFSET_X)}`
	},
	{
		orientation: 'horizontal',
		from: ENCLOSURE_OFFSET_X,
		to: ENCLOSURE_OFFSET_X + ENCLOSURE_WIDTH,
		at: -0.3,
		label: `${ENCLOSURE_WIDTH_TILES} plattor = ${formatMeters(ENCLOSURE_WIDTH)}`
	},
	{
		orientation: 'vertical',
		from: 0,
		to: ENCLOSURE_OFFSET_Y,
		at: ENCLOSURE_OFFSET_X + ENCLOSURE_WIDTH + 0.32,
		label: `${formatMeters(ENCLOSURE_OFFSET_Y)}`
	},
	{
		orientation: 'vertical',
		from: ENCLOSURE_OFFSET_Y,
		to: ENCLOSURE_OFFSET_Y + ENCLOSURE_DEPTH,
		at: ENCLOSURE_OFFSET_X + ENCLOSURE_WIDTH + 0.32,
		label: `${ENCLOSURE_DEPTH_TILES} plattor = ${formatMeters(ENCLOSURE_DEPTH)}`
	},
	{
		orientation: 'vertical',
		from: ENCLOSURE_OFFSET_Y + ENCLOSURE_DEPTH,
		to: STRIP_END_Y,
		at: ENCLOSURE_OFFSET_X + ENCLOSURE_WIDTH + 0.32,
		label: `${STRIP_ROWS_TILES} plattor = ${formatMeters(STRIP_LENGTH)}`
	},
	{
		orientation: 'vertical',
		from: 0,
		to: SHED_DEPTH,
		at: -0.5,
		label: formatMeters(SHED_DEPTH),
		left: true
	},
	{
		orientation: 'horizontal',
		from: ENCLOSURE_OFFSET_X,
		to: ENCLOSURE_OFFSET_X + STRIP_WIDTH,
		at: STRIP_END_Y + 0.28,
		label: `${STRIP_WIDTH_TILES} plattor = ${formatMeters(STRIP_WIDTH)}`,
		below: true
	}
];
