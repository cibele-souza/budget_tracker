import type { Transaction, Budget, Import, ClassificationRule } from '../types';
import { CATEGORIES } from '../types';
import { DEFAULT_RULES } from './classificationRules';

// ── Storage keys ─────────────────────────────────────────────────────────────

const KEYS = {
   transactions: 'budgettracker_transactions',
   budgets: 'budgettracker_budgets',
   imports: 'budgettracker_imports',
   rules: 'budgettracker_rules',
} as const;

function initialiseBudgets(): Budget[] {
   return CATEGORIES.map((category) => ({
      category,
      defaultValue: 0,
      monthlyOverrides: {},
   }));
}

function initialiseRules(): ClassificationRule[] {
   return DEFAULT_RULES;
}

// ── Generic helpers ───────────────────────────────────────────────────────────

function saveToStorage<T>(key: string, data: T): void {
   try {
      localStorage.setItem(key, JSON.stringify(data));
   } catch (error) {
      console.error(`Failed to save to localStorage [${key}]:`, error);
   }
}

function loadFromStorage<T>(key: string, fallback: T): T {
   try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
   } catch (error) {
      console.error(`Failed to load from localStorage [${key}]:`, error);
      return fallback;
   }
}

// ── Typed save functions ──────────────────────────────────────────────────────

export function saveTransactions(transactions: Transaction[]): void {
   saveToStorage(KEYS.transactions, transactions);
}

export function saveBudgets(budgets: Budget[]): void {
   saveToStorage(KEYS.budgets, budgets);
}

export function saveImports(imports: Import[]): void {
   saveToStorage(KEYS.imports, imports);
}

export function saveRules(rules: ClassificationRule[]): void {
   saveToStorage(KEYS.rules, rules);
}

// ── Typed load functions ──────────────────────────────────────────────────────

export function loadTransactions(): Transaction[] {
   return loadFromStorage<Transaction[]>(KEYS.transactions, []);
}

export function loadBudgets(): Budget[] {
   return loadFromStorage<Budget[]>(KEYS.budgets, initialiseBudgets());
}

export function loadImports(): Import[] {
   return loadFromStorage<Import[]>(KEYS.imports, []);
}

export function loadRules(): ClassificationRule[] {
   return loadFromStorage<ClassificationRule[]>(KEYS.rules, initialiseRules());
}

// Reporting failures
export function checkStorageHealth(): string | null {
   try {
      const keys = [KEYS.transactions, KEYS.budgets, KEYS.imports, KEYS.rules];
      for (const key of keys) {
         const raw = localStorage.getItem(key);
         if (raw !== null) JSON.parse(raw); // will throw if corrupted
      }
      return null;
   } catch {
      return 'Some saved data could not be loaded and has been reset to default. Your file imports are unaffected.';
   }
}
