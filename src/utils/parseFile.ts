import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// ── Types ────────────────────────────────────────────────────────────────────

// A raw row is just a plain object with string keys and unknown values.
// We don't know the column names yet — that's the normaliser's job.
export type RawRow = Record<string, unknown>;

export type ParsedFile = {
   rows: RawRow[];
   bankName: string;
};

// ── CSV parser ───────────────────────────────────────────────────────────────

export function parseCsv(file: File): Promise<RawRow[]> {
   return new Promise((resolve, reject) => {
      Papa.parse<RawRow>(file, {
         header: true, // first row becom0es the object keys
         skipEmptyLines: true,
         complete: (results) => resolve(results.data),
         error: (error) => reject(new Error(error.message)),
      });
   });
}

// ── XLS / XLSX parser ────────────────────────────────────────────────────────

export function parseXls(file: File): Promise<RawRow[]> {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
         try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json<RawRow>(firstSheet, {
               range: 2, // 0-indexed: skip rows 0 and 1, treat row 2 as headers
            });
            resolve(rows);
         } catch (err) {
            reject(new Error(`XLS parsing failed: ${err}`));
         }
      };

      reader.onerror = () => reject(new Error('FileReader failed'));
      reader.readAsArrayBuffer(file);
   });
}

// ── Entry point ──────────────────────────────────────────────────────────────

// Dispatches to the right parser based on file extension.
// Bank detection is based on filename for now
export async function parseFile(file: File): Promise<ParsedFile> {
   const ext = file.name.split('.').pop()?.toLowerCase();
   const name = file.name.toLowerCase();

   if (ext === 'csv') {
      const rows = await parseCsv(file);
      // Detect bank from filename
      const bankName = name.includes('bourso') ? 'BoursoBank' : 'Unknown Bank';
      return { rows, bankName };
   }

   if (ext === 'xls' || ext === 'xlsx') {
      const rows = await parseXls(file);
      const bankName =
         name.includes('hb') || name.includes('hello')
            ? 'Hello Bank'
            : 'Unknown Bank';
      return { rows, bankName };
   }

   return Promise.reject(new Error(`Unsupported file type: .${ext}`));
}
