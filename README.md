# Budget Tracker

A personal finance tracker built with React and TypeScript. Upload your bank exports, auto-classify transactions into categories, set monthly budgets, and visualize your spending on an interactive dashboard.

Built as a portfolio project to demonstrate full-stack front-end development skills, including data parsing, state management, data visualization, and UI design.

---

## Features

- **File import** — Upload CSV and XLS/XLSX bank exports via drag-and-drop or file browser
- **Auto-classification** — Transactions are automatically assigned to spending categories based on description keywords
- **Manual override** — Correct any misclassified transaction inline with a category dropdown
- **Budget planning** — Set a default monthly budget per category, with per-month overrides; apply defaults to empty months in one click
- **Dashboard** — Visualize spending vs budget with summary cards, a monthly bar chart, and a per-category horizontal chart
- **Filters** — Filter by year, month(s), and category independently across the Transactions page and Dashboard
- **Persistence** — All data (transactions, budgets, import history) is saved to localStorage and survives page refreshes

---

## Tech Stack

- **React 18** with TypeScript
- **React Router** for client-side navigation
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **PapaParse** for CSV parsing
- **SheetJS (xlsx)** for XLS/XLSX parsing
- **localStorage** for persistence

---

## Project Structure

```
src/
├── components/        # Reusable UI components (filters, tables, charts, inputs)
├── pages/             # Page-level components (Upload, Transactions, Budget, Dashboard)
├── utils/             # Pure utility functions (parsing, normalization, aggregation, storage)
└── types/             # TypeScript types and constants (Transaction, Budget, Import, Categories)
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## Supported Banks

The app currently supports exports from:

- **BoursoBank** (CSV)
- **Hello Bank** (XLS)

The normalisation logic is modular — adding support for a new bank requires adding a normaliser function in `src/utils/normalise.ts`.

---

## About

This project is part of my development portfolio. I'm an engineer with a background in logistics and supply chain operations (CentraleSupélec / USP), currently building skills at the intersection of operations and software development — Python, TypeScript, React, and data analysis.

I build tools with strong operational utility: practical, data-driven, and designed to solve real problems.

→ [LinkedIn](https://www.linkedin.com/in/cibele-s-b1b7bba/)
