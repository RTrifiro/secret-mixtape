# Secret Mixtape

A free, human-powered mixtape exchange. Listeners answer three questions about mood, memory, and moment — a Producer is matched with them and sends a real cassette or CD, guided only by those answers.

**Live site:** https://secret-mixtape.com

---

## Project Status

### ✅ Complete
- Frontend built — single `index.html`, vanilla HTML/CSS/JS, fully responsive with mobile nav
- Listener signup modal with dynamic question rendering and form validation
- Hosted on GitHub Pages (`main` branch)
- Custom domain connected: **secret-mixtape.com** → DNS configured, GitHub Pages verified, HTTPS enforced, confirmed live
- Airtable schema designed and renamed — five tables: `QUESTIONS`, `LISTENERS`, `PRODUCERS`, `MATCHES`, `NOTIFICATIONS_LOG`
- Naming decision resolved and applied: "Maker" renamed to "Producer" everywhere — Airtable schema, Vercel function code, and all frontend copy
- Vercel serverless functions built (`listener-signup.js`, `producer-signup.js`, `mark-shipped.js`, `mark-received.js`) plus `vercel.json`, uploaded to the repo
- Companion pages built and uploaded: `producer-shipping.html` (a Producer confirms they've mailed the tape) and `listener-received.html` (a Listener confirms it arrived)
- Listener sign-up temporarily paused with an on-brand "finishing setup" message — old Zapier webhook call removed from `index.html` so no submissions are silently lost while the real backend is wired up
- "I want to be a Producer" button given a temporary placeholder (was previously a dead link with no function at all) — now shows an alert that Producer sign-ups aren't open yet

### ⚠️ Decided, Not Yet Built
- **Vercel ↔ domain strategy decided:** the frontend will call the Vercel deployment's own address directly (e.g. `secret-mixtape.vercel.app/api/...`) with CORS locked to `secret-mixtape.com`, rather than standing up a separate `api.secret-mixtape.com` subdomain. Simpler, no extra DNS work.
- **Automation strategy decided:** staying on Zapier (Professional-tier account, not the free plan) rather than moving matching/notifications into Vercel. The original 3-Zap design — Listener welcome email, Producer welcome email, daily matching automation — will be built as originally planned.
- Vercel project not yet connected/deployed — the function files exist in the repo but aren't live yet
- `producer-shipping.html` and `listener-received.html` still point to a placeholder web address instead of the real Vercel address, since Vercel isn't deployed yet
- `index.html`'s sign-up form still needs to be pointed at `/api/listener-signup` once Vercel is live

### ⏳ Not Started
- Producer sign-up modal/form on the frontend (currently just a placeholder alert)
- Zapier automations: daily matching logic, confirmation/notification emails
- Migrating question source from Google Sheets CSV to Airtable `QUESTIONS` table
- `/resources` page

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | Vanilla HTML/CSS/JS (single file) |
| Hosting | GitHub Pages (`main` branch) |
| Domain | secret-mixtape.com (Squarespace Domains) |
| Database | Airtable (5-table schema) |
| API middleware | Vercel serverless functions |
| Automation | Zapier (Professional tier) — triggered by Airtable record changes |

---

## Repo Structure

```
/
├── index.html                 # Main landing page + Listener signup modal
├── README.md
├── CNAME
├── producer-shipping.html     # Producer confirms tape shipped
├── listener-received.html     # Listener confirms tape received
├── vercel.json
└── api/
    ├── listener-signup.js
    ├── producer-signup.js
    ├── mark-shipped.js
    └── mark-received.js
```

---

## Architecture Notes

**Form intake flow:**
Frontend → Vercel Function → Airtable (direct API), with Zapier triggered by Airtable record changes for downstream matching and email automation.

Zapier is *not* the entry point for form data — a previous attempt at Frontend → Zapier webhook → Airtable failed due to CORS restrictions and Zapier's inability to reliably parse browser-submitted payloads.

**Cross-origin calls:** since GitHub Pages can't route `/api/*` to Vercel on its own, the frontend calls the Vercel deployment's own domain directly. The Vercel functions restrict CORS to `secret-mixtape.com` so only the real site can call them.

---

*Made with care & blank tapes.*
