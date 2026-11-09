import type { Ebook } from "./ebooks";

/** Wave 4 (Oct 2026): practical books for business owners, office workers, students and job seekers. */
export const WAVE4_EBOOKS: Ebook[] = [
  {
    id: "ebook-start-register-business-ng",
    slug: "start-and-register-a-business-in-nigeria",
    title: "Start and Register a Business in Nigeria",
    subtitle: "CAC, TIN, bank account, licences and tax basics, step by step",
    author: "DoyinTech",
    priceNgn: 6500,
    amountKobo: 650000,
    pagesLabel: "8 chapters · step-by-step guide",
    category: "Business",
    coverFrom: "#14532d",
    coverTo: "#0f172a",
    accent: "#4ade80",
    icon: "🏢",
    coverImage: "https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=900&q=85",
    badge: "New",
    blurb:
      "Go from idea to a properly registered business that banks, customers and government agencies take seriously: which structure to choose, how CAC registration works, getting a TIN and corporate account, the permits your sector needs, and the tax habits that keep you out of trouble.",
    benefits: [
      "Business name vs limited company, explained plainly",
      "The CAC registration process without an agent's confusion",
      "TIN, corporate bank account and Paystack set-up",
      "Sector permits: NAFDAC, food handling, SON and more",
      "Tax basics under the 2026 rules",
      "A 30-day launch checklist",
    ],
    chapters: [
      {
        title: "1. Why register at all",
        body:
          "Many Nigerian businesses run for years on a personal account and a WhatsApp number. That works until you need something only a registered business can get: a corporate bank account, a contract with a company or government agency, a loan, a grant, a payment gateway in your business name, or a customer who simply trusts a registered name more.\n\nRegistration also separates you from the business. When money for the business goes into the business account, you can see whether it actually makes a profit, you can show a lender clean statements, and you can pay yourself a salary instead of dipping in whenever you need cash.\n\nThe cost of registering is small compared with one lost contract. The real cost is the confusion: agents who charge triple, forms that ask for things you don't understand, and banks that ask for documents you didn't know existed. This book removes that confusion. Read it once from start to finish, then use the checklists at the end of each chapter as you work.",
      },
      {
        title: "2. Business name or limited company?",
        body:
          "The Corporate Affairs Commission (CAC) registers three common types of entity for small businesses.\n\nA business name (sole proprietorship or partnership) is the simplest and cheapest. It is ideal for a one-person shop, a freelancer or a family trade. The owner is the business: if the business owes money, the owner is personally responsible. Your certificate will carry a number beginning with BN.\n\nA private limited company (Ltd) is a separate legal person. It can own property, sign contracts and borrow in its own name, and shareholders' personal assets are generally protected from company debts. Larger customers, investors, many government contracts and some licences require a limited company. Its number begins with RC. It has more obligations: annual returns, statutory records, and company income tax filings, even when the company is small.\n\nIncorporated trustees are for churches, mosques, NGOs, associations and clubs that are not run for profit.\n\nA quick rule: start with a business name if you are testing an idea alone and selling to individuals. Choose a limited company if you will bring in partners or investors, sell to corporates or government, need to hold significant assets, or plan to grow beyond a handful of staff. You can convert later, but it is easier to choose correctly now.",
      },
      {
        title: "3. Registering with CAC",
        body:
          "Registration is done online on the CAC portal. You can do it yourself or use an accredited agent; either way, understand the steps so you know what you are paying for.\n\nStep 1: Name availability search and reservation. Propose two or three names. Avoid names that are too similar to existing companies, names that suggest government connection, and restricted words (such as 'Bank', 'Insurance' or 'Federal') that need special approval.\n\nStep 2: Fill in the registration form: the nature of business, registered address, and details of the proprietor(s) or directors and shareholders, including means of identification and NIN. For a company you also choose the share capital and allotment.\n\nStep 3: Pay the filing fees on the portal and upload documents: valid ID, passport photograph and signatures. Check the current fees on the CAC site; they change, and paying more than the official fee to an agent should only be for their time.\n\nStep 4: Wait for approval. Once approved, download your certificate and status report. Keep digital copies in two places.\n\nCommon reasons for delay are a rejected name, unclear ID scans and mismatched details between your NIN and the form. Use exactly the name on your NIN, and scan documents in good light.\n\nChecklist: three name options, NIN and valid ID for every owner, passport photographs, signature specimen, a real business address, a clear one-line description of what you do.",
      },
      {
        title: "4. TIN, bank account and getting paid",
        body:
          "After registration, get a Tax Identification Number (TIN) for the business. Under the reforms, TIN registration is linked to your CAC records and the tax authority's online system; many businesses now receive a TIN with or soon after incorporation. Check your status and print the TIN certificate, because banks and big customers ask for it.\n\nNext, open a corporate (business) account. Banks will typically ask for your CAC certificate and status report, the business TIN, valid IDs and BVNs of owners or signatories, proof of address, and sometimes references from existing account holders. For a company they may also ask for a board resolution to open the account. Ask the bank for its exact list before you go; it saves trips.\n\nThen set up how customers pay you. A payment gateway such as Paystack lets you accept cards, transfers and USSD on your website, in a payment link, or through WhatsApp. Registering the gateway in the business name with the corporate account means settlements land in the right place and your statements look professional.\n\nFinally, separate money. All business income goes into the business account. Pay yourself a fixed amount on a fixed date. Keep receipts for every expense. This habit alone puts you ahead of most small businesses when you apply for a loan.",
      },
      {
        title: "5. Permits and licences by sector",
        body:
          "Registration makes you a legal business; some sectors also need a regulator's approval before you sell. The common ones:\n\nFood, drinks, cosmetics, drugs and chemicals: NAFDAC registration of products before they are sold in the open market. Small-scale producers should check the current small-business pathway and requirements.\n\nFood businesses (restaurants, bakeries, caterers): state environmental health and food handlers' certificates, and premises inspection.\n\nManufactured goods: the Standards Organisation of Nigeria (SON) for product standards and certification.\n\nSchools: approval from the state Ministry of Education before admitting pupils.\n\nHealth facilities and pharmacies: state Ministry of Health registration and professional council licences.\n\nTransport, logistics and dispatch: state and local permits for vehicles; NIPOST licensing applies to courier businesses.\n\nAlcohol, events and signage: local government permits for signboards and event venues.\n\nRequirements differ by state and change over time, so treat this chapter as a map, not the law. Call the regulator's office or check its website, ask what applies to a business of your size, and get every requirement in writing. Budget time as well as money: some approvals take weeks.",
      },
      {
        title: "6. Tax basics for a small business in 2026",
        body:
          "The Nigeria Tax Act 2025 took effect on 1 January 2026 and simplified much of the system. What most small businesses need to know:\n\nCompanies: small companies (turnover of ₦50 million or less and fixed assets of ₦250 million or less, not providing professional services) pay 0% company income tax, but they must still file returns. Some articles quote ₦100 million for turnover, a figure from the earlier draft bill, so confirm with the Nigeria Revenue Service or an accountant if you are near the limit. Larger companies pay company income tax at 30% plus a development levy. Use our free Small Company Tax Checker to see where you stand.\n\nBusiness names and freelancers: profits are taxed as the owner's personal income under the progressive bands, where the first ₦800,000 of taxable income is tax-free. File your personal return by 31 March each year.\n\nVAT: charged at 7.5% on taxable goods and services. Small businesses below the turnover threshold are generally exempt from charging VAT, but check your position as you grow.\n\nEmployees: if you pay staff, you deduct PAYE and pension and remit them monthly.\n\nThe habits that matter more than the rules: keep every receipt, reconcile your bank account monthly, record income the day you receive it, and set aside a percentage of profit for tax in a separate account. When you file, you will have the numbers ready instead of guessing.",
      },
      {
        title: "7. Look like a real business from day one",
        body:
          "Customers judge you in seconds. A few inexpensive things make a small business look established:\n\nA business email on your own domain (you@yourbusiness.com) instead of a free email address.\n\nA Google Business Profile, so you appear on Google Maps with your hours, photos and reviews when people search near you.\n\nA simple website or landing page that shows what you sell, your prices or price range, your location and a WhatsApp button.\n\nA WhatsApp Business account with your catalogue, greeting message and quick replies.\n\nProfessional documents: invoices, receipts and quotations with your CAC number and bank details. Our free invoice, receipt and quotation generators produce these as PDFs.\n\nConsistent branding: the same name, logo and colours on your signboard, social pages, documents and packaging.\n\nNone of this needs a big budget. It needs consistency. Set it up once and every enquiry starts from trust instead of suspicion.",
      },
      {
        title: "8. Your 30-day launch checklist",
        body:
          "Week 1: choose your structure (business name or company), three name options, gather IDs, NIN and photographs, decide your registered address. Search and reserve your name on the CAC portal.\n\nWeek 2: complete and submit the CAC registration. While you wait, write your one-line offer, price list and the three channels you'll use to find customers. Draft a one-page plan with our free Business Plan Generator.\n\nWeek 3: download your certificate; get your TIN; open the corporate account; set up Paystack or your preferred gateway in the business name. Check sector permits and start any that apply.\n\nWeek 4: set up your business email, Google Business Profile, WhatsApp Business and simple website. Create invoice and receipt templates. Open a separate savings account for tax and emergencies. Make your first sale through the business account.\n\nAfter 30 days, review: what did customers ask about most? What did they pay for? Double down on that. Registration was the foundation. Now build on it with consistent sales, clean records and good service.",
      },
    ],
  },
  {
    id: "ebook-excel-office-work",
    slug: "excel-for-office-work",
    title: "Excel for Office Work",
    subtitle: "The formulas, reports and shortcuts managers actually ask for",
    author: "DoyinTech",
    priceNgn: 6000,
    amountKobo: 600000,
    pagesLabel: "8 chapters · with practice tasks",
    category: "Career",
    coverFrom: "#065f46",
    coverTo: "#0f172a",
    accent: "#34d399",
    icon: "📊",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85",
    badge: "New",
    blurb:
      "Most office jobs in Nigeria list 'proficiency in Microsoft Excel'. This book teaches the part that matters at work: clean data, the 25 formulas you'll use weekly, PivotTables, charts, and the payroll, sales, stock and budget reports managers request. Works for Excel and Google Sheets.",
    benefits: [
      "Set up data so formulas don't break",
      "SUMIFS, XLOOKUP, IF, TEXT and date formulas with office examples",
      "PivotTables in five minutes",
      "Ready-made layouts for sales, stock, payroll and budget reports",
      "Charts managers can read at a glance",
      "Shortcuts that save an hour a week",
    ],
    chapters: [
      {
        title: "1. Set up data the right way",
        body:
          "Most spreadsheet problems start with bad layout. Before any formula, organise your data as a table: one header row, one record per row, one type of information per column, no blank rows in the middle and no merged cells inside the data.\n\nGood: columns Date, Invoice No., Customer, Item, Qty, Unit Price, Amount, Paid. Each sale is one row.\n\nBad: a separate sheet per month with totals typed in, customer names spelt three ways, and amounts stored as text with '₦' typed in.\n\nThree habits fix most of this. First, convert your range into an Excel Table (Ctrl+T). Tables expand automatically, keep formatting consistent and let you use readable formulas like =SUM(Sales[Amount]). Second, use Data Validation drop-downs for repeated values such as branch, product or staff name, so spelling stays consistent. Third, format numbers with number formats, not by typing symbols: select the column and apply the currency or accounting format with ₦.\n\nPractice: take any list you have (sales, stock, contacts) and restructure it into a single table with clear headers. Every chapter after this assumes your data looks like this.",
      },
      {
        title: "2. The everyday formulas",
        body:
          "These ten formulas cover most office work.\n\nSUM, AVERAGE, MIN, MAX, COUNT: totals and summaries. =SUM(G2:G500).\n\nCOUNTA counts non-empty cells: how many staff, how many invoices.\n\nROUND: =ROUND(G2*7.5%,2) for VAT to two decimals. Round money at the point of calculation to avoid totals that are off by a kobo.\n\nIF: decisions. =IF(H2=\"Yes\",\"Paid\",\"Owing\"). Nest carefully, or use IFS in newer Excel: =IFS(G2>=70,\"A\",G2>=60,\"B\",TRUE,\"C\").\n\nAND / OR inside IF: =IF(AND(D2>=100000,E2=\"Lagos\"),\"Priority\",\"Normal\").\n\nIFERROR hides ugly errors: =IFERROR(G2/F2,0).\n\nTRIM and PROPER clean names: =PROPER(TRIM(C2)) turns '  aDA okafor ' into 'Ada Okafor'.\n\nText joins: =C2&\" - \"&D2 or =TEXTJOIN(\", \",TRUE,C2:E2).\n\nPractice: add a Status column to your table using IF, a cleaned Customer column using PROPER(TRIM()), and a VAT column using ROUND.",
      },
      {
        title: "3. Conditional totals: SUMIFS and COUNTIFS",
        body:
          "Managers rarely want a grand total. They want 'sales for Abuja branch in March' or 'number of unpaid invoices for this customer'. That is SUMIFS and COUNTIFS.\n\n=SUMIFS(Amount, Branch, \"Abuja\") totals the Amount column where Branch is Abuja.\n\nAdd conditions in pairs: =SUMIFS(Amount, Branch, \"Abuja\", Date, \">=\"&DATE(2026,3,1), Date, \"<=\"&DATE(2026,3,31)).\n\nPoint criteria to cells instead of typing them, so one formula works for a whole summary table: =SUMIFS(Sales[Amount], Sales[Branch], $A5, Sales[Month], B$4). Fill it across months and down branches and you've built a report in one formula.\n\nCOUNTIFS works the same way: =COUNTIFS(Sales[Paid],\"No\",Sales[Customer],A2) counts unpaid invoices for a customer. AVERAGEIFS gives average order size by branch.\n\nPractice: build a summary grid with branches down the side and months across the top, filled with one SUMIFS formula.",
      },
      {
        title: "4. Lookups: XLOOKUP and VLOOKUP",
        body:
          "Lookups bring information from one table into another: a product's price into the sales sheet, a staff member's department into payroll, a customer's phone number into a debtors list.\n\nXLOOKUP (Excel 365/2021 and Google Sheets) is the modern way: =XLOOKUP(D2, Products[Code], Products[Price], \"Not found\"). It looks for D2 in the Code column and returns the matching Price.\n\nIf your office uses older Excel, VLOOKUP does the same with different rules: =VLOOKUP(D2, Products!A:C, 3, FALSE). The lookup value must be in the first column, 3 means the third column, and FALSE means exact match. Forgetting FALSE is the most common cause of wrong results.\n\nINDEX/MATCH works in every version and can look left: =INDEX(Products[Price], MATCH(D2, Products[Code], 0)).\n\nTips: look up by codes, not names, because names get misspelt. Wrap in IFERROR for missing items. Remove extra spaces with TRIM, which cause many 'not found' errors.\n\nPractice: create a Products table with codes and prices, then fill the Unit Price in your sales table with XLOOKUP.",
      },
      {
        title: "5. Dates and text that behave",
        body:
          "Dates in Excel are numbers underneath, so they can be subtracted, filtered and grouped. Problems come from dates typed as text, usually from copied bank statements or exports.\n\nCheck: a real date aligns to the right by default and changes when you change its format. If it doesn't, use Data → Text to Columns → Date (DMY) to convert.\n\nUseful date formulas: =TODAY() for today; =G2-TODAY() for days until due; =EOMONTH(A2,0) for the last day of the month; =NETWORKDAYS(A2,B2) for working days between dates (great for leave); =TEXT(A2,\"mmm yyyy\") to label months for reports; =DATEDIF(A2,TODAY(),\"y\") for years of service.\n\nAgeing debts: =IF(TODAY()-Due<=30,\"0-30\",IF(TODAY()-Due<=60,\"31-60\",\"60+\")). Combine with SUMIFS to show how much is owed in each age band.\n\nText formulas: LEFT, RIGHT, MID and LEN split codes; TEXTSPLIT (newer Excel) splits 'Surname, Firstname'; SUBSTITUTE replaces characters, such as removing commas from numbers stored as text.\n\nPractice: add a Days Overdue column and an Age Band column to an invoice list.",
      },
      {
        title: "6. PivotTables: reports in minutes",
        body:
          "A PivotTable summarises thousands of rows without formulas. Click inside your table, Insert → PivotTable, then drag fields:\n\nRows: Branch. Columns: Month. Values: Sum of Amount. You now have sales by branch by month.\n\nGroup dates by right-clicking a date in the PivotTable → Group → Months and Years.\n\nChange Sum to Count or Average in Value Field Settings. Show values as % of total to see each branch's share.\n\nAdd a Slicer (PivotTable Analyze → Insert Slicer) for Product or Salesperson, and your manager can click to filter the report.\n\nRefresh when data changes: right-click → Refresh. If your source is an Excel Table, new rows are included automatically.\n\nCommon office pivots: sales by product and month; expenses by category; stock movement by item; leave days by department; complaints by type. Each takes two minutes once the data is clean.\n\nPractice: build a sales-by-branch-by-month PivotTable with a product slicer, then copy it and change the rows to Salesperson.",
      },
      {
        title: "7. Charts and reports managers read",
        body:
          "A good office chart answers one question. Pick the chart from the question:\n\nHow did it change over time? Line or column chart by month.\nWhich is biggest? Bar chart sorted from largest to smallest.\nWhat share of the total? A bar chart is usually clearer than a pie; use a pie only for two to four parts.\nHow are we doing against target? Column for actual with a line for target.\n\nClean up every chart: a title that states the finding ('Abuja sales up 18% in Q3'), no 3D effects, data labels instead of gridlines where possible, and consistent colours for the same branch across charts.\n\nA one-page monthly report layout: the headline numbers at the top (revenue, expenses, profit, cash), a trend chart, a table by branch or product with conditional formatting to highlight problems, and three bullet points of commentary: what happened, why, and what you recommend.\n\nConditional formatting: Home → Conditional Formatting → Highlight cells less than target in red, or add Data Bars to show size within a table.\n\nPractice: build a one-page monthly sales report from your PivotTable with one chart and three lines of commentary.",
      },
      {
        title: "8. Office templates and speed",
        body:
          "Four templates cover most requests:\n\nSales register: Date, Invoice, Customer, Item, Qty, Price, Amount, Paid, Due Date, with a SUMIFS summary and a debtors age analysis.\n\nStock register: Item Code, Description, Opening, Received, Issued, Closing (=Opening+Received-Issued), Reorder Level, and a Reorder flag using IF.\n\nPayroll: Staff, Basic, Housing, Transport, Gross, Pension, PAYE, Net, using the formulas in our SME Payroll & PAYE Sheet or the free PAYE calculator.\n\nBudget vs actual: Category, Budget, Actual, Variance (=Actual-Budget), Variance % with conditional formatting.\n\nShortcuts worth learning this week: Ctrl+T (table), Ctrl+Shift+L (filters), Alt+= (AutoSum), Ctrl+; (today's date), Ctrl+Arrow (jump to the end of data), Ctrl+Shift+Arrow (select to the end), F4 (lock a cell reference with $), Ctrl+1 (format cells), Ctrl+D (fill down).\n\nProtect your work: lock formula cells and protect the sheet so others only type in input cells; keep a 'Read me' sheet explaining what each tab does.\n\nYou now know more Excel than most job applicants. Put two of these templates on your CV as examples of reports you can build.",
      },
    ],
  },
  {
    id: "ebook-final-year-project-guide",
    slug: "final-year-project-guide",
    title: "Final Year Project: From Topic to Defence",
    subtitle: "A calm, week-by-week guide for Nigerian university and polytechnic students",
    author: "DoyinTech",
    priceNgn: 4500,
    amountKobo: 450000,
    pagesLabel: "8 chapters · with templates",
    category: "Education",
    coverFrom: "#1e3a8a",
    coverTo: "#0f172a",
    accent: "#60a5fa",
    icon: "🎓",
    coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=85",
    badge: "Students",
    blurb:
      "Your project carries real weight in your final grade, yet most students start it confused. This guide walks through choosing a topic your supervisor will approve, writing each chapter, collecting and analysing data honestly, and defending with confidence.",
    benefits: [
      "A topic formula supervisors approve",
      "What goes in each of the five chapters",
      "Sample size, questionnaires and analysis explained simply",
      "Writing the literature review without copying",
      "Formatting and referencing that passes checks",
      "The defence questions you will be asked",
    ],
    chapters: [
      {
        title: "1. Start early, start small",
        body:
          "The students who finish well are rarely the most brilliant. They start early and keep moving. Plan for about sixteen weeks of steady work: two weeks for the topic and proposal, six for Chapters One to Three, four for data and Chapter Four, two for Chapter Five, and two for corrections, formatting and defence.\n\nSet a fixed weekly slot, such as three evenings and Saturday morning, and protect it. Keep everything in one folder with a backup in cloud storage. Name files by chapter and date: Chapter2_2026-11-14.docx.\n\nTalk to your supervisor early and on their terms. Ask how they prefer to receive drafts (printed or email), how long they need to read, and which referencing style the department uses. Bring specific questions to every meeting and write down what they say. Supervisors help students who make their job easy.\n\nFinally, small is beautiful. A narrow topic you can finish properly earns more than a grand topic you can't collect data for.",
      },
      {
        title: "2. Choosing a topic that gets approved",
        body:
          "Use this formula: [Effect / Impact / Assessment / Role / Design] of [X] on [Y] in [specific place or organisation].\n\nExamples: 'Effect of mobile banking on customer satisfaction in selected banks in Jos Metropolis.' 'Design and implementation of an online hostel allocation system for [your institution].' 'Assessment of waste disposal practices among traders in [named market].'\n\nTest each idea against four questions. Can I get the data in six weeks without special permission or money I don't have? Are there at least fifteen recent studies to review? Is it specific enough that someone knows exactly what I'm studying? Does it interest my supervisor or match the department's focus?\n\nSubmit three topics, ranked, each with a one-sentence aim. Avoid topics copied from old projects in the library; supervisors recognise them. Instead, take an old topic and change the place, population, period or method, then explain why that change matters.\n\nOnce approved, write the aim and three to five objectives immediately. Everything else in your project must answer them.",
      },
      {
        title: "3. Chapter One: the introduction",
        body:
          "Chapter One sets up the whole project. Its sections usually are: background, statement of the problem, aim and objectives, research questions, hypotheses (for quantitative studies), significance, scope and limitations, and definition of terms.\n\nBackground: move from general to specific in three or four paragraphs. Start with the broad issue, narrow to Nigeria, then to your place and population. Cite sources for every factual claim.\n\nStatement of the problem: the most important section. State what is wrong, show evidence that it is wrong, explain what happens if nothing is done, and point out that it hasn't been studied in your context.\n\nObjectives: begin with verbs you can measure, such as 'to examine', 'to determine', 'to assess' or 'to design'. Each objective gets one research question, and if quantitative, one hypothesis.\n\nSignificance: name who benefits and how: management, policymakers, customers, future researchers.\n\nScope: where, who and when. Limitations: honest constraints, not excuses like 'time and finance' alone; explain how you reduced their effect.",
      },
      {
        title: "4. Chapter Two: the literature review",
        body:
          "The literature review shows you understand what is already known and where the gap is. It has three parts.\n\nConceptual review: define each key variable in your topic using two or three authors, then state the definition you will use.\n\nTheoretical framework: one or two established theories that explain the relationship you're studying. Name the theorist and year, summarise the theory, and explain how it applies to your study.\n\nEmpirical review: summarise ten to twenty previous studies. Before writing, fill a table: author and year, aim, location, method, findings, and the gap. Then write a paragraph for each, or group studies with similar findings together.\n\nEnd with a short summary that states the gap: what no one has studied in your context, period or with your method.\n\nAvoid plagiarism by reading a source, closing it, and writing what you understood in your own words, then citing it. Never paste and edit. Use Google Scholar and your institution's library databases, prefer studies from the last ten years, and keep every reference in a reference manager from day one.",
      },
      {
        title: "5. Chapter Three: methodology",
        body:
          "Methodology explains exactly how you got your answers, clearly enough that someone else could repeat it.\n\nResearch design: survey for opinions and practices; experimental for testing an intervention; case study for one organisation in depth; system development for computing projects.\n\nPopulation and sample: the population is everyone you could study; the sample is who you actually study. For a known population, Taro Yamane's formula is common: n = N ÷ (1 + N × e²), with e = 0.05. For a population of 400, n = 400 ÷ (1 + 400 × 0.0025) = 200. State your sampling technique: simple random, stratified or purposive, and why.\n\nInstrument: usually a questionnaire for surveys. Explain its sections and the scale, such as a five-point Likert scale.\n\nValidity and reliability: your supervisor or experts reviewed it (validity); a pilot test on a small group gave a Cronbach's alpha above 0.7 (reliability).\n\nData analysis: descriptive statistics (frequencies, percentages, mean) for research questions; inferential tests (chi-square, correlation, regression, t-test) for hypotheses. Choose the test that matches your data, and be able to say why.\n\nFor computing projects, replace these with analysis of the existing system, the proposed system, design diagrams (use case, flowchart, ERD), and the tools used.",
      },
      {
        title: "6. Collecting and analysing data honestly",
        body:
          "Good data beats clever analysis. Pilot your questionnaire on five to ten people and fix confusing statements before you print. Distribute more than your sample size, because not all will return: print about 10 to 15% extra. Record how many you distributed and how many came back; this is your response rate.\n\nEnter data into Excel or SPSS with one row per respondent and one column per question, using codes (5 = Strongly Agree … 1 = Strongly Disagree). Check for entry errors by sorting each column and looking for impossible values.\n\nChapter Four presents results in the order of your research questions. For each: a table, then a short interpretation in words. Don't just repeat the numbers; say what they mean. For hypotheses, state the null hypothesis, the test used, the result (statistic and p-value), and the decision: reject or fail to reject at the 0.05 level.\n\nThen discuss findings: compare each with the studies in Chapter Two. Where you agree, say so; where you differ, suggest why.\n\nNever invent or adjust data. Examiners can tell, and it is academic misconduct. A modest, honest result is a perfectly good project.",
      },
      {
        title: "7. Chapter Five, formatting and references",
        body:
          "Chapter Five is short and should be easy if the rest is solid. Summary: one paragraph per chapter. Conclusion: answer each research question directly in a sentence or two. Recommendations: tie each to a finding and address it to someone specific: management, government, parents, students. Contribution to knowledge: what your study adds. Suggestions for further study: what the next student should investigate.\n\nFormatting is where easy marks are lost. Follow the department's guide exactly. Typically: Times New Roman 12, double spacing, wider left margin for binding, Roman page numbers for preliminary pages and Arabic from Chapter One, tables numbered by chapter with titles above, figures with captions below, and a consistent heading style.\n\nPreliminary pages: title page, certification, dedication, acknowledgements, abstract (150–300 words covering aim, method, key findings and recommendation), table of contents, list of tables and figures.\n\nReferences: use the department's style, often APA. Every in-text citation must appear in the reference list and vice versa. Generate the table of contents automatically from headings so page numbers stay correct after edits. Run a plagiarism check before submission and rewrite flagged sections in your own words.",
      },
      {
        title: "8. Defending with confidence",
        body:
          "Your defence is a conversation about work you know better than anyone in the room. Prepare ten to twelve slides: title; problem and objectives; methodology; three or four slides of key findings with simple charts; conclusion and recommendations; thank you. Keep text minimal and numbers large.\n\nRehearse aloud to a timer, aiming for ten minutes, then rehearse again in front of a friend who interrupts with questions.\n\nPrepare answers to the questions panels always ask: Why did you choose this topic? How did you determine your sample size? Why this method of analysis? What are your limitations and how did you reduce them? What is your contribution to knowledge? If you were to do it again, what would you change?\n\nOn the day: arrive early, dress formally, bring printed copies and a backup on a flash drive and in your email. Listen to each question fully, pause, then answer briefly. If you don't know, say what you would do to find out. Accept corrections politely and write them down.\n\nAfter the defence, make the corrections quickly, get your supervisor's sign-off and submit. Then celebrate: you've done real research.",
      },
    ],
  },
  {
    id: "ebook-remote-job-from-nigeria",
    slug: "land-a-remote-job-from-nigeria",
    title: "Land a Remote Job from Nigeria",
    subtitle: "Skills, CV, platforms, interviews and getting paid in foreign currency",
    author: "DoyinTech",
    priceNgn: 7500,
    amountKobo: 750000,
    pagesLabel: "8 chapters · with scripts and checklists",
    category: "Career",
    coverFrom: "#4c1d95",
    coverTo: "#0f172a",
    accent: "#a78bfa",
    icon: "🌍",
    coverImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=85",
    badge: "Popular",
    blurb:
      "Thousands of Nigerians work for companies abroad from Lagos, Jos or Enugu. This book shows which roles hire remotely, how to make your CV and LinkedIn pass foreign recruiters' screens, where to find real openings, how to interview across time zones, and how to receive payment safely.",
    benefits: [
      "Roles that hire Nigerians remotely, and the skills each needs",
      "A CV format foreign recruiters expect",
      "LinkedIn profile and outreach messages that get replies",
      "Where to find legitimate remote jobs, and how to spot scams",
      "Interview preparation for video calls and take-home tasks",
      "Getting paid, power and internet set-up, and taxes",
    ],
    chapters: [
      {
        title: "1. What remote employers actually buy",
        body:
          "Remote employers hire for one thing above all: reliable output without supervision. They worry about three risks with any remote hire: will this person communicate clearly, will they deliver on time, and will they be available when needed? Your entire application should reduce those worries.\n\nThat changes how you present yourself. Show finished work, not just certificates. Write clearly and briefly. Respond within a working day. Mention how you handle power and internet. Show overlap with the employer's working hours.\n\nRemote roles open to applicants from Nigeria tend to fall into a few groups: software engineering, product design, data analysis, customer support, virtual assistance and operations, content writing and marketing, sales development, technical writing, QA testing, and accounting or bookkeeping support.\n\nThe good news: these roles judge you on work you can demonstrate. The challenge: competition is global. You win by being specific: not 'I'm hardworking and can do anything' but 'I handle customer support for SaaS products, 60+ tickets a day, with a 95% satisfaction score'.",
      },
      {
        title: "2. Choose a lane and build proof",
        body:
          "Pick one lane for the next six months. Jumping between design, data and writing makes you look like a beginner in all three.\n\nFor each lane, build three proof pieces that look like real work:\n\nCustomer support: write help-centre articles for a real product, record a mock ticket workflow, and list the tools you've used (Zendesk, Intercom, Freshdesk, or their free trials).\n\nVirtual assistant / operations: a sample inbox and calendar management SOP, a project tracker in Notion or Trello, and a research report delivered in a polished document.\n\nData analysis: three dashboards on public datasets, each answering a business question, with a short write-up.\n\nDesign: three case studies showing the problem, process and result, not just final screens.\n\nDevelopment: two or three deployed projects with clean READMEs, and contributions to someone else's codebase.\n\nWriting and marketing: six samples in the format employers hire for: blog posts, email sequences, landing page copy.\n\nPut everything on one simple portfolio page with your email and LinkedIn. Our Portfolio Builder tool can help.",
      },
      {
        title: "3. A CV that passes foreign screens",
        body:
          "International recruiters skim a CV in seconds, often after software filters it. Use the format they expect.\n\nKeep it to one or two pages. Remove date of birth, marital status, state of origin, religion and a photograph; these are standard in some Nigerian CVs but unusual abroad and can introduce bias.\n\nTop: name, title matching the role ('Customer Support Specialist'), email, LinkedIn, portfolio link, and 'Location: Lagos, Nigeria (GMT+1), available for remote work'.\n\nSummary: two lines on what you do and your strongest result.\n\nExperience: for each role, three to five bullets that start with a verb and include a number: 'Resolved an average of 60 tickets daily with 96% CSAT', 'Reduced invoice processing time from 3 days to 1 by building a Google Sheets tracker'.\n\nSkills: the tools named in the job ads you target.\n\nTailor the title, summary and top bullets for each application using the job ad's own words. Save as PDF named Firstname-Lastname-CV.pdf. Our free CV Builder exports this format.",
      },
      {
        title: "4. LinkedIn and outreach that get replies",
        body:
          "Recruiters search LinkedIn for remote talent every day. Make your profile findable and convincing.\n\nHeadline: role plus result plus 'Remote', e.g. 'Customer Support Specialist for SaaS | 95% CSAT | Open to remote roles'. Photo: clear, smiling, plain background. About: four short paragraphs: what you do, your best results, the tools you use, and your working hours overlap. Featured: link your portfolio and best samples. Set 'Open to work' for remote roles.\n\nPost once or twice a week about your work: a lesson from a project, a tool tip, a before-and-after. Consistent, useful posts bring recruiters to you.\n\nDirect outreach works when it is short and specific. To a hiring manager: 'Hi [Name], I saw you're hiring a support specialist. I've handled support for two SaaS products and built a help centre that cut repeat tickets by 30%. Here's a 2-minute sample: [link]. Would you be open to considering my application?'\n\nSend ten thoughtful messages a week rather than a hundred copy-pastes. Follow up once after five working days, then move on.",
      },
      {
        title: "5. Where to find real jobs, and how to avoid scams",
        body:
          "Sources worth checking regularly: LinkedIn Jobs filtered to Remote and your region's eligibility; company career pages of firms that hire globally; remote job boards such as We Work Remotely and Remote OK; job boards focused on African talent; and communities in your field on Slack, Discord and X where roles are shared before they are advertised.\n\nRead eligibility carefully. 'Remote' sometimes means 'remote within the US' only. Look for phrases like 'worldwide', 'EMEA', 'Africa', or 'anywhere within GMT±3'.\n\nCommon scams target remote job seekers. Warning signs: they ask you to pay for training, equipment or a 'work permit'; the interview is only by text chat; they send a cheque to buy equipment; the salary is unrealistically high for the role; the email domain doesn't match the company; they ask for your bank login or BVN early.\n\nLegitimate employers never ask you to pay to get a job. Verify the company and the recruiter on LinkedIn, check that the job appears on the company's own site, and never send money.",
      },
      {
        title: "6. Interviews and take-home tasks",
        body:
          "Prepare your set-up first: a quiet space, a plain background, earphones with a microphone, a laptop with a working camera, and a backup internet source (a second network's mobile hotspot). Test the meeting link an hour early. Confirm the time in your time zone; mistakes here end interviews before they start.\n\nExpect three stages: a recruiter screen (motivation, salary expectations, availability), a skills interview or take-home task, and a final conversation with the team or manager.\n\nUse the STAR method for experience questions: Situation, Task, Action, Result, with a number in the result.\n\nAnswer 'Why remote?' with how you work: 'I've worked remotely for two years; I communicate in writing daily, overlap with UK hours fully, and have backup power and internet.'\n\nFor take-home tasks, follow the brief exactly, deliver early, and include a short note explaining your decisions and what you'd improve with more time. That note often matters more than the task.\n\nOn salary, research the range for the role and region, and give a range rather than a single number. Ask what currency and payment method they use.",
      },
      {
        title: "7. Getting paid and working reliably",
        body:
          "Remote employers pay contractors abroad through employer-of-record platforms, contractor payment platforms, or direct transfers. Ask early how they pay. You will typically need a way to receive foreign currency: a domiciliary account at a Nigerian bank, or a reputable cross-border payment service that gives you foreign account details. Compare fees and exchange rates before choosing, keep records of every payment, and never share your login details.\n\nWork like a professional remote employee. Overlap with your team's core hours. Reply to messages within a few working hours. Post a short daily update: what you did, what you'll do next, anything blocking you. Over-communicate when something goes wrong.\n\nPower and internet are your responsibility. Budget for a reliable setup: an inverter or solar backup for your laptop and router, two internet providers on different networks, and a plan for outages (a co-working space you can reach quickly).\n\nTax: income from foreign employers is generally taxable in Nigeria as your personal income. Keep records and file your annual return. Our Freelancer Tax Calculator estimates what you owe under the 2026 bands.",
      },
      {
        title: "8. Your 60-day plan",
        body:
          "Days 1–7: choose your lane. Study twenty job ads in it and list the skills and tools that repeat. Note your gaps.\n\nDays 8–21: build three proof pieces. Close one skill gap with a focused free course. Set up your portfolio page.\n\nDays 22–28: rewrite your CV in the international format. Rebuild your LinkedIn profile. Post your first piece of work.\n\nDays 29–60: apply to five carefully tailored roles a week, send ten outreach messages a week, post twice a week, and ask for feedback after every rejection that offers it. Track everything in a simple sheet: company, role, date, stage, follow-up date.\n\nMeanwhile, take short freelance gigs in your lane to build recent, paid experience.\n\nMost people quit between the twentieth and fortieth application. Those who keep improving their proof and their targeting are the ones who get hired. Treat your job search like a job: a fixed schedule, measured output, and steady improvement.",
      },
    ],
  },
  {
    id: "ebook-bookkeeping-small-business",
    slug: "bookkeeping-for-small-businesses-nigeria",
    title: "Bookkeeping for Small Businesses",
    subtitle: "Simple records that show your real profit, keep tax easy and win loans",
    author: "DoyinTech",
    priceNgn: 6500,
    amountKobo: 650000,
    pagesLabel: "8 chapters · with templates",
    category: "Finance",
    coverFrom: "#7c2d12",
    coverTo: "#0f172a",
    accent: "#fb923c",
    icon: "📒",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=85",
    badge: "New",
    blurb:
      "If you can't say last month's profit in one number, this book is for you. Learn a simple bookkeeping system for a shop, service or small company: what to record, how to reconcile, how to read a profit and loss statement, and the monthly routine that takes under an hour.",
    benefits: [
      "Separate business and personal money for good",
      "The four records every small business needs",
      "Cash vs profit: why you can be busy and still broke",
      "Reconcile your bank account in 20 minutes",
      "Read your profit and loss and balance sheet",
      "Records that make tax filing and loan applications easy",
    ],
    chapters: [
      {
        title: "1. Why bookkeeping pays for itself",
        body:
          "Bookkeeping is simply recording what came in, what went out and why. It sounds boring, but it answers the questions that decide whether a business survives: Am I actually making money? Which products make the most profit? Who owes me? Can I afford to hire? How much tax will I owe?\n\nWithout records, owners guess. They see money in the account and assume they're doing well, then discover suppliers unpaid and tax due. Or they see an empty account and think they're failing, when customers simply owe them.\n\nGood records also open doors. Banks, grant programmes and investors ask for statements and accounts. A business that can produce clean monthly figures looks far less risky than one that can't.\n\nYou don't need to be an accountant. You need a simple system and a routine. This book gives you both. If your business grows, an accountant will thank you for the records and charge you less to prepare your annual accounts.",
      },
      {
        title: "2. Separate the money",
        body:
          "The single most important bookkeeping step happens before any recording: separate business money from personal money.\n\nOpen a business account and route every business receipt into it: transfers, POS, Paystack settlements and cash deposits. Pay every business expense from it. When you need money for yourself, transfer a fixed salary to your personal account on a fixed date, and record it as owner's drawings or salary.\n\nIf you mix accounts, every statement becomes a puzzle: is this transfer from a customer or a family member? Was that payment for stock or for school fees? You can't see profit, and you can't prove income to a lender.\n\nFor cash businesses, count cash daily, record it, and bank it regularly. Keep a small fixed float for change and petty expenses, and record every petty cash payment with a voucher or receipt.\n\nIf you already mix money, start fresh from the first of next month. Don't try to untangle the past perfectly; start clean and stay clean.",
      },
      {
        title: "3. The four records you need",
        body:
          "Most small businesses need just four records, kept in a notebook, a spreadsheet or simple accounting software.\n\n1. Sales record: date, customer, item or service, amount, payment method, and whether it's paid. Every invoice or receipt you issue should appear here.\n\n2. Expense record: date, supplier, what it was for, category (stock, rent, salaries, transport, power, data, marketing, repairs), amount, payment method, and receipt reference.\n\n3. Debtors and creditors: who owes you (and since when), and who you owe. These are often the most valuable lists in the business.\n\n4. Stock record (if you sell goods): opening stock, purchases, sales and closing stock for each item. A monthly count is enough for most shops.\n\nUse consistent categories every month so you can compare. Number your invoices and receipts. Keep receipts in a folder or photograph them into a cloud folder named by month.\n\nOur free invoice and receipt generators number documents for you; record each one in your sales record the same day.",
      },
      {
        title: "4. Cash is not profit",
        body:
          "Profit is sales minus the costs of earning those sales over a period. Cash is the money you have now. They differ for several reasons, and confusing them is a common way businesses fail.\n\nCredit sales: you've made a sale (profit) but haven't received the cash. Your profit looks good while your account is empty.\n\nStock: you've paid for stock (cash out) that you haven't sold yet. Cash is low, but the stock is an asset.\n\nEquipment: you bought a generator for ₦1.8m. That isn't a ₦1.8m loss this month; its cost is spread over its useful life as depreciation.\n\nLoans: borrowed money is cash in but not profit; repayments are cash out but only the interest is a cost.\n\nOwner's drawings: money you take for yourself reduces cash but isn't a business expense (if you're a sole trader).\n\nTo manage both, look at two reports monthly: a profit and loss statement for profit, and a simple cash flow summary (opening balance, money in, money out, closing balance) for cash. A profitable business can still run out of cash. Plan for it.",
      },
      {
        title: "5. Reconcile your bank account monthly",
        body:
          "Reconciliation means checking that your records agree with your bank statement. It catches missing entries, bank charges you didn't notice, double payments, and fraud.\n\nOnce a month: download the statement. Tick each statement line against your sales and expense records. For lines in the statement but not in your records (bank charges, stamp duty, a customer transfer you didn't log), add them to your records. For lines in your records but not yet in the bank (a cheque not cleared, a deposit in transit), note them.\n\nThen check: your record's closing balance, plus or minus the items in transit, should equal the bank's closing balance. If it doesn't, the difference tells you how much to look for.\n\nDo the same for cash: physical cash counted should equal recorded cash.\n\nReconciliation takes about twenty minutes when done monthly, and a painful weekend when left for a year. Set a calendar reminder for the third working day of each month.",
      },
      {
        title: "6. Reading your profit and loss",
        body:
          "A profit and loss (P&L) statement for the month looks like this:\n\nSales (revenue)\nless Cost of sales (the direct cost of what you sold: stock, materials, direct labour)\n= Gross profit\nless Operating expenses (rent, salaries, power, data, transport, marketing, repairs, bank charges)\n= Operating profit\nless Interest and tax\n= Net profit\n\nThree numbers to watch. Gross margin = gross profit ÷ sales. If it falls, your supplier prices have risen or you're discounting too much. Operating expenses as a percentage of sales: if it rises, costs are growing faster than sales. Net profit: the money the business actually earned.\n\nCompare each month with the previous month and the same month last year. Look at profit by product or service: often a few items make most of the profit while others barely cover their costs.\n\nOur free Profit Margin and Break-Even calculators help you test prices before you change them.",
      },
      {
        title: "7. Balance sheet, tax and loans",
        body:
          "The balance sheet is a snapshot of what the business owns and owes on a date.\n\nAssets: cash, money owed to you, stock, equipment. Liabilities: money you owe suppliers, loans, tax due. Equity: what's left for the owners (assets minus liabilities).\n\nIf liabilities are growing faster than assets, the business is borrowing to survive, even if it looks busy.\n\nTax becomes simple with good records. For a business name, profit is taxed as the owner's income under the progressive personal income tax bands; for a company, the company files its own return, and small companies currently pay 0% company income tax but must still file. VAT and PAYE have their own monthly rules. Your monthly P&L gives you the profit figure, and your expense records support every deduction.\n\nFor loans and grants, prepare: six to twelve months of bank statements, monthly P&Ls, a list of debtors and creditors, and a simple balance sheet. Clean, consistent records are often the deciding factor between two otherwise similar applications.",
      },
      {
        title: "8. The one-hour monthly routine",
        body:
          "Daily (5 minutes): record every sale and expense; file receipts; bank cash.\n\nWeekly (15 minutes): review who owes you and send polite reminders; check upcoming supplier payments; count high-value stock.\n\nMonthly (one hour, by the 5th):\n1. Reconcile bank and cash.\n2. Update debtors, creditors and stock.\n3. Produce the P&L and cash summary.\n4. Compare with last month: sales, gross margin, expenses, profit, cash.\n5. Move your tax set-aside (a fixed percentage of profit) into a separate account.\n6. Write three lines: what went well, what went badly, what you'll change.\n\nQuarterly: review prices against costs, chase old debts, and decide on any big purchases.\n\nYearly: hand clean records to an accountant for annual accounts and tax returns.\n\nStart with the daily habit this week. The rest will follow, and within three months you'll know your business better than most owners ever do.",
      },
    ],
  },
  {
    id: "ebook-grants-funding-guide",
    slug: "grants-and-funding-for-nigerian-smes",
    title: "Grants and Funding for Nigerian SMEs",
    subtitle: "Find, apply for and win grants, loans and investment without getting scammed",
    author: "DoyinTech",
    priceNgn: 7000,
    amountKobo: 700000,
    pagesLabel: "8 chapters · with application templates",
    category: "Business",
    coverFrom: "#713f12",
    coverTo: "#0f172a",
    accent: "#facc15",
    icon: "💡",
    coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=900&q=85",
    badge: "New",
    blurb:
      "Every year Nigerian entrepreneurs miss funding because they apply late, apply to the wrong programmes, or send weak applications. This guide explains the types of funding available, how to judge which fits your stage, how to write each part of an application, and how to avoid the fake grant schemes that circulate on WhatsApp.",
    benefits: [
      "Grants, loans, equity and competitions: which fits your stage",
      "Where funding opportunities are announced",
      "The documents to prepare before any call opens",
      "How to answer the standard application questions",
      "Pitching and interviews",
      "Spotting fake grant scams",
    ],
    chapters: [
      {
        title: "1. Know what kind of money you need",
        body:
          "Funding comes in four main forms, each suited to different stages and needs.\n\nGrants are money you don't repay, usually from foundations, development agencies, government programmes or corporate initiatives. They're competitive, often tied to specific sectors, regions or groups (women, youth, agriculture, climate, technology), and come with reporting requirements.\n\nLoans must be repaid with interest. Development finance institutions, intervention schemes and microfinance banks offer SME loans, sometimes at below-market rates. They want evidence that you can repay: sales history, cash flow, and sometimes collateral or guarantors.\n\nEquity investment means giving part of your company to an investor in exchange for money. It suits businesses that can grow very large, and requires a limited company with clean records.\n\nCompetitions and accelerators combine smaller cash prizes or grants with training, mentoring and networks. They're often the best first step for early-stage founders.\n\nBefore searching, write down: how much you need, exactly what it will buy, and how that increases revenue. Funders reject 'I need money to grow my business'. They fund 'I need ₦3.5m for a second oven and packaging machine to supply three supermarkets that have already asked for stock'.",
      },
      {
        title: "2. Where opportunities are announced",
        body:
          "Funding calls are usually open for a few weeks a year, so you need to know where to look and be ready when they open.\n\nGood sources: the official websites and social pages of foundations, development finance institutions and government enterprise agencies; state-level enterprise and employment trust funds; bank SME and women-in-business programmes; embassies and international development agencies; incubators and hubs in your city; and university entrepreneurship centres.\n\nWell-known examples include annual entrepreneurship programmes run by African foundations, the Bank of Industry's SME products, and state enterprise funds such as those in Lagos. Programmes, eligibility and dates change each year, so always confirm details on the official site.\n\nSet up a simple tracker: programme name, link, who it's for, amount, deadline, documents required, status. Check your sources weekly. Join newsletters and follow the official pages, not unofficial 'grant alert' accounts that may spread fakes.\n\nFocus on programmes where you clearly meet eligibility. Ten strong, targeted applications beat fifty generic ones.",
      },
      {
        title: "3. Get your documents ready now",
        body:
          "Many founders find a great opportunity three days before the deadline and can't assemble the documents. Prepare this folder now, scanned and named clearly:\n\nBusiness registration: CAC certificate and status report (business name or company).\nTax: business TIN.\nIdentity: NIN, valid ID and BVN details of owners.\nBank: six to twelve months of business bank statements.\nFinancials: simple P&L for the last twelve months and a 12-month projection.\nBusiness plan: a 5–10 page plan and a one-page summary.\nPitch deck: 10 slides.\nProof: photos of your premises, products and team; customer testimonials; invoices from major customers; any press coverage or awards.\nQuotations: pro-forma invoices for the equipment you plan to buy.\nA 60–90 second video of you explaining the business (many applications now ask for one).\n\nKeep a master document with your standard answers (see the next chapter), updated every quarter with new numbers. With this folder ready, most applications take hours, not weeks.",
      },
      {
        title: "4. Answering the standard questions",
        body:
          "Most applications ask variations of the same questions. Draft strong answers once and adapt them.\n\nDescribe your business: what you sell, to whom, where, since when, and one proof point. 'We produce and deliver fresh bread to 40 shops and two supermarkets in Jos, selling 3,000 loaves a week since 2023.'\n\nWhat problem do you solve? Describe it from the customer's point of view, with evidence.\n\nWhat makes you different? Specific advantages: location, cost, quality, relationships, technology.\n\nTraction: revenue, growth, number of customers, repeat rate. Numbers, with dates.\n\nHow will you use the funds? A table of items, costs and the effect on revenue or jobs.\n\nImpact: jobs created, women or youth employed, community benefits, environmental gains. Funders often score this heavily.\n\nWhat are the risks? Show you've thought about them and have plans.\n\nWrite simply and concretely. Reviewers read hundreds of applications; the clear, specific, honest ones stand out. Ask someone outside your business to read your answers and tell you what they understood.",
      },
      {
        title: "5. Making the numbers convincing",
        body:
          "Weak financials sink more applications than weak ideas. Reviewers check whether your numbers are realistic and consistent.\n\nBuild projections from the bottom up: units you can sell × price, based on current sales and capacity, not percentages of a huge market. Show your assumptions: 'Sales grow 8% monthly as the second oven doubles capacity; current demand exceeds supply by about 40%.'\n\nMake sure every number matches across your application, business plan and pitch deck. Inconsistency suggests carelessness or invention.\n\nShow how the funding changes the numbers: before and after revenue, profit and jobs.\n\nFor loans, show monthly cash flow with repayments included, proving you can repay even if sales are 20% lower than expected.\n\nKeep financial history honest. If you had a bad year, explain why and what you changed. Reviewers respect honesty; they reject inflated figures that don't match bank statements.\n\nOur free Business Plan Generator calculates break-even and payback from your inputs, and the Business Plan & Pitch Deck Kit includes a 12-month projection sheet.",
      },
      {
        title: "6. Pitching and interviews",
        body:
          "Shortlisted applicants are often invited to pitch or interview. Prepare a three-minute version and a ten-minute version of your pitch.\n\nStructure: the problem, your solution, traction, the business model, the market, why your team, what the money will do, and your ask. Lead with your strongest proof point within the first thirty seconds.\n\nRehearse aloud until you can deliver it without slides, then with slides. Time yourself. Record a practice run and watch it.\n\nExpect questions about your numbers, competitors, risks and personal commitment. Common ones: How did you calculate your market size? What happens if a bigger company copies you? Why will customers keep buying? How much of your own money have you invested? What will you do if you don't get this funding?\n\nAnswer directly and briefly. If you don't know, say how you'll find out. Bring a one-page summary to leave behind.\n\nAfter any rejection, ask politely for feedback. Many programmes provide it, and it's the fastest way to improve the next application.",
      },
      {
        title: "7. Avoiding grant scams",
        body:
          "Fake grant messages circulate widely, especially on WhatsApp and Facebook. They typically promise large, quick payouts in the name of government officials, foundations or international bodies. Know the warning signs:\n\nYou're asked to pay a 'processing fee', 'registration fee', 'form fee' or 'tax' to receive a grant. Legitimate grants don't charge applicants.\n\nThe link is not on the official website of the organisation, or uses a lookalike domain.\n\nThe message pressures you to apply within hours or share with ten groups.\n\nThey ask for your bank login details, card PIN or OTP.\n\nThe 'grant officer' contacts you only by WhatsApp or a personal email address.\n\nTo verify: go directly to the organisation's official website (by searching, not clicking the link), check whether the programme is listed there, and look for news coverage from established media. If in doubt, don't apply.\n\nProtect others too: when you see a fake grant message in a group, say so politely and share the official source.",
      },
      {
        title: "8. Your 90-day funding plan",
        body:
          "Days 1–14: decide what you need and why. Write your funding request in one paragraph with amounts. Choose the funding type that fits your stage.\n\nDays 15–30: build your document folder. Register with CAC if you haven't. Get your TIN. Gather bank statements. Write your business plan and one-page summary.\n\nDays 31–45: draft your standard answers and pitch deck. Record your video. Ask two people to review everything.\n\nDays 46–90: track opportunities weekly and apply to every programme where you fully meet eligibility. Customise each application, especially the opening answer and use-of-funds section. Meanwhile, keep growing sales: traction is the strongest application of all.\n\nAfter each round, review: which applications progressed and why? Update your answers with new numbers every quarter.\n\nFunding is rarely won on the first attempt. Founders who keep records clean, keep improving their applications, and keep selling while they wait are the ones who eventually get funded. And many find that once they've done this work, their business is strong enough to grow without it.",
      },
    ],
  },
];
