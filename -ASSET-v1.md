<instructions>

ASSET LOG
INSTRUCTION FOR AI MODEL:

ALWAYS ADD NEW ASSET ENTRIES AT THE TOP, DIRECTLY BELOW THIS HEADER.

NEVER DELETE OR EDIT PREVIOUS ASSET ENTRIES.

REQUIRED FORMAT FOR EACH ASSET ENTRY:

## ASSET:{NAME OF ENVIRONMENT} {YYYY-MM-DD HH:MM} → {CONTENT}

</instructions>

####### <!-- ANCHOR MARKER - ADD NEW ENTRIES BELOW -->

## ASSET:ts-file 2026-06-06 → pipeline fully operational — all 4 jobs passing

First end-to-end run confirmed. Drive API → Ollama → GitHub commit + must-file email all passing.

| Job | Status | Detail |
|---|---|---|
| `fetch` | ✅ | Drive API exported sheet CSV — private sheet, OAuth authenticated |
| `issue` | ✅ | Ollama analysis via `must-update-content.yml` |
| `asset` | ✅ | Ollama analysis via `must-update-content.yml` |
| `update` | ✅ | Committed to `would/` files + sent `must-file` email |

**Fix required:** CSV data contained `(`, `"`, `$`, backtick characters breaking shell jq interpolation in `must-update-content.yml`. Fixed by sanitizing via `tr -d '"\\` `` ` `` `$()' | tr "'" ' '` in fetch step.

**Schedule:** 6pm NZST (`0 6 * * *` UTC)

## ASSET:ts-file 2026-06-06 → pipeline initialised — Google Sheets + GitHub Actions

Migrated from Mac-bound local script to GitHub Actions pipeline.

| Component | Detail |
|---|---|
| `would-read-md.js` | Fetches Google Sheet CSV via public export URL — no auth required |
| Sheet | `1VsRoh9Wg3TSAGJNtJHnovIqxzqKT-1ti1xbM7_DPEG0` gid `1433072521` |
| `would-update-content.js` | Commits to `would/` files + sends `must-file` email with .md attachment |
| `would-update-csv.js` | Appends daily asset analysis to `would/-log-asset-v1.csv` |
| Workflow | 4-job: `fetch` → `issue` + `asset` (reusable Ollama) → `update` |
| Schedule | cron `0 18 * * *` — 6am NZST daily |
| Email | `must-file` subject, `must-file-YYYY-MM-DD.md` attachment to `jayreck996@gmail.com` |
| Org secrets | Inherits `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `OLLAMA_SECRET`, `OLLAMA_URL` |
