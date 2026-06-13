# Engineering Decisions Log

## 1. Database Selection (Relational DB)
- **Decision:** Used PostgreSQL with Prisma ORM.
- [cite_start]**Why:** The assignment requires a relational database[cite: 29]. PostgreSQL provides strong ACID compliance, which is critical for financial transactions and balance tracking. Prisma offers type-safe database access, reducing runtime errors.

## 2. CSV Import Strategy
- **Decision:** Built a custom streaming CSV parser.
- [cite_start]**Why:** The requirement forbids manual editing of the CSV[cite: 32]. A streaming approach (`csv-parser`) allows the app to handle large files efficiently without loading the entire content into memory, avoiding server crashes.

## 3. Handling Split Logic
- **Decision:** Normalizing all split types to individual `ExpenseSplit` records.
- [cite_start]**Why:** To satisfy Rohan's requirement ("No magic numbers")[cite: 12], we need granular records to trace exactly which expenses contribute to a balance. This enables full auditability.

## 4. Currency Conversion
- **Decision:** Normalizing to a base currency (INR) at the time of import.
- [cite_start]**Why:** Priya's requirement highlighted the inaccuracy of treating USD as INR[cite: 13]. By implementing an exchange rate lookup, we maintain accurate financial reporting regardless of the transaction currency.

## 5. Temporal Membership
- **Decision:** Filtering expenses based on `GroupMember` join/leave dates.
- [cite_start]**Why:** Sam's requirement ("Why would March electricity affect my balance?") [cite: 14] necessitates that balances be calculated only against expenses incurred during a member's active period in the group.

## 6. Duplicate Resolution
- **Decision:** Hash-based duplicate detection.
- [cite_start]**Why:** To clean up the spreadsheet as requested by Meera[cite: 15], we generate a hash for each row (based on description, amount, and date) to identify and flag duplicates without silent data loss.