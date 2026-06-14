# Engineering Decisions Log: Why and How

### 1. Relational Database over NoSQL
I opted for PostgreSQL because financial systems require strong consistency. Using Prisma ORM allowed me to enforce schema constraints at the database level, ensuring that balances cannot be orphaned. NoSQL was considered but rejected due to the risk of data inconsistency in "who-owes-whom" calculations.

### 2. The "Staging" Architecture
The core requirement was to handle messy data without crashing. Instead of building a fragile parser that tries to "guess," I built a `StagedExpense` quarantine. This allows the system to be **transparent**. It forces the user to own the data-cleaning process, ensuring 100% accuracy in the balance sheet.

### 3. JWT-Based Stateless Auth
I chose JWT over session-based auth to keep the API stateless. This design choice enables the backend to scale independently, which is crucial for potential feature expansion into mobile platforms.

### 4. Client-Side Balance Calculation
Initially, I considered offloading balance calculations to the database (SQL aggregates), but decided to handle core logic in the Service layer (Node.js). This makes the code **testable**. I can now write unit tests for the math logic without needing to mock complex SQL joins.