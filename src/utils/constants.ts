export const MONTH_NAMES = [
   'Janvier',
   'Février',
   'Mars',
   'Avril',
   'Mai',
   'Juin',
   'Juillet',
   'Août',
   'Septembre',
   'Octobre',
   'Novembre',
   'Décembre',
] as const;

export const MONTHS = [
   'JAN',
   'FEV',
   'MAR',
   'AVR',
   'MAI',
   'JUN',
   'JUL',
   'AOU',
   'SEP',
   'OCT',
   'NOV',
   'DÉC',
];

export type MonthName = (typeof MONTH_NAMES)[number];

export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
