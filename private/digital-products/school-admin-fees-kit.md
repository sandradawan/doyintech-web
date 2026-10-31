# School Admin & Fees Tracker Kit
**DoyinTech · for private nursery, primary and secondary schools**

Templates and spreadsheets for the jobs that take the bursar's and head teacher's time every term: fees, debtors, admissions, results and parent communication.

---

## 1. Fees tracker (fees-tracker.csv)
One row per student per term: admission no., name, class, fee due, discount/scholarship, amount paid, payment dates, method, receipt numbers, balance, status.

Formulas (Google Sheets/Excel), assuming F = fee due, G = discount, H = paid:
- Balance: `=F2-G2-H2`
- Status: `=IF(I2<=0,"Paid",IF(H2>0,"Part-paid","Owing"))`
- Class total owing (on a summary tab): `=SUMIFS(I:I,C:C,"JSS1")`

**Weekly routine (20 minutes):** match bank alerts to students → issue receipts → update the sheet → filter "Owing" and "Part-paid" → send reminders.

## 2. Fee reminder messages
**Polite (week 3 of term):**
"Good morning, Mr/Mrs [SURNAME]. This is a gentle reminder that [CHILD]'s [TERM] fees balance of ₦[ ] is due by [DATE]. Account: [BANK, NUMBER, NAME]. Kindly send the payment slip here for a receipt. Thank you for your support. — [SCHOOL] Bursary"

**Firm (week 6):**
"Dear Parent, our records show an outstanding balance of ₦[ ] for [CHILD]. Please pay or contact the bursar by [DATE] to agree a payment plan. Thank you."

**Payment plan agreement:** "I, [PARENT], agree to pay [CHILD]'s outstanding fees of ₦[ ] in [N] instalments of ₦[ ] on [DATES]. Signed ______ Bursar ______"

## 3. Admission form (key fields)
Pupil: surname, other names, date of birth, gender, class applied for, previous school, last class completed, medical conditions/allergies, blood group.
Parents/guardians: names, occupations, phone numbers, email, home address, who may pick up the child.
Documents: birth certificate, last report card, passport photos (2), transfer letter where applicable.
Office use: entrance exam score, interview date, admitted ☐ Yes ☐ No, admission no., class assigned.

## 4. Admission letter
"Dear Parent, we are pleased to offer [CHILD] admission into [CLASS] for the [2026/2027] academic session. Please complete the acceptance form and pay the acceptance fee of ₦[ ] by [DATE] to secure the place. Resumption is on [DATE]. We look forward to welcoming your family. — Head Teacher"

## 5. Score sheet (score-sheet.csv)
Columns: Admission no. · Name · CA1 (/10) · CA2 (/10) · CA3 (/10) · Exam (/70) · Total (/100) · Grade · Position · Remark.
- Total: `=SUM(C2:F2)`
- Grade: `=IFS(G2>=70,"A",G2>=60,"B",G2>=50,"C",G2>=45,"D",G2>=40,"E",TRUE,"F")`
- Position in class: `=RANK(G2,G$2:G$41)`

Adjust the grade boundaries to your school's policy.

## 6. Report card comment bank
**Excellent:** "An outstanding performance. [NAME] is diligent and a good example to others." · **Good:** "A good result. More attention to [SUBJECT] will lift [NAME] further." · **Average:** "Fair performance. [NAME] can do better with regular revision at home." · **Needs support:** "[NAME] needs closer supervision with homework and reading. Let us work together this term." · **Conduct:** "Well behaved and respectful." / "Should be more punctual."

## 7. Termly calendar template
Week 1 resumption and fee drive · Week 3 first CA · Week 5 PTA meeting · Week 6 mid-term break · Week 8 second CA · Week 10 revision · Week 11 exams · Week 12 results and closing · Holiday: fees for next term communicated.

## 8. PTA meeting agenda
Opening prayer · Head teacher's report · Finance report (fees, projects) · Academic report · Security and welfare · Parents' questions · Date of next meeting · Closing.
Use the free Meeting Minutes Generator to record decisions.

## 9. Staff records
Use the HR & Staff Policy Starter Pack, or keep at least: appointment letter, qualifications, NIN, bank details, PFA, guarantor and next of kin.

## 10. When to move to software
If you have more than about 200 pupils, several staff entering scores, or parents asking to pay online, a school management system saves more than it costs: parents pay fees by Paystack, receipts issue automatically and report cards generate from teachers' scores. See doyintech.com/school-management-software-nigeria.

### Files in this pack
- **fees-tracker.csv**
- **score-sheet.csv**
