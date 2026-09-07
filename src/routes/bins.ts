import { INHAGNAD_OFFSET_X, KRAV_FRITT_FRAMFOR_KARL, SOPKARL_GAP } from './dimensions';

export type SopkarlSize = 'small' | 'large';

export const SOPKARL_SIZES: Record<
	SopkarlSize,
	{ width: number; depth: number; height: number; label: string }
> = {
	small: { width: 0.5, depth: 0.55, height: 1.09, label: '140 l' },
	large: { width: 0.76, depth: 0.8, height: 1.09, label: '370 l' }
};

/** Ordning räknat från skjulet och utåt: färgat glas, ofärgat glas, metall, papper, plast. */
const ORDNING: SopkarlSize[] = ['small', 'small', 'small', 'large', 'large'];

/** Kärlen på rad längs bortre sidan, med spel före varje kärl. */
export const SOPKARL = ORDNING.reduce<{ size: SopkarlSize; x: number }[]>((karl, size) => {
	const prev = karl.at(-1);
	const edge = prev ? prev.x + SOPKARL_SIZES[prev.size].width : INHAGNAD_OFFSET_X;
	return [...karl, { size, x: edge + SOPKARL_GAP }];
}, []);

/** Antal kärl av varje storlek. */
export const SOPKARL_ANTAL: Record<SopkarlSize, number> = {
	small: ORDNING.filter((s) => s === 'small').length,
	large: ORDNING.filter((s) => s === 'large').length
};

// --- Minsta inhägnad som rymmer kärlen: spel runt om och fritt utrymme framför ---

export const MIN_INHAGNAD_DEPTH =
	SOPKARL_GAP + Math.max(...ORDNING.map((s) => SOPKARL_SIZES[s].depth)) + KRAV_FRITT_FRAMFOR_KARL;
export const MIN_INHAGNAD_WIDTH =
	(ORDNING.length + 1) * SOPKARL_GAP + ORDNING.reduce((sum, s) => sum + SOPKARL_SIZES[s].width, 0);
