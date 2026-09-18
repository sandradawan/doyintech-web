# Client CRM & Lead Tracker — Google Sheets Template

**DoyinTech · Instant digital product**

A lightweight CRM for freelancers and SMEs who outgrew a notebook but don’t need Salesforce.

## Tabs
1. **Pipeline** — every lead/client in one board-style list
2. **Contacts** — phone, email, business, source
3. **Activity Log** — calls, WhatsApp, meetings
4. **Tasks** — next actions with due dates
5. **Dashboard** — counts by stage + unpaid pipeline value

## Pipeline columns
```
ID,Name,Business,Stage,ValueNGN,Source,NextFollowUp,Owner,Notes,Created
L001,Ada Okafor,Glow Salon,Quoted,250000,Instagram,2026-09-20,You,Wants booking site,2026-09-10
```

## Stages (use data validation dropdown)
Lead → Contacted → Quoted → Won → Delivering → Paid → Lost

## Contacts columns
```
Name,Business,Phone,Email,Source,Tags,Notes
```

## Activity Log columns
```
Date,Contact,Type,Summary,NextStep
2026-09-12,Ada Okafor,WhatsApp,Sent quote PDF,Follow up Friday
```
Types: Call, WhatsApp, Email, Meeting, Other

## Tasks columns
```
Title,Contact,DueDate,Done,Priority
Send portfolio samples,James Bello,2026-09-18,FALSE,High
```

## Dashboard metrics
- Open leads: `=COUNTIF(Pipeline!D:D,"Lead")+COUNTIF(Pipeline!D:D,"Contacted")`
- Pipeline value: `=SUMIF(Pipeline!D:D,"<>Paid",Pipeline!E:E)-SUMIF(Pipeline!D:D,"Lost",Pipeline!E:E)`
- Follow-ups due today: filter NextFollowUp ≤ TODAY()

## WhatsApp power tip
Add a helper column:  
`="https://wa.me/234"&RIGHT(SUBSTITUTE(Phone," ",""),10)`  
(adjust for your number format)

## Color code stages
- Lead: gray · Quoted: orange · Won: blue · Paid: green · Lost: red

Pairs well with DoyinOps on doyintech.vercel.app/ops
