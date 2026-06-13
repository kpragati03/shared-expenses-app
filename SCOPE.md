# Scope & Anomaly Log

## 1. Project Overview
This document logs the data anomalies detected in `expenses_export.csv` and the corresponding handling policies implemented in the Shared Expenses App backend.

## 2. Data Anomaly Log
| Anomaly Detected | Description | Handling Policy |
| :--- | :--- | :--- |
| **Duplicate Entries** | Identical rows for expenses (e.g., "Dinner at Marina Bites"). | Detected via record hashing; the first occurrence is kept, others are logged as duplicates. |
| **Settlement as Expense** | Debt repayments logged incorrectly in the expenses sheet. | Migrated to the `settlements` table; removed from `expenses` calculation. |
| **Currency Mismatch** | Mixture of USD and INR in amount fields. | Implemented an exchange rate service to normalize all values to INR. |
| **Unknown Payer** | "House cleaning supplies" lacks a valid payer. | Flagged as an anomaly; assigned to the 'System/Default' user. |
| **Inconsistent Split Format** | Mixed comma and semicolon separators in `split_with`. | Normalized all delimiters to semicolons during the CSV parsing stage. |
| **Missing Notes** | NULL values in the notes column. | Defaulted to an empty string to maintain schema integrity. |
| **Date Format Variability** | Inconsistent DD-MM-YYYY and YYYY-MM-DD formats. | Parsed using a fallback logic to ensure conversion to ISO Date objects. |
| **Negative Amounts** | Negative values present in specific rows. | Validated against the requirement; treated as refund transactions. |
| **Member Movement (Mid-April)** | Expenses logged after a member left the group. | Validation logic checks `leftAt` date of `GroupMember` before committing. |
| **Rounding Issues** | Excessive decimal points in split calculations. | Enforced 4-decimal point precision (`Decimal(19, 4)`) as per database schema. |
| **Sam's Move-in** | Expenses dated before Sam's move-in date. | Implemented temporal filtering to exclude pre-membership expenses. |
| **Trip Expenses** | Currency conversion discrepancies in trip logs. | Applied `isCustomExchangeRate` flag to handle variable trip-based rates. |

## 3. Database Schema Summary
The application utilizes a relational PostgreSQL database to ensure data integrity and support complex relationships between Users, Groups, Expenses, and Settlements.
- **Key Models:** `User`, `Group`, `Expense`, `ExpenseSplit`, `Settlement`.
- **Relationship Integrity:** Cascade deletes are implemented on `Group` and `Expense` deletions to prevent orphaned records.

## 4. Handling Policies
- **Data Integrity:** No manual CSV editing is allowed; the importer detects and surfaces all issues.
- **Reporting:** Every detected anomaly is recorded in the `Import Report` generated upon ingestion.
- **Transactional Safety:** Imports use database transactions to ensure that if a row fails, the database remains in a consistent state.