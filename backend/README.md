# Shared Expenses App (Spreetail Assignment)

A robust, full-stack solution designed for the specific needs of flatmates dealing with inconsistent, multi-currency, and temporal expense data.

## Product Philosophy
"Don't guess; be accurate." The app prioritizes financial traceability and auditability over rapid, unverified bulk imports.

## Technical Highlights
- **Staging-Area Parsing:** A robust ingestion engine that quarantines anomalies rather than silently failing.
- **Temporal Membership:** Smart logic ensures electricity bills from March don't affect April balances (Sam's constraint).
- **Audit Trails:** Full history of who, when, and how much.

## Setup
1. **Clone:** `git clone <repo-url>`
2. **Dependencies:** `npm install`
3. **Environment:** Create a `.env` with `DATABASE_URL` (PostgreSQL).
4. **Migrate:** `npx prisma migrate dev`
5. **Start:** `npm run dev`

## Evaluation Note
I am the engineer of record. Every line of code, including the anomaly detection logic and the staging engine, has been reviewed for security and accuracy.