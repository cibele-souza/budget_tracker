import type { Transaction, Budget, Import } from '../types';
import { CATEGORIES } from '../types';

// ── Storage keys ─────────────────────────────────────────────────────────────

const KEYS = {
   transactions: 'budgettracker_transactions',
   budgets: 'budgettracker_budgets',
   imports: 'budgettracker_imports',
} as const;

function initialiseBudgets(): Budget[] {
   return CATEGORIES.map((category) => ({
      category,
      defaultValue: 0,
      monthlyOverrides: {},
   }));
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
