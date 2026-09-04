import {
	ENCLOSURE_DEPTH,
	ENCLOSURE_DEPTH_TILES,
	ENCLOSURE_WIDTH,
	ENCLOSURE_WIDTH_TILES,
	FENCE,
	GATE_WIDTH,
	POST_WIDTH,
	SHED_DEPTH,
	STRIP_LENGTH,
	STRIP_ROWS_TILES,
	STRIP_WIDTH,
	STRIP_WIDTH_TILES
} from './dimensions';
import { formatMeters } from './format';

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
	east: { x: FENCE.corner.x, y1: 0, y2: FENCE.corner.y },
	south: { x1: GATE_WIDTH, x2: ENCLOSURE_WIDTH + POST_WIDTH, y: FENCE.corner.y },
	labelAt: { x: ENCLOSURE_WIDTH - 0.12, y: ENCLOSURE_DEPTH - 0.3 }
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
		label: `${ENCLOSURE_WIDTH_TILES} plattor = ${formatMeters(ENCLOSURE_WIDTH)}`
	},
	{
		orientation: 'vertical',
		from: 0,
		to: ENCLOSURE_DEPTH,
		at: ENCLOSURE_WIDTH + 0.32,
		label: `${ENCLOSURE_DEPTH_TILES} plattor = ${formatMeters(ENCLOSURE_DEPTH)}`
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
		from: 0,
		to: STRIP_WIDTH,
		at: STRIP_END_Y + 0.28,
		label: `${STRIP_WIDTH_TILES} plattor = ${formatMeters(STRIP_WIDTH)}`,
		below: true
	},
	{
		orientation: 'vertical',
		from: ENCLOSURE_DEPTH,
		to: STRIP_END_Y,
		at: ENCLOSURE_WIDTH + 0.32,
		label: `${STRIP_ROWS_TILES} plattor = ${formatMeters(STRIP_LENGTH)}`
	}
];
