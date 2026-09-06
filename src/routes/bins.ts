import { GAP } from './dimensions';

export type BinSize = 'small' | 'large';

export const BIN_SIZES: Record<BinSize, { width: number; depth: number; label: string }> = {
	small: { width: 0.5, depth: 0.55, label: '140 l' },
	large: { width: 0.76, depth: 0.8, label: '370 l' }
};

export const BINS: { size: BinSize; x: number; name: [string, string] }[] = [
	{ size: 'small', x: GAP, name: ['Färgat', 'glas'] },
	{ size: 'small', x: GAP + 0.56, name: ['Ofärgat', 'glas'] },
	{ size: 'small', x: GAP + 1.12, name: ['Metall', ''] },
	{ size: 'large', x: 1.74, name: ['Papper', ''] },
	{ size: 'large', x: 1.74 + BIN_SIZES.large.width + GAP, name: ['Plast', ''] }
];
