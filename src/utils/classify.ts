import type { Category, ClassificationRule } from '../types';

// ── Bank category mapping ─────────────────────────────────────────────────────
// This is kept as a hardcoded fallback for bank category exact matches
// that are not covered by user-managed rules.

// ── Classifier ────────────────────────────────────────────────────────────────

export function classifyTransaction(
   description: string,
   bankCategory: string,
   rules: ClassificationRule[],
): Category {
   const descLower = description.toLowerCase().trim();
   const bankCatLower = bankCategory.toLowerCase().trim();

   // 1. Find all matching description rules (contains, case-insensitive)
   const descriptionMatches = rules
      .filter(
         (r) =>
            r.matchField === 'description' &&
            descLower.includes(r.keyword.toLowerCase()),
      )
      .sort((a, b) => b.keyword.length - a.keyword.length); // most specific first

   if (descriptionMatches.length > 0) return descriptionMatches[0].category;

   // 2. Find all matching bank category rules (contains, case-insensitive)
   const bankCategoryMatches = rules
      .filter(
         (r) =>
            r.matchField === 'bankCategory' &&
            bankCatLower.includes(r.keyword.toLowerCase()),
      )
      .sort((a, b) => b.keyword.length - a.keyword.length); // most specific first

   if (bankCategoryMatches.length > 0) return bankCategoryMatches[0].category;

   // 3. Nothing matched
   return 'Non classé';
}
