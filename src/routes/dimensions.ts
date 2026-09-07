// Alla mått i meter, i ett planvy-koordinatsystem:
//   origo = skjulets nordöstra hörn, i linje med det befintliga staketet
//   +x = österut, bort från skjulet — x < 0 ligger alltså inne i skjulet
//   +y = söderut, bort från det befintliga staketet

// --- Platsen: uppmätt på plats ---

export const SKJUL_DEPTH = 2.67;
export const BEFINTLIG_STOLPE_DISTANCE = 3.93;

// --- Material: bestäms av vad som köps ---

export const PLATTA_PITCH = 0.353;
const PLATTA_THICKNESS = 0.05;
export const STOLPE_WIDTH = 0.095;
export const STOLPE_HOLE_SIZE = 0.17;
export const TRALL_THICKNESS = 0.028;
export const STENMJOL_THICKNESS = 0.03;
export const BARLAGER_THICKNESS = 0.1;

// --- Utformning: här ligger designbesluten ---

export const INHAGNAD_WIDTH_PLATTOR = 11;
export const INHAGNAD_DEPTH_PLATTOR = 7;
export const REMSA_WIDTH_PLATTOR = 4;
export const REMSA_LENGTH_PLATTOR = 5;
export const ANSLUTNING_HALVPLATTOR = 4;

/** Spel runt om och mellan kärlen. */
export const SOPKARL_GAP = 0.06;

/** Största tillåtna avstånd mellan två stolpar. */
const MAX_STOLPE_SPACING = 1.8;

// --- Härledda mått ---

export const INHAGNAD_WIDTH = INHAGNAD_WIDTH_PLATTOR * PLATTA_PITCH;
export const INHAGNAD_DEPTH = INHAGNAD_DEPTH_PLATTOR * PLATTA_PITCH;
export const REMSA_WIDTH = REMSA_WIDTH_PLATTOR * PLATTA_PITCH;
export const REMSA_LENGTH = REMSA_LENGTH_PLATTOR * PLATTA_PITCH;
export const ANSLUTNING_LENGTH = ANSLUTNING_HALVPLATTOR * PLATTA_PITCH;
export const ANSLUTNING_WIDTH = PLATTA_PITCH / 2;

export const SCHAKT_DEPTH = PLATTA_THICKNESS + STENMJOL_THICKNESS + BARLAGER_THICKNESS;

/** Staketets sydöstra hörnstolpe, som all plattläggning placeras utifrån. */
const STAKET_CORNER_X = BEFINTLIG_STOLPE_DISTANCE + STOLPE_WIDTH / 2;
const STAKET_CORNER_Y = SKJUL_DEPTH - STOLPE_WIDTH / 2 - TRALL_THICKNESS;

/** Plattfältets nordvästra hörn. */
export const INHAGNAD_OFFSET_X = STAKET_CORNER_X - INHAGNAD_WIDTH - STOLPE_WIDTH / 2;
export const INHAGNAD_OFFSET_Y = STAKET_CORNER_Y - INHAGNAD_DEPTH - STOLPE_WIDTH / 2;

/** Jämnt fördelade stolplägen mellan `from` och `to`, båda ändarna inkluderade. */
function spanStolpar(from: number, to: number) {
	const segments = Math.ceil((to - from) / MAX_STOLPE_SPACING);
	return Array.from({ length: segments + 1 }, (_, i) => from + ((to - from) * i) / segments);
}

// Det östra staketet skruvas fast i det befintliga staketet i norr, så den änden
// får ingen egen stolpe. Det södra staketet delar hörnstolpe med det östra och
// hoppar därför över sin sista punkt.
const eastStolpar = spanStolpar(INHAGNAD_OFFSET_Y, STAKET_CORNER_Y)
	.slice(1)
	.map((y) => ({ x: STAKET_CORNER_X, y }));
const southStolpar = spanStolpar(
	INHAGNAD_OFFSET_X + REMSA_WIDTH + STOLPE_WIDTH / 2,
	STAKET_CORNER_X
)
	.slice(0, -1)
	.map((x) => ({ x, y: STAKET_CORNER_Y }));

export const STOLPAR = [...eastStolpar, ...southStolpar];

export const STAKET = {
	corner: { x: STAKET_CORNER_X, y: STAKET_CORNER_Y },
	anchor: { x: STAKET_CORNER_X, y: STOLPE_WIDTH / 2 }
};
