# Project & Task Tracker — Google Sheets Template

**DoyinTech · Instant digital product**

Kanban-style status + deadlines + simple workload view. Competes with popular Etsy “task tracker / Eisenhower / project” sheets.

## Tabs
1. **Tasks** — master list
2. **Projects** — project owner, deadline, health
3. **Kanban helper** — filter views by status
4. **Workload** — tasks per person this week
5. **Dashboard** — overdue count, done this week

## Tasks columns
```
ID,Title,Project,Status,Priority,Owner,DueDate,EstimateHrs,Done,Notes
T01,Wireframe home,Salon Site,In Progress,High,You,2026-09-18,3,FALSE,Mobile first
```

### Status dropdown
Backlog, Next, In Progress, Review, Done, Blocked

### Priority dropdown
Low, Medium, High, Urgent

## Projects columns
```
Project,Client,Start,Deadline,Status,BudgetNGN,Health
Salon Site,Glow Salon,2026-09-01,2026-09-30,Active,250000,On track
```
Health: On track, At risk, Late

## Eisenhower tag (optional column)
`=IF(AND(Priority="Urgent",DueDate<=TODAY()+3),"Do first",IF(Priority="High","Schedule","Delegate/Later"))`

## Dashboard formulas
- Overdue open tasks:  
  `=COUNTIFS(Tasks!G:G,"<"&TODAY(),Tasks!I:I,FALSE)`
- Done this week: count Done where DueDate in current week (or use CompletedDate column)

## Filter views to save
1. My tasks — Owner = You, Done = FALSE  
2. Overdue — DueDate &lt; TODAY(), Done = FALSE  
3. In Progress only  
4. Urgent + High

## Weekly ritual (15 min)
1. Move Blocked items or kill them.
2. Cap **In Progress** at 3.
3. Set next week’s Next queue (max 7).
4. Update project Health.

## Color
Urgent = red text · In Progress = orange bar · Done = muted green
