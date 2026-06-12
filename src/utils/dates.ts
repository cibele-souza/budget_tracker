// Returns a sorted array of years derived from transactions,
// plus one additional future year for budget planning.
export function getAvailableYears(transactionDates: string[]): number[] {
   if (transactionDates.length === 0) {
      const currentYear = new Date().getFullYear();
      return [currentYear, currentYear + 1];
   }

   const years = new Set(
      transactionDates.map((date) => parseInt(date.slice(0, 4))),
   );

   const maxYear = Math.max(...years);
   years.add(maxYear + 1);

   return Array.from(years).sort((a, b) => a - b);
}
