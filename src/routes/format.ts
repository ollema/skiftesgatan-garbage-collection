export const formatKr = (n: number) => Math.round(n).toLocaleString('sv-SE') + ' kr';

export const formatMeters = (n: number) => n.toFixed(2).replace('.', ',') + ' m';

export const formatNumber1 = (n: number) => n.toFixed(1).replace('.', ',');

export const formatKg = (n: number) =>
	n >= 1000 ? formatNumber1(n / 1000) + ' ton' : Math.round(n) + ' kg';
