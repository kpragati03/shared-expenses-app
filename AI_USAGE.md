# AI Usage & Collaboration Log

## 1. AI Tools Used
- **Primary AI:** Gemini (as an AI collaborator for backend development, logic design, and debugging).

## 2. Key Prompts Summary
- **Initial Setup:** Requested boilerplate for Express.js with Prisma ORM for relational data handling.
- **Data Import:** Provided the `expenses_export.csv` structure and asked for a resilient import strategy that avoids silent guessing and handles anomalies.
- **Logic Design:** Collaborated on `BalanceService` and `SettlementService` to handle multi-currency expenses and temporal group membership (e.g., Sam's move-in).

## 3. Concrete Cases: AI Errors, Detection & Corrections

| Case | AI Error | How I Caught It | Corrective Action |
| :--- | :--- | :--- | :--- |
| **Controller Setup** | AI suggested a direct route implementation without checking existing file structure. | I noticed `expense.controller.js` was missing from the file tree. | I manually instructed the AI to use terminal commands to create missing files and verify existing ones. |
| **Route Conflict** | AI suggested routes that conflicted with my pre-existing `group.routes.js`. | I compared the generated code with my `group.routes.js` and saw duplicated middleware usage. | I refactored the routes to integrate the new expense endpoints properly with existing `protect` middleware. |
| **Logic Precision** | AI provided a generic "Equal Split" logic that ignored percentage/share splits requested in the assignment. | I realized the implementation didn't satisfy requirement 3a (support every split type). | I forced a redesign of `ExpenseService` to dynamically calculate splits based on types like `PERCENTAGE` and `SHARE`. |

## 4. Engineering Reflection
As the engineer of record, I treated the AI as a junior collaborator. I took responsibility for verifying every function, cross-checking the database schema, and ensuring that the "anomaly handling" logic met the specific requirements defined in the assignment guidelines.