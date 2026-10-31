/** Search-landing copy for the office, business and student document tools (one entry per /tools/<slug> page). */
import type { Faq } from "@/components/tools/SeoToolPage";

export type OfficeToolPage = {
  slug: string;
  title: string; // <title>
  description: string; // meta description
  h1: string;
  intro: string;
  appName: string;
  appCategory: "BusinessApplication" | "EducationalApplication" | "FinanceApplication";
  guide: [string, string][]; // [heading, paragraph]
  faqs: Faq[];
  upsell: { heading: string; body: string; href: string; cta: string };
};

const PAGES: OfficeToolPage[] = [
  {
    slug: "payslip-generator-nigeria",
    title: "Payslip Generator Nigeria 2026 — Free PDF with PAYE and Pension",
    description: "Create staff payslips with the 2026 PAYE bands, 8% pension, NHF, rent relief and loan deductions. Free PDF download, no sign-up.",
    h1: "Free payslip generator for Nigerian employers",
    intro: "Enter basic, housing and transport pay and get a clean payslip with PAYE under the Nigeria Tax Act 2025, pension, NHF and other deductions worked out for you.",
    appName: "Payslip Generator Nigeria",
    appCategory: "BusinessApplication",
    guide: [
      ["What a Nigerian payslip should show", "Employer name, pay period, the employee's name and staff number, each earning (basic, housing, transport, other allowances), each deduction (PAYE, pension, NHF, loans) and the net pay. Banks and embassies ask for payslips when staff apply for loans or visas, so a consistent, professional slip saves your HR team time."],
      ["How PAYE is calculated here", "Monthly pay is annualised, pension (8% of basic + housing + transport) and NHF are deducted, rent relief of 20% of annual rent (capped at ₦500,000) is applied, and the 2026 bands are used: the first ₦800,000 is tax-free, then 15%, 18%, 21%, 23% and 25%. The annual tax is divided by 12."],
      ["Employer pension contribution", "Employers pay a further 10% of basic, housing and transport into the employee's retirement savings account. It is not deducted from salary, so the payslip shows it as a note."],
    ],
    faqs: [
      { q: "Is this payslip valid for bank loans and visa applications?", a: "Banks and embassies accept payslips issued by the employer on its letterhead and signed or stamped. This tool produces the payslip; print it, sign or stamp it, or add your logo details at the top." },
      { q: "Does it use the new 2026 tax bands?", a: "Yes. PAYE follows the Nigeria Tax Act 2025 bands that took effect on 1 January 2026, including the rent relief that replaced the old consolidated relief allowance." },
      { q: "Can I make payslips for all my staff?", a: "Yes. Your company details are saved on this device, so you only change the employee and pay figures for each slip. For 10+ staff, the SME Payroll and PAYE Sheet in our products store does the whole payroll at once." },
      { q: "Is my salary data stored anywhere?", a: "No. Everything is calculated in your browser and nothing is sent to our servers." },
    ],
    upsell: { heading: "Running payroll for a team?", body: "The SME Payroll & PAYE Sheet calculates PAYE, pension and net pay for every staff member at once, with a monthly remittance summary.", href: "/products/sme-payroll-paye-sheet", cta: "See the payroll sheet" },
  },
  {
    slug: "meeting-minutes-generator",
    title: "Meeting Minutes Generator — Free Template and PDF",
    description: "Write board, AGM, committee and team meeting minutes in the correct format: attendance, agenda items, resolutions and action items. Free PDF.",
    h1: "Meeting minutes generator",
    intro: "Fill in attendance, agenda items and decisions; get properly formatted minutes with an action-item table and signature lines for the chair and secretary.",
    appName: "Meeting Minutes Generator",
    appCategory: "BusinessApplication",
    guide: [
      ["How to write good minutes", "Record decisions and who will act, not every word spoken. For each agenda item write a short summary of the discussion, the resolution, the person responsible and a due date. Circulate the draft within 48 hours, while memories are fresh."],
      ["Formal versus simple minutes", "Boards, AGMs, school PTAs, churches and associations usually need formal minutes: opening time, chair, “Resolved” wording and signatures, because they form an official record. Team meetings only need the decisions and actions."],
      ["Standard agenda for organisations", "Opening prayer or remarks, apologies, reading and adoption of previous minutes, matters arising, main business items, any other business, date of next meeting and adjournment."],
    ],
    faqs: [
      { q: "Who signs the minutes?", a: "The secretary prepares them and the chair signs them once they are adopted as a true record at the next meeting." },
      { q: "Can I use this for a church, school PTA or association?", a: "Yes. Choose the formal style; it follows the format most Nigerian organisations, boards and committees use." },
      { q: "Are my minutes saved?", a: "Your organisation name and secretary are saved on this device. Download the PDF to keep each set of minutes." },
    ],
    upsell: { heading: "Need every office template in one pack?", body: "The Office Admin Templates Bundle has memo, minutes, petty cash, visitor log, asset register and requisition templates ready to use.", href: "/products/office-admin-templates-bundle", cta: "See the office bundle" },
  },
  {
    slug: "certificate-generator",
    title: "Certificate Generator — Free Printable Certificates (Bulk)",
    description: "Make certificates of completion, participation, achievement, appreciation and attendance. Paste a list of names to print a certificate for each. Free PDF.",
    h1: "Free certificate generator with bulk names",
    intro: "Design a certificate once, paste your list of names, and print one certificate per person: ideal for trainings, schools, churches, competitions and staff awards.",
    appName: "Certificate Generator",
    appCategory: "BusinessApplication",
    guide: [
      ["Which certificate to choose", "Completion for courses and trainings with an assessment, participation for workshops and competitions, achievement for winners and top students, appreciation for staff, volunteers and sponsors, and attendance for conferences and seminars."],
      ["Printing tips", "Print on 200–250gsm card paper at 100% scale with headers and footers turned off. For a premium finish use cream or textured paper and sign with a blue pen."],
    ],
    faqs: [
      { q: "Can I print certificates for a whole class at once?", a: "Yes. Paste every name on its own line and the tool prints one A4 landscape certificate per name in a single PDF." },
      { q: "Can I add signatures?", a: "Two signatory names and titles are printed above signature lines for hand signing, which most organisations prefer for authenticity." },
      { q: "Is it free?", a: "Yes, with no watermark." },
    ],
    upsell: { heading: "Running trainings or a school?", body: "We build school management systems and training websites with automatic certificates for every student.", href: "/school-management-software-nigeria", cta: "See school systems" },
  },
  {
    slug: "id-card-generator",
    title: "ID Card Generator — Free Staff and Student ID Cards to Print",
    description: "Make staff, student and member ID cards with photo, ID number and expiry date at the standard card size. Prints eight per A4 sheet. Free.",
    h1: "Free staff and student ID card maker",
    intro: "Add your organisation, colour and each person's name, role, number and passport photo. Print at the standard 85.6 × 54 mm card size, eight cards per A4 sheet.",
    appName: "ID Card Generator",
    appCategory: "BusinessApplication",
    guide: [
      ["What to put on an ID card", "Organisation name and address, full name, passport photo, job title or class, staff or matric number and an expiry date. Schools often add a blood group and an emergency contact on the back."],
      ["Printing and laminating", "Print on 250–300gsm card at 100% scale, cut along the card edges, then laminate with 125-micron pouches. Many business centres will print and laminate for you."],
    ],
    faqs: [
      { q: "Are the photos uploaded to your server?", a: "No. Photos stay in your browser and are only used to build the print page." },
      { q: "What size are the cards?", a: "The international CR80 card size, 85.6 × 54 mm, which fits standard ID card holders and lanyards." },
      { q: "Can I make student ID cards for a school?", a: "Yes. Choose Student ID and the fields change to class and matric or admission number." },
    ],
    upsell: { heading: "Want ID cards produced from your school or HR records?", body: "Our school management system generates ID cards, report cards and receipts from the same student records.", href: "/school-management-software-nigeria", cta: "See school systems" },
  },
  {
    slug: "business-plan-generator",
    title: "Business Plan Generator Nigeria — Free Template with Financials",
    description: "Write a business plan for a loan, grant or investor with start-up costs, monthly profit projection, break-even and payback worked out. Free PDF.",
    h1: "Business plan generator with financial projections",
    intro: "Answer each section in plain language, add your start-up costs and expected sales, and get a formatted business plan with break-even and payback calculated for you.",
    appName: "Business Plan Generator",
    appCategory: "BusinessApplication",
    guide: [
      ["What lenders and grant reviewers look for", "A clear customer, a realistic price, honest costs and a believable path to profit. Reviewers for grants and SME loans in Nigeria consistently reject plans that are vague about who pays and how much the business needs."],
      ["Getting the numbers right", "Start-up costs are one-off: equipment, first stock, rent deposit, registration. Fixed monthly costs happen whether you sell or not: rent, salaries, data, fuel. Cost per unit is what each sale costs you. Break-even is the number of sales that covers fixed costs."],
      ["Keep it short", "Most reviewers prefer 5–10 pages. Use the template sections, attach your CAC certificate and three months of bank statements if you have them."],
    ],
    faqs: [
      { q: "Can I use this for a grant or loan application?", a: "Yes. It covers the sections most grant programmes and SME lenders ask for. Check the specific application for any extra questions they require." },
      { q: "Is my plan saved?", a: "It saves automatically on this device, so you can work on it over several days." },
      { q: "Do I need to register my business first?", a: "Not to write the plan, but most lenders and many grants require CAC registration. We can register your business name for you." },
    ],
    upsell: { heading: "Want an investor-ready plan?", body: "The Business Plan & Pitch Deck Kit includes a full template, a 12-month projection sheet and a 10-slide pitch outline.", href: "/products/business-plan-pitch-kit", cta: "See the business plan kit" },
  },
  {
    slug: "aggregate-score-calculator",
    title: "Aggregate Score Calculator — JAMB + Post-UTME (2026)",
    description: "Calculate your admission aggregate from your JAMB score, Post-UTME score and O'level grades. Choose the 50/50 formula, the 50/30/20 formula or custom weights.",
    h1: "JAMB and Post-UTME aggregate score calculator",
    intro: "Enter your UTME score, your Post-UTME score and, if your school uses it, your O'level grades to see your admission aggregate out of 100.",
    appName: "Aggregate Score Calculator",
    appCategory: "EducationalApplication",
    guide: [
      ["The two common formulas", "Many universities use 50% JAMB and 50% Post-UTME: divide your JAMB score by 8 and convert your Post-UTME score to 50. Others use 50% JAMB, 30% Post-UTME and 20% O'level, where five relevant subjects are graded A1 = 4, B2 = 3.6, B3 = 3.2, C4 = 2.8, C5 = 2.4 and C6 = 2."],
      ["Worked example", "JAMB 250 and Post-UTME 60/100 on the 50/50 formula: 250 ÷ 8 = 31.25 plus 60 ÷ 100 × 50 = 30, an aggregate of 61.25."],
      ["What is a good aggregate?", "It depends on the course and school. Competitive courses such as Medicine, Law and Nursing often need 70+, while many other courses admit in the 50s and 60s. Compare with the departmental cut-off your school published last year."],
    ],
    faqs: [
      { q: "Which formula does my university use?", a: "Each school sets its own. Check the admission screening brochure on your school's website, then pick the matching option or use custom weights." },
      { q: "Do O'level grades count?", a: "In some schools, yes, usually as 20% of the aggregate from five relevant subjects in one sitting. Choose the 50/30/20 option to include them." },
      { q: "Is this the official result?", a: "No. It's an estimate to help you plan; your school's admission list is final." },
    ],
    upsell: { heading: "Got in? Plan your CGPA from day one", body: "Use our free CGPA calculator to track every semester and see the GPA you need for a First Class.", href: "/tools/cgpa-calculator", cta: "Open the CGPA calculator" },
  },
  {
    slug: "timesheet-calculator",
    title: "Timesheet Calculator — Hours Worked, Overtime and Pay",
    description: "Weekly timesheet that adds up hours worked minus breaks, splits regular and overtime hours and calculates pay in naira. Printable with signature lines.",
    h1: "Timesheet and overtime calculator",
    intro: "Enter start time, end time and break for each day to get total hours, overtime and gross pay for the week, then print a timesheet for signing.",
    appName: "Timesheet Calculator",
    appCategory: "BusinessApplication",
    guide: [
      ["Who uses timesheets", "Shift workers, contract staff, security guards, cleaners, nurses, hourly tutors and freelancers billing by the hour. A signed timesheet settles disputes about pay before they start."],
      ["Night shifts", "If a shift ends after midnight, enter the real end time (for example 22:00 to 06:00); the calculator counts it as 8 hours."],
      ["Overtime", "Set the weekly hours after which overtime starts (40 is common) and the multiplier your company pays (1.5× is common). Check your employment contract or company policy."],
    ],
    faqs: [
      { q: "Does it handle shifts past midnight?", a: "Yes. An end time earlier than the start time is treated as the next day." },
      { q: "Can I print it for a supervisor to sign?", a: "Yes. The PDF has employee and supervisor signature lines." },
    ],
    upsell: { heading: "Track staff hours automatically?", body: "We build attendance and payroll systems for businesses with shift staff, linked to WhatsApp and your payroll.", href: "/services", cta: "See custom systems" },
  },
  {
    slug: "study-timetable-planner",
    title: "Study Timetable Planner — Free Personal Reading Timetable",
    description: "Build a weekly reading timetable that gives more time to hard courses and exams that are coming soon. For university, polytechnic, WAEC and JAMB students.",
    h1: "Study timetable planner",
    intro: "List your courses, how hard each one is and when the exam is, set the hours you can study each day, and get a balanced weekly timetable you can print.",
    appName: "Study Timetable Planner",
    appCategory: "EducationalApplication",
    guide: [
      ["How the timetable is built", "Each course gets a share of your study sessions based on difficulty, doubled when its exam is within two weeks and increased by half within a month. Sessions are spread across the week so you don't study the same course back to back."],
      ["Making it stick", "Study at the same time every day, start each session with 5 minutes of recall from memory, finish with past questions, and protect one rest day."],
    ],
    faqs: [
      { q: "Does it work for WAEC, NECO and JAMB?", a: "Yes. Enter your subjects as courses and the exam date to prioritise them." },
      { q: "Is my timetable saved?", a: "Yes, on this device, so you can update it as exams approach." },
    ],
    upsell: { heading: "Want a full study system?", body: "The Student Productivity System ebook covers active recall, exam-week protocols and focus routines that work.", href: "/ebooks/student-productivity-system", cta: "See the ebook" },
  },
  {
    slug: "purchase-order-generator",
    title: "Purchase Order Generator Nigeria — Free PO Template PDF",
    description: "Create purchase orders for suppliers with items, quantities, VAT, delivery date and your company details. Free PDF in naira.",
    h1: "Free purchase order generator",
    intro: "Send suppliers a professional purchase order with items, quantities, prices, VAT and a delivery date, so every order is approved and traceable.",
    appName: "Purchase Order Generator",
    appCategory: "BusinessApplication",
    guide: [
      ["Why use purchase orders", "A PO records exactly what you ordered, at what price and by when, before the supplier delivers. It stops price disputes, unauthorised spending and double orders, and it is what auditors and procurement teams expect."],
      ["The three-way match", "When goods arrive, compare the purchase order, the supplier's delivery note and their invoice. Pay only when all three agree."],
    ],
    faqs: [
      { q: "What's the difference between a purchase order and an invoice?", a: "The buyer issues the purchase order to request goods; the supplier issues the invoice to request payment after supplying." },
      { q: "Can I add VAT?", a: "Yes. Set the VAT rate (7.5% in Nigeria) and it's added to the order total." },
    ],
    upsell: { heading: "All your office paperwork in one pack", body: "The Office Admin Templates Bundle includes purchase requisition, petty cash, asset register and memo templates.", href: "/products/office-admin-templates-bundle", cta: "See the office bundle" },
  },
];

export function getOfficeToolPage(slug: string): OfficeToolPage {
  const p = PAGES.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown office tool page ${slug}`);
  return p;
}
