#!/usr/bin/env node
// would-read-md.js — fetch Google Sheet CSV via Drive API export and output to stdout
// Env: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN

const CLIENT_ID     = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const FILE_ID       = '1VsRoh9Wg3TSAGJNtJHnovIqxzqKT-1ti1xbM7_DPEG0';
const GID           = '1433072521';

async function refreshAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type:    'refresh_token'
    })
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

async function main() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error('GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN required');
  }

  const token = await refreshAccessToken();
  const url   = `https://www.googleapis.com/drive/v3/files/${FILE_ID}/export?mimeType=text/csv&gid=${GID}`;
  const res   = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Drive export failed: ${res.status} ${await res.text()}`);
  const csv = await res.text();
  if (!csv.trim()) throw new Error('Sheet returned empty data');
  process.stdout.write(csv.trim());
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
