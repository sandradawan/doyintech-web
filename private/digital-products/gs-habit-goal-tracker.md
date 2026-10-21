# Habit & Goal Tracker 2026 — Google Sheets Template

**DoyinTech · Instant digital product**

Daily/weekly habit grid + SMART goals. Strong Etsy demand in productivity and ADHD-friendly planning.

## Tabs
1. **Habits Monthly** — grid: habit rows × day columns
2. **Habit Definitions** — name, cue, target days/week
3. **Goals** — SMART goals with progress %
4. **Weekly Review** — wins, blockers, next week focus
5. **Dashboard** — completion rates

## Habit Definitions
```
Habit,Cue,TargetDaysPerWeek,Active
Deep work 90m,After morning tea,5,TRUE
Walk 20m,After lunch,6,TRUE
No phone first 30m,Wake up,7,TRUE
Ship one sales action,09:30,5,TRUE
```

## Habits Monthly layout
- Column A: Habit name
- Columns B–AF: days 1–31
- Enter `1` when done, blank when missed
- **Row total:** `=SUM(B2:AF2)`
- **% complete:** `=B32/DAY(EOMONTH(DATE(2026,9,1),0))` (adjust)

## Goals sheet
```
Goal,Metric,Start,Target,Current,Deadline,Status
₦500k product revenue,NGN,0,500000,120000,2026-12-31,On track
Launch DoyinOps cloud,%,0,100,40,2026-10-31,At risk
```

Progress formula: `=IF(Target=0,0,Current/Target)`

## Weekly Review prompts
- Win of the week
- Habit with lowest completion
- One system fix (not motivation)
- Top 3 outcomes next week

## Streak helper
Conditional formatting: cell value = 1 → green; empty on weekday → light red

## ADHD-friendly rules (built into the pack)
- Max **4** active habits
- Targets are days/week, not perfection
- Weekly review ≤ 15 minutes

Replace month tabs each month (duplicate Habits Monthly → rename).
