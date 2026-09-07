// --- Grundmått ------------------------------------------------------------

export const GAP = 0.06;
export const TILE_PITCH = 0.353;
export const POST_WIDTH = 0.095;
export const TRALL_THICKNESS = 0.028;
export const SHED_DEPTH = 2.67;

// varje grävd stolphål (för plint), större än stolpen själv
export const POST_HOLE_SIZE = 0.17;

export const ENCLOSURE_WIDTH_TILES = 11;
export const ENCLOSURE_DEPTH_TILES = 7;
export const STRIP_WIDTH_TILES = 4;
export const STRIP_ROWS_TILES = 5;

// ny rad halvplattor (350×175 mm) som viker av västerut från gångens nedre del, för att täcka
// glappet mot asfalten - gången blir ett spegelvänt L. Asfalten når inte hela vägen fram till
// cykelskjulet, så det är halvbred platta som används här, inte helbred
export const PATH_CONNECTOR_TILES = 4;

const PLATTA_THICKNESS = 0.05;
export const STENMJOL_THICKNESS = 0.03;
export const BARLAGER_THICKNESS = 0.1;
export const SCHAKT_DEPTH = PLATTA_THICKNESS + STENMJOL_THICKNESS + BARLAGER_THICKNESS;

export const ENCLOSURE_WIDTH = ENCLOSURE_WIDTH_TILES * TILE_PITCH;
export const ENCLOSURE_DEPTH = ENCLOSURE_DEPTH_TILES * TILE_PITCH;
export const STRIP_WIDTH = STRIP_WIDTH_TILES * TILE_PITCH;
export const STRIP_LENGTH = STRIP_ROWS_TILES * TILE_PITCH;
export const PATH_CONNECTOR_LENGTH = PATH_CONNECTOR_TILES * TILE_PITCH;
export const PATH_CONNECTOR_WIDTH = TILE_PITCH / 2;

// öppningen i staketet (ingen grind, bara ett hål lika brett som gången)
export const OPENING_WIDTH = STRIP_WIDTH;

// --- Offset från befintliga väggen -----------------------------------------

// uppmätt: cykelskjulets hörn till starten av befintlig stolpe, längs övre väggen
export const EXISTING_STUD_DISTANCE = 3.93;

// --- Stolpar --------------------------------------------------------------

const MAX_POST_SPACING = 1.8;

const EAST_POST_COUNT = Math.ceil((ENCLOSURE_DEPTH + POST_WIDTH) / MAX_POST_SPACING);
const SOUTH_POST_COUNT = Math.ceil((ENCLOSURE_WIDTH - OPENING_WIDTH) / MAX_POST_SPACING) + 1;

// nya hörnstolpens vänsterkant (mot inhägnaden) ska börja exakt där den befintliga stolpen börjar,
// så stolpen centreras en halv stolpbredd bortom det uppmätta avståndet, inte rakt på det
const FENCE_CORNER_X = EXISTING_STUD_DISTANCE + POST_WIDTH / 2;
// nya staketets nedre hörn: det är trallens utsida (inte stolpens mittlinje) som ska hamna
// i liv med cykelskjulets framkant, så stolpens mittlinje flyttas in en halv stolpbredd + trallens tjocklek
const FENCE_CORNER_Y = SHED_DEPTH - POST_WIDTH / 2 - TRALL_THICKNESS;

// hur mycket hela plattfältet flyttas åt höger för att hörnet ska hamna vid stolpen
export const ENCLOSURE_OFFSET_X = FENCE_CORNER_X - ENCLOSURE_WIDTH - POST_WIDTH / 2;
// marginal mellan den befintliga väggen och plattorna/staketet, för att slippa gräva alldeles intill den
export const ENCLOSURE_OFFSET_Y = FENCE_CORNER_Y - ENCLOSURE_DEPTH - POST_WIDTH / 2;

const eastPosts = Array.from({ length: EAST_POST_COUNT }, (_, i) => ({
	x: FENCE_CORNER_X,
	y: ENCLOSURE_OFFSET_Y + ((FENCE_CORNER_Y - ENCLOSURE_OFFSET_Y) * (i + 1)) / EAST_POST_COUNT
}));
const southPosts = Array.from({ length: SOUTH_POST_COUNT - 1 }, (_, i) => ({
	x:
		ENCLOSURE_OFFSET_X +
		OPENING_WIDTH +
		POST_WIDTH / 2 +
		(i * (ENCLOSURE_WIDTH - OPENING_WIDTH)) / (SOUTH_POST_COUNT - 1),
	y: FENCE_CORNER_Y
}));

export const POSTS = [...eastPosts, ...southPosts];

export const FENCE = {
	corner: { x: FENCE_CORNER_X, y: FENCE_CORNER_Y },
	// ingen egen grävd plint här - skruvas direkt på den befintliga väggens stolpe.
	// stolpen monteras på väggens utsida (söder om den), inte centrerad på vägglivet
	anchor: { x: FENCE_CORNER_X, y: POST_WIDTH / 2 }
};
