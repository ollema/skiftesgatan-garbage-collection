import {
	ANSLUTNING_HALVPLATTOR,
	ANSLUTNING_LENGTH,
	ANSLUTNING_WIDTH,
	BEFINTLIG_STOLPE_DISTANCE,
	INHAGNAD_DEPTH,
	INHAGNAD_DEPTH_PLATTOR,
	INHAGNAD_OFFSET_X,
	INHAGNAD_OFFSET_Y,
	INHAGNAD_WIDTH,
	INHAGNAD_WIDTH_PLATTOR,
	REMSA_LENGTH,
	REMSA_LENGTH_PLATTOR,
	REMSA_WIDTH,
	REMSA_WIDTH_PLATTOR,
	SKJUL_DEPTH,
	STAKET,
	STOLPAR,
	STOLPE_HOLE_SIZE,
	STOLPE_WIDTH,
	TRALL_THICKNESS
} from './dimensions';
import { formatMeters } from './format';

export const PLAN_SCALE = 100;

const STRIP_END_Y = INHAGNAD_OFFSET_Y + INHAGNAD_DEPTH + REMSA_LENGTH;

const PLAN_BOUNDS = {
	xMin: -2.2,
	xMax: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH + 0.85,
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
	depth: SKJUL_DEPTH
};

export const TILE_FIELDS = {
	enclosure: {
		x: INHAGNAD_OFFSET_X,
		y: INHAGNAD_OFFSET_Y,
		width: INHAGNAD_WIDTH,
		height: INHAGNAD_DEPTH
	},
	strip: {
		x: INHAGNAD_OFFSET_X,
		y: INHAGNAD_OFFSET_Y + INHAGNAD_DEPTH,
		width: REMSA_WIDTH,
		height: REMSA_LENGTH
	},
	connector: {
		x: INHAGNAD_OFFSET_X - ANSLUTNING_WIDTH,
		y: INHAGNAD_OFFSET_Y + INHAGNAD_DEPTH + REMSA_LENGTH - ANSLUTNING_LENGTH,
		width: ANSLUTNING_WIDTH,
		height: ANSLUTNING_LENGTH
	}
};

export const ASPHALT = {
	x: PLAN_BOUNDS.xMin,
	y: SKJUL_DEPTH,
	width: TILE_FIELDS.connector.x - PLAN_BOUNDS.xMin,
	height: PLAN_BOUNDS.yMax - SKJUL_DEPTH,
	labelAt: { x: (PLAN_BOUNDS.xMin + TILE_FIELDS.connector.x) / 2, y: SKJUL_DEPTH + 0.4 }
};

export const EXISTING_FENCE = {
	x1: PLAN_BOUNDS.xMin,
	y1: -0.03,
	x2: STAKET.corner.x + STOLPE_WIDTH / 2 + 0.05,
	y2: -0.03,
	labelAt: { x: PLAN_BOUNDS.xMin, y: -0.14 }
};

export const EXISTING_STUD = {
	x: BEFINTLIG_STOLPE_DISTANCE,
	y1: -STOLPE_WIDTH,
	y2: 0,
	width: STOLPE_WIDTH
};

export const SHED_STUDS = {
	se: { x1: -STOLPE_WIDTH, x2: 0, y1: SKJUL_DEPTH - STOLPE_WIDTH, y2: SKJUL_DEPTH },
	ne: { x1: -STOLPE_WIDTH, x2: 0, y1: -STOLPE_WIDTH, y2: 0 }
};

export const SHED_FRONT_GUIDE = { x1: PLAN_BOUNDS.xMin, y1: SKJUL_DEPTH, x2: 0, y2: SKJUL_DEPTH };

export const NEW_FENCE = {
	east: { x: STAKET.corner.x, y1: 0, y2: STAKET.corner.y },
	south: {
		x1: INHAGNAD_OFFSET_X + REMSA_WIDTH,
		x2: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH + STOLPE_WIDTH,
		y: STAKET.corner.y
	},
	labelAt: {
		x: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH - 0.12,
		y: INHAGNAD_OFFSET_Y + INHAGNAD_DEPTH - 0.3
	}
};

const CLADDING_OUTER_X = STAKET.corner.x + STOLPE_WIDTH / 2;
const CLADDING_OUTER_Y = STAKET.corner.y + STOLPE_WIDTH / 2;
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
	width: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH,
	height: INHAGNAD_OFFSET_Y
};
export const GRAVEL_WEST = {
	x: TILE_FIELDS.connector.x,
	y: INHAGNAD_OFFSET_Y,
	width: INHAGNAD_OFFSET_X - TILE_FIELDS.connector.x,
	height: TILE_FIELDS.connector.y - INHAGNAD_OFFSET_Y
};

export const POST_HOLES = STOLPAR.map((post) => ({
	x: post.x - STOLPE_HOLE_SIZE / 2,
	y: post.y - STOLPE_HOLE_SIZE / 2,
	size: STOLPE_HOLE_SIZE
}));

export const CONNECTOR_LABEL = {
	x: TILE_FIELDS.connector.x - 0.16,
	y: TILE_FIELDS.connector.y + ANSLUTNING_LENGTH / 2,
	text: `${ANSLUTNING_HALVPLATTOR} halvplattor`
};

export const SHED_LABEL_AT = {
	x: PLAN_BOUNDS.xMin + (0 - PLAN_BOUNDS.xMin) / 2,
	y: SKJUL_DEPTH / 2
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
		to: BEFINTLIG_STOLPE_DISTANCE,
		at: -0.58,
		label: `Skjul till bef. stolpe = ${formatMeters(BEFINTLIG_STOLPE_DISTANCE)}`,
		muted: true
	},
	{
		orientation: 'horizontal',
		from: 0,
		to: INHAGNAD_OFFSET_X,
		at: -0.3,
		label: `${formatMeters(INHAGNAD_OFFSET_X)}`
	},
	{
		orientation: 'horizontal',
		from: INHAGNAD_OFFSET_X,
		to: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH,
		at: -0.3,
		label: `${INHAGNAD_WIDTH_PLATTOR} plattor = ${formatMeters(INHAGNAD_WIDTH)}`
	},
	{
		orientation: 'vertical',
		from: 0,
		to: INHAGNAD_OFFSET_Y,
		at: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH + 0.32,
		label: `${formatMeters(INHAGNAD_OFFSET_Y)}`
	},
	{
		orientation: 'vertical',
		from: INHAGNAD_OFFSET_Y,
		to: INHAGNAD_OFFSET_Y + INHAGNAD_DEPTH,
		at: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH + 0.32,
		label: `${INHAGNAD_DEPTH_PLATTOR} plattor = ${formatMeters(INHAGNAD_DEPTH)}`
	},
	{
		orientation: 'vertical',
		from: INHAGNAD_OFFSET_Y + INHAGNAD_DEPTH,
		to: STRIP_END_Y,
		at: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH + 0.32,
		label: `${REMSA_LENGTH_PLATTOR} plattor = ${formatMeters(REMSA_LENGTH)}`
	},
	{
		orientation: 'vertical',
		from: 0,
		to: SKJUL_DEPTH,
		at: -0.5,
		label: formatMeters(SKJUL_DEPTH),
		left: true
	},
	{
		orientation: 'horizontal',
		from: INHAGNAD_OFFSET_X,
		to: INHAGNAD_OFFSET_X + REMSA_WIDTH,
		at: STRIP_END_Y + 0.28,
		label: `${REMSA_WIDTH_PLATTOR} plattor = ${formatMeters(REMSA_WIDTH)}`,
		below: true
	}
];
