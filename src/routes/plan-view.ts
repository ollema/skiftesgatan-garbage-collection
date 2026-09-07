import {
	BEFINTLIG_STOLPE_DISTANCE,
	GANG_LENGTH,
	GANG_LENGTH_PLATTOR,
	GANG_WIDTH,
	GANG_WIDTH_PLATTOR,
	GRUS_YTOR,
	INHAGNAD_DEPTH,
	INHAGNAD_DEPTH_PLATTOR,
	INHAGNAD_OFFSET_X,
	INHAGNAD_OFFSET_Y,
	INHAGNAD_WIDTH,
	INHAGNAD_WIDTH_PLATTOR,
	PLATT_YTOR,
	SKJUL_DEPTH,
	STAKET,
	STAKET_KLADSEL,
	STOLPE_WIDTH,
	TRALL_THICKNESS
} from './dimensions';
import { formatMeters } from './format';

export const PLAN_SCALE = 100;

const GANG_END_Y = INHAGNAD_OFFSET_Y + INHAGNAD_DEPTH + GANG_LENGTH;

const PLAN_BOUNDS = {
	xMin: -2.2,
	xMax: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH + 0.85,
	yMin: -0.7,
	yMax: GANG_END_Y + 0.75
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

export const NEW_FENCE = {
	far: { x: STAKET.corner.x, y1: 0, y2: STAKET.corner.y },
	front: {
		x1: INHAGNAD_OFFSET_X + GANG_WIDTH,
		x2: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH + STOLPE_WIDTH,
		y: STAKET.corner.y
	}
};

export const FENCE_CLADDING = {
	far: {
		x: STAKET_KLADSEL.bortre.at,
		y1: STAKET_KLADSEL.bortre.from,
		y2: STAKET_KLADSEL.bortre.to,
		width: TRALL_THICKNESS
	},
	front: {
		x1: STAKET_KLADSEL.framre.from,
		x2: STAKET_KLADSEL.framre.to,
		y: STAKET_KLADSEL.framre.at,
		height: TRALL_THICKNESS
	}
};

export const GRAVEL_ALONG_FENCE = GRUS_YTOR.vidStaketet;
// Ritas ända in under skjulet, annars lyser gräset igenom bakom anslutningsraden.
export const GRAVEL_ALONG_SHED = {
	...GRUS_YTOR.vidSkjulet,
	x: TILE_FIELDS.connector.x,
	width: GRUS_YTOR.vidSkjulet.x + GRUS_YTOR.vidSkjulet.width - TILE_FIELDS.connector.x
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
		to: GANG_END_Y,
		at: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH + 0.32,
		label: `${GANG_LENGTH_PLATTOR} plattor = ${formatMeters(GANG_LENGTH)}`
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
		to: INHAGNAD_OFFSET_X + GANG_WIDTH,
		at: GANG_END_Y + 0.28,
		label: `${GANG_WIDTH_PLATTOR} plattor = ${formatMeters(GANG_WIDTH)}`,
		below: true
	}
];
