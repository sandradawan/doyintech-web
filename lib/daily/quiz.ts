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

  // More money
  { topic: "Money", q: "You save 5,000 every week. About how much is that in a year?", options: ["260,000", "60,000", "200,000", "365,000"], explain: "There are 52 weeks in a year: 5,000 × 52 = 260,000." },
  { topic: "Money", q: "100,000 earns 10% a year, added each year. How much after 2 years?", options: ["121,000", "120,000", "110,000", "200,000"], explain: "Year 1: 110,000. Year 2: 10% of 110,000 is 11,000, so 121,000. The extra 1,000 is interest on interest." },
  { topic: "Money", q: "Which is usually the most expensive way to borrow?", options: ["Instant loan apps with daily fees", "A cooperative society loan", "A bank loan", "Borrowing from family"], explain: "Small daily or weekly fees add up to very high yearly rates. Always work out the yearly cost before you borrow.", tool: { href: "/tools/loan-emi-calculator", label: "Loan calculator" } },
  { topic: "Money", q: "Your 'net worth' is…", options: ["What you own minus what you owe", "Your monthly salary", "Your bank balance", "What you spend in a year"], explain: "Someone with a big house and a bigger mortgage can have a lower net worth than a saver with no debt." },
  { topic: "Money", q: "Prices rise 25% this year. Next year, 100,000 will buy roughly what…", options: ["80,000 buys today", "75,000 buys today", "125,000 buys today", "100,000 buys today"], explain: "100,000 ÷ 1.25 = 80,000. Holding cash during high inflation quietly loses value." },
  { topic: "Money", q: "What is a 'sinking fund'?", options: ["Money saved bit by bit for a known future cost", "A failing investment", "A loan for a boat", "Money kept under the mattress"], explain: "Saving monthly for school fees, rent or a festive season means no panic or borrowing when the bill comes." },
  { topic: "Money", q: "You have debts at 30% and 10% a year. Extra payments save most on…", options: ["The 30% debt", "The 10% debt", "Split equally", "It makes no difference"], explain: "Paying off the highest rate first (the 'avalanche' method) cuts the most interest." },
  { topic: "Money", q: "Which of these is a 'need' in a budget?", options: ["Rent", "A new phone when yours works", "Eating out", "Streaming subscriptions"], explain: "Needs keep you housed, fed, healthy and able to work. Cover them before wants." },
  { topic: "Money", q: "A car or phone losing value over time is called…", options: ["Depreciation", "Appreciation", "Inflation", "Interest"], explain: "Most things you buy depreciate. Land and some investments can appreciate (rise in value)." },
  { topic: "Money", q: "Your take-home pay is 300,000 and you save 20%. How much do you save?", options: ["60,000", "20,000", "30,000", "6,000"], explain: "20% of 300,000 = 0.2 × 300,000 = 60,000.", tool: { href: "/salary-calculator", label: "Salary calculator" } },

  // More business
  { topic: "Business", q: "You sell 200 items a month at 1,500 each. What is your monthly revenue?", options: ["300,000", "30,000", "150,000", "3,000,000"], explain: "Revenue is price × quantity: 1,500 × 200 = 300,000. Revenue is not profit: costs come out next." },
  { topic: "Business", q: "Revenue is 500,000 and total costs are 420,000. What is the profit margin?", options: ["16%", "84%", "80%", "19%"], explain: "Profit is 80,000. 80,000 ÷ 500,000 = 16%.", tool: { href: "/tools/profit-margin-calculator", label: "Profit margin calculator" } },
  { topic: "Business", q: "An item costs 3,000. What price gives a 25% margin?", options: ["4,000", "3,750", "3,250", "4,500"], explain: "Price = cost ÷ (1 − 0.25) = 4,000. Selling at 3,750 is a 25% markup but only a 20% margin.", tool: { href: "/tools/profit-margin-calculator", label: "Profit margin calculator" } },
  { topic: "Business", q: "Price 2,000, cost per item 1,200, fixed costs 160,000 a month. How many sales to break even?", options: ["200", "80", "134", "160"], explain: "Each sale contributes 800 towards fixed costs. 160,000 ÷ 800 = 200.", tool: { href: "/tools/break-even-calculator", label: "Break-even calculator" } },
  { topic: "Business", q: "For a bakery, which is a variable cost?", options: ["Flour", "Shop rent", "Insurance", "The oven"], explain: "Variable costs rise with each loaf you bake. Fixed costs stay the same whether you bake 10 or 1,000." },
  { topic: "Business", q: "What is 'working capital'?", options: ["Money available for day-to-day running", "Money spent on buildings", "The owner's salary", "Profit after tax"], explain: "It is what you have in cash and short-term assets after short-term bills. Too little and you can't buy stock or pay staff.", tool: { href: "/tools/cash-flow-forecast", label: "Cash flow forecast" } },
  { topic: "Business", q: "A customer's invoice is 30 days overdue. Best first step?", options: ["A polite reminder with the invoice and how to pay", "Post about them online", "Stop all contact", "Write it off"], explain: "Most late payers just forgot. A friendly, clear reminder with an easy way to pay gets most invoices settled.", tool: { href: "/tools/invoice-generator", label: "Invoice generator" } },
  { topic: "Business", q: "A 1,200,000 interest-free loan is repaid over 12 months. What is each payment?", options: ["100,000", "120,000", "12,000", "1,000,000"], explain: "1,200,000 ÷ 12 = 100,000. Add interest and the payment rises.", tool: { href: "/tools/loan-emi-calculator", label: "Loan calculator" } },
  { topic: "Business", q: "Customer A buys 10,000 a month for 3 years. What is their lifetime value in sales?", options: ["360,000", "30,000", "120,000", "3,600,000"], explain: "10,000 × 12 × 3 = 360,000. Keeping customers is often worth more than chasing new ones." },
  { topic: "Business", q: "What is a 'unique selling point' (USP)?", options: ["What makes you different from competitors", "Your lowest price", "Your logo", "A one-off sale"], explain: "Fast delivery, a guarantee or a special skill can all be USPs. Say it in your headline." },

  // More marketing
  { topic: "Marketing", q: "You spend 50,000 on ads and get 25 customers. What is the cost per customer?", options: ["2,000", "1,250", "25,000", "500"], explain: "50,000 ÷ 25 = 2,000. If each customer brings in less profit than that, the ads lose money." },
  { topic: "Marketing", q: "400 people saw an ad and 12 clicked. What is the click-through rate?", options: ["3%", "12%", "0.3%", "33%"], explain: "12 ÷ 400 = 0.03, or 3%." },
  { topic: "Marketing", q: "What is A/B testing?", options: ["Comparing two versions to see which works better", "Grading customers A or B", "Testing a site on two phones", "Running ads on two days"], explain: "Change one thing, such as a headline, and let real visitors show you which wins." },
  { topic: "Marketing", q: "What is a 'lead magnet'?", options: ["Something free offered in return for contact details", "A paid advert", "A fridge magnet with your logo", "A sales person"], explain: "A checklist, guide or calculator brings in people who are interested, so you can follow up." },
  { topic: "Marketing", q: "Who is your 'target audience'?", options: ["The people most likely to buy from you", "Everyone in the country", "Your competitors", "Your staff"], explain: "Speaking to a specific group makes your message sharper than trying to please everyone." },
  { topic: "Marketing", q: "Which is an example of 'social proof'?", options: ["Customer reviews and photos", "A bigger logo", "A long About page", "A lower price"], explain: "People trust what other customers say more than what you say about yourself." },
  { topic: "Marketing", q: "'Retargeting' ads are shown to…", options: ["People who already visited your site", "People who have never heard of you", "Your competitors", "Only new customers"], explain: "Most visitors don't buy on their first visit. A reminder ad brings some of them back." },
  { topic: "Marketing", q: "Why show prices on your website or menu?", options: ["It answers buyers' first question and saves time", "It scares people away", "Google requires it", "It lowers your tax"], explain: "Hidden prices make many people leave instead of asking. Clear prices bring better enquiries." },

  // More tax & invoicing
  { topic: "Tax & invoicing", q: "What is the standard VAT rate in Nigeria?", options: ["7.5%", "5%", "10%", "15%"], explain: "Nigeria's VAT has been 7.5% since February 2020. Some items, like basic food, are exempt.", tool: { href: "/tools/nigeria-vat-calculator", label: "Nigeria VAT calculator" } },
  { topic: "Tax & invoicing", q: "A price of 10,750 includes 7.5% VAT. What is the price before VAT?", options: ["10,000", "9,943.75", "10,000.75", "9,250"], explain: "Divide by 1.075: 10,750 ÷ 1.075 = 10,000. Taking 7.5% off 10,750 gives the wrong answer.", tool: { href: "/tools/nigeria-vat-calculator", label: "Nigeria VAT calculator" } },
  { topic: "Tax & invoicing", q: "What does 'Net 30' on an invoice mean?", options: ["Pay the full amount within 30 days", "Pay 30% now", "A 30% discount", "Pay after 30 invoices"], explain: "Put the due date on the invoice too, so there is no confusion.", tool: { href: "/tools/invoice-generator", label: "Invoice generator" } },
  { topic: "Tax & invoicing", q: "What is a credit note?", options: ["A document that reduces or cancels an invoice", "A loan from a bank", "A receipt for cash", "A tax refund"], explain: "If goods are returned or a price was wrong, issue a credit note instead of deleting the invoice." },
  { topic: "Tax & invoicing", q: "A pro forma invoice is…", options: ["A preliminary bill sent before goods or work are delivered", "A final demand", "A tax form", "A receipt"], explain: "It lets a customer arrange payment or approval before you send the real invoice.", tool: { href: "/tools/quotation-generator-nigeria", label: "Quotation generator" } },
  { topic: "Tax & invoicing", q: "Withholding tax is…", options: ["Tax the payer deducts and pays to the tax office for you", "Tax you can refuse to pay", "A fine for late filing", "Tax on savings only"], explain: "Keep the credit notes or receipts for any tax withheld: they count towards your own tax bill." },
  { topic: "Tax & invoicing", q: "In Nigeria and the UK, businesses should usually keep financial records for at least…", options: ["6 years", "6 months", "1 year", "2 weeks"], explain: "Tax offices can check past years, so keep invoices, receipts and bank statements safe." },
  { topic: "Tax & invoicing", q: "Which of these should never appear on a receipt?", options: ["The customer's card PIN", "The date", "The amount paid", "What was bought"], explain: "A receipt shows who paid, how much, when and for what. Never ask for or record a PIN.", tool: { href: "/tools/receipt-generator-nigeria", label: "Receipt generator" } },

  // More online safety
  { topic: "Online safety", q: "Someone online asks you to receive money in your account and send it on for a fee. This is…", options: ["Money muling, which is a crime", "A normal side job", "A bank promotion", "Safe if they pay first"], explain: "Criminals use other people's accounts to hide stolen money. Your account can be frozen and you can be arrested." },
  { topic: "Online safety", q: "What is phishing?", options: ["Fake messages that trick you into giving away details", "A fishing game app", "A type of virus scan", "A way to speed up Wi-Fi"], explain: "Check the sender and the link address, and never enter details from a link you didn't expect." },
  { topic: "Online safety", q: "On free public Wi-Fi, the safest habit is to…", options: ["Use mobile data for banking and payments", "Log in to everything as usual", "Turn off your password", "Share the Wi-Fi password"], explain: "Public networks can be watched or faked. Save banking for mobile data or a trusted network." },
  { topic: "Online safety", q: "A buyer 'accidentally' pays more than the price and asks you to refund the difference. This is likely…", options: ["An overpayment scam", "An honest mistake", "A tip", "A bank error in your favour"], explain: "The first payment often bounces or is fake, and you lose what you 'refunded'. Wait for cleared funds." },
  { topic: "Online safety", q: "Why use a different password for every account?", options: ["One leak won't unlock everything else", "It is faster to log in", "Websites require it by law", "It saves data"], explain: "When one site is hacked, criminals try the same password everywhere. A password manager makes this easy.", tool: { href: "/tools/password-generator", label: "Password generator" } },
  { topic: "Online safety", q: "In 'SIM swap' fraud, criminals…", options: ["Move your number to their SIM to get your codes", "Swap your phone for a fake", "Send you a free SIM", "Block your network signal"], explain: "If your phone suddenly loses all signal for no reason, call your network and bank at once." },
  { topic: "Online safety", q: "A friend's WhatsApp asks you for urgent money. What should you do?", options: ["Call them on their usual number to check", "Send it at once", "Send half", "Reply asking for their account number"], explain: "Hijacked WhatsApp accounts are a common trick. A quick voice call protects you both." },
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
