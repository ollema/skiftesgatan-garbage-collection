import {
	ANSLUTNING_HALVPLATTOR,
	BARLAGER_THICKNESS,
	INHAGNAD_DEPTH,
	INHAGNAD_DEPTH_PLATTOR,
	INHAGNAD_WIDTH,
	INHAGNAD_WIDTH_PLATTOR,
	PLATTA_PITCH,
	REMSA_LENGTH,
	REMSA_LENGTH_PLATTOR,
	REMSA_WIDTH,
	REMSA_WIDTH_PLATTOR,
	SCHAKT_DEPTH,
	STENMJOL_THICKNESS,
	STOLPAR,
	STOLPE_WIDTH
} from './dimensions';
import { formatKg, formatMeters, formatNumber1 } from './format';

const PRICE = {
	stolpe48: 316.56,
	trall45: 85.28,
	plint: 159.0,
	skruv: 450,
	platta: 24.0,
	plattaFew: 26.9,
	plattaHalf: 17.0,
	fiberduk: 399,
	fogsand: 199,
	kantsten: 38.8,
	markvibrator: 700,
	schakt: 2000,
	bergskross1000: 993.65,
	stenmjol500: 601.3,
	returpall: 279.0,
	pallyftare: 200,
	leverans: 2615.0
};

const BERGSKROSS_STORSACKAR = 2;
const STENMJOL_STORSACKAR = 1;

interface BomRow {
	label: string;
	quantity: number;
	unitPrice: number;
	cost: number;
	estimated?: boolean;
	url?: string;
}

interface BomGroup {
	label: string;
	rows: BomRow[];
	sum: number;
}

function bomRow(
	label: string,
	quantity: number,
	unitPrice: number,
	estimated = false,
	url?: string
): BomRow {
	return { label, quantity, unitPrice, cost: Math.round(quantity * unitPrice), estimated, url };
}

function bomGroup(label: string, rows: BomRow[]): BomGroup {
	return { label, rows, sum: rows.reduce((sum, r) => sum + r.cost, 0) };
}

