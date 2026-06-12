import type { Category } from '../types';

// ── Bank category mapping ────────────────────────────────────────────────────
// Maps bank-provided category strings (exact match, case-insensitive) to internal categories.
// Add new entries here as you discover new bank categories.

const BANK_CATEGORY_MAP: Record<string, Category> = {
   // Boursobank
   'restaurants, bars, discothèques…': 'Restaurant',
   'divertissement - culture (ciné, théâtre, concerts…)': 'Loisir Voyage',
   'courses alimentaires': 'Supermarché',
   'transports en commun': 'Transport',
   santé: 'Santé',
   logement: 'Logement',
   éducation: 'Education',
   sport: 'Sport',
   'abonnements et téléphonie': 'Mobile',
   revenus: 'Revenu',
   'épargne et placements': 'Rendement',
   'impôts et taxes': 'Impôt',
   animaux: 'Chien',
   'achats et shopping': 'Achat',
   retraits: 'Retrait',
   'virements internes': 'Intercompte',

   // Hello Bank
   loyer: 'Logement',
   'internet, tv': 'Internet',
   "retrait d'espèces": 'Retrait',
   'virement émis': 'Intercompte',
   salaire: 'Revenu',
   remboursement: 'Santé',
   assurance: 'Administratif',
   abonnement: 'Mobile',
   supermarché: 'Supermarché',
   restaurant: 'Restaurant',
   transport: 'Transport',
   'éducation / formation': 'Education',
   impôts: 'Impôt',
};

// ── Description keyword mapping ──────────────────────────────────────────────
// Fallback: if no bank category match, scan the description for keywords.
// Order matters — first match wins.

const KEYWORD_MAP: Array<{ keywords: string[]; category: Category }> = [
   { keywords: ['loyer', 'virement permanent'], category: 'Logement' },
   { keywords: ['edf', 'electricité', 'engie'], category: 'Electricité' },
   {
      keywords: ['orange', 'free', 'sfr', 'bouygues', 'fibre'],
      category: 'Internet',
   },
   { keywords: ['sncf', 'ratp', 'navigo', 'uber'], category: 'Transport' },
   {
      keywords: [
         'carrefour',
         'monoprix',
         'lidl',
         'aldi',
         'leclerc',
         'franprix',
      ],
      category: 'Supermarché',
   },
   {
      keywords: ['restaurant', 'brasserie', 'café', 'mcdonald', 'burger'],
      category: 'Restaurant',
   },
   {
      keywords: ['pharmacie', 'docteur', 'médecin', 'clinique'],
      category: 'Santé',
   },
   { keywords: ['salaire', 'virement reçu'], category: 'Revenu' },
   { keywords: ['retrait distributeur', 'retrait dab'], category: 'Retrait' },
   { keywords: ['amazon', 'fnac', 'darty'], category: 'Achat' },
   { keywords: ['impôt', 'trésor public', 'dgfip'], category: 'Impôt' },
   { keywords: ['assurance'], category: 'Administratif' },
   { keywords: ['intercompte', 'virement vers'], category: 'Intercompte' },
   { keywords: ['sport', 'fitness', 'salle de sport'], category: 'Sport' },
   { keywords: ['vétérinaire', 'royal canin', 'animalis'], category: 'Chien' },
];

// ── Classifier ───────────────────────────────────────────────────────────────

export function classifyTransaction(
   description: string,
   bankCategory: string,
): Category {
   // 1. Try exact match on bank category (case-insensitive)
   const bankMatch = BANK_CATEGORY_MAP[bankCategory.toLowerCase().trim()];
   if (bankMatch) return bankMatch;

   // 2. Fallback: scan description for keywords (case-insensitive)
   const descLower = description.toLowerCase();
   for (const { keywords, category } of KEYWORD_MAP) {
      if (keywords.some((kw) => descLower.includes(kw))) {
         return category;
      }
   }

   // 3. Nothing matched
   return 'Non classé';
}
