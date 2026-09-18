# Freelancer Income & Expense Bookkeeping — Google Sheets Template

**DoyinTech · Instant digital product**

Track invoices, income, expenses, and a simple P&amp;L. Built for freelancers and solopreneurs (Nigeria-friendly labels).

## Tabs
1. **Income** — paid invoices / transfers received
2. **Expenses** — tools, data, transport, contractors
3. **Invoices** — issued invoices (paid or not)
4. **Clients** — who owes what
5. **P&L Monthly** — summary by month
6. **Tax Notes** — non-advice reminder checklist

## Income columns
```
Date,Client,Description,AmountNGN,Method,InvoiceNo,TaxFlag
2026-09-05,Glow Salon,Landing page 50%,125000,Transfer,INV-001,Yes
```
Methods: Transfer, Paystack, Cash, Other

## Expenses columns
```
Date,Category,Vendor,AmountNGN,Deductible?,Notes
2026-09-03,Software,Google Workspace,12000,TRUE,Monthly
2026-09-04,Data,MTN,8000,TRUE,Hotspot
```
Categories: Software, Data, Transport, Equipment, Education, Contractor, Bank Charges, Marketing, Other

## Invoices columns
```
Number,Client,IssueDate,DueDate,AmountNGN,Status,PaidDate
INV-001,Glow Salon,2026-09-01,2026-09-08,125000,Paid,2026-09-05
```
Status: Draft, Sent, Paid, Overdue, Cancelled

## P&L Monthly (one row per month)
```
Month,Income,Expenses,Profit,Margin%
2026-09,=SUMIFS(Income!D:D,Income!A:A,">="&DATE(2026,9,1),Income!A:A,"<="&DATE(2026,9,30)),...
```
Margin: `=IF(Income=0,0,Profit/Income)`

## Clients roll-up
Use unique client names from Income + Invoices.  
Outstanding: sum of invoices where Status is Sent or Overdue.

## Tax Notes (not legal advice)
- Keep transfer references in Notes
- Separate personal vs business wallet if you can
- Ask your accountant about VAT/WHT thresholds
- Export CSV before tax appointments

## Year-end export
File → Download → CSV for Income and Expenses tabs.
