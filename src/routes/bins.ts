import { INHAGNAD_OFFSET_X, SOPKARL_GAP } from './dimensions';

export type SopkarlSize = 'small' | 'large';

export const SOPKARL_SIZES: Record<SopkarlSize, { width: number; depth: number; label: string }> = {
	small: { width: 0.5, depth: 0.55, label: '140 l' },
	large: { width: 0.76, depth: 0.8, label: '370 l' }
};

export const SOPKARL: { size: SopkarlSize; x: number; name: [string, string] }[] = [
	{ size: 'small', x: INHAGNAD_OFFSET_X + SOPKARL_GAP, name: ['Färgat', 'glas'] },
	{ size: 'small', x: INHAGNAD_OFFSET_X + SOPKARL_GAP + 0.56, name: ['Ofärgat', 'glas'] },
	{ size: 'small', x: INHAGNAD_OFFSET_X + SOPKARL_GAP + 1.12, name: ['Metall', ''] },
	{ size: 'large', x: INHAGNAD_OFFSET_X + 1.74, name: ['Papper', ''] },
	{
		size: 'large',
		x: INHAGNAD_OFFSET_X + 1.74 + SOPKARL_SIZES.large.width + SOPKARL_GAP,
		name: ['Plast', '']
	}
];
