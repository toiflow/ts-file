#!/usr/bin/env node
// would-read-md.js — fetch Google Sheet CSV and output task data to stdout
// No auth required — sheet must be publicly accessible via export URL

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1VsRoh9Wg3TSAGJNtJHnovIqxzqKT-1ti1xbM7_DPEG0/export?format=csv&gid=1433072521';

async function main() {
  const res = await fetch(SHEET_URL);
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status} ${await res.text()}`);
  const csv = await res.text();
  if (!csv.trim()) throw new Error('Sheet returned empty data');
  process.stdout.write(csv.trim());
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
