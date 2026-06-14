# AI Collaboration & Engineering Transparency

**Tools Used:** Gemini (Architectural guidance), VS Code, Prisma, Postman.

**Reflection on AI-Generated Logic:**
While AI was an excellent partner for boilerplate and boilerplate architecture, it frequently proposed "shortcuts" that I had to reject to maintain the integrity of the project.

**Concrete Case Studies of Critical Corrections:**
1. **The Date Serialization Trap:** AI provided a quick `new Date(row.date)` solution for the CSV import. During local testing, this failed on `DD-MM-YYYY` strings. I refactored this into a manual string-split parser to guarantee that `day` and `month` were interpreted correctly regardless of locale.
2. **The Currency "Black Box" Problem:** AI suggested an auto-converter using a hardcoded `80` multiplier for USD. I flagged this as a critical failure (per Rohan's requirement to avoid "Magic Numbers"). I replaced it with a multi-step verification process that forces the user to input the conversion rate.
3. **Authentication Persistence:** AI suggested storing JWTs in `localStorage`. Recognizing the XSS risk, I overrode this and implemented a secure HTTP-only cookie approach (or secured Interceptor), ensuring sensitive tokens are not accessible to standard client-side scripts.