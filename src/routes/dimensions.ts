// Alla mått i meter, sedda rakt uppifrån (planvy).
//
// Origo = skjulets hörn mot det befintliga staketet.
//   +x = bort från skjulet, längs det befintliga staketet (x < 0 ligger inne i skjulet)
//   +y = bort från det befintliga staketet, längs skjulets sida
//
// Riktningarna i koden är platsrelativa, inte väderstreck — ritningen ligger inte
// i linje med kompassen:
//   "mot staketet"  y ≈ 0                "mot skjulet"  låga x
//   "framre"        y ≈ SKJUL_DEPTH,     "bortre"       högsta x, längst från
//                   i linje med skjulets                skjulet
//                   öppna framsida

// --- Skjulet och tomten: uppmätt på plats ---

export const SKJUL_DEPTH = 2.67;

/** Från skjulets vägg till den befintliga staketstolpe som nya staketet fästs i. */
export const BEFINTLIG_STOLPE_DISTANCE = 3.93;

// --- Marksten ---

export const PLATTA_PITCH = 0.353;
const PLATTA_THICKNESS = 0.05;

// --- Markuppbyggnad under plattorna ---

export const STENMJOL_THICKNESS = 0.03;
export const BARLAGER_THICKNESS = 0.1;
export const SCHAKT_DEPTH = PLATTA_THICKNESS + STENMJOL_THICKNESS + BARLAGER_THICKNESS;

// --- Inhägnaden ---

export const INHAGNAD_WIDTH_PLATTOR = 11;
export const INHAGNAD_DEPTH_PLATTOR = 7;
export const INHAGNAD_WIDTH = INHAGNAD_WIDTH_PLATTOR * PLATTA_PITCH;
export const INHAGNAD_DEPTH = INHAGNAD_DEPTH_PLATTOR * PLATTA_PITCH;

// --- Gången: från inhägnaden ut mot asfalten ---

export const GANG_WIDTH_PLATTOR = 4;
export const GANG_LENGTH_PLATTOR = 5;
export const GANG_WIDTH = GANG_WIDTH_PLATTOR * PLATTA_PITCH;
export const GANG_LENGTH = GANG_LENGTH_PLATTOR * PLATTA_PITCH;

// --- Anslutningen: halvplattor som tar upp glappet mot asfalten ---

export const ANSLUTNING_HALVPLATTOR = 4;
export const ANSLUTNING_LENGTH = ANSLUTNING_HALVPLATTOR * PLATTA_PITCH;
export const ANSLUTNING_WIDTH = PLATTA_PITCH / 2;

// --- Sopkärlen ---

/** Spel runt om och mellan kärlen. */
export const SOPKARL_GAP = 0.06;

// --- Staketets virke ---

export const STOLPE_WIDTH = 0.095;
export const STOLPE_HOLE_SIZE = 0.17;
export const TRALL_THICKNESS = 0.028;

/** Största tillåtna avstånd mellan två stolpar. */
const MAX_STOLPE_SPACING = 1.8;

// --- Placering: allt hängs upp på staketets hörnstolpe ---

/** Hörnstolpen där det bortre och det framre staketet möts. */
const STAKET_CORNER_X = BEFINTLIG_STOLPE_DISTANCE + STOLPE_WIDTH / 2;
const STAKET_CORNER_Y = SKJUL_DEPTH - STOLPE_WIDTH / 2 - TRALL_THICKNESS;

/** Plattfältets hörn närmast skjulet och det befintliga staketet. */
export const INHAGNAD_OFFSET_X = STAKET_CORNER_X - INHAGNAD_WIDTH - STOLPE_WIDTH / 2;
export const INHAGNAD_OFFSET_Y = STAKET_CORNER_Y - INHAGNAD_DEPTH - STOLPE_WIDTH / 2;

// --- Staketets stolpar ---

/** Jämnt fördelade stolplägen mellan `from` och `to`, båda ändarna inkluderade. */
function spanStolpar(from: number, to: number) {
	const segments = Math.ceil((to - from) / MAX_STOLPE_SPACING);
	return Array.from({ length: segments + 1 }, (_, i) => from + ((to - from) * i) / segments);
}

// Det bortre staketet skruvas fast i det befintliga staketet, så den änden får
// ingen egen stolpe. Det framre staketet delar hörnstolpe med det bortre och
// hoppar därför över sin sista punkt.
const bortreStolpar = spanStolpar(INHAGNAD_OFFSET_Y, STAKET_CORNER_Y)
	.slice(1)
	.map((y) => ({ x: STAKET_CORNER_X, y }));
const framreStolpar = spanStolpar(
	INHAGNAD_OFFSET_X + GANG_WIDTH + STOLPE_WIDTH / 2,
	STAKET_CORNER_X
)
	.slice(0, -1)
	.map((x) => ({ x, y: STAKET_CORNER_Y }));

export const STOLPAR = [...bortreStolpar, ...framreStolpar];

export const STAKET = {
	corner: { x: STAKET_CORNER_X, y: STAKET_CORNER_Y },
	anchor: { x: STAKET_CORNER_X, y: STOLPE_WIDTH / 2 }
};
