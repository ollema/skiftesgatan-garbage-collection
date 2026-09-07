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

// --- Betongplintar (Benders 4" × 700 mm) ---

/** Plinten är 690 mm hög och ställs med toppen under plattorna, så hålet blir djupare. */
const PLINT_HEIGHT = 0.69;
/** Plinttoppen hamnar i nivå med plattornas undersida, så plattorna kan läggas över kanten. */
export const PLINT_TOP_DEPTH = PLATTA_THICKNESS;
export const PLINT_DEPTH = PLINT_HEIGHT + PLINT_TOP_DEPTH;
/** Plintens toppmått; basen är bredare men syns inte när hålet är packat. */
export const PLINT_TOP = 0.17;
/** Grävt hål runt plinten, med plats att packa runt om. */
export const PLINT_HAL_SIZE = 0.3;

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
const ANSLUTNING_LENGTH = ANSLUTNING_HALVPLATTOR * PLATTA_PITCH;
const ANSLUTNING_WIDTH = PLATTA_PITCH / 2;

// --- Sopkärlen ---

/** Spel runt om och mellan kärlen. */
export const SOPKARL_GAP = 0.06;

// --- Staketets virke ---

export const STOLPE_WIDTH = 0.095;
export const TRALL_THICKNESS = 0.028;
export const TRALL_WIDTH = 0.12;

/** Springa mellan de stående trallbrädorna. */
export const TRALL_GAP = 0.01;
/** Trallens nederkant hålls fri från plattorna. */
export const TRALL_GROUND_GAP = 0.04;

/** Färdig höjd över plattorna. */
export const STAKET_HEIGHT = 1.5;
/** Liggande reglar per fack, mellan stolparna. */
export const REGLAR_PER_FACK = 3;

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

// Det bortre staketet börjar i stolpen som skruvas fast i det befintliga
// staketet (`STAKET.anchor`), så den änden får ingen egen plint. Det framre
// staketet delar hörnstolpe med det bortre och hoppar därför över sin sista punkt.
const bortreStolpar = spanStolpar(STOLPE_WIDTH / 2, STAKET_CORNER_Y)
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

// --- Ytorna som schaktas, som rektanglar i planvyn ---
//
// Plinthålen är centrerade på stolparna, som står precis vid plattfältets kant.
// En del av varje hål ligger därför redan inne i plattfältet — ytorna överlappar
// och måste läggas ihop som en union, inte summeras rakt av.

export interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

/** Plattfältet: inhägnaden, gången och anslutningsraden mot asfalten. */
export const PLATT_YTOR = {
	inhagnad: {
		x: INHAGNAD_OFFSET_X,
		y: INHAGNAD_OFFSET_Y,
		width: INHAGNAD_WIDTH,
		height: INHAGNAD_DEPTH
	},
	gang: {
		x: INHAGNAD_OFFSET_X,
		y: INHAGNAD_OFFSET_Y + INHAGNAD_DEPTH,
		width: GANG_WIDTH,
		height: GANG_LENGTH
	},
	anslutning: {
		x: INHAGNAD_OFFSET_X - ANSLUTNING_WIDTH,
		y: INHAGNAD_OFFSET_Y + INHAGNAD_DEPTH + GANG_LENGTH - ANSLUTNING_LENGTH,
		width: ANSLUTNING_WIDTH,
		height: ANSLUTNING_LENGTH
	}
} satisfies Record<string, Rect>;

/** Grusremsorna: plattfältet är förskjutet så att ingen platta behöver kapas. */
export const GRUS_YTOR = {
	vidStaketet: {
		x: 0,
		y: 0,
		width: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH,
		height: INHAGNAD_OFFSET_Y
	},
	vidSkjulet: {
		x: 0,
		y: INHAGNAD_OFFSET_Y,
		width: INHAGNAD_OFFSET_X,
		height: PLATT_YTOR.anslutning.y - INHAGNAD_OFFSET_Y
	}
} satisfies Record<string, Rect>;

/** Grävda hål för betongplintarna. */
export const PLINT_HAL: Rect[] = STOLPAR.map((post) => ({
	x: post.x - PLINT_HAL_SIZE / 2,
	y: post.y - PLINT_HAL_SIZE / 2,
	width: PLINT_HAL_SIZE,
	height: PLINT_HAL_SIZE
}));

/**
 * Schaktens omriss: unionen av plattfältet och grusremsorna, som en polygon
 * medurs från skjulhörnet vid staketet. Plinthålen sticker ut utanför.
 */
export const SCHAKT_POLYGON: { x: number; y: number }[] = [
	{ x: 0, y: 0 },
	{ x: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH, y: 0 },
	{ x: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH, y: PLATT_YTOR.gang.y },
	{ x: INHAGNAD_OFFSET_X + GANG_WIDTH, y: PLATT_YTOR.gang.y },
	{ x: INHAGNAD_OFFSET_X + GANG_WIDTH, y: PLATT_YTOR.gang.y + GANG_LENGTH },
	{ x: PLATT_YTOR.anslutning.x, y: PLATT_YTOR.gang.y + GANG_LENGTH },
	{ x: PLATT_YTOR.anslutning.x, y: PLATT_YTOR.anslutning.y },
	{ x: 0, y: PLATT_YTOR.anslutning.y }
];

// --- Trallklädseln: sitter utanpå stolparna och möts i ytterhörnet ---

const KLADSEL_OUTER_X = STAKET_CORNER_X + STOLPE_WIDTH / 2;
const KLADSEL_OUTER_Y = STAKET_CORNER_Y + STOLPE_WIDTH / 2;

/** `at` = klädselns utsida, `from`/`to` = dess utsträckning längs sidan. */
export const STAKET_KLADSEL = {
	bortre: { at: KLADSEL_OUTER_X, from: 0, to: KLADSEL_OUTER_Y + TRALL_THICKNESS },
	framre: {
		at: KLADSEL_OUTER_Y,
		from: INHAGNAD_OFFSET_X + GANG_WIDTH,
		to: KLADSEL_OUTER_X + TRALL_THICKNESS
	}
};

// --- Staketets två sidor, som kaplistan räknas ur ---

export interface StaketSida {
	label: string;
	/** Kort form, för när sidan nämns mitt i en mening. */
	short: string;
	/** Stolplägen längs sidan (mittlinje), i ordning. */
	stolplagen: number[];
	/** Fria måttet mellan stolparna i varje fack. */
	fack: number[];
	/** Trallklädselns längd, ytterkant till ytterkant. */
	kladsel: number;
}

function staketSida(
	label: string,
	short: string,
	stolplagen: number[],
	kladsel: { from: number; to: number }
): StaketSida {
	return {
		label,
		short,
		stolplagen,
		fack: stolplagen.slice(1).map((p, i) => p - stolplagen[i] - STOLPE_WIDTH),
		kladsel: kladsel.to - kladsel.from
	};
}

// Den bortre sidan börjar i stolpen som skruvas fast i det befintliga staketet
// (`STAKET.anchor`); den framre slutar i den gemensamma hörnstolpen.
export const STAKET_SIDOR: StaketSida[] = [
	staketSida(
		'Bortre sidan, mot befintliga staketet',
		'bortre sidan',
		[STOLPE_WIDTH / 2, ...bortreStolpar.map((p) => p.y)],
		STAKET_KLADSEL.bortre
	),
	staketSida(
		'Främre sidan, mot asfalten',
		'främre sidan',
		[...framreStolpar.map((p) => p.x), STAKET_CORNER_X],
		STAKET_KLADSEL.framre
	)
];
