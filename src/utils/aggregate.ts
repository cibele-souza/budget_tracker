import type { Transaction, Budget, Category } from '../types';

// ── Types ────────────────────────────────────────────────────────────────────

export interface MonthData {
   spent: number;
   budget: number;
}

export interface CategorySummary {
   category: Category;
   spent: number; // total for the period
   budget: number; // total for the period
   isOverBudget: boolean;
   monthlyData: Record<string, MonthData>; // e.g. { "2025-01": { spent: 300, budget: 400 } }
}

export interface PeriodSummary {
   totalSpent: number;
   totalBudget: number;
   overBudgetCount: number;
   categories: CategorySummary[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

// Returns the budget value for a single month key (e.g. "2025-03")
function getMonthBudget(budget: Budget, monthKey: string): number {
   return budget.monthlyOverrides[monthKey] ?? budget.defaultValue;
}

// Returns all month keys for a given year (e.g. ["2025-01", ..., "2025-12"])
function getMonthKeysForYear(year: number): string[] {
   return Array.from(
      { length: 12 },
      (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`,
   );
}

// Filters transactions by year and optionally by month or months
function filterTransactions(
   transactions: Transaction[],
   year: number,
   selectedMonths: number[], // empty = all months
): Transaction[] {
   return transactions.filter((t) => {
      const [tYear, tMonth] = t.date.split('-').map(Number);
      if (tYear !== year) return false;
      if (selectedMonths.length > 0 && !selectedMonths.includes(tMonth))
         return false;
      return true;
   });
}

// ── Per-category aggregation ─────────────────────────────────────────────────

function aggregateByCategory(
   transactions: Transaction[],
   budgets: Budget[],
   year: number,
   selectedMonths: number[],
): CategorySummary[] {
   const filtered = filterTransactions(transactions, year, selectedMonths);

   // Sum spent per category (expenses only — negative amounts)
   const spentMap: Partial<Record<Category, number>> = {};
   for (const t of filtered) {
      if (t.amount < 0) {
         spentMap[t.category] =
            (spentMap[t.category] ?? 0) + Math.abs(t.amount);
      }
   }

   // Compute budget per category for the period
   return budgets.map((budget) => {
      const spent = spentMap[budget.category] ?? 0;

      // Build monthly data for all 12 months of the year
      const monthlyData: Record<string, MonthData> = {};
      getMonthKeysForYear(year).forEach((key) => {
         const monthTransactions = transactions.filter(
            (t) =>
               t.date.startsWith(key) &&
               t.category === budget.category &&
               t.amount < 0,
         );
         const monthSpent = monthTransactions.reduce(
            (sum, t) => sum + Math.abs(t.amount),
            0,
         );
         const monthBudget = getMonthBudget(budget, key);
         monthlyData[key] = {
            spent: Math.round(monthSpent * 100) / 100,
            budget: Math.round(monthBudget * 100) / 100,
         };
      });

      const monthsToSum =
         selectedMonths.length > 0
            ? selectedMonths.map((m) => `${year}-${String(m).padStart(2, '0')}`)
            : getMonthKeysForYear(year);

      const budgetAmount = monthsToSum.reduce(
         (sum, key) => sum + getMonthBudget(budget, key),
         0,
      );

      return {
         category: budget.category,
         spent: Math.round(spent * 100) / 100,
         budget: Math.round(budgetAmount * 100) / 100,
         isOverBudget: spent > budgetAmount && budgetAmount > 0,
         monthlyData,
      };
   });
}

// ── Main aggregation function ────────────────────────────────────────────────

export function aggregatePeriod(
   transactions: Transaction[],
   budgets: Budget[],
   year: number,
   selectedMonths: number[], // empty = all months
): PeriodSummary {
   const categories = aggregateByCategory(
      transactions,
      budgets,
      year,
      selectedMonths,
   );

   const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
   const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0);
   const overBudgetCount = categories.filter((c) => c.isOverBudget).length;

   return {
      totalSpent: Math.round(totalSpent * 100) / 100,
      totalBudget: Math.round(totalBudget * 100) / 100,
      overBudgetCount,
      categories,
   };
}
