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

// --- Krav från Göteborgs stad som utformningen kontrolleras mot ---

/** Fritt utrymme framför kärlen där de står. */
export const KRAV_FRITT_FRAMFOR_KARL = 1.5;
/** Minsta bredd på inhägnadens öppning. */
export const KRAV_OPPNING_WIDTH = 1.2;

// --- Marksten ---

export const PLATTA_SIZE = 0.35;
export const PLATTA_THICKNESS = 0.05;
/** Fogen mellan plattorna. */
export const PLATTA_FOG = 0.003;
export const PLATTA_PITCH = PLATTA_SIZE + PLATTA_FOG;

// --- Markuppbyggnad under plattorna ---

export const STENMJOL_THICKNESS = 0.03;
export const BARLAGER_THICKNESS = 0.1;
export const SCHAKT_DEPTH = PLATTA_THICKNESS + STENMJOL_THICKNESS + BARLAGER_THICKNESS;

// --- Betongplintar (Benders 4" × 700 mm) ---

/** Plinten är 690 mm hög och ställs med toppen under plattorna, så hålet blir djupare. */
const PLINT_HEIGHT = 0.69;
/**
 * Plinttoppen hamnar en plattjocklek ner, i nivå med plattornas undersida, så
 * att plattorna kan läggas över plintens kant utan att kapas.
 */
export const PLINT_DEPTH = PLINT_HEIGHT + PLATTA_THICKNESS;
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

export const STAKET = {
	/** Hörnstolpen där det bortre och det framre staketet möts. */
	corner: { x: STAKET_CORNER_X, y: STAKET_CORNER_Y },
	/** Stolpen som skruvas fast i det befintliga staketets stolpe. */
	anchor: { x: STAKET_CORNER_X, y: STOLPE_WIDTH / 2 }
};

// --- Staketets stolpar ---

/** Avrundat till tiondels mm, så att lika mått inte blir olika av flyttalsbrus. */
const roundMm = (n: number) => Math.round(n * 1e4) / 1e4;

/** Jämnt fördelade stolplägen mellan `from` och `to`, båda ändarna inkluderade. */
function spanStolpar(from: number, to: number) {
	const segments = Math.ceil((to - from) / MAX_STOLPE_SPACING);
	return Array.from({ length: segments + 1 }, (_, i) =>
		roundMm(from + ((to - from) * i) / segments)
	);
}

// Det bortre staketet börjar i `STAKET.anchor`, så den änden får ingen egen
// plint. Det framre staketet delar hörnstolpe med det bortre och hoppar därför
// över sin sista punkt.

/** Stolpar på plint längs bortre sidan, inklusive hörnstolpen. */
export const BORTRE_STOLPAR = spanStolpar(STAKET.anchor.y, STAKET.corner.y)
	.slice(1)
	.map((y) => ({ x: STAKET.corner.x, y }));
/** Stolpar på plint längs främre sidan, utom hörnstolpen. */
export const FRAMRE_STOLPAR = spanStolpar(
	INHAGNAD_OFFSET_X + GANG_WIDTH + STOLPE_WIDTH / 2,
	STAKET.corner.x
)
	.slice(0, -1)
	.map((x) => ({ x, y: STAKET.corner.y }));

/** Alla stolpar som står på plint. */
export const STOLPAR = [...BORTRE_STOLPAR, ...FRAMRE_STOLPAR];

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

export function centeredSquare(center: { x: number; y: number }, size: number): Rect {
	return { x: center.x - size / 2, y: center.y - size / 2, width: size, height: size };
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
export const PLINT_HAL: Rect[] = STOLPAR.map((post) => centeredSquare(post, PLINT_HAL_SIZE));

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
//
// I hörnet går den främre sidans brädor hela vägen ut och täcker änden på den
// bortre sidans, som slutar vid stolpens utsida.

/** Stolparnas utsida, där brädorna skruvas fast. */
const KLADSEL_INNER_X = STAKET.corner.x + STOLPE_WIDTH / 2;
const KLADSEL_INNER_Y = STAKET.corner.y + STOLPE_WIDTH / 2;

/** `at` = brädornas insida mot stolparna, `from`/`to` = deras utsträckning längs sidan. */
export const STAKET_KLADSEL = {
	bortre: { at: KLADSEL_INNER_X, from: 0, to: KLADSEL_INNER_Y },
	framre: {
		at: KLADSEL_INNER_Y,
		from: INHAGNAD_OFFSET_X + GANG_WIDTH,
		to: KLADSEL_INNER_X + TRALL_THICKNESS
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
		fack: stolplagen.slice(1).map((p, i) => roundMm(p - stolplagen[i] - STOLPE_WIDTH)),
		kladsel: roundMm(kladsel.to - kladsel.from)
	};
}

// Den bortre sidan börjar i `STAKET.anchor`; den framre slutar i den
// gemensamma hörnstolpen.
export const STAKET_SIDOR: StaketSida[] = [
	staketSida(
		'Bortre sidan, mot befintliga staketet',
		'bortre sidan',
		[STAKET.anchor.y, ...BORTRE_STOLPAR.map((p) => p.y)],
		STAKET_KLADSEL.bortre
	),
	staketSida(
		'Främre sidan, mot asfalten',
		'främre sidan',
		[...FRAMRE_STOLPAR.map((p) => p.x), STAKET.corner.x],
		STAKET_KLADSEL.framre
	)
];
