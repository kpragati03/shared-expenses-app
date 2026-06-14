# Anomaly Log & System Scope

## Database Schema Architecture
The application utilizes a relational database (PostgreSQL) managed by Prisma ORM. 
- **Users**: Authentication and profile management.
- **Groups**: Handles multi-tenant flatmate groups with `joinedAt` and `leftAt` timestamps for temporal membership tracking (Sam's requirement).
- **Expense**: Stores valid, normalized financial records including `splitType` (EQUAL, PERCENTAGE, SHARE, EXACT).
- **StagedExpense**: A buffer layer for non-compliant CSV rows. This ensures the app is "fault-tolerant."
- **ImportJob**: Links batches of imports to specific users, facilitating idempotency and auditability.

## Detailed Data Anomaly Log & Policies
The system parses `expenses_export.csv` through a strict Rules Engine. No silent guesses are permitted.

| ID | Issue Found | Technical Detection | Resolution Policy |
| :--- | :--- | :--- | :--- |
| 1 | **USD Currency** | `row.currency === 'USD'` | Redirect to `StagedExpense` (Status: AWAITING_USER). User must provide exchange rate. |
| 2 | **Negative Amounts** | `parseFloat(amount) < 0` | Quarantine row; prevents automated balance corruption. |
| 3 | **Invalid Date Format** | `Date.parse()` check | `DD-MM-YYYY` normalization; invalid strings trigger system failure alert. |
| 4 | **Duplicates** | Row Hashing (desc+amt+date) | Redirect to `StagedExpense` for Meera’s manual approval. |
| 5 | **Missing Split Types** | Fallback validation | Default to 'EQUAL' with an audit log entry. |
| 6 | **Future Dating** | Date > `new Date()` | Flagged as data error to prevent balance prediction bias. |
| 7 | **Unauthorized Membership** | Date comparison vs group join date | Expenses logged before/after membership are excluded from user balances. |
| 8 | **Rounding Precision** | Floating point check | All calculations performed using integer-based logic to avoid rounding drift. |
| 9 | **Settlements as Expenses** | Regex on description | Automated tag as `PAYMENT` rather than `EXPENSE` if "settlement" keyword found. |
| 10 | **Missing PaidBy** | Null-check | Defaults to `SYSTEM_USER` and logs an alert. |
| 11 | **Large Volume Anomalies** | Batch timeout monitor | Transaction roll-back if file exceeds 500 rows to prevent server crash. |
| 12 | **Illegal Characters** | Encoding check (UTF-8) | Sanitizes special characters in descriptions to prevent SQL injection. |