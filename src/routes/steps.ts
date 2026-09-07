import {
	ANSLUTNING_HALVPLATTOR,
	BARLAGER_THICKNESS,
	BORTRE_STOLPAR,
	FRAMRE_STOLPAR,
	GANG_LENGTH,
	GANG_LENGTH_PLATTOR,
	GANG_WIDTH,
	GANG_WIDTH_PLATTOR,
	INHAGNAD_DEPTH,
	INHAGNAD_DEPTH_PLATTOR,
	INHAGNAD_OFFSET_X,
	INHAGNAD_OFFSET_Y,
	INHAGNAD_WIDTH,
	INHAGNAD_WIDTH_PLATTOR,
	PLATT_YTOR,
	PLATTA_FOG,
	PLATTA_SIZE,
	PLATTA_THICKNESS,
	PLINT_DEPTH,
	PLINT_HAL_SIZE,
	REGLAR_PER_FACK,
	SCHAKT_DEPTH,
	STENMJOL_THICKNESS,
	STAKET,
	STAKET_KLADSEL,
	STAKET_SIDOR,
	STOLPE_WIDTH,
	TRALL_GAP,
	TRALL_GROUND_GAP,
	TRALL_THICKNESS,
	TRALL_WIDTH
} from './dimensions';
import {
	formatCm,
	formatCount,
	formatLength,
	formatMeters,
	formatMm,
	formatSection
} from './format';
import { quantities } from './materials';
import { DIM_LANES, GANG_END_Y, SCHAKT_EDGE_X, type Annotation, type Layer } from './plan-view';

export interface Step {
	id: string;
	title: string;
	text: string;
	layers: Layer[];
	annotations: Annotation[];
}

// --- Hjälpare för annoteringar ---

const h = (from: number, to: number, at: number, label: string, below = false): Annotation => ({
	kind: 'dimension',
	orientation: 'horizontal',
	from,
	to,
	at,
	label,
	below
});
const v = (from: number, to: number, at: number, label: string, left = false): Annotation => ({
	kind: 'dimension',
	orientation: 'vertical',
	from,
	to,
	at,
	label,
	left
});
const callout = (x: number, y: number, dx: number, dy: number, label: string): Annotation => ({
	kind: 'callout',
	x,
	y,
	dx,
	dy,
	label
});
const label = (x: number, y: number, text: string): Annotation => ({
	kind: 'label',
	x,
	y,
	label: text
});

// --- Referenspunkter ---

const anslutning = PLATT_YTOR.anslutning;
const GANG_EDGE_X = INHAGNAD_OFFSET_X + GANG_WIDTH;
const SCHAKT_FRONT_Y = PLATT_YTOR.gang.y;
const { top: TOP_1, bottom: BOTTOM_1, left1: LEFT_1, left2: LEFT_2, right: RIGHT_1 } = DIM_LANES;

/** Mitt i inhägnaden, där fältetiketterna hamnar. */
const FIELD_CENTER = { x: INHAGNAD_OFFSET_X + INHAGNAD_WIDTH / 2, y: INHAGNAD_OFFSET_Y + 1.2 };

const plintar = quantities.plintar;

// --- Måttgrupper som återanvänds mellan steg ---

/** Schaktens omriss, absolut från skjulväggen och det befintliga staketet. */
const schaktMatt: Annotation[] = [
	h(0, SCHAKT_EDGE_X, TOP_1, formatLength(SCHAKT_EDGE_X)),
	v(0, SCHAKT_FRONT_Y, RIGHT_1, formatLength(SCHAKT_FRONT_Y)),
	h(0, GANG_EDGE_X, BOTTOM_1, formatLength(GANG_EDGE_X), true),
	h(anslutning.x, 0, BOTTOM_1, formatLength(-anslutning.x), true),
	v(0, GANG_END_Y, LEFT_1, formatLength(GANG_END_Y), true),
	v(0, anslutning.y, LEFT_2, formatLength(anslutning.y), true)
];

/** Plintcentrum, mätt inne i schakten från staketet respektive skjulväggen. */
const plintMatt: Annotation[] = [
	...BORTRE_STOLPAR.map((p, i) =>
		v(0, p.y, STAKET.corner.x - 0.35 - i * 0.3, formatLength(p.y), true)
	),
	...FRAMRE_STOLPAR.map((p, i) => h(0, p.x, STAKET.corner.y - 0.35 - i * 0.25, formatLength(p.x)))
];

