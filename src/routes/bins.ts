import { INHAGNAD_OFFSET_X, SOPKARL_GAP } from './dimensions';

export type SopkarlSize = 'small' | 'large';

export const SOPKARL_SIZES: Record<SopkarlSize, { width: number; depth: number; label: string }> = {
	small: { width: 0.5, depth: 0.55, label: '140 l' },
	large: { width: 0.76, depth: 0.8, label: '370 l' }
};

/** Ordning räknat från skjulet och utåt. */
export const SOPKARL: { size: SopkarlSize; x: number }[] = [
	{ size: 'small', x: INHAGNAD_OFFSET_X + SOPKARL_GAP }, // färgat glas
	{ size: 'small', x: INHAGNAD_OFFSET_X + SOPKARL_GAP + 0.56 }, // ofärgat glas
	{ size: 'small', x: INHAGNAD_OFFSET_X + SOPKARL_GAP + 1.12 }, // metall
	{ size: 'large', x: INHAGNAD_OFFSET_X + 1.74 }, // papper
	{ size: 'large', x: INHAGNAD_OFFSET_X + 1.74 + SOPKARL_SIZES.large.width + SOPKARL_GAP } // plast
];
