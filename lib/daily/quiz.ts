/**
 * The Daily Money Quiz: five questions a day on money, business, marketing and staying safe online.
 * Everyone gets the same five on the same day; the bank is walked in a fixed shuffled order so no
 * question repeats until the whole bank has been used.
 */

import { seeded } from "@/lib/kids/daily";

export type QuizQuestion = {
  topic: "Money" | "Business" | "Marketing" | "Tax & invoicing" | "Online safety";
  q: string;
  /** The first option is the right one; options are shuffled for display. */
  options: [string, string, string, string];
  explain: string;
  tool?: { href: string; label: string };
};

export const BANK: QuizQuestion[] = [
  // Money
  { topic: "Money", q: "You save 10,000 a month for a year at 0% interest. How much do you have?", options: ["120,000", "100,000", "110,000", "130,000"], explain: "10,000 × 12 months = 120,000. Saving a fixed amount on payday is the simplest way to build a habit." },
  { topic: "Money", q: "What does compound interest mean?", options: ["Earning interest on your interest as well as your original money", "Interest charged only on loans", "Interest paid once at the end", "Interest that never changes"], explain: "With compounding, each period's interest is added to the balance, so the next period earns on a bigger amount." },
  { topic: "Money", q: "Prices rise 20% in a year and your savings earn 10%. What happened to your buying power?", options: ["It fell", "It rose", "It stayed the same", "It doubled"], explain: "Your money grew 10% but prices grew 20%, so the same savings buy less. This is why inflation matters." },
  { topic: "Money", q: "How many months of expenses is a common target for an emergency fund?", options: ["3 to 6 months", "1 week", "2 years", "None, use credit cards"], explain: "Three to six months of essential costs covers most job losses, repairs or medical bills without new debt." },
  { topic: "Money", q: "The '50/30/20' budget splits income into…", options: ["Needs, wants and savings", "Rent, food and transport", "Tax, pension and pay", "Spending, giving and investing"], explain: "50% needs, 30% wants and 20% savings or debt repayment is a simple starting split you can adjust." },
  { topic: "Money", q: "A loan of 100,000 at a 5% monthly flat rate for 6 months costs how much interest?", options: ["30,000", "5,000", "6,000", "15,000"], explain: "5% of 100,000 is 5,000 a month, × 6 months = 30,000. That is a 60% yearly rate: always ask for the yearly figure.", tool: { href: "/tools/loan-emi-calculator", label: "Loan calculator" } },
  { topic: "Money", q: "Which usually makes a loan cheaper overall?", options: ["A shorter term at the same rate", "A longer term at the same rate", "Paying only the minimum", "Adding fees to the loan"], explain: "Owing money for less time means less interest in total, even though each payment is bigger.", tool: { href: "/tools/loan-emi-calculator", label: "Loan calculator" } },
  { topic: "Money", q: "What is 'paying yourself first'?", options: ["Moving savings out as soon as you are paid", "Buying yourself a treat each payday", "Paying your salary before staff", "Paying off loans before rent"], explain: "Saving first, before spending, means saving actually happens instead of using what is left over." },
  { topic: "Money", q: "Spreading money across different investments is called…", options: ["Diversification", "Liquidation", "Amortisation", "Depreciation"], explain: "Diversifying means one bad investment does not wipe you out." },
  { topic: "Money", q: "An offer promises to double your money in 30 days with 'no risk'. It is most likely…", options: ["A scam", "A bank deposit", "A government bond", "A normal business"], explain: "Guaranteed high returns with no risk are the classic sign of a Ponzi scheme. Real returns come with real risk." },
  { topic: "Money", q: "If you earn 12% a year, roughly how long does it take to double your money?", options: ["About 6 years", "About 12 years", "About 2 years", "About 20 years"], explain: "The 'rule of 72': divide 72 by the yearly rate. 72 ÷ 12 = 6 years." },
  { topic: "Money", q: "Your hourly rate is 2,000 for a 40-hour week. What is the yearly pay over 52 weeks?", options: ["4,160,000", "960,000", "2,080,000", "8,320,000"], explain: "2,000 × 40 × 52 = 4,160,000 before tax.", tool: { href: "/tools/hourly-to-salary-calculator", label: "Hourly to salary" } },

  // Business
  { topic: "Business", q: "You buy for 600 and sell for 1,000. What is your profit margin?", options: ["40%", "60%", "66.7%", "400%"], explain: "Profit is 400. Margin is profit ÷ price: 400 ÷ 1,000 = 40%. (66.7% would be the markup on cost.)", tool: { href: "/tools/profit-margin-calculator", label: "Margin calculator" } },
  { topic: "Business", q: "Markup and margin on the same sale: which number is bigger?", options: ["Markup", "Margin", "They are always equal", "It depends on the currency"], explain: "Markup divides profit by the smaller cost, margin by the larger price, so markup is always the bigger percentage.", tool: { href: "/tools/profit-margin-calculator", label: "Margin calculator" } },
  { topic: "Business", q: "Rent is 50,000 a month. Each item sells for 2,500 and costs 1,500 to make. How many must you sell to break even?", options: ["50", "20", "34", "100"], explain: "Each sale contributes 1,000. 50,000 ÷ 1,000 = 50 items.", tool: { href: "/tools/break-even-calculator", label: "Break-even calculator" } },
  { topic: "Business", q: "Which of these is a fixed cost?", options: ["Shop rent", "Packaging per order", "Delivery per order", "Card fees per sale"], explain: "Fixed costs stay the same whatever you sell. The others rise with each sale (variable costs)." },
  { topic: "Business", q: "A business can be profitable and still run out of money. Why?", options: ["Customers pay late while bills are due now", "Profit is always fake", "Tax is too low", "It has too many customers"], explain: "Cash flow is timing. Profit on paper does not pay salaries if the cash has not arrived.", tool: { href: "/tools/cash-flow-forecast", label: "Cash flow forecast" } },
  { topic: "Business", q: "What does 'cash flow forecast' mean?", options: ["A plan of money coming in and going out by month", "A prediction of exchange rates", "Your bank statement", "A loan application"], explain: "Forecasting cash shows when you will be short before it happens, so you can chase payments or delay spending.", tool: { href: "/tools/cash-flow-forecast", label: "Cash flow forecast" } },
  { topic: "Business", q: "Raising your price by 10% with no lost customers mostly increases…", options: ["Profit, because costs stay the same", "Costs", "Tax only", "Nothing"], explain: "All of a price rise goes straight to profit when cost per sale and customer numbers hold." },
  { topic: "Business", q: "A freelancer wants 3,000,000 a year and can bill 1,000 hours. Ignoring tax and costs, what hourly rate?", options: ["3,000", "1,500", "300", "30,000"], explain: "3,000,000 ÷ 1,000 hours = 3,000 an hour. Add tax and costs on top for the real rate.", tool: { href: "/tools/freelance-rate-calculator", label: "Freelance rate calculator" } },
  { topic: "Business", q: "Why should freelancers not bill 40 hours every week of the year?", options: ["Time goes on admin, sales, holidays and sickness", "It is illegal", "Clients prefer fewer hours", "Banks will not allow it"], explain: "Most freelancers bill 50–70% of their working hours. Price for the hours you can really bill.", tool: { href: "/tools/freelance-rate-calculator", label: "Freelance rate calculator" } },
  { topic: "Business", q: "What is a 'deposit' on a project?", options: ["Part payment before work starts", "The final payment", "A tax", "A refund"], explain: "Taking 30–50% up front protects your time and filters out clients who are not serious." },
  { topic: "Business", q: "What does ROI stand for?", options: ["Return on investment", "Rate of income", "Revenue over interest", "Risk of insolvency"], explain: "ROI = (gain − cost) ÷ cost. Spending 100 to make 150 is a 50% ROI." },
  { topic: "Business", q: "Your best way to keep a new customer coming back is usually…", options: ["Follow up after the sale", "Raise prices straight away", "Never contact them again", "Change your products often"], explain: "A thank-you, a check-in and a reason to return cost little and keep customers buying." },
  { topic: "Business", q: "Two successive discounts of 20% and 10% give a total discount of…", options: ["28%", "30%", "32%", "10%"], explain: "100 becomes 80, then 72. That is 28% off, not 30%.", tool: { href: "/tools/discount-calculator", label: "Discount calculator" } },

  // Marketing
  { topic: "Marketing", q: "What is the main job of a website's home page headline?", options: ["Say clearly what you do and for whom", "Show the company history", "List every product", "Welcome visitors"], explain: "Visitors decide in seconds. A clear 'what and for whom' keeps them reading." },
  { topic: "Marketing", q: "What is a 'call to action'?", options: ["A button or line telling people the next step", "A phone call to a customer", "A legal notice", "A sales report"], explain: "'Get a quote', 'Order on WhatsApp', 'Book a call': one clear next step lifts enquiries." },
  { topic: "Marketing", q: "Which helps most when people search 'bakery near me'?", options: ["A complete Google Business Profile with reviews", "A long Instagram bio", "More hashtags", "A bigger logo"], explain: "Local searches show the Google map pack first. Complete profiles with recent reviews rank higher." },
  { topic: "Marketing", q: "What is SEO?", options: ["Making your site easier to find in search engines", "Paid adverts on social media", "Sending bulk SMS", "A type of website builder"], explain: "Search engine optimisation brings free, steady visitors who are already looking for what you sell." },
  { topic: "Marketing", q: "Out of 1,000 visitors, 20 buy. What is the conversion rate?", options: ["2%", "20%", "0.2%", "5%"], explain: "20 ÷ 1,000 = 2%. Raising it to 3% is 50% more sales from the same traffic." },
  { topic: "Marketing", q: "Which customer review is most persuasive?", options: ["Specific: what they bought and the result", "'Great service!'", "A star rating with no text", "A review from the owner's family"], explain: "Detail makes reviews believable. Ask happy customers what changed for them." },
  { topic: "Marketing", q: "Why is an email or WhatsApp list valuable?", options: ["You can reach customers without paying a platform each time", "It is required by law", "It replaces a website", "It improves your logo"], explain: "Followers on a platform can be lost to algorithm changes. A list is yours." },
  { topic: "Marketing", q: "What does 'mobile-first' design mean?", options: ["Designing for phone screens before desktops", "Only having an app", "Sending texts first", "Using mobile money only"], explain: "Most visitors arrive on phones, so the phone layout should be the best one." },
  { topic: "Marketing", q: "A slow website mainly causes…", options: ["Visitors leaving before it loads", "Higher Google ranking", "More sales", "Lower hosting bills"], explain: "Every extra second of loading time loses visitors, especially on mobile data." },
  { topic: "Marketing", q: "What makes a good offer?", options: ["Clear value, a reason to act now and low risk", "The lowest possible price", "A long list of features", "Small print"], explain: "People buy when the value is obvious, the risk feels small and there is a reason not to wait." },

  // Tax & invoicing
  { topic: "Tax & invoicing", q: "A price of 1,000 plus 7.5% VAT comes to…", options: ["1,075", "1,750", "1,007.50", "925"], explain: "7.5% of 1,000 is 75, so 1,075 including VAT.", tool: { href: "/tools/nigeria-vat-calculator", label: "VAT calculator" } },
  { topic: "Tax & invoicing", q: "A price of 1,200 includes 20% VAT. What is the price before VAT?", options: ["1,000", "960", "1,040", "1,180"], explain: "Divide by 1.2, not take away 20%: 1,200 ÷ 1.2 = 1,000.", tool: { href: "/vat-calculator", label: "VAT calculators" } },
  { topic: "Tax & invoicing", q: "Which should every invoice show?", options: ["An invoice number, date, what was supplied and the amount due", "Your home address only", "Your bank PIN", "The customer's salary"], explain: "Clear numbered invoices get paid faster and keep your records straight.", tool: { href: "/tools/invoice-generator", label: "Invoice generator" } },
  { topic: "Tax & invoicing", q: "What are 'payment terms' on an invoice?", options: ["When and how the customer must pay", "The product warranty", "Your tax ID", "The delivery address"], explain: "'Payment due within 14 days by transfer to…' sets expectations and makes chasing easier." },
  { topic: "Tax & invoicing", q: "What is the difference between a quotation and an invoice?", options: ["A quote is an offer before work; an invoice asks for payment", "They are the same", "An invoice comes first", "A quote is a receipt"], explain: "Quote first, agree, do the work, then invoice. A receipt confirms payment received.", tool: { href: "/tools/quotation-generator-nigeria", label: "Quotation generator" } },
  { topic: "Tax & invoicing", q: "In the UK, businesses can charge late payment interest of…", options: ["8% plus the Bank of England base rate", "1% a year", "50% a month", "Nothing at all"], explain: "Statutory interest on business debts is 8% above the reference base rate, plus fixed compensation.", tool: { href: "/tools/late-payment-interest-calculator", label: "Late payment calculator" } },
  { topic: "Tax & invoicing", q: "Gross pay is…", options: ["Pay before tax and deductions", "Pay after tax", "Bonus pay only", "Pay in cash"], explain: "Gross is before deductions; net (take-home) is what lands in your account.", tool: { href: "/salary-calculator", label: "Salary calculators" } },
  { topic: "Tax & invoicing", q: "Why keep business and personal money in separate accounts?", options: ["It makes records, tax and true profit clear", "Banks require it for everyone", "It earns more interest", "It hides money from tax"], explain: "Mixing money hides how the business is really doing and makes tax returns painful." },
  { topic: "Tax & invoicing", q: "A receipt is proof that…", options: ["Payment was received", "Work will be done", "A price was offered", "Tax was filed"], explain: "Give a receipt for every payment: customers trust you more and your records match the bank.", tool: { href: "/tools/receipt-generator-nigeria", label: "Receipt generator" } },
  { topic: "Tax & invoicing", q: "What is a progressive income tax?", options: ["Higher rates apply to higher slices of income", "Everyone pays the same amount", "Tax that falls each year", "Tax only on businesses"], explain: "Each band of income is taxed at its own rate, so moving into a higher band only taxes the extra income at the higher rate." },

  // Online safety
  { topic: "Online safety", q: "Someone calls from 'your bank' asking for your OTP to 'stop a fraud'. You should…", options: ["Refuse and call the bank on its official number", "Read out the OTP quickly", "Send it by SMS instead", "Share half of it"], explain: "Banks never ask for your OTP, PIN or password. Anyone who does is the fraudster." },
  { topic: "Online safety", q: "Which password is strongest?", options: ["A long phrase of four random words", "Your name and birth year", "password123", "The same password everywhere"], explain: "Length beats complexity. Use a password manager so every account gets its own.", tool: { href: "/tools/password-generator", label: "Password generator" } },
  { topic: "Online safety", q: "What does two-factor authentication (2FA) add?", options: ["A second check, like a code, when you log in", "A second password you share", "Faster logins", "A backup email"], explain: "Even if your password leaks, an attacker still needs your phone or app code." },
  { topic: "Online safety", q: "A payment alert screenshot arrives but nothing shows in your bank app. You should…", options: ["Wait until the money shows in your account before releasing goods", "Release the goods", "Trust the screenshot", "Ask for a second screenshot"], explain: "Fake alerts and edited screenshots are common. Only your own bank balance is proof." },
  { topic: "Online safety", q: "What does the padlock (https) on a website mean?", options: ["The connection is encrypted", "The business is trustworthy", "The site is government approved", "Prices are fixed"], explain: "HTTPS protects data in transit, but scam sites can have it too. Check the address carefully.", tool: { href: "/tools/ssl-checker", label: "SSL checker" } },
  { topic: "Online safety", q: "A link says 'Your account is locked, log in here' and goes to paypa1-secure.com. It is…", options: ["A phishing site", "The real PayPal", "A PayPal partner", "Safe if it has a padlock"], explain: "Look-alike addresses (1 for l) are a phishing trick. Type the real address yourself." },
  { topic: "Online safety", q: "Why install updates on your phone and computer?", options: ["They fix security holes attackers use", "They only change colours", "They slow devices on purpose", "They are optional advertising"], explain: "Most hacks use known flaws that an update already fixed." },
  { topic: "Online safety", q: "The safest way to back up important business files is…", options: ["Automatic copies in two places, one off-site or in the cloud", "One USB stick in a drawer", "Email them to yourself once a year", "Never delete anything"], explain: "Phones get stolen and drives fail. Automatic backups in two places mean you lose nothing." },
];

export function dayNumber(day: string) {
  return Math.floor(Date.parse(day + "T00:00:00Z") / 86400000);
}

/** A fixed shuffled order of the bank, so consecutive days never repeat questions. */
const ORDER = (() => {
  const rnd = seeded("quiz-order-v1");
  const idx = BANK.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
})();

export type DailyQuestion = QuizQuestion & { shuffled: string[]; correct: number };

/** The day's questions, each with its options shuffled and the right answer's position. */
export function dailyQuiz(day: string, count = 5): DailyQuestion[] {
  const start = (dayNumber(day) * count) % ORDER.length;
  const rnd = seeded(`quiz:${day}`);
  return Array.from({ length: count }, (_, k) => {
    const q = BANK[ORDER[(start + k) % ORDER.length]];
    const order = [0, 1, 2, 3];
    for (let i = 3; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return { ...q, shuffled: order.map((o) => q.options[o]), correct: order.indexOf(0) };
  });
}