const plattMatt: Annotation[] = [
	h(
		INHAGNAD_OFFSET_X,
		INHAGNAD_OFFSET_X + INHAGNAD_WIDTH,
		TOP_1,
		`${INHAGNAD_WIDTH_PLATTOR} plattor = ${formatMeters(INHAGNAD_WIDTH)}`
	),
	v(
		INHAGNAD_OFFSET_Y,
		INHAGNAD_OFFSET_Y + INHAGNAD_DEPTH,
		RIGHT_1,
		`${INHAGNAD_DEPTH_PLATTOR} plattor = ${formatMeters(INHAGNAD_DEPTH)}`
	),
	v(
		INHAGNAD_OFFSET_Y + INHAGNAD_DEPTH,
		GANG_END_Y,
		RIGHT_1,
		`${GANG_LENGTH_PLATTOR} plattor = ${formatMeters(GANG_LENGTH)}`
	),
	h(
		INHAGNAD_OFFSET_X,
		GANG_EDGE_X,
		BOTTOM_1,
		`${GANG_WIDTH_PLATTOR} plattor = ${formatMeters(GANG_WIDTH)}`,
		true
	),
	callout(
		anslutning.x + anslutning.width / 2,
		anslutning.y + anslutning.height / 2,
		-0.3,
		0,
		`${ANSLUTNING_HALVPLATTOR} halva`
	)
];

/** Fackens fria mått (regellängderna) och trallens längd per sida. */
const [bortre, framre] = STAKET_SIDOR;
const staketMatt: Annotation[] = [
	...bortre.fack.map((f, i) =>
		v(
			bortre.stolplagen[i] + STOLPE_WIDTH / 2,
			bortre.stolplagen[i + 1] - STOLPE_WIDTH / 2,
			STAKET.corner.x - 0.3,
			formatLength(f),
			true
		)
	),
	...framre.fack.map((f, i) =>
		h(
			framre.stolplagen[i] + STOLPE_WIDTH / 2,
			framre.stolplagen[i + 1] - STOLPE_WIDTH / 2,
			STAKET.corner.y - 0.3,
			formatLength(f)
		)
	),
	v(
		STAKET_KLADSEL.bortre.from,
		STAKET_KLADSEL.bortre.to,
		STAKET_KLADSEL.bortre.at + 0.35,
		`${formatLength(bortre.kladsel)}, ${quantities.bradorPerSida[0].brador} brädor`
	),
	h(
		STAKET_KLADSEL.framre.from,
		STAKET_KLADSEL.framre.to,
		STAKET_KLADSEL.framre.at + 0.35,
		`${formatLength(framre.kladsel)}, ${quantities.bradorPerSida[1].brador} brädor`,
		true
	)
];

// --- Stegen ---

