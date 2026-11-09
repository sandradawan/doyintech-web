import type { EbookChapter } from "@/lib/ebooks";

/**
 * Extra chapters for books whose catalogue text is sound but short. They go in just before the
 * book's closing plan, and the chapter numbers are redone so the book still reads in order.
 */
export const EXTRA_CHAPTERS: Record<string, EbookChapter[]> = {
  "ebook-start-register-business-ng": [
    {
      title: "Partners, shares and using an agent",
      body: `Most registration trouble doesn't come from the CAC portal. It comes from people. Settle these questions before you file anything.

If you're starting with a partner, write down who owns what. For a company, shares decide who controls it and who gets the profit. An example: two friends start a logistics company. One puts in ₦2,000,000 and works part-time. The other puts in ₦300,000 and works full-time. A 50/50 split may feel friendly today, but it could cause a fight in year two. Discuss it now, and consider paying the full-time partner a salary, so that shares reward ownership and pay rewards work.

Put these in a signed shareholders' or partnership agreement:

Who owns what percentage.
What each person contributes and does.
How decisions are made, and what happens if you disagree 50/50.
How profit is shared, and when.
What happens if someone wants to leave or dies.
Whether shares can be sold to outsiders.

Our contract generator can give you a starting draft, but have a lawyer review an agreement like this. The fee is small compared with a dispute.

Directors have legal duties. If you're a director of a company, you must act honestly in its interest, keep proper records and make the required filings. Don't agree to be a director just to help a friend. You may become responsible for things you know nothing about.

Using an agent. Doing it yourself is possible, but an accredited agent can save time, particularly for a company. CAC publishes information on accredited agents, so check before you pay. Ask:

What's the official fee, and what's your fee?
Will the registration be in my name, with my email and phone number?
Who keeps the login to the portal?
How long will it take, and what happens if the name is rejected?
Will I get all the documents, including the status report?

Warning signs: an agent who won't show the official fee, who wants to register using their own email, or who promises to "arrange" a licence without the usual process.

Your task now: if you have partners, write down the answers to the six agreement questions and sign them. If you're using an agent, get their fee and the official fee in writing.`,
    },
    {
      title: "Staying compliant after registration",
      body: `Registration isn't the end. A business that ignores its filings can be marked inactive, pay penalties, and find that a bank or a client refuses to deal with it. The good news is that the yearly list is short. Rules and fees change, so confirm each item with the relevant agency.

CAC annual returns. Registered businesses and companies must file annual returns with CAC, even if business was slow. A company files within 42 days after each anniversary of incorporation. Late filing brings penalties, and they can pile up over the years. Put the date in your calendar now.

Changes. Tell CAC when things change: address, directors, shareholders or the nature of your business. If you change them only on your signboard, your official record stays wrong, and that may cause problems at your bank or with a contract.

Persons with significant control. Companies must disclose the people who ultimately own or control them. Know who that is for your company, and make sure the record stays correct.

Tax filings. Even a company taxed at 0% must still file its return. Companies generally file within six months of the end of their accounting year. Individuals, including business name owners, self-assess by 31 March. If you register for VAT or employ staff, there are monthly remittances as well. Our compliance calendar for Nigeria lists the common dates.

Staff duties. When you employ people, look into these. Applicability depends on your size, so ask an accountant or check with each agency:

PAYE deducted and remitted monthly.
Pension contributions, under the Pension Reform Act.
NSITF for workplace injury cover.
ITF training contributions, for employers above its threshold.
A written employment contract for every staff member.

Sector renewals. NAFDAC registrations, food handlers' certificates, premises permits and professional licences expire. List each one with its renewal date.

Set up a compliance sheet with five columns: what's due, which agency, due date, cost and who's responsible. Review it on the first working day of each month. Keep all your certificates in one scanned folder, stored in two places.

Your task now: create the compliance sheet today, fill in your CAC anniversary and add every licence you hold or need.`,
    },
    {
      title: "Your first customers and first staff",
      body: `A certificate on the wall doesn't bring in money. Once your paperwork is moving, put your attention on customers, because registration is only useful to a business that's selling.

Write your offer in one sentence. "We deliver fresh bread to shops in Jos before 7am, ₦X per crate, with a minimum order of five crates." It should state who it's for, what they get and what it costs.

Price from your real costs. List your materials, delivery, fees and your own time. Add the profit you need. Our profit margin and break-even calculators can check your figures. If you can't make a profit at the price customers will pay, you want to find that out in your first month, not your second year.

Find your first 10 customers by hand. Don't start with ads. Message or visit people who already know you, or businesses that clearly need what you sell. Ask them to try you. Fix what goes wrong, then ask for a review and a referral. Their words tell you how to describe your business to everyone else.

Keep the records from your first sale. Number your invoices. Record all money in and out on the same day. Our Bookkeeping for Small Businesses ebook explains the simple system.

Hiring your first person. Don't hire until there's enough regular work to pay them for at least three months, and you can name the tasks they'll take off you. Then:

Write the job down in five lines.
Check references, and verify their ID.
Agree a trial period.
Give a written contract covering role, pay, hours, leave and notice. Our offer letter tool can give you a starting point.
Pay on the same date every month.

A family member isn't an exception. Use the same contract, the same pay rules and the same standards.

Our employee cost calculator shows what a staff member really costs beyond their salary.

Protect your name. Register your domain and social handles in the business's name, and keep the logins yourself. Consider a trademark if your brand becomes valuable. Ask a lawyer about it, since a CAC-registered name isn't automatically a trademark.

Your task now: write your one-sentence offer and a list of 10 people to contact this week.`,
    },
  ],

  "ebook-excel-office-work": [
    {
      title: "Cleaning messy data",
      body: `In real offices, data rarely arrives clean. You get a bank export, a report from another department, or a list somebody typed in a hurry. Learning to clean it quickly is a skill that will make people bring you work. Always keep a copy of the original sheet before you start.

Remove extra spaces: =TRIM(A2) removes extra spaces, which are a common reason lookups fail. Web and system exports may contain a non-breaking space that TRIM can't see. Use =TRIM(SUBSTITUTE(A2,CHAR(160)," ")).

Fix numbers stored as text: if a column won't add up, the numbers may really be text. They usually align to the left, and may show a small green triangle. Select the column and use Data → Text to Columns → Finish. Or use =VALUE(A2). If they contain commas or a currency sign, first remove them with Find and Replace (Ctrl+H).

Fix capitals: =PROPER(A2) gives "Ada Okafor". =UPPER(A2) suits product codes. Remember that PROPER can spoil names such as "McDonald" and abbreviations such as "PLC", so check them.

Split one column into two: for "Okafor, Ada", use Data → Text to Columns → Delimited → Comma. Flash Fill can also do it: type the first result by hand in the next column, then press Ctrl+E. Excel usually works out the pattern. Check a few rows afterwards.

Remove duplicates: first check what counts as a duplicate. Is it the same invoice number, or the same customer and date? Copy your data, then select it and use Data → Remove Duplicates. To see duplicates before deleting them, use Conditional Formatting → Highlight Duplicate Values, or =COUNTIF(A:A,A2)>1.

Standardise names: "Abj", "Abuja" and "ABUJA" will appear as three branches in your pivot. Filter the column to see all the versions, and use Find and Replace to fix them. Then add a drop-down so it doesn't happen again.

Fill gaps: exports often leave a branch name only on the first row of each group. Select the column, press Ctrl+G → Special → Blanks, type = and press the up arrow, then Ctrl+Enter. Afterwards, copy the column and paste it as values.

Convert formulas to values: when you've finished cleaning, copy the cleaned column and use Paste Special → Values, so it doesn't depend on the messy original.

For a report that repeats every month, look at Power Query (Data → Get Data) in newer Excel. It records your cleaning steps, so next month you only click Refresh.

Practice: export a bank statement or report and clean it into a proper table, listing every fix you make.`,
    },
    {
      title: "Worked build: a debtors tracker",
      body: `Let's put the skills together in one useful tool. A debtors tracker tells you who owes money, how much and for how long. Managers love it, because it directly brings in cash.

Step 1: Create the table. On a sheet named Invoices, add these columns and press Ctrl+T. Name the table Inv under Table Design.

Invoice No, Date, Customer, Amount, Terms (days), Paid.

Example row: INV-104, 03/02/2026, Bello Stores, 240000, 30, 100000.

Step 2: Add calculated columns. Type these in the next empty columns. A table fills them all the way down.

Balance: =[@Amount]-[@Paid]

Due Date: =[@Date]+[@[Terms (days)]]

Days Overdue: =MAX(0,TODAY()-[@[Due Date]])

Status: =IF([@Balance]<=0,"Paid",IF([@[Days Overdue]]>0,"Overdue","Not yet due"))

Age Band: =IF([@Balance]<=0,"Paid",IF([@[Days Overdue]]=0,"Current",IF([@[Days Overdue]]<=30,"Up to 30 days",IF([@[Days Overdue]]<=60,"31 to 60 days","Over 60 days"))))

Step 3: Build a summary. On a new sheet named Summary, list your bands in A2 to A5: Current, Up to 30 days, 31 to 60 days, Over 60 days. Use these words rather than "1-30", because Excel can read that as a date. In B2, enter:

=SUMIFS(Inv[Balance],Inv[Age Band],A2)

Fill it down. Add a total in B6 with =SUM(B2:B5). In C2, show each band's share of the total with =B2/$B$6, and format it as a percentage. The $ signs hold the reference still when you fill down.

Step 4: List your top debtors. With Excel 365, use this in a free cell:

=TAKE(SORTBY(UNIQUE(Inv[Customer]),SUMIFS(Inv[Balance],Inv[Customer],UNIQUE(Inv[Customer])),-1),5)

On older Excel, insert a PivotTable with Customer in Rows and Sum of Balance in Values, then sort it from largest to smallest.

Step 5: Make the problems stand out. Select the Days Overdue column. Use Home → Conditional Formatting → Highlight Cells Rules → Greater Than, and enter 30. Add a slicer on Customer or Age Band, if you've used a pivot.

Step 6: Check it. Add up the Balance column on the Invoices sheet. It should equal the total on your Summary. Test one row by hand with a calculator. Enter a fake invoice with an old date and confirm it lands in the Over 60 days band, then delete it.

Using it. Each Monday, filter by Overdue and send reminders. Each month, send your manager the Summary with one comment: "₦1.2m is over 60 days, mainly from two customers. Recommend stopping credit until they pay."

Adapt the same pattern to staff leave, stock or expenses.

Practice: build this tracker with 15 invoices. Use dummy data if your real figures are confidential.`,
    },
    {
      title: "Fixing errors and checking your work",
      body: `One wrong formula in a report can cost your company money and cost you your boss's trust. Good Excel users don't avoid errors altogether. They know how to read them, and they check their work before they send it.

What each error means:

#N/A: a lookup can't find the value. Check for extra spaces, numbers stored as text, or a code that really is missing.

#REF!: a formula points to a cell that no longer exists, usually after someone deleted a row, a column or a sheet. Use Undo, or rewrite the reference.

#VALUE!: the formula has the wrong kind of data, such as text where a number should be. Look for a number stored as text, or a stray space.

#DIV/0!: you're dividing by zero or by a blank cell. Fix the cause, or use =IF(B2=0,"",A2/B2).

#NAME?: Excel doesn't recognise a word in your formula. You may have misspelt a function, left out quote marks around text, or used a newer function, such as XLOOKUP, on an older Excel version.

#####: this isn't an error. The column is simply too narrow. Double-click the edge of the column header. A negative date also shows this.

Don't just hide errors. IFERROR can make a sheet look tidy while hiding a real problem. Use it only when you already understand why the error appears.

Common mistakes that show no error at all:

Relative references that shift. A tax rate in B1 used as =A2*B1 becomes =A3*B2 when filled down. Lock it with F4: =A2*$B$1.

Typed-over formulas. Someone types a number over a formula in the middle of a column. Use Home → Find & Select → Go To Special → Formulas, to see which cells contain formulas and which don't.

Hidden rows. SUM includes hidden rows. Use =SUBTOTAL(109,A2:A100) to total visible rows only.

Totals that miss new rows. Tables avoid this problem.

Calculation set to Manual. If formulas aren't updating, check Formulas → Calculation Options → Automatic.

Tracing a formula. Click on a formula cell and use Formulas → Trace Precedents to see which cells feed it. Use Evaluate Formula to step through a long one. F2 shows its references in colour.

Your checklist before sending a report:

Does the total match the source system or bank statement?
Does a sample row agree with a manual calculation?
Do the figures look reasonable against last month?
Are the dates and the period correct in the title?
Have you removed test data?
Does it fit on a page when printed?

Add check cells, such as =SUM(Detail)-SUM(Summary), which should show 0.

Keep versions: Report_2026-03_v2.xlsx. Protect confidential payroll files with a password, and don't email them around carelessly.

AI tools can explain a formula and suggest one, but test the result on real data. Don't paste confidential payroll or customer details into public tools.

Practice: deliberately break a copy of your tracker, by deleting a column or typing over a formula. Then find and fix each problem.`,
    },
  ],

  "ebook-final-year-project-guide": [
    {
      title: "Writing a questionnaire that gives usable answers",
      body: `Weak questionnaires produce weak projects. Once you've printed and shared it, you can't go back and ask what you forgot. So spend time here, and show your draft to your supervisor before you collect anything.

Start from your research questions. Every item must help you answer one of them. Make a simple table: research question in one column, questionnaire items in the next. If an item doesn't serve a question, cut it. If a question has no items, write some.

Structure it clearly:

A short introduction: who you are, your institution, the purpose, how long it takes, and a statement that answers are confidential and voluntary.

Section A: background details you truly need, such as gender, age range and level of education.

Sections B, C and D: one section per research question, usually four to six statements each, on a five-point scale.

A thank you.

Write better statements. Compare these:

Double-barrelled: "Mobile banking is fast and secure." What if it's fast but not secure? Split it into two statements.

Leading: "Don't you agree that poor network harms mobile banking?" Rewrite it as: "Poor network affects my use of mobile banking."

Too vague: "I use the app regularly." Better: "I use the app at least once a week."

Too hard: Avoid technical language your respondents won't understand. Market traders may not use the word "liquidity", so ask about "having enough cash to restock".

Choose response options carefully. For a Likert scale, use Strongly Agree, Agree, Undecided, Disagree, Strongly Disagree, unless your department prefers a four-point version. Age options shouldn't overlap: use 18 to 24, then 25 to 34, not 18 to 25 and 25 to 35.

Language and access. If your respondents can't read English comfortably, have someone translate and read the questions consistently, and report that in your methodology. Think about how you'll reach them. Online forms via Google Forms are cheap, but only reach people online, which can bias your sample. State this as a limitation.

Ethics. Get permission from any organisation you're studying. Tell respondents they can refuse, and don't collect names or phone numbers unless your design requires them. Store the responses securely. Some departments and hospitals require ethical approval first, especially for health studies or anything involving children. Ask your supervisor.

Pilot it. Give it to five to ten people similar to your respondents, but not in your actual sample. Ask them which questions confused them and how long it took. Fix those items, and keep a note of what you changed.

Your task now: draw your research question and item table. Check each statement against the four problems above.`,
    },
    {
      title: "Worked example: from responses to Chapter Four",
      body: `Many students panic at analysis, but the most common approaches follow a clear pattern. Here's a small worked example with made-up numbers, to show the steps. Follow the method your supervisor approves.

The study: Effect of mobile banking on customer satisfaction. 200 questionnaires were shared, and 180 were returned and usable. The response rate is 180 ÷ 200 × 100 = 90%. Report that first.

Step 1: Code the data. In Excel or SPSS, each respondent gets one row, each item one column. Strongly Agree = 5, Agree = 4, Undecided = 3, Disagree = 2, Strongly Disagree = 1.

Step 2: Present the background of respondents. Show frequency and percentage tables. In Excel, =COUNTIF(B2:B181,"Female") gives the frequency. If 99 are female: 99 ÷ 180 × 100 = 55%. Remember to write what the table shows in words, in a sentence or two.

Step 3: Answer the research questions with means. Suppose the statement is "The app has reduced my time at the bank". Responses are 70 SA, 60 A, 20 U, 20 D, 10 SD.

Total score = (70×5) + (60×4) + (20×3) + (20×2) + (10×1) = 350 + 240 + 60 + 40 + 10 = 700.

Mean = 700 ÷ 180 = 3.89.

A common decision rule uses the scale's midpoint: (5+4+3+2+1) ÷ 5 = 3.0. A mean of 3.0 or above is treated as agreement, and below that as disagreement. In this case, 3.89 means respondents agree. State the rule in Chapter Three, before you use it. In Excel, =AVERAGE(D2:D181) and =STDEV.S(D2:D181) give you the mean and standard deviation.

Step 4: Test your hypotheses. Suppose H0 is: "Mobile banking has no significant effect on customer satisfaction." Use a test that suits your data. For the relationship between two continuous scores, use correlation or regression. For two categorical variables, use chi-square. In SPSS, the menus are under Analyze. For a regression, Analyze → Regression → Linear.

Say your results give p = 0.003. Since p is below 0.05, you reject the null hypothesis and conclude there's a statistically significant effect. If p were 0.21, you'd fail to reject it. That doesn't prove the null is true. It simply means your data didn't show enough evidence.

Remember, a significant result is about evidence, and it doesn't show how big or important the effect is. Report the size too, such as the correlation or R-squared. Survey data also shows relationships more readily than it proves causes, so write carefully.

Step 5: Discuss. For each main finding, write: what you found, how it compares with the studies you reviewed, and why that may be. "This agrees with Ade (2023), probably because both studies were in urban areas..." Use only sources you've really read, and never invent a citation.

Ask for help with statistics, if you need it, from your department's statistician. A paid analyst can show you how it's done, but you must be able to explain every number at your defence.

Your task now: enter five sample questionnaires, calculate one mean by hand and in Excel, and write your interpretation sentence.`,
    },
    {
      title: "AI tools, plagiarism and academic honesty",
      body: `Tools such as ChatGPT can help you understand your topic, but they can also get you into serious trouble. Rules differ between institutions and are changing quickly, so start by asking your supervisor or department what's allowed, and get the answer in writing if you can.

Uses that are usually lower risk, if your institution permits them:

Explaining a concept you didn't understand from a lecture or journal article.
Suggesting search terms for finding literature.
Testing you with likely defence questions.
Checking the grammar of a paragraph you've already written.
Explaining an error in your SPSS output or Excel formula.

Uses that can get you penalised:

Having AI write your chapters and submitting them as your own work.
Using references it gives you without checking them. AI can invent convincing citations, complete with authors, titles and journals that don't exist. Look up each source yourself, and read it before citing it.
Inventing or "cleaning up" your data, or using AI-generated responses in place of real ones. This is fabrication, and it's serious misconduct.

Many departments now use similarity checkers, like Turnitin, and some look for AI-written text. These tools aren't perfect, but you may still have to explain yourself. Keep your drafts, notes and data, which can help show the work is yours.

Understand plagiarism. It means presenting someone else's work or ideas as your own, even by accident. Common forms:

Copying sentences without quotation marks.
Changing a few words in someone's sentence, and calling it paraphrase.
Using an idea without citing its author.
Copying an old project and changing the location.
Buying a project, or paying someone to write it.

Paying someone to write your project is cheating, whatever the marketing says. Besides the risk, you'd have to defend work you don't understand, and panels can usually tell quickly. It's fine to pay for typing, printing or statistical guidance, as long as your department permits it and the thinking remains yours.

How to use sources properly:

Read, then close the source, and write what you understood.
Use quotation marks and a page number for direct quotes. Use these sparingly.
Note every source immediately in a reference manager. Zotero and Mendeley are free options.
Check every in-text citation against your reference list.

Check your similarity score before you submit. Ask your department what level is acceptable. A high score isn't always cheating, as references and standard phrases can raise it. But review each highlighted part, and rewrite any section that's too close to its source, and cite it.

Your honesty will still matter later. Employers may ask you about your project, and some will verify your results. You should be able to explain every part with confidence.

Your task now: find out your department's rules on AI and its similarity limit. Install a reference manager, and enter your first five sources.`,
    },
  ],

  "ebook-remote-job-from-nigeria": [
    {
      title: "Before and after: CV and application examples",
      body: `It's easier to see what works by comparing real wording. The people and numbers below are examples. Use your own honest results, and never invent a figure, because interviewers often ask how you got it.

Headline.

Before: "Graduate of Accounting seeking a challenging position in a reputable organisation."

After: "Customer Support Specialist | SaaS and E-commerce | Lagos (GMT+1), full UK-hours overlap."

Summary.

Before: "A hardworking, honest and God-fearing team player with good communication skills."

After: "Support specialist with three years handling chat and email for an online retailer. Answered about 50 tickets a day, wrote the team's refund guide and trained two new staff. Comfortable with Zendesk and Google Workspace."

Experience bullets.

Before: "Responsible for attending to customers."
After: "Resolved about 50 customer tickets daily across chat and email, keeping an average rating of 4.7 out of 5."

Before: "Handled reports."
After: "Built a Google Sheets tracker that cut the weekly report from three hours to 40 minutes."

If you don't have exact numbers, use honest ranges or describe scale: "a team of six," "about 200 orders a week," or "three branches".

No formal experience? Show proof from projects:

"Created a sample help centre of 10 articles for a real budgeting app. Link: [portfolio]."
"Volunteered as support lead for a 300-person student conference, managing all attendee questions by email."

Cover message. Keep it to under 150 words.

"Hi Sarah,

I'm applying for the Support Specialist role. I've spent three years supporting customers of an online retailer, averaging about 50 tickets a day at a 4.7 rating. Your ad mentions reducing repeat questions. I wrote the refund guide that did that at my current company, and I've attached it.

I'm based in Lagos and can work your full UK hours, with backup power and internet in place.

Could we talk this week?

Tolu Adeyemi
[Portfolio] [LinkedIn]"

Note what's in there: the person's name, one relevant result, a link to the requirement in the ad, availability and proof. Avoid "Dear Sir/Ma" and "I humbly apply".

Application form questions. When asked "Why do you want to work here?", mention something specific about the company. Avoid sending a general answer that could suit any company. If it asks for salary expectations, give a researched range.

Using AI. AI can help you tighten your wording or adapt a CV to an ad, but it shouldn't invent experience. Recruiters see a lot of AI-written applications, and generic ones sound alike. Always add your real examples. Our cover letter tool and CV builder give you a starting point too.

Check before you send:

Is the role title the same as the ad's?
Are any links broken?
Did you spell the company's name correctly?
Does your file name look professional?
Did you answer all the required questions?

Your task now: rewrite your summary and your top three bullets, using the "after" format. Ask someone working in your field to read them.`,
    },
    {
      title: "Offers, contracts and pay",
      body: `Getting an offer is exciting, and it's easy to sign anything. Slow down. A careful read now can prevent months of trouble. This chapter is general information. For a large contract, or anything confusing, speak to a lawyer or an accountant.

Know your status. Most Nigerians working for foreign firms are one of these:

Contractor: you're running your own small business, you invoice the client, and you handle your own tax. You usually don't get paid leave or benefits unless they're agreed. Either side may end it quickly.

Employee through an employer of record: a third-party company employs you legally on the firm's behalf, and may handle deductions and benefits.

Local employee: the firm has an entity in Nigeria, and employs you directly.

Check these in the contract:

Pay: amount, currency, and whether it's gross or net.
Payment: date, method and who pays the transfer fees.
Hours: expected working hours and time zone.
Leave: holidays, sick days, and whether they're paid.
Equipment: who provides the laptop? Who pays for internet?
Probation and notice: how long, and on both sides?
Intellectual property: the company normally owns the work you do for it. Be careful of wording that claims your personal projects as well.
Confidentiality and non-compete: what can't you do, and for how long? Does it stop you from working elsewhere in your field?
Governing law: which country's law applies?

Negotiating. Research the market rate for the role and the region. Glassdoor, Levels.fyi, salary posts in communities and the numbers in similar ads can give you a guide. Many international companies adjust pay by location, and others don't.

If asked first: "Based on similar roles and my experience, I'm looking for $1,400 to $1,700 a month. What's the budget for this position?" (Example numbers only.)

After an offer: "Thank you, I'm excited about this. Based on [specific reason], could you move to $1,500?" If they can't raise it, ask about a review after three months, paid time off, or an equipment and internet allowance.

Convert everything to real take-home pay. Subtract platform fees, exchange-rate margins, your tax, your internet and your power costs. A small difference in fees can matter a lot over a year. Our freelancer tax calculator and hourly-to-salary calculator can help you compare offers.

Warning signs even at this stage:

They want you to receive money and forward it, or buy gift cards.
They send a cheque or a crypto payment for equipment.
There's no written agreement.
They ask for your bank login, your BVN or a copy of your card.
They ask you to use a stranger's account.
They want you to pretend to be in another country. Misrepresenting your location can violate a company's rules or the law.

Keep your own records. Save signed contracts, invoices and payment confirmations. If you're a contractor, send invoices on time. Our invoice generator is free. Consider registering a business name if your income grows, as this may help with banking.

Your task now: write your target pay range and your minimum, after fees and costs. Save this chapter's checklist for your next offer.`,
    },
    {
      title: "Your first 90 days in a remote job",
      body: `Getting hired is half the battle. Many people lose remote jobs within months, not because they lack skill, but because no one can see their work, or trust that it's happening. Your first 90 days set your reputation.

Before day one. Test your laptop, internet backup and power setup. Install the tools they've asked for. Confirm your start time in your own time zone. Remember that the UK and the US change their clocks during the year, while Nigeria doesn't.

Week 1: Learn how things work.

Ask your manager: "What does success look like for me in the first 30, 60 and 90 days?"
Ask how they prefer updates, and how quickly you should reply.
Read the documentation before asking questions, and write down what isn't clear.
Introduce yourself to the team with a short, friendly message.
Create your own notes, and offer to update any outdated guide. It's an easy way to be useful.

Days 8 to 30: Deliver small wins. Finish something real and small, as early as you can. Don't vanish for a week to work on something big. Share progress early, and ask for feedback on drafts.

Send a short end-of-day or weekly update, if that fits the team:

"Done: closed 42 tickets, updated the refund article.
Next: billing queue, new macro for shipping questions.
Blocked: need access to the Stripe dashboard. Who should I ask?"

Ask good questions. Group them, and show what you've already tried. "I checked the guide and tried X. It failed with this error. Should I do Y, or is there another way?"

Days 31 to 60: Take ownership. Find a recurring problem and fix it without being asked. Note what you did and the result. Ask for feedback directly: "What's one thing I could do better?" Then act on it.

Days 61 to 90: Show your value. Before your probation review, send a brief summary of what you've achieved, using numbers where you can. Ask about your goals for the next quarter.

Build relationships on purpose. In remote work, nobody will bump into you at the kettle. Turn your camera on when it's the norm. Join social channels. Have short calls with colleagues. People help, and promote, those they know.

Communicate outages early.

"Power's out in my area. I've switched to backup and I'm online. If the network drops, I'll work from my phone hotspot, and I'll be back by 2pm."

Say it before anyone notices, and don't let it become regular. Invest in a better setup with your first paychecks.

Protect your energy. Working UK or US hours from Nigeria might mean late nights. Keep a set finish time where possible, take real breaks and step outside each day. Remote work can be isolating, so join a community and see people in person.

Keep your career alive. Keep your CV and LinkedIn updated, save your results (without confidential data), and keep learning. A contractor's job can end quickly, so build an emergency fund of several months of expenses. Our Personal Finance Playbook explains how.

Your task now: write your 30-60-90 day questions and your update template now, so you're ready on day one.`,
    },
  ],

  "ebook-bookkeeping-small-business": [
    {
      title: "Setting up: notebook, spreadsheet or software",
      body: `The best system is the one you'll use every day. Don't let a choice of tool delay you. You can start in a notebook today and move up when the business grows.

Notebook. Good for a very small business with few transactions. Use one book with sections for sales, expenses, debtors and creditors. It's cheap and it needs no power. But it can get lost, and you must add up by hand. Photograph the pages each week, and keep the photos in cloud storage.

Spreadsheet. Good for most small businesses. Excel or Google Sheets can total your sales and expenses automatically. Create one sheet each for Sales, Expenses, Debtors, Creditors and Stock, plus a Summary. Google Sheets also works on your phone, and it backs itself up. Our Excel for Office Work ebook shows you how to use tables and SUMIFS for monthly summaries.

Accounting software. Worth considering when you have many invoices, several staff, stock lines or an accountant who wants to log in. Options include QuickBooks, Zoho Books, Wave and Sage. Check current prices, whether they suit Nigerian VAT and banks, and how you'd export your data if you left. Software won't fix bad habits. If receipts aren't recorded, you'll get wrong figures faster.

Set up your expense categories. Use the same ones each month, and keep the list short so that you use it properly. For example:

Cost of sales: stock, materials, direct labour, delivery to customers.
Staff: salaries, pension, PAYE.
Premises: rent, power, fuel, repairs.
Admin: data, airtime, stationery, software.
Marketing: ads, printing, signage.
Finance: bank charges, POS charges, interest.
Transport.
Professional fees: accountant, lawyer, CAC.
Tax: set-aside and payments.
Owner's drawings. Keep it separate, as it isn't an expense for a sole trader.

Number everything. Invoices run in order: INV-001, INV-002. Receipts likewise. Give each expense receipt a reference, and write it in your record. When a question comes up, you can find the document in seconds.

Store your receipts. Thermal receipts fade, so photograph them on the same day. Create folders by year and month, such as 2026/03-March. Check with your accountant how long to keep your records. Many advisers suggest at least six years, and tax rules may set a minimum.

Who does the recording? If a staff member records sales, have someone else check the cash and the bank. Keep the checking separate from the recording. You don't need to suspect anybody; this is a basic protection for you and for them.

Starting midway through the year. Count your stock and cash today, and list your bank balances and all who owe you or whom you owe. These are your opening balances. You can then start clean from today, and ask an accountant to help with earlier months if you need them.

Your task now: pick your tool, write your category list and record today's transactions in it.`,
    },
    {
      title: "A worked month: Mama Tobi's shop",
      body: `Here's a full month for a made-up provisions shop, so you can see how the records come together. Follow the numbers with a calculator.

During March:

Sales: ₦1,200,000, of which ₦1,050,000 was paid at once and ₦150,000 was on credit.
Old debts collected from February: ₦40,000.
Stock on hand at 1 March: ₦400,000.
Stock bought and paid for: ₦900,000.
Stock on hand at 31 March (counted): ₦420,000.
Expenses paid: rent for the month ₦50,000, assistant's salary ₦60,000, transport ₦25,000, power and data ₦20,000, POS and bank charges ₦15,000. Total: ₦170,000.
Mama Tobi took ₦100,000 for herself.
Cash and bank at 1 March: ₦180,000.

Step 1: Cost of sales.

Opening stock ₦400,000 + purchases ₦900,000 − closing stock ₦420,000 = ₦880,000.

Note that the purchases figure isn't the cost of sales, because some of the stock is still on the shelf.

Step 2: Profit and loss.

Sales: ₦1,200,000
Cost of sales: ₦880,000
Gross profit: ₦320,000 (gross margin 26.7%)
Operating expenses: ₦170,000
Profit: ₦150,000 (12.5% of sales)

Her ₦100,000 drawing doesn't appear here, as she's a sole trader, and it isn't a business expense. Her tax would be worked out on her annual profit under personal income tax rules.

Step 3: Cash summary.

Opening balance: ₦180,000
Money in: ₦1,050,000 + ₦40,000 = ₦1,090,000
Money out: ₦900,000 + ₦170,000 + ₦100,000 = ₦1,170,000
Closing balance: ₦100,000

Her profit was ₦150,000, yet her cash fell by ₦80,000. Why?

Step 4: Explain the difference.

Profit: +₦150,000
Stock grew by ₦20,000, using up cash: −₦20,000
Customers owe ₦110,000 more (₦150,000 new credit minus ₦40,000 collected): −₦110,000
Drawings: −₦100,000
Change in cash: −₦80,000

It matches exactly. This is the "cash is not profit" lesson in real numbers.

Step 5: What should she do? The numbers now point to real decisions.

Credit is draining her cash. She needs to chase the ₦150,000, and set limits for customers who buy on credit.

At a 26.7% margin, every extra ₦100,000 of sales gives ₦26,700 of gross profit. If she wants ₦100,000 more profit monthly, she must sell about ₦375,000 more, or improve her margin. Our profit margin calculator can test that. A two-point margin rise on ₦1,200,000 of sales adds ₦24,000 a month.

Her drawings are less than her profit, which is healthy. But with just ₦100,000 cash and a big purchase coming, she could soon be short. A cash forecast for April would warn her.

Next month's rent or a yearly rent payment should be saved up monthly, or it will arrive as a shock.

Three lines for her monthly note:

Went well: profit of ₦150,000, margin stable.
Went badly: credit grew by ₦110,000, and cash fell to ₦100,000.
Change: no new credit above ₦20,000. Chase debts each Monday.

Your task now: work through last month for your business using these same five steps. Use estimates where you have to, and note what you couldn't find.`,
    },
    {
      title: "Common mistakes and simple controls",
      body: `Most bookkeeping problems come from a few repeated mistakes. Most small business fraud comes from a few missing controls. Fix both and your numbers will become far more reliable.

Common mistakes:

Recording only what passes through the bank. Cash sales and cash expenses disappear. Record cash on the same day, or you'll understate both your sales and your costs.

Treating all money received as sales. Loans, owner's capital and customer deposits aren't sales. A deposit for work you haven't done yet is money you still owe in service, so note it separately until the work's done.

Recording a loan repayment as an expense. Only the interest is an expense. The principal reduces what you owe.

Counting a large equipment purchase as a single month's expense. Spread it over its useful life, or ask your accountant how to treat it.

Ignoring small charges. Bank charges, transfer fees, stamp duty and POS charges add up over a year. Reconciling will bring them to light.

Never counting stock. Without a count, you can't calculate cost of sales properly, and you won't notice theft or waste.

Paying personal bills from the business without recording them. Record these as drawings, or better, stop doing it.

Leaving it all to the end of the year. You'll forget what transactions were for, and you may lose documents. A few minutes each day is far easier.

Not knowing your margin by product. Your total may look fine while one popular item loses money.

Simple controls that protect you:

Separate duties. The person who sells shouldn't be the only person who counts the cash and records it. In a tiny business, the owner can be the second person.

Use serial-numbered receipts. Ask every customer to take one. Check that the numbers run in order, and investigate any missing ones.

Daily cash count. Count at closing, and compare it with sales records. Sign and date the count. Note differences, even small ones.

Bank daily or as often as you can. Don't pay expenses from sales cash before it's been recorded.

Check the alerts yourself. Never accept a customer's screenshot as proof of payment. Confirm it in your own bank app. Fake alerts are common.

Approve payments. Have someone other than the person who prepared a payment approve it, particularly above a set amount.

Surprise stock counts. Count a few high-value items at random times.

Verify changes in account details. If a supplier "changes" their bank details, phone a known number before you pay. Our Small Business Cyber Basics ebook covers these scams.

Staff advances. Write them down and have them signed.

Fixing an error. Don't erase anything. Record a correcting entry and a note explaining why. Keep your records honest, too. Don't keep two sets of books. Hiding sales to reduce tax is illegal, and it also makes your business look small when you need a loan.

When to get an accountant. Bring one in for your annual accounts and tax returns, when you take on a large loan or investor, when you register for VAT, or when you employ several staff. Clean records reduce the fee and the risk.

Your task now: pick three controls you don't have yet, and start them this week.`,
    },
  ],

  "ebook-grants-funding-guide": [
    {
      title: "Your one-page summary and budget",
      body: `Reviewers read a lot of applications, and a clear one-page summary helps them understand yours quickly. Writing one also forces you to clarify your own thinking. The business below is a made-up example.

One-page summary template:

Business: Jos Fresh Bakery Ltd. RC number. Founded 2023. Three staff.

What we do: We bake and deliver fresh bread to shops and supermarkets in Jos.

Problem: Local shops struggle to get fresh bread reliably, and they often run out by mid-morning.

Traction: 3,000 loaves a week to 40 shops and two supermarkets. Sales grew from about ₦1.2m to ₦2.1m a month over the last 12 months.

The opportunity: Two more supermarkets have asked for supply, but we're at full oven capacity.

What we need: ₦3,500,000 for a second oven, a packaging machine, and installation.

Result: Capacity doubles. Revenue is projected to reach ₦3.5m a month within 9 months, with three new jobs.

Team: The founder has eight years' experience in baking, and our manager has run a delivery operation.

Contact: Name, phone, email, website.

Keep every number traceable to your records. If asked, you should be able to show the bank statement or invoice behind it.

Use-of-funds budget. Reviewers want to see that you've priced the items properly and that the money creates results.

Item | Cost | Why it matters
Second rotary oven | ₦2,200,000 | Doubles daily output
Packaging machine | ₦800,000 | Meets supermarket packaging standards
Installation and electrical work | ₦200,000 | Required to run the equipment safely
Staff training | ₦100,000 | Food safety and machine operation
Contingency | ₦200,000 | Price changes on imported parts
Total | ₦3,500,000 |

Check that the total adds up, because errors here make a poor impression. Attach supplier quotations, and check their dates, since prices may have changed. Explain any contingency, and find out whether the funder allows it.

Things funders commonly refuse to pay for. Rules vary, so read each call carefully. Many exclude or limit:

Paying off old debts.
Owners' salaries, or salaries above a limit.
Land or vehicles.
Very general "working capital" without detail.
Costs incurred before the funding starts.

Show your own contribution. Say what you've already put in, or what you'll add: "We've invested ₦1.8m in equipment so far, and will contribute ₦500,000 towards this." Some programmes require matched funding. Show where that money will really come from.

Show results in numbers. Link the money to outcomes such as output, revenue, jobs, or women and young people employed. Our break-even and ROI calculators can help you test whether your projection makes sense.

Your task now: write your own one-page summary and budget table. Collect at least one current quotation per major item.`,
    },
    {
      title: "Weak answers and strong answers",
      body: `Here's how the same business might answer common application questions, once badly and once well. The business and its figures are examples. Your own answer must be true and must match your records.

"Tell us about your business."

Weak: "We are a fast-growing, innovative company passionate about delivering excellent quality products to customers all over Nigeria."

Strong: "We make and deliver fresh bread to 40 shops and two supermarkets in Jos, selling about 3,000 loaves a week. We started in 2023 from a home kitchen and now employ three staff."

"What problem are you solving?"

Weak: "Nigeria has a big problem with food supply, and everyone needs bread."

Strong: "Small shops in Jos told us that their bread often runs out by 10am, because bakeries deliver irregularly. We asked 25 shopkeepers, and 19 said they had lost sales this way. We deliver before 7am, with a second run on request."

"What makes you different?"

Weak: "Our quality is second to none, and our customer service is excellent."

Strong: "We're the only bakery we know of in our area offering twice-daily delivery. Shops can reorder through WhatsApp by 8pm for the following morning. Eighteen of our first 20 shop customers still buy from us."

"How will you use the funds?"

Weak: "To expand the business, buy equipment and market our products."

Strong: "₦3.5m to buy a second oven (₦2.2m), a packaging machine (₦800,000), installation (₦200,000), training (₦100,000) and a contingency (₦200,000). This doubles our capacity, so we can supply two supermarkets that have already asked, and it adds three jobs."

"What's your impact?"

Weak: "We'll empower many youths and transform our community."

Strong: "Two of our three staff are women under 30. The expansion adds three jobs, and at least two will go to young people from our area. We also buy flour-based inputs and packaging from two local suppliers."

"What are the risks?"

Weak: "There are no major risks because we've planned well."

Strong: "Flour prices are our main risk. We've agreed quarterly pricing with two suppliers, and we review our prices every quarter. Power is the second. Our new oven runs on gas, so outages won't stop production. If demand is slower than expected, we'd run fewer shifts until the second supermarket starts."

"Why you?"

Weak: "I'm a hardworking person with a passion for business, and I never give up."

Strong: "I've worked in baking for eight years, including three years managing production for a larger bakery. I've run this business with clean monthly accounts since we started, and I've reinvested over ₦1.8m of our profit."

What the strong answers do:

Use specific numbers and names.
Show evidence, such as customers asked or orders received.
Connect each claim to a result.
Admit real risks.
Stay simple.

Using AI. AI can tighten your language and find gaps, but reviewers notice generic answers. Add your real data, and read every word. Some programmes have rules about AI, so check them. Never let it invent numbers, customers or awards.

Follow instructions exactly. Keep to the word limits, answer every part of the question and upload the right formats. Submit a few days early, as portals often slow down near deadlines.

Your task now: rewrite your three weakest answers using this approach, and ask someone outside your business to read them.`,
    },
    {
      title: "After you apply: winning, losing and other options",
      body: `Whether you win or lose, what happens after you've applied matters. A grant comes with duties, and a rejection can still move you forward.

If you win. Congratulations, but read your agreement before celebrating too much.

Read the grant agreement line by line. Note the conditions, reporting dates, allowed costs and what happens if you break the rules. Ask a lawyer to review a large agreement.

Use a separate account or a clear tracking system, where possible. Money should go only on what you said it would. If you need to change something, ask in writing before you spend.

Keep every receipt and quotation. Photograph equipment after purchase, and keep a record of jobs created and sales achieved. Funders may audit you.

Report on time. Be honest about delays and problems. Funders respect honesty, and many will help. If a report is missing, you could lose the rest of your funds, or a chance at future funding.

Ask about tax. Grants might have tax consequences, depending on your structure and on current rules. Ask your accountant.

Tell the story. With permission, share your win on your website and social media. It's strong proof for customers and other funders. Our Google Business Profile ebook covers ways of showing your credibility online.

If you lose. Most applicants don't get funded in any given round, and that doesn't mean your business is bad.

Ask for feedback politely.
Compare your application against the published winners. What do they have that you don't?
Update your numbers, and apply to the next suitable call.
Save your work, so the next one takes less time.

If you're offered a loan. Work out the total repayment, including all fees. Check the collateral or personal guarantee. Run your cash flow with repayments included, and a scenario in which sales fall by 20%. Our loan EMI calculator and cash flow forecast tools can help. Don't borrow simply because the loan is available.

If an investor is interested. Equity is a big decision, because you're selling part of your company. Understand how much of it you're giving up, what rights the investor gets, and what they expect in return. Use a lawyer who knows investment agreements. Check that the investor is genuine, and don't pay anyone a fee to "access" investors without careful checks.

Other ways to fund your growth. Grants take time, and you're not guaranteed to win one. Consider:

Customer prepayments or deposits on confirmed orders.
Better supplier credit terms.
Selling off dead stock, and tightening up your debt collection.
Leasing or hiring equipment rather than buying it.
Starting with a smaller version: a used oven, or one supermarket.
A cooperative or a microfinance loan, after you've checked the cost.
Reinvesting profits slowly.

Our Cash-First Small Business ebook has more on freeing up your own money, which is often the cheapest funding available.

Stay honest. Never inflate your figures, forge documents, or misstate your eligibility, for example by claiming to be a woman-led business when you aren't. It can lead to disqualification, repayment demands and legal trouble.

Your task now: list three ways you could fund your next step without a grant, and put the next two grant deadlines on your calendar.`,
    },
  ],
};
