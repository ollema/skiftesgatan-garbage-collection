export const formatKr = (n: number) => Math.round(n).toLocaleString('sv-SE') + ' kr';

export const formatMeters = (n: number) => n.toFixed(2).replace('.', ',') + ' m';

/** Byggmått: hela cm under en meter, annars meter med två decimaler. */
export const formatLength = (n: number) =>
	n < 1 ? `${Math.round(n * 100)} cm` : formatMeters(Math.round(n * 100) / 100);

export const formatNumber1 = (n: number) => n.toFixed(1).replace('.', ',');

export const formatKg = (n: number) =>
	n >= 1000 ? formatNumber1(n / 1000) + ' ton' : Math.round(n) + ' kg';