function computeQuantities() {
	const stolpar = STOLPAR.length;
	const run = INHAGNAD_DEPTH + STOLPE_WIDTH + (INHAGNAD_WIDTH - REMSA_WIDTH);
	const brador = Math.ceil((run / 0.13) * 1.05);
	const trallLen = Math.ceil(brador / 3);
	const stolpeCutLength = 4.8 / 3;
	const stolpeRegelLength = stolpar * stolpeCutLength + 3 * run * 1.1 + stolpeCutLength + 2.0;
	const stolpeRegelLen = Math.ceil(stolpeRegelLength / 4.8);

	const inhagnadPlattor = INHAGNAD_WIDTH_PLATTOR * INHAGNAD_DEPTH_PLATTOR;
	const remsaPlattor = REMSA_WIDTH_PLATTOR * REMSA_LENGTH_PLATTOR;
	const plattor = inhagnadPlattor + remsaPlattor;
	const reservPlattor = Math.ceil(plattor * 0.05);
	const plattorToBuy = plattor + reservPlattor;
	const reservHalvplattor = Math.ceil(ANSLUTNING_HALVPLATTOR * 0.05);
	const halvplattorToBuy = ANSLUTNING_HALVPLATTOR + reservHalvplattor;
	const area = (plattor + ANSLUTNING_HALVPLATTOR * 0.5) * PLATTA_PITCH * PLATTA_PITCH;
	const plattaPrice = plattorToBuy >= 90 ? PRICE.platta : PRICE.plattaFew;

	const stenmjolKg = area * STENMJOL_THICKNESS * 1600;
	const barlagerTon = area * BARLAGER_THICKNESS * 1.8;
	const fogsandBags = Math.max(1, Math.ceil((area * 2.5) / 20));
	const schaktM3 = area * SCHAKT_DEPTH;

	const pallar = BERGSKROSS_STORSACKAR + STENMJOL_STORSACKAR;

	const KANTSTEN_LENGTH = 0.5;
	const kantstenCount = Math.ceil((REMSA_LENGTH * 2) / KANTSTEN_LENGTH);

	const bomGroups: BomGroup[] = [
		bomGroup('Schaktning', [
			bomRow(
				`Bortforsling av schaktmassor, ca ${formatNumber1(schaktM3)} m³`,
				1,
				PRICE.schakt,
				true
			)
		]),
		bomGroup(
			`Plattläggning, ${formatNumber1(area)} m² (${inhagnadPlattor} plattor inhägnad + ${remsaPlattor} remsa + ${ANSLUTNING_HALVPLATTOR} halvplattor anslutning mot asfalt + ${reservPlattor} reserv)`,
			[
				bomRow(
					'Markplatta Benders Siena 35×35×5 cm grå',
					plattorToBuy,
					plattaPrice,
					false,
					'https://www.hornbach.se/p/markplatta-benders-siena-slat-fasad-gra-350x350x50mm/8628862/'
				),
				bomRow(
					'Markplatta Benders Siena 35×17,5×5 cm grå, halv',
					halvplattorToBuy,
					PRICE.plattaHalf,
					false,
					'https://www.hornbach.se/p/markplatta-benders-siena-slat-fasad-gra-350x175x50mm/8407799/'
				),
				bomRow(
					'Fiberduk under bärlagret, N1 90 g/m², 1,4×25 m (35 m²)',
					1,
					PRICE.fiberduk,
					false,
					'https://www.hornbach.se/p/markduk-geotex-geotextil-fiberduk-n1-90g-m-1-4x25-m/12124052/'
				),
				bomRow(
					'Fogsand 20 kg',
					fogsandBags,
					PRICE.fogsand,
					false,
					'https://www.hornbach.se/p/fogsand-benders-gra-ograshammande-20-kg/10598223/'
				),
				bomRow(
					`Kantsten Benders grå 500×250×50 mm, längs gången (2 × ${formatNumber1(REMSA_LENGTH)} m)`,
					kantstenCount,
					PRICE.kantsten,
					false,
					'https://www.hornbach.se/p/kantsten-benders-gra-500x250x50mm/5148862/'
				),
				bomRow(
					'Bergskross 0–32, storsäck 1 000 kg',
					BERGSKROSS_STORSACKAR,
					PRICE.bergskross1000,
					false,
					'https://stenbolaget.se/products/bergskross-0-32-storsack-1000kg'
				),
				bomRow(
					'Stenmjöl 0–8, storsäck 500 kg',
					STENMJOL_STORSACKAR,
					PRICE.stenmjol500,
					false,
					'https://stenbolaget.se/products/stenmjol-0-8-storsack-500kg-1'
				),
				bomRow('Returpall (EUR-pall)', pallar, PRICE.returpall),
				bomRow('Leverans, bergskross och stenmjöl', 1, PRICE.leverans)
			]
		),
		bomGroup('Staket', [
			bomRow(
				'Betongplint Benders 4" × 700 mm med fast stolpjärn',
				stolpar,
				PRICE.plint,
				false,
				'https://www.hornbach.se/p/betongplint-benders-4x700mm/5520589/'
			),
			bomRow(
				'Stolpe/regel 95×95 mm NTR A, 4,8 m',
				stolpeRegelLen,
				PRICE.stolpe48,
				false,
				'https://www.hornbach.se/p/tryckimpregnerad-stolpe-ntr-a-95x95x4800-mm/6810575/'
			),
			bomRow(
				'Trall 28×120 mm NTR AB, 4,5 m (3 brädor per längd)',
				trallLen,
				PRICE.trall45,
				false,
				'https://www.hornbach.se/p/tryckimpregnerad-trall-ntr-ab-28x120x4500-mm/6736138/'
			),
			bomRow(
				'Trallskruv + konstruktionsskruv + bult till befintliga staketet, rostfri',
				1,
				PRICE.skruv,
				true,
				'https://www.hornbach.se/c/jarnvaror/skruv-bult/trallskruv/S16916/'
			)
		]),
		bomGroup('Maskinhyra', [
			bomRow('Hyra markvibrator, 1 dag', 1, PRICE.markvibrator, true),
			bomRow('Hyra pallyftare, 1 dag', 1, PRICE.pallyftare, true)
		])
	];

	const total = bomGroups.reduce((sum, g) => sum + g.sum, 0);

	return {
		stolpar,
		run,
		area,
		plattor,
		stenmjolKg,
		barlagerTon,
		schaktM3,
		bomGroups,
		total
	};
}

export const quantities = computeQuantities();

export const FACTS: { term: string; description: string }[] = [
	{
		term: 'Total yta',
		description: `${INHAGNAD_WIDTH_PLATTOR} × ${INHAGNAD_DEPTH_PLATTOR} + ${REMSA_WIDTH_PLATTOR} × ${REMSA_LENGTH_PLATTOR} = ${quantities.plattor} plattor + ${ANSLUTNING_HALVPLATTOR} halvplattor ≈ ${formatNumber1(quantities.area)} m²`
	},
	{
		term: 'Schaktning',
		description: `${Math.round(SCHAKT_DEPTH * 100)} cm × ${formatNumber1(quantities.area)} m² ≈ ${formatNumber1(quantities.schaktM3)} m³ ska schaktas bort`
	},
	{
		term: 'Bärlager',
		description: `${Math.round(BARLAGER_THICKNESS * 100)} cm × ${formatNumber1(quantities.area)} m² ≈ ${formatNumber1(quantities.area * BARLAGER_THICKNESS)} m³ × 1 800 kg/m³ ≈ ${formatNumber1(quantities.barlagerTon)} ton`
	},
	{
		term: 'Stenmjöl',
		description: `3 cm × ${formatNumber1(quantities.area)} m² × 1 600 kg/m³ ≈ ${formatKg(Math.round(quantities.stenmjolKg))}`
	},
	{
		term: 'Staket',
		description: `${formatMeters(quantities.run)} långt, 1,5 m högt och ${quantities.stolpar} stolpar`
	},
	{
		term: 'Öppning',
		description: `${formatMeters(REMSA_WIDTH)} bred, ingen grind`
	}
];
