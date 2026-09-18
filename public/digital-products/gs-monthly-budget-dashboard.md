# Monthly Budget Dashboard — Google Sheets Template

**DoyinTech · Instant digital product**  
Thank you for your purchase. Build this in Google Sheets in ~15 minutes using the structure below.

## Why this sells
Budget planners are the #1 Google Sheets category on Etsy. Buyers want income vs expense, category limits, and a clear dashboard.

## Tabs to create
1. **Dashboard** — summary only (no raw data entry)
2. **Income** — date, source, amount, notes
3. **Expenses** — date, category, amount, payment method, notes
4. **Categories** — category name, monthly limit
5. **Bills** — name, amount, due day, paid?
6. **Savings Goals** — goal, target, current, deadline

## Categories (seed list)
Rent/Mortgage, Utilities, Food, Transport, Data/Airtime, Subscriptions, Healthcare, Education, Family, Entertainment, Business, Debt Payment, Savings, Other

## Income sheet columns
```
Date,Source,Amount,Notes
2026-09-01,Salary,450000,September pay
2026-09-05,Freelance,85000,Landing page deposit
```

## Expenses sheet columns
```
Date,Category,Amount,Method,Notes
2026-09-02,Food,12500,Transfer,Shoprite
2026-09-03,Data/Airtime,8000,Card,MTN
```

## Categories sheet
```
Category,MonthlyLimit
Food,80000
Transport,40000
Data/Airtime,25000
Subscriptions,15000
Savings,50000
```

## Dashboard formulas (put on Dashboard)
- **Total income (month):** `=SUMIF(Income!A:A,">="&DATE(2026,9,1),Income!C:C)`
- **Total expenses:** `=SUMIF(Expenses!A:A,">="&DATE(2026,9,1),Expenses!C:C)`
- **Left to spend:** `=B2-B3` (income cell − expense cell)
- **By category:** `=SUMIF(Expenses!B:B,A10,Expenses!C:C)` next to each category name

## Conditional formatting
- Expense amount **over** category limit → red fill
- Savings goal **≥ 100%** → green fill

## How to deliver to yourself
1. Create a blank Google Sheet → rename tabs as above.
2. Paste column headers.
3. Add sample rows, then replace with your data.
4. File → Share → Anyone with link (view) if you want a client copy later.

## Optional dark aesthetic
Format → Theme → choose dark; use orange `#ff8c14` for headers to match DoyinTech branding.

Not financial advice. Adjust categories to your life.