export const STEPS: Step[] = [
	{
		id: 'mark-ut',
		title: 'Märk ut',
		text: `Märk med sprayfärg upp var vi ska gräva. Mät från cykelskjulet och det befintliga staketet. Inhägnadens bortre kant ligger i linje med insidan på stolpen i befintliga staketet. Kontrollera gärna att allt ser rimligt ut genom att lägga ut några plattor på gräset.`,
		layers: ['markering'],
		annotations: [
			...schaktMatt,
			...plintMatt,
			callout(SCHAKT_EDGE_X, 0, -0.12, -0.5, 'I linje med bef. stolpens insida'),
			callout(
				FRAMRE_STOLPAR[0].x,
				FRAMRE_STOLPAR[0].y,
				-0.3,
				0.35,
				`${plintar} hål ${formatCm(PLINT_HAL_SIZE)} × ${formatCm(PLINT_HAL_SIZE)}`
			)
		]
	},
	{
		id: 'grav',
		title: 'Gräv',
		text: `Gräv ${formatCm(SCHAKT_DEPTH)} djupt inom uppmärkt område och ${formatCm(PLINT_DEPTH)} djupt i de ${formatCount(plintar)} plinthålen.`,
		layers: ['schakt', 'plinthal'],
		annotations: [
			...schaktMatt,
			...plintMatt,
			label(FIELD_CENTER.x, FIELD_CENTER.y, `Gräv ${formatCm(SCHAKT_DEPTH)}`),
			callout(
				FRAMRE_STOLPAR[1].x,
				FRAMRE_STOLPAR[1].y,
				0,
				0.35,
				`Hål ${formatCm(PLINT_DEPTH)} djupa`
			)
		]
	},
	{
		id: 'plintar',
		title: 'Placera plintar',
		text: `Ställ plintarna med centrum enligt ritningen. De ${formatCount(BORTRE_STOLPAR.length)} på bortre sidan ska stå mitt för stolpen i det befintliga staketet. Överkanten ska hamna ${formatCm(PLATTA_THICKNESS)} under färdig plattyta, i nivå med plattornas undersida, så att plattorna kan läggas över plintens kant utan att kapas. Fyll på runt plintarna så de står stadigt, men vänta med att packa tills stolparna sitter.`,
		layers: ['schakt', 'plinthal', 'plint-topp'],
		annotations: [
			...plintMatt,
			...framre.fack.map((_, i) =>
				h(
					framre.stolplagen[i],
					framre.stolplagen[i + 1],
					STAKET.corner.y + 0.3,
					formatLength(framre.stolplagen[i + 1] - framre.stolplagen[i]),
					true
				)
			),
			callout(
				BORTRE_STOLPAR[0].x,
				BORTRE_STOLPAR[0].y,
				-0.3,
				-1.1,
				`Mitt för bef. stolpe, ${formatCm(STAKET.corner.x - SCHAKT_EDGE_X)} utanför schaktkanten`
			)
		]
	},
	{
		id: 'stolpar',
		title: 'Förankra stolpar',
		text: `Stolpar ${formatSection(STOLPE_WIDTH, STOLPE_WIDTH)} skruvas fast i plintarnas stolpjärn. Stolpen i bortre sidans ände mot befintliga staketet skruvas istället fast i det staketets stolpe. Kontrollera med stolparna på plats att allt står i linje och lodrätt, packa sedan väl runt plintarna.`,
		layers: ['schakt', 'plinthal', 'plint-topp', 'stolpar'],
		annotations: []
	},
	{
		id: 'fiberduk',
		title: 'Lägg ut fiberduk',
		text: `Lägg en tunn fiberduk mellan jorden och bärlagret, runt plintarna.`,
		layers: ['plinthal', 'fiberduk', 'plint-topp', 'stolpar'],
		annotations: [label(FIELD_CENTER.x, FIELD_CENTER.y, 'Fiberduk')]
	},
	{
		id: 'barlager',
		title: 'Fyll på med bärlager',
		text: `Krossad sten i blandade storlekar upp till 32 mm ("0–32"), över hela ytan. Lägg det i två omgångar som vardera packas med markvibrator. Vibrationen låser bitarna i varandra till ett hårt, dränerande underlag som fördelar lasten. Det är det här lagret som gör att plattorna inte sätter sig.`,
		layers: ['plinthal', 'barlager', 'plint-topp', 'stolpar'],
		annotations: [
			label(FIELD_CENTER.x, FIELD_CENTER.y, `Bärlager 0–32, ${formatCm(BARLAGER_THICKNESS)}`)
		]
	},
	{
		id: 'stenmjol',
		title: 'Fyll på med stenmjöl',
		text: `Krossad sten i finare storlekar upp till 8 mm ("0–8"), ungefär som grov sand. Plana ${formatCm(STENMJOL_THICKNESS)} jämnt ovanpå bärlagret med en rak bräda, men bara där plattorna ska ligga. Remsorna mot skjulet och staketet fylls med bärlager. Det är stenmjölet som gör ytan plan, plattorna knackas sen ner i det.`,
		layers: ['plinthal', 'barlager', 'stenmjol', 'plint-topp', 'stolpar'],
		annotations: [
			label(FIELD_CENTER.x, FIELD_CENTER.y, `Stenmjöl 0–8, ${formatCm(STENMJOL_THICKNESS)}`)
		]
	},
	{
		id: 'plattor',
		title: 'Plattor och fogsand',
		text: `Börja vid plintarna och lägg inåt mot skjulet, så tar remsorna mot skjulet och befintliga staketet upp eventuella avvikelser. Knacka ner betongplattor ${formatCm(PLATTA_SIZE)} × ${formatCm(PLATTA_SIZE)} × ${formatCm(PLATTA_THICKNESS)} med ${formatMm(PLATTA_FOG)} fog med gummiklubba, halvplattor ${formatCm(PLATTA_SIZE / 2)} × ${formatCm(PLATTA_SIZE)} i raden mot asfalten. Sopa till sist ner fogsand i mellanrummen så plattorna låser fast.`,
		layers: ['plinthal', 'barlager', 'plattor', 'plint-topp', 'stolpar'],
		annotations: plattMatt
	},
	{
		id: 'reglar-trall',
		title: 'Skruva på reglar och trall',
		text: `Varje fack får ${formatCount(REGLAR_PER_FACK)} reglar ${formatSection(STOLPE_WIDTH, STOLPE_WIDTH)}, kapade till fackens fria mått i ritningen. Stående trall ${formatSection(TRALL_THICKNESS, TRALL_WIDTH)} med ${formatMm(TRALL_GAP)} springa, rostfri trallskruv. Nedersta kanten ${formatCm(TRALL_GROUND_GAP)} ovanför plattorna. Såga av toppen med vinkel för att förhindra vattenansamling.`,
		layers: ['plinthal', 'barlager', 'plattor', 'plint-topp', 'stolpar', 'reglar', 'trall'],
		annotations: staketMatt
	},
	{
		id: 'karl',
		title: 'Ställ in kärlen',
		text: `Ställ in kärlen. Klart!`,
		layers: ['plinthal', 'barlager', 'plattor', 'plint-topp', 'stolpar', 'reglar', 'trall', 'karl'],
		annotations: []
	}
];

/** Översikten visar slutresultatet, utan mått. */
export const OVERVIEW_LAYERS: Layer[] = STEPS[STEPS.length - 1].layers;
