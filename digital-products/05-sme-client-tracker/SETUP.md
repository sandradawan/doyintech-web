# SME Client Tracker — Google Sheets setup

1. Create a Google Sheet
2. Import `clients.csv` → rename tab **Clients**
3. Import `pipeline.csv` → rename tab **Pipeline**
4. Create tab **Dashboard**

## Dashboard formulas
- Total pipeline: `=SUM(Pipeline!E:E)`
- Active clients: `=COUNTA(Clients!A2:A)`
- Won deals query:
```
=QUERY(Pipeline!A:J, "select B,C,E where D = 'Won'", 1)
```

## Stages
Lead → Contacted → Proposal → Won → Lost
