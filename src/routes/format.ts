// Svenska talformat: decimalkomma och enhet med mellanslag.

export const formatKr = (n: number) => Math.round(n).toLocaleString('sv-SE') + ' kr';

export const formatMeters = (n: number) => n.toFixed(2).replace('.', ',') + ' m';

/** Byggmått: hela cm under en meter, annars meter med två decimaler. */
export const formatLength = (n: number) =>
	n < 1 ? `${Math.round(n * 100)} cm` : formatMeters(Math.round(n * 100) / 100);

export const formatNumber1 = (n: number) => n.toFixed(1).replace('.', ',');

/** Upp till två decimaler utan avslutande nollor: 1,5 och 18, inte 1,50 och 18,00. */
export const formatNumberTrimmed = (n: number) =>
	n
		.toFixed(2)
		.replace(/\.?0+$/, '')
		.replace('.', ',');

/** Meter utan avslutande nolla: 1,5 m. */
export const formatMetersTrimmed = (n: number) => `${formatNumberTrimmed(n)} m`;

/** Centimeter med en decimal om det behövs: 30 cm, 17,5 cm. */
export const formatCm = (n: number) => `${formatNumberTrimmed(Math.round(n * 1000) / 10)} cm`;

export const formatMm = (n: number) => `${Math.round(n * 1000)} mm`;

/** Virkesdimension i mm: 95 × 95 mm. */
export const formatSection = (a: number, b: number) =>
	`${Math.round(a * 1000)} × ${Math.round(b * 1000)} mm`;

export const formatKg = (n: number) =>
	n >= 1000 ? formatNumber1(n / 1000) + ' ton' : Math.round(n) + ' kg';

const RAKNEORD = [
	'noll',
	'ett',
	'två',
	'tre',
	'fyra',
	'fem',
	'sex',
	'sju',
	'åtta',
	'nio',
	'tio',
	'elva',
	'tolv'
];

/** Räkneord i löptext: "fyra plinthål", inte "4 plinthål". Större tal skrivs med siffror. */
export const formatCount = (n: number) => RAKNEORD[n] ?? String(n);

/** "a", "a och b", "a, b och c". */
export const listJoin = (parts: string[]) =>
	parts.length < 2 ? (parts[0] ?? '') : `${parts.slice(0, -1).join(', ')} och ${parts.at(-1)}`;
