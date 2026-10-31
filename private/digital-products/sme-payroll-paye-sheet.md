# SME Payroll & PAYE Sheet (2026)
**DoyinTech · for businesses paying 2–100 staff**

A payroll spreadsheet that works out gross pay, pension, NHF, PAYE under the Nigeria Tax Act 2025 and net pay for every employee, plus the monthly remittance summary and a payroll calendar.

> Planning tool, not tax advice. Confirm your state's remittance process with your State Internal Revenue Service and your PFA.

---

## 1. Setting up the sheet
1. Open **payroll.csv** in Google Sheets (File → Import) or Excel.
2. Fill one row per employee: name, staff ID, basic, housing, transport, other allowances, annual rent paid (if they've given you proof), pension Y/N, NHF Y/N.
3. Paste the formulas below into the calculated columns on row 2 and fill down.
4. Duplicate the tab each month and name it "2026-01", "2026-02"…

## 2. Column formulas (Google Sheets / Excel)
Assume: D = Basic, E = Housing, F = Transport, G = Other, H = Annual rent, I = Pension (Y/N), J = NHF (Y/N).

| Column | Meaning | Formula (row 2) |
|---|---|---|
| K | Gross monthly | `=D2+E2+F2+G2` |
| L | Pension (8%) | `=IF(I2="Y",(D2+E2+F2)*8%,0)` |
| M | NHF (2.5% basic) | `=IF(J2="Y",D2*2.5%,0)` |
| N | Rent relief (annual) | `=MIN(H2*20%,500000)` |
| O | Annual taxable income | `=MAX(0,K2*12-(L2+M2)*12-N2)` |
| P | Annual PAYE | see band formula below |
| Q | Monthly PAYE | `=P2/12` |
| R | Other deductions | (enter) |
| S | Net pay | `=K2-L2-M2-Q2-R2` |
| T | Employer pension (10%) | `=IF(I2="Y",(D2+E2+F2)*10%,0)` |

**PAYE band formula (column P), 2026 bands:**
```
=IF(O2<=800000,0,
 IF(O2<=3000000,(O2-800000)*15%,
 IF(O2<=12000000,330000+(O2-3000000)*18%,
 IF(O2<=25000000,1950000+(O2-12000000)*21%,
 IF(O2<=50000000,4680000+(O2-25000000)*23%,
 10430000+(O2-50000000)*25%)))))
```
Bands: first ₦800,000 at 0%; next ₦2.2m at 15%; next ₦9m at 18%; next ₦13m at 21%; next ₦25m at 23%; above ₦50m at 25%.

## 3. Worked example
Basic ₦150,000, housing ₦60,000, transport ₦30,000, pension Y, NHF N, no rent relief.
- Gross monthly = ₦240,000 → annual ₦2,880,000.
- Pension = 8% × ₦240,000 = ₦19,200/month → ₦230,400/year.
- Taxable = ₦2,880,000 − ₦230,400 = ₦2,649,600.
- PAYE = (₦2,649,600 − ₦800,000) × 15% = ₦277,440/year → **₦23,120/month**.
- Net pay = ₦240,000 − ₦19,200 − ₦23,120 = **₦197,680**.

Check any single employee with the free PAYE calculator: doyintech.com/tools/paye-calculator-nigeria

## 4. Monthly remittance summary
At the bottom of each month's tab:
| Item | Total | Pay to | Due |
|---|---|---|---|
| PAYE | `=SUM(Q:Q)` | State Internal Revenue Service of the employee's residence | by the 10th of the following month |
| Pension (employee + employer) | `=SUM(L:L)+SUM(T:T)` | Each employee's PFA | within 7 working days of paying salaries |
| NHF | `=SUM(M:M)` | Federal Mortgage Bank of Nigeria | monthly |
| Net salaries | `=SUM(S:S)` | Employees' bank accounts | pay day |

## 5. Payroll calendar
| Day | Task |
|---|---|
| 20th | Collect changes: new staff, exits, increments, advances, absences |
| 22nd | Update the sheet; second person checks totals against last month |
| 24th | MD approves payroll |
| 25th–28th | Pay salaries; send payslips (free generator: doyintech.com/tools/payslip-generator-nigeria) |
| Within 7 working days | Remit pension |
| By the 10th next month | Remit PAYE |
| 31 January | Employers' annual return of staff emoluments (Form H1) to the state |

## 6. Payroll controls
- Two people involved: one prepares, another approves.
- Compare total net pay with last month; investigate any change above 5%.
- Pay only to accounts in the employee's own name.
- Keep signed payroll approvals and remittance receipts for at least six years.
- Pay new staff only after their file is complete (offer letter, ID, bank details, PFA, TIN).

## Files
- **payroll.csv** — headers and three sample employees to overwrite.
