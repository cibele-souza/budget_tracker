# BudgetTracker

A personal finance tracker built with React and TypeScript. Upload your bank exports, auto-classify transactions into categories using customizable rules, manage your transactions inline, set monthly budgets, and visualize your spending on an interactive dashboard.

Built as a portfolio project to demonstrate full-stack front-end development skills, including data parsing, state management, data visualization, cloud sync, and UI design.

---

## Features

**File import**
Upload CSV and XLS/XLSX bank exports via drag-and-drop or file browser. Transactions are automatically parsed, normalized, and classified on import.

**Auto-classification**
Transactions are automatically assigned to spending categories based on a user-manageable rule set. Rules match against the transaction description or the bank-provided category, with case-insensitive substring matching. The most specific rule (longest keyword) wins.

**Classification rules manager**
View, add, edit, and delete classification rules directly in the app. Rules are split into description rules and bank category rules, and ship with a sensible set of defaults that can be reset at any time.

**Transaction management**
- Add transactions manually with an inline form (useful for splitting expenses across categories)
- Edit any transaction inline (date, description, amount, category)
- Delete any transaction individually with an inline confirmation
- Edited and manually added transactions are marked with a ✎ indicator

**Budget planning**
Set a default monthly budget per category, with per-month overrides. Apply defaults to empty months in one click.

**Dashboard**
Visualize spending vs budget with summary cards, a monthly bar chart, and a per-category horizontal chart.

**Filters**
Filter by year(s), month(s), and category independently on the Transactions page and Dashboard. Text search on transaction description. Filters on the Transactions page persist across navigation and can be reset in one click.

**Data export & restore**
Export a full JSON snapshot of all your data at any time. Restore from a previously exported snapshot with a metadata preview before confirming.

**Google Drive sync**
Connect your Google account to automatically back up your data to your personal Google Drive (app-private folder). Auto-saves after any change (debounced 2s). Manual save available with immediate feedback.

**Persistence**
All data is saved to localStorage and survives page refreshes. Google Drive provides an additional cloud backup layer.

---

## Tech Stack

- **React 18** with **TypeScript**
- **React Router** for client-side navigation
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **PapaParse** for CSV parsing
- **SheetJS (xlsx)** for XLS/XLSX parsing
- **Google Identity Services (GIS)** for OAuth
- **Google Drive API** (`drive.appdata` scope) for cloud sync
- **localStorage** for local persistence

---

## Project Structure

```
src/
├── components/   # Reusable UI components (filters, tables, charts, modals, inputs)
├── pages/        # Page-level components (Upload, Transactions, Budget, Dashboard, Settings)
├── utils/        # Pure utility functions (parsing, classification, aggregation, storage, sync)
└── types/        # TypeScript types and constants (Transaction, Budget, Import, ClassificationRule, Categories)
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Google Drive sync (optional)

To enable Google Drive sync, create a project in the [Google Cloud Console](https://console.cloud.google.com), enable the Google Drive API, and create an OAuth 2.0 client ID. Then add your client ID to a `.env` file at the project root:

```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

The app uses the `drive.appdata` scope — it can only access its own backup file and cannot read or modify any other files in your Google Drive.

---

## Supported Banks

The app currently supports exports from:

| Bank | Format |
| --- | --- |
| BoursoBank | CSV |
| Hello Bank | XLS |

The normalisation logic is modular — adding support for a new bank requires adding a normaliser function in `src/utils/normalise.ts` and wiring it into `src/utils/parseFile.ts`.

---

## About

This project is part of my development portfolio. I'm an engineer with a background in logistics and supply chain operations (CentraleSupélec / USP), currently building skills at the intersection of operations and software development — Python, TypeScript, React, and data analysis.

I build tools with strong operational utility: practical, data-driven, and designed to solve real problems.

→ [LinkedIn](https://www.linkedin.com/in/cibele-s-b1b7bba/)
