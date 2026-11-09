import type { EbookChapter } from "@/lib/ebooks";

export const WRITTEN_2: Record<string, EbookChapter[]> = {
  "ebook-sme-security": [
    {
      title: "1. You are a target",
      body: `Most small business owners think hackers only go after banks and big companies. The opposite is often true. Criminals like small businesses because they have money moving through them and rarely have anyone watching security.

Most attacks on small firms aren't clever movie-style hacking. They are simple tricks that run in bulk: a fake bank alert, a WhatsApp account taken over with a stolen code, a false invoice sent to your accountant, or a staff member's password reused from a leaked site. Nobody picked you out personally. A criminal sent the same message to thousands of people and you happened to be one who clicked.

The good news is that simple habits stop most of this. You don't need an IT department. You need strong logins, a healthy suspicion about payment requests, sensible limits on staff access, and backups.

Start by listing what you would lose. Write down your bank and fintech apps, business WhatsApp, email, website, social media pages, Paystack or other payment dashboards, accounting records and customer list. For each one, ask: if a stranger got in tomorrow, how bad would it be, and who currently has access? Most owners find a surprise here, like an ex-staff member still logged in to the Instagram page.

Throughout this book, treat one idea as a rule: pause when you feel rushed. Nearly every scam creates urgency, such as "your account will be blocked today", "pay now to keep the discount" or "the boss needs this immediately". Urgency is there to stop you thinking. Thirty seconds of checking prevents most losses.

Your task now: make your list of accounts and who can access each. Keep it somewhere safe, not in a WhatsApp chat.`,
    },
    {
      title: "2. Passwords and two-step login",
      body: `Stolen or guessed passwords are the easiest way into a business. Two habits fix most of the problem.

Habit one: a different password for each important account. When a website gets hacked, criminals try that same email and password on Gmail, Instagram and banking sites. If you use one password everywhere, one leak opens everything.

A password manager makes this practical. It stores your passwords in an encrypted vault and creates strong new ones. Well-known options include Bitwarden, 1Password and the built-in Google or Apple managers. You only need to remember one strong main password. Make that one long: four or five random words work well, such as "mango-bridge-seven-river-cloud". Don't use your name, phone number, birthday or company name.

Habit two: turn on two-step login, also called two-factor authentication or 2FA. Even if someone steals your password, they still need a second code. Do it today on email first, since email can reset almost every other account. Then do WhatsApp, Instagram, Facebook, your website, Paystack and any others.

The best option is an authenticator app, like Google Authenticator or Microsoft Authenticator, or a passkey. SMS codes are weaker, as SIM swap fraud exists, but they are far better than nothing. Save your backup codes on paper in a safe place, because losing your phone without them can lock you out.

For WhatsApp, open Settings, Account, Two-step verification, and set a PIN. Never share the six-digit code you receive by SMS, no matter who asks. A popular trick: a friend's hacked account messages you saying "I sent a code to your phone by mistake, please send it to me." It isn't your friend, and that code hands over your account.

Don't share logins between staff if you can avoid it. Give each person their own account, so you can remove one person without changing everything.

Your checklist:

Email has a unique password and 2FA.
Banking apps have a strong PIN that isn't your birth year.
WhatsApp two-step PIN is on.
Social media pages have 2FA on.
Website and payment dashboards have 2FA on.
Backup codes are stored safely.

Your task now: complete the first three items today. Check our free password generator if you need one quickly.`,
    },
    {
      title: "3. Invoice and payment fraud",
      body: `Payment fraud hits Nigerian businesses every day, because money moves so quickly by transfer and POS. Learn these common tricks.

The fake alert. A buyer sends a fake credit SMS or an edited screenshot of a transfer, then rushes you to release goods. The rule: only trust your own banking app or the bank's real alert, checked by you or the person who manages the money. A screenshot proves nothing. Fake POS receipts and fake transfer apps exist too.

The changed account number. You get a message from a "supplier" saying their account has changed. Or a real email account gets hacked, and the criminal sends a real-looking invoice with their own account details. The rule: if bank details change, phone the supplier on a number you already have, not the one in the message.

The false boss. A staff member receives a WhatsApp from a new number with your profile picture: "This is my new line. I need you to pay ₦450,000 to this vendor now. I'm in a meeting." The rule: all new payment requests get confirmed by voice on the known number. Tell your staff that you will never be offended by being checked.

The overpayment. A customer "accidentally" pays too much and asks you to refund the difference. Their original payment gets reversed later, and you lose both. The rule: refund only after the money has fully cleared, and return it to the same account it came from.

The fake bank officer. A caller says there's a problem with your account and asks for your OTP, PIN, or to dial a code. Real banks don't need your PIN or OTP. Hang up and call the number on the back of your card.

Set simple controls in your business. Two people should be involved in any big payment: one prepares it and another approves it. Set transfer limits on your banking app. Keep a list of approved vendors with confirmed account numbers. Reconcile your account every day or two, so you notice problems quickly.

If you've been defrauded, speed matters. Call your bank's fraud desk immediately and ask them to try to place a hold on the money. Report it to the police, keeping every message and receipt.

Your task now: write these payment rules on one page and give a copy to anyone who handles your money.`,
    },
    {
      title: "4. Staff access rules",
      body: `Many security problems come from inside, through mistakes more than bad intentions. A staff member clicks a link, a sales rep reuses a password, or someone who left six months ago can still log in.

Follow one principle: everybody gets only the access they need for their job, and nothing extra. The sales assistant needs WhatsApp and the catalogue, not the bank dashboard. The accountant needs the books, not the website admin.

Set up accounts properly. Use "team member" or "manager" roles rather than sharing the owner's login. Instagram and Facebook have Business Portfolio roles. Paystack lets you add team members with limited permissions. Google lets you add managers to a Business Profile. Keep the owner role for yourself.

Keep a simple access register in a spreadsheet: staff name, what they can access, date added and date removed.

Have a leaver checklist, and use it the same day someone leaves, even if things ended well:

Remove them from email, social media, website, payment dashboard and shared drives.
Change any shared passwords they knew.
Recover phones, laptops, SIMs and POS machines.
Tell your key suppliers if that person was a contact.

Devices matter too. Business phones and laptops should have a screen lock. Don't leave a POS terminal or an open laptop unattended. Install updates, and only install apps from official stores. Keep cracked software away from your business, since it often carries malware. Staff should not plug in unknown USB drives either.

Train your people in 10 minutes a month. It doesn't need to be formal. Share one real example: "This fake alert went around this week. Here's how to spot it." Praise the person who reports a suspicious message, including when it turns out to be harmless. If people fear being blamed, they'll hide their mistakes, and that's when small problems become big ones.

Your rule when someone clicks something bad: tell the owner immediately. No punishment for reporting quickly.

Your task now: fill in the access register and remove anyone who shouldn't still be on it.`,
    },
    {
      title: "5. Phishing: spotting fake messages",
      body: `Phishing means a fake message that tries to trick you into giving up a password, a code or money. It might arrive through email, SMS, WhatsApp or even a phone call. It might look quite professional, especially now that AI tools help criminals write clean messages. Bad spelling is no longer a reliable sign.

Check these things instead:

The sender. Look at the actual email address, not only the display name. "Paystack Support" from support@paystack-verify.help isn't Paystack.

The link. On a phone, press and hold to see where it goes. A real bank link goes to the bank's official domain. A trick might be "gtbank.secure-login.xyz", where the real site is the part just before the last dot: "secure-login.xyz".

The feeling. Are you frightened or excited? "Your account will be blocked", "You've won", "Your package is held", "CBN grant for small businesses". Strong feelings are the trap.

The request. Passwords, OTPs, PINs, card numbers or payment to unlock something are all red flags.

The safest habit is to not use the link. If a message claims to be from your bank, open the bank's app yourself and check there. If it's from a supplier, phone them.

Common versions in Nigeria include fake government grants and loans that ask for an "activation fee", fake job offers that ask for payment, hacked friends asking you to vote in a contest or "borrow" money, fake investment groups with screenshots of profit, and fake delivery messages.

What if you've already clicked or entered your password? Stay calm and act quickly. Change that password from a clean device and turn on 2FA. If you gave banking details, call your bank right away. Check your email for forwarding rules you didn't set up, and check social media for login activity. Tell your staff and contacts if your account sent messages out. Use our free breach hygiene guide for the steps in order.

Your task now: share this chapter with your team and agree a rule: "When in doubt, stop and ask."`,
    },
    {
      title: "6. Website and email basics",
      body: `Your website represents your business, and it's often the easiest thing for a criminal to damage. A hacked site can send visitors to scams, steal customer data or get flagged by Google with a warning that scares people away. Ask your developer about each of these, or go through them yourself.

HTTPS: your site should show a padlock and start with https. This protects data moving between customers and your site. Most hosts provide it free. Our SSL checker will tell you if yours is working and when the certificate expires.

Updates: an outdated WordPress, theme or plugin is one of the most common ways small sites get hacked. Turn on automatic updates where it's safe, and delete any plugin you no longer use. Avoid "nulled" or cracked paid themes. They frequently contain hidden malware.

Backups: keep at least one automatic backup that is stored away from the website's own server, and test restoring it at least once. A backup you've never tried may not work. Ask yourself: if the site vanished today, how long would it take to come back?

Admin access: use a strong password and 2FA, remove old users, and don't use "admin" as a username. Find out who controls your domain and hosting. Your domain should be registered in your own name or the business's name, using your own email. Many owners have lost their domain because a developer registered it in their personal account and then disappeared.

Forms and payment: never collect card details on your own site. Use a provider like Paystack, so sensitive data never touches your server. Keep only the customer data you truly need. Under the Nigeria Data Protection Act, businesses have legal duties when they handle personal data, so have a clear privacy notice and take care of it.

Email: use a business domain email rather than a free address if you can, and ask your provider or developer to set up SPF, DKIM and DMARC. These records make it harder for criminals to send email pretending to be you, and they also help your real mail avoid spam folders.

Your task now: run your site through our free security checker tools, and send the results to your developer. Confirm in writing that your domain is in your name.`,
    },
    {
      title: "7. Backups and what to do when things go wrong",
      body: `Assume that one day something will go wrong. A phone gets stolen, a laptop dies, a ransomware message appears or your account is taken over. Being prepared is the difference between a bad day and a closed business.

Backups: the simple rule is to keep your important data in at least two places, one of them away from your premises. Back up your accounting records, customer lists, contracts, designs and WhatsApp chats. Use a cloud service like Google Drive or OneDrive, plus an external drive that you update monthly. Unplug that drive after use, since ransomware can encrypt anything connected.

A one-page emergency plan: write this before you need it, and keep a printed copy.

Who to call: your bank's fraud desk number, your developer, your domain host, your accountant and your lawyer.
What to do first in each case:

Phone stolen: call your network to block the SIM, report the phone, log out of your accounts from another device, and tell your bank.

WhatsApp taken over: reinstall WhatsApp and verify your number, then message your contacts to warn them. WhatsApp's support page can help too.

Social media hacked: use the platform's official recovery page. Warn your customers through other channels not to pay anybody claiming to be you. Avoid "recovery experts" who approach you online. Many are scammers themselves.

Email hacked: change the password, turn on 2FA, remove unknown forwarding rules, and check connected apps.

Website hacked: contact your host and developer, restore from a clean backup, change all passwords and find how they got in. Otherwise it will happen again.

Money stolen: phone your bank immediately, write down exact times and amounts, and file a police report.

Ransomware: disconnect the affected devices from the internet. Don't pay straight away, as payment doesn't guarantee your files come back. Get professional help.

Telling customers: if customer data may be affected, tell them honestly and quickly. Certain data breaches may have to be reported to the Nigeria Data Protection Commission, so get legal advice when customer data is involved.

Your task now: write the one-page plan and save the numbers offline.`,
    },
    {
      title: "8. Your 14-day hardening plan",
      body: `You don't need to do everything at once. Fifteen to 30 minutes a day for two weeks will make your business much harder to attack than most.

Day 1: List your accounts and who can access them.
Day 2: Secure your main email with a unique password and 2FA.
Day 3: Turn on WhatsApp two-step verification for you and your staff.
Day 4: Set up a password manager and change passwords on your three most important accounts.
Day 5: Turn on 2FA for social media pages and your payment dashboard.
Day 6: Check banking limits, and turn on transaction alerts on every account.
Day 7: Write your payment rules: confirm alerts in the bank app, verify changed account numbers by phone, two people for large payments. Share them.
Day 8: Fill in your staff access register and remove anyone who has left.
Day 9: Show your team a real scam example and agree "when in doubt, stop and ask."
Day 10: Check your website for HTTPS and updates. Delete unused plugins.
Day 11: Confirm you own your domain and hosting. Save those login details securely.
Day 12: Set up a cloud backup of key files. Make your first external drive backup.
Day 13: Test a restore. Choose one file from your backup and open it.
Day 14: Write your one-page emergency plan and print a copy.

Then keep it going with a monthly 15-minute check:

Any staff changes? Update access.
Website and device updates done?
Latest backup confirmed?
Any new scam your team should hear about?

And a yearly check: review your bank limits, your list of who has access, and your emergency plan. Test your restore again.

Be realistic: no business can be completely safe. Your aim is to be a harder target than the next business, to limit the damage when something happens, and to recover quickly. Criminals move on when the easy route is closed.

If you handle lots of customer data or large sums, pay a professional for a proper review once a year. For most small firms, the habits in this book cover the largest risks at almost no cost.

Finally, tell your customers how you work. "We will never ask for your PIN. Our only account name is ___." That protects them from people pretending to be you, and it builds trust in your name.`,
    },
  ],

  "ebook-founder-website": [
    {
      title: "1. A website is a sales tool",
      body: `Most first websites fail for a simple reason: the owner treats them as a decoration. They want it to look impressive, they spend weeks on colours, and nobody ever checks whether it brings in business.

Think of your website as a salesperson who works all night. What should that salesperson do? Tell people what you do, show them proof, answer common questions, and get them to take the next step, which is usually to call, send a WhatsApp, book or pay.

Before you talk to any developer, answer five questions in writing:

Who is this for? "Parents in Abuja looking for a primary school" is good. "Everybody" is useless.

What's the one main action you want people to take? Book a visit, request a quote, or buy.

What do people worry about before they buy from you? Price, trust, delivery, quality.

What proof do you have? Reviews, photos, case studies, your CAC number, years in business.

How will you know it's working? Enquiries per month, online sales, or fewer repeat phone questions.

Do you even need a website yet? If you're testing an idea, a WhatsApp catalogue or a one-page site can be enough. You need a proper website when people look you up before buying, when you sell to businesses or to customers outside your area, when you want to be found on Google, or when you want to take payments directly.

Most of your visitors will be on phones, often with slow or expensive data. A fast, plain, clear site will beat a heavy and animated one. Your developer may love animations, but your customer on 3G won't.

Your task now: answer the five questions on one page. This page will become the heart of your brief, and it could save you hundreds of thousands of naira in wasted work.`,
    },
    {
      title: "2. Pages you actually need",
      body: `A first website doesn't need 15 pages. Each extra page adds to your cost and your maintenance, and few get read. For most small businesses, five is enough.

Home: within five seconds, a visitor should know what you do, who it's for and what to do next. Include a clear headline, your main button, a short list of services, proof and a WhatsApp or call button.

Services or products: list what you sell, with prices or a "from" price where you can. Each main service might deserve its own page later, as that helps with Google searches.

About: why should someone trust you? Include your real story, your team, photos of real people and your registration details. Keep the focus on what it means for the customer.

Contact: phone, WhatsApp, email, address, a map, your opening hours, and a very short form. Asking for 10 fields loses people.

Reviews or case studies: real proof. This can be a section on your home page at the start.

For particular businesses, add what's specific: a menu for a restaurant, admission and fees for a school, listings for property, booking for a clinic or a shop for online selling.

Legal pages: a privacy notice is sensible as soon as you collect any personal data. If you sell online, add your delivery and refund terms.

Things you can skip at first: a blog you won't update (an empty one looks worse than none), an image slider, a chatbot, a newsletter nobody will write, and a FAQ page full of questions no one has asked.

Write the words before the design. Designers can't work well on "lorem ipsum". Write in the language your customer uses. Say "We fix your car in one day" rather than "We deliver best-in-class automotive solutions." Your customers aren't impressed by big grammar; they just want to know whether you can help.

Your task now: list your pages, and for each one write the single question it answers. Then gather your real photos. Good photos of your real business are worth more than any template.`,
    },
    {
      title: "3. Briefing a developer without jargon",
      body: `You don't need to speak tech to brief a developer well. You need to be clear about your business, and that's something you know better than anybody. A good brief gets you better quotes and fewer arguments.

Include these points:

About the business: what you do, where, and for whom.
Goal: "Get 20 enquiries a month from parents in Abuja."
Main action: "Tap WhatsApp to book a school visit."
Pages: your list from chapter 2.
Features: booking, online payment through Paystack, a blog you can edit, or a product catalogue. For each, explain why you need it.
Content: who writes the words and supplies the photos? Say so.
Examples: three sites you like, and exactly what you like about each. Add one you hate.
Budget: give a range. It isn't a trap. A good developer will tell you what's possible at that price.
Deadline: and why. "Before admission opens on 1 March" is useful.
Who decides: name the one person who approves things.

Questions to ask each developer:

Can I see three live sites you've built? Open them on your phone. Do they load quickly?
Can I speak with a past client?
Who owns the domain, the hosting account and the code once it's done? The right answer is: you.
What does your price include, and what will cost extra?
How many rounds of changes are included?
What happens after launch? Who fixes things, and at what cost?
Can I update prices and text myself?
What do you need from me, and by when?

Watch out for these warning signs: no real portfolio, a very low price with no details, no written agreement, a demand for full payment upfront, domain registered in their own name, or a promise of "first page on Google in two weeks". No honest person can promise that.

Choosing between a freelancer, an agency and a site builder. A freelancer is usually cheaper and more personal, but you depend on one person. An agency costs more, with more capacity and process. A site builder like Wix or Shopify is fine if you can do it yourself and don't need much. We've written a free comparison on this site called Agency vs Freelancer vs DIY.

Your task now: write your brief using this list. Send it to at least three developers and compare what comes back.`,
    },
    {
      title: "4. Budget honesty",
      body: `People often ask "how much does a website cost?", but that's like asking "how much does a house cost?" It depends on what you need. Here's how to think about it.

The upfront build is only part of your cost. Plan for these too.

Domain name: paid yearly. A .com or .com.ng usually costs a modest amount, so register it in your own name.

Hosting: paid monthly or yearly. It depends on the type of site.

Email: a business address like hello@yourbusiness.com may have a free tier or a small monthly cost.

Maintenance: updates, backups and small changes. You can do some yourself, or pay monthly for a care plan.

Content: professional photos and copywriting are optional, but these often make the largest difference to results.

Marketing: a site with no visitors won't do anything. Budget something for Google Business Profile effort, social media or ads.

Payment fees: providers such as Paystack charge per transaction. Check current rates on their sites.

Our website calculator on this site and our price guide can give you a realistic range based on your features.

How to spend wisely. Start with what brings in money. Launch a smaller version, learn what customers do and add to it later. A good five-page site this month beats a perfect 30-page site that never launches. Features you don't need yet, such as custom apps and member logins, can multiply your cost many times.

Be careful with extremes. A ₦30,000 website often comes from a template with no support, and it may vanish along with the person who built it. A multi-million naira quote for a simple brochure site is often a sign you're paying for overhead you don't need. Ask for the reasons behind any quote.

Typical payment terms are 50% to start and 50% before launch. For larger projects, use milestones. Get everything in writing, including what's included, the timeline, and who owns what.

Set aside about 20% extra for surprises. There's always something: another page, some photo editing or a change of mind.

Your task now: write out your first-year budget: build, domain, hosting, email, maintenance, content and marketing. If the total frightens you, cut scope, not quality.`,
    },
    {
      title: "5. Getting the words and pictures right",
      body: `The most common reason website projects run late isn't technical. The owner hasn't provided the content. Start early, because this is also what most affects whether visitors trust you.

Your home page headline should say what you do, for whom, in plain words.

Weak: "Welcome to Excellence Consulting, your partner in success."
Better: "We help Nigerian small businesses register with CAC and file taxes on time."

Under the headline, add one or two lines on how you do it, and a button with a clear action: "Chat with us on WhatsApp", not "Submit".

Write your services like you'd explain them to a customer. For each one, say what it is, who it suits, what's included, how long it takes, and how much it costs (or starts from). Publishing prices filters out those who can't afford you and earns trust from those who can. If your price truly depends on the job, explain what affects it.

Answer objections. What do people ask before buying? "Do you deliver outside Lagos?" "What if I don't like it?" "How long does it take?" Those answers belong on your site, and they will reduce repeat questions.

Add proof. Use real reviews with names (with permission), photos of your work, logos of clients who've agreed, and any numbers you can honestly back up. Add your CAC registration number and a real address if you have one. Scammers have made Nigerians cautious, so show you're real.

Photos make a big difference. Stock pictures of smiling models in suits don't convince anyone. Shoot your real place, team and work. You can get decent results on a modern phone with good daylight. If you can afford a photographer for half a day, this is often the best money you'll spend.

Use AI tools to help with first drafts if you like, but always read and correct them. Add your own details, and make sure it sounds like you. Check every fact.

Don't copy another business's text or photos. It's dishonest and can hurt you on Google. Get permission for anything you use, and only use images you have the rights to.

Your task now: draft your home page in a plain document. Read it aloud to a friend who doesn't know your business, then ask them to tell you what you do.`,
    },
    {
      title: "6. Before launch: the checklist",
      body: `Before you announce your site, test it as a stranger would. Borrow a cheap Android phone if you can, and try on mobile data. Your developer's powerful laptop doesn't reflect your customers' reality.

Basics:

Does it load fast on a phone? Try Google PageSpeed Insights for a score and advice.
Can you tell what the business does within five seconds?
Do all buttons and links work?
Does the WhatsApp button open a chat with the right number and a prefilled message?
Do your forms send to the right email? Send a test.
Are the phone, email, address and hours correct on every page?
Are there spelling mistakes? Ask two others to read it.
Does anything still say "lorem ipsum" or show sample photos?

Payments, if you sell online:

Do a real low-value test purchase from start to finish.
Do the confirmation message and receipt arrive?
Are delivery fees and the refund policy clear before payment?

Google and technical:

Does every page have its own title and description?
Do images have useful alt text?
Is there a sitemap, and has it been submitted to Google Search Console?
Is the site set to allow search engines? Developers sometimes block them during the build and forget to remove the block.
Does the site open at both the www and non-www address?
Is HTTPS on, with a padlock?
Is Google Analytics or another counting tool in place, and is it set up with proper cookie notices?
Are redirects in place if you're replacing an old site? Otherwise, old links on Google will break.

Ownership:

Is the domain in your name? Do you have the logins?
Do you have hosting access and a copy of the code or an export?
Are backups running?
Has the developer given you a short guide to edit text and prices?

Legal: your privacy notice, terms and refund policy should be in place, if applicable. Get a lawyer to check them for anything significant.

Don't launch on a Friday night, as nobody will be around to fix problems. Choose a weekday morning, and watch carefully for a day.

Your task now: print this list, and go through it with your developer before you pay the final balance.`,
    },
    {
      title: "7. Launch week",
      body: `Launching isn't an event where crowds suddenly arrive. Nobody knows your site exists until you tell them, so have a plan for launch week.

Day 1: Tell people you already know. Send a personal message to your customers and friends: "We've just launched our new website. I'd love your honest opinion. Is anything confusing?" You'll get free testing, and some might buy.

Day 2: Update your links everywhere. Instagram bio, Facebook page, WhatsApp Business profile, Google Business Profile, email signature, business cards and signboard. Create a QR code for printed materials using our free tool.

Day 3: Set up Google. Verify your site in Google Search Console, submit your sitemap and check your Google Business Profile links to your site. Google takes time. New sites rarely rank within days, and that's normal.

Day 4: Share something useful. Post about one service, with a link. Don't just shout "Our website is live." Show a real benefit: "You can now see all our fees and book a school visit in one minute."

Day 5: Ask for reviews from happy customers, on Google especially. Ask a few trade partners to link to your site from theirs.

Day 6: Check your numbers. How many visitors, WhatsApp clicks or form fills have you had? Watch how a real person uses your site by asking a friend to book something while you watch silently. You'll quickly see what confuses them.

Day 7: Make a list of fixes. Then do the top three.

Also make it easy to measure enquiries. Ask each new customer "How did you find us?" and record the answer. It's old-fashioned, but it works when analytics are unclear, particularly as so many sales close on WhatsApp.

Don't be surprised if launch week is quiet. Your site is now a foundation. Over the coming months, the traffic comes from Google, social media, referrals and ads. Stay patient and keep going.

Your task now: put these seven days in your calendar, and name who's responsible for each.`,
    },
    {
      title: "8. After launch: habits that keep it working",
      body: `A website isn't finished at launch. It's like a shop: if you don't keep it clean and stocked, people stop trusting it. The good news is that small habits are enough.

Weekly, 15 minutes:

Check that the site loads and that forms and WhatsApp buttons work.
Update prices, stock, events or anything out of date.
Note the three most common customer questions. Are they answered on the site?

Monthly, 30 minutes:

Look at your numbers: visitors, top pages, enquiries and sales. Which page gets the most traffic? Is your best service easy to find from it?
Check Google Search Console for search terms you appear for and any errors.
Confirm backups are running and updates have been applied.
Add one piece of proof: a review, a photo or a small case study.

Quarterly:

Add a page or article that answers a real customer question. "How much does braces cost in Jos?" is the kind of thing people actually search for. Over time, these useful pages will bring you steady visitors.
Check your site on a phone again. Is anything slow or broken?
Review your domain and hosting renewal dates. An expired domain means your site and email both stop.
Ask yourself whether the site still reflects your best offer.

Yearly:

Renew your domain early and set it to auto-renew. Put a backup reminder in your calendar too.
Consider what should change: new photos, new testimonials, better pages.

Decide who does what. If your developer keeps a care plan, ask exactly what it includes, how quickly they respond and how you get your data if you leave. If you do it yourself, learn the simple editing tasks and keep the instructions handy.

Improve what's already working. If people visit but don't contact you, your message or trust is the likely problem. Change the headline, make the button clearer or add proof. If nobody visits at all, your problem is finding people, not the design.

Avoid the redesign trap. Business owners often grow bored of their site and want a new one, when their customers just want a clear answer. Small monthly improvements usually beat an expensive full redesign every two years.

The whole point of all this is more trust and more customers. Keep watching those two things, and your website will keep paying its way.`,
    },
  ],

  "ebook-ai-sme": [
    {
      title: "1. AI is an intern, not a CEO",
      body: `Tools like ChatGPT, Claude and Gemini can save a small business owner hours every week. They can also confidently make things up. The easiest way to use them well is to treat them like a very fast, very willing intern who has read a lot but doesn't know your business.

A good intern can draft a message, summarise a document, suggest 20 ideas and format your notes into a table. A good intern can't decide your strategy, sign off a legal contract or be trusted without you checking the work. Keep this in mind and you'll get the benefit without the embarrassment.

AI is good at first drafts, rewriting, summarising, brainstorming, turning rough notes into clean documents, explaining something in plain language and simple translation. It's weak at current facts, exact figures, local Nigerian details and anything it can't check. It can invent a law, a statistic or a source that sounds entirely real. People call these invented answers hallucinations, and they happen to every AI tool. So you must check facts.

Getting started takes minutes. Sign up for a free account with one of the main tools. Free plans are enough to begin; pay later only if you hit limits. Use the official websites and apps, because there are many fake AI apps that collect your data or take money.

Your first try. Copy this, and put in your own details:

"You're helping me run a small [type of business] in [town], Nigeria. A customer just asked why our [product] is more expensive than a competitor's. We use [reason] and offer [benefit]. Write a short, friendly WhatsApp reply, no more than 60 words."

Read the answer. If it's stiff, reply with "Make it warmer and simpler." You can have a back-and-forth, as though you're directing a staff member. This back-and-forth is the most important skill of all, and most people never use it. They ask once, get something average and give up.

Your task now: run this prompt and refine it twice. Save the final version if it's useful.`,
    },
    {
      title: "2. Five jobs AI does well for small businesses",
      body: `Don't try to use AI for everything. Begin with five jobs that take up a lot of an owner's time.

Job 1: Customer replies. Paste a difficult customer message and ask for three reply options: "Here's a complaint from a customer. Draft a calm reply that apologises, explains what we'll do and keeps them as a customer." You still read and send it yourself.

Job 2: Marketing content. "Give me 10 Instagram post ideas for a bakery in Enugu in December, with a one-line caption for each." Then choose the best and make them yours. It's a cure for staring at a blank screen.

Job 3: Your offer and pricing page. "Here are my services and prices. Rewrite this as a clear offer for busy parents. Include what they get and what happens next. Avoid big grammar."

Job 4: Standard procedures. Talk through how a job is done, type your rough notes, then ask: "Turn this into a simple step-by-step checklist for a new staff member." You'll finally have documented processes.

Job 5: Admin and documents. Summarise a long email or policy. Draft a job description, an appraisal form, meeting notes or a polite debt reminder. Convert messy notes into a table you can paste into Excel. Ask it to explain an Excel formula you don't understand.

Other useful jobs:

Preparing for a meeting: "What questions should I ask a supplier before signing a 12-month contract?"
Practising a tough conversation: "Play a customer who wants a 30% discount, and let me practise responding."
Learning quickly: "Explain VAT to me like I'm a shop owner, with an example in naira. I'll check with my accountant."

Measure the benefit. Choose one task you do weekly, note how long it takes now, and how long it takes with AI. If a two-hour job becomes 30 minutes with the same quality, keep it.

Your task now: choose two of these five jobs and try them today on real work from your business.`,
    },
    {
      title: "3. A prompt pattern that works",
      body: `A prompt is simply what you ask the tool. Weak prompts give weak answers. "Write an Instagram caption" produces something bland. You don't need to learn any tricks. Just give it what you'd give a new staff member.

Use this five-part pattern: Role, Context, Task, Format, Rules.

Role: who it should act as. "You're an experienced copywriter for Nigerian small businesses."

Context: the situation. "We're a laundry in Wuse, Abuja. Most customers are busy young professionals. We offer pickup and delivery within 24 hours."

Task: what you want. "Write three Instagram captions promoting our Saturday pickup."

Format: how it should look. "Each under 40 words, with a question at the end."

Rules: what to avoid. "Use simple English. No hashtags, no fake discounts and don't exaggerate."

Put it all together, and the output will be much closer to usable.

Give it examples. If you have a message you like, include it: "Here's how we usually talk to customers: [paste]. Match this tone." This does more than any description of tone.

Ask it to question you. "Before you write anything, ask me up to five questions you need answered." This is excellent when you aren't sure what to include.

Improve in steps. Rather than starting over, tell it what to change: "Shorter." "Less formal." "The second one is good. Give me three more like it." "Remove the part about discount."

Ask for options. "Give me five different headlines" beats "Give me a headline". You pick, and you often combine two.

Save what works. Keep a simple document called "My prompts". Each time a prompt works well, paste it in with spaces for details: "[product]", "[customer]". After a month, you'll have a library that saves hours. Create a "business profile" paragraph too: what you sell, where, who buys, your prices and your tone. Paste it at the start of new chats, or store it in the tool's custom instructions if it has them.

Your task now: write your business profile paragraph and save three prompts you can reuse.`,
    },
    {
      title: "4. Customer replies and content that don't sound fake",
      body: `People have started to spot AI writing. It's often too polished, too long and oddly excited: "We're thrilled to embark on this journey with you." In a Nigerian WhatsApp chat, that kind of line sounds strange. Your customers want to know a human cares.

Rules to keep it sounding like you:

Tell the tool to keep it short. Real messages are short. "Under 40 words" works well.

Give your own voice. Paste three real messages you've written and say "Match this style."

Cut the fillers. Remove words such as "delighted", "elevate", "seamless", "unlock" and "in today's fast-paced world". Nobody talks like that.

Add what AI can't know. Your customer's name, what happened last time, today's stock, the real delivery time, the story behind your product.

Use your local reality. Mention the area, the rain, the school resumption, the salary week or the Christmas rush. Take care with Pidgin or local languages: AI may get them wrong, and you know your customers better. Write those parts yourself.

Read it aloud before sending. If you wouldn't say it to the customer's face, change it.

Never let AI answer customers unsupervised at the start. An automated reply can promise a discount you never offered or state a wrong price. If you set up a chatbot later, limit it to set questions, give it your real price list and offer a way to reach a human.

Be honest. Don't use AI to invent testimonials, fake reviews, made-up results or a fake "doctor" recommending your product. Besides being wrong, it can land you in trouble with consumer protection rules and with platforms. Be careful with AI-generated photos too. If you sell food, clothes, or property, show the real thing. Customers feel cheated when the item doesn't match the picture.

A good weekly content routine: on Monday, ask for 10 post ideas. Pick three. Add a real photo and a real detail to each. Schedule or post them. That's about 30 minutes for a week of content, and the ideas are from AI but the substance is yours.

Your task now: take one AI-written caption and rewrite it with three real details only you would know.`,
    },
    {
      title: "5. Documents, spreadsheets and research",
      body: `Many owners stop at marketing, but AI can save you even more time in the back office.

Documents. Paste your notes, and ask: "Turn these into a clear one-page proposal for a client" or "Rewrite this staff warning to be firm but respectful." Ask for a meeting agenda, minutes from rough notes, or an email to your landlord negotiating rent. For contracts and HR letters, AI can give you a draft, but get a lawyer or an HR professional to review anything important, as the law it references might be wrong or from another country.

Spreadsheets. You don't need to know formulas. Describe your sheet: "In Excel, column A has product names, B has quantity sold and C has unit price. I want the total sales in column D and a monthly total at the bottom. Give me the formulas and tell me where to put them." Paste an error message and ask what's wrong. You can also ask for a template: "Design a simple stock-tracking sheet for a provisions store, listing the columns and formulas."

If your tool lets you upload a file, you can ask it to find patterns: "Which products sold the most?" Check the sums independently on anything you're going to rely on. AI can make arithmetic mistakes, and it may misread a messy file.

Research. AI can help you start: "List questions I should research before opening a pharmacy in Nigeria." But always verify. Ask for sources, then click to confirm they exist and say what's claimed. For laws, fees and government programmes, check the official source, such as CAC or the tax authority, since rules change and AI's knowledge may be out of date.

Translating. It can produce a first draft in Yoruba, Hausa, Igbo or French, but ask a fluent speaker to check before you print anything.

Learning. Ask it to teach you: "Explain cash flow with an example of a shop in Kano. Then quiz me with three questions." It's a patient teacher that never tires of your questions.

Summaries. Paste a long report or policy document, and ask for "the five main points and what I need to do." Then scan the original for anything important.

Your task now: give AI one boring document job from your to-do list this week.`,
    },
    {
      title: "6. What not to trust AI with",
      body: `The fastest way to get hurt by AI is to trust it too much. These limits protect your money, your customers and your name.

Don't paste sensitive information. Your customers' personal data, staff records, bank details, passwords and confidential contracts should not go into public AI tools. Your input might be stored, reviewed or, depending on your settings, used for training. Read the privacy settings of the tool you use, and turn off training on your chats where possible. Replace names and numbers with placeholders such as "Customer A" before you paste. Under the Nigeria Data Protection Act, you're responsible for how you handle people's data.

Don't trust facts without checking. This goes especially for prices, tax rates, legal requirements, medical information, statistics and quotes. Lawyers abroad have been sanctioned for submitting court papers with cases invented by AI. If it matters, verify it at the source.

Don't let it make final decisions. It doesn't know your finances, your customers or your town. Ask for options and for the arguments on each side, then decide for yourself. You also shouldn't use it to decide who to hire or fire on its own, since it can carry biases, and you would be the one responsible.

Don't use it for legal, medical or tax advice that you'll act on without a professional. It can help you prepare questions and understand terms, which saves paid consultation time.

Don't assume it's up to date. Some tools have search, others don't. Ask what date its information runs to.

Be careful with AI-made images, logos and text if ownership matters. Copyright for AI-generated content is still unsettled in many countries. Check before building your brand on it.

Watch out for scams using the AI label: "AI trading bots" promising daily returns, fake AI apps, and voice-cloned calls pretending to be family or the boss. If someone calls with an urgent request for money, call them back on the number you know.

A simple checklist before you use any AI output: Is it true? Is it fair? Would I sign my name to it? Does it reveal anything private?

Your task now: set your privacy settings and write a one-paragraph AI rule for your staff, covering what they can and can't paste.`,
    },
    {
      title: "7. Bringing your staff along",
      body: `AI won't help much if only the owner uses it. It also won't help if staff use it secretly and carelessly. A little direction goes a long way.

Be clear about why. Your team may worry that AI will take their jobs. Tell them straight what you're doing: the goal is to save time on boring tasks so they can focus on customers, and you'll keep checking everything. Be honest if roles will change.

Start with one volunteer. Choose someone curious. Ask them to try AI on one regular task for two weeks and to report what worked. A staff member's real example will convince others more than your speech will.

Train on real work. Run a one-hour session where everybody brings a real task: an email, a customer reply, a report or a roster. Help them through the prompt pattern. Share successful prompts in a shared document.

Write down simple rules:

What's allowed: drafts, summaries, ideas, learning and formatting.
What isn't: pasting customer data, financial records or passwords, or sending anything without reading it.
Who's responsible: the person who sends it. "The AI wrote it" is not an excuse.
What to do when unsure: ask.

Build in checking. For anything sent outside your business, a human reads it. For figures, someone recalculates. For prices, check your real list.

Measure. Ask each month: "What did AI save you this month? What went wrong?" Share the mistakes without blaming anybody, so others learn.

Decide on tools. If several people use it, consider a business plan from a major provider. They typically offer stronger privacy controls. Compare the cost with the time saved. Avoid signing up to many small AI apps, since each has its own subscription, login and data risk. One main tool used well is better than ten barely touched.

Don't cut quality to save time. If customers notice that replies feel cold or have mistakes, slow down. Keep human contact where it counts, such as complaints, big clients and sensitive matters.

Your task now: pick your volunteer and one task. Agree a date to review in two weeks.`,
    },
    {
      title: "8. Your 14-day AI adoption plan",
      body: `Use this plan to turn AI into a habit. You need about 20 minutes a day.

Day 1: Choose one tool and set up an account on the official site. Set your privacy settings.

Day 2: Write your business profile paragraph: what you sell, where, who buys, your prices and your tone.

Day 3: Use the five-part prompt pattern to draft three customer replies. Change them to sound like you.

Day 4: Ask for 10 social media ideas. Post one, with a real photo.

Day 5: Paste your service list and ask for it to be rewritten clearly. Compare with your current words.

Day 6: Have it turn your notes on one task into a step-by-step checklist. Give it to a staff member and see where they get stuck.

Day 7: Review the week. What saved time? Save your best three prompts.

Day 8: Ask it to create a spreadsheet template you need, with formulas. Test the sums with real figures.

Day 9: Prepare for an upcoming negotiation or a tough conversation by practising with it.

Day 10: Summarise a long document and write down what you need to do. Then check it against the original.

Day 11: Run a research question, and check each claim with the original source. Note what it got wrong. This teaches you how much to trust it.

Day 12: Write your staff AI rules.

Day 13: Share one good prompt with your team, and set up a shared prompt document.

Day 14: Measure. Pick three regular tasks. How long did they take before, and how long now? Decide which you'll continue.

After 14 days, make it part of your week. On Monday, plan content. When a customer asks something new, ask AI to help draft a reply, and save the final version. At month end, ask for help with a summary of your numbers.

Stay curious but sceptical. New tools come out all the time. You don't need to chase each one. Ask a simple question: does this save time or earn money, and can I check its work? If yes, try it. If not, leave it.

The owners who gain most from AI aren't the most technical. They're the ones who know their business well enough to ask clearly and to notice when the answer is wrong. You already have that advantage.`,
    },
  ],

  "ebook-one-page-marketing": [
    {
      title: "1. Strategy is choices, not slides",
      body: `Many small businesses have no marketing plan at all, and a few have a 40-page document no one reads. What you need is a single page you can stick to the wall: who you're selling to, what you promise, where you'll reach them and what you'll do each week.

A plan is really a list of decisions. Saying "we'll focus on working mothers in Ikeja this quarter" means saying no to everybody else for now. That's uncomfortable, and it's why most people avoid planning. They post anything, boost a post when sales are slow and jump to whichever platform someone told them about. The result is lots of effort and little to show for it.

Here's your one-page plan. By the end of this book you'll have filled in every line.

WHO: The specific customer I'll focus on is ___.
PROBLEM: The problem they'll pay to solve is ___.
PROMISE: I help them ___ by ___.
PROOF: They should trust me because ___.
OFFER: My main offer and price is ___.
CHANNELS: I'll reach them through ___ and ___.
NEXT STEP: I want them to ___.
WEEKLY ACTIONS: Every week I'll ___, ___ and ___.
SCOREBOARD: I'll count ___ each Friday.
TARGET: In 90 days, I want ___.

That's it. Simple doesn't mean easy, though, since each line needs real thought.

Before you start, gather facts. List your last 20 customers: who they were, how they found you, what they bought and how much they paid. Which three do you wish you had more of? Businesses are often surprised to find that one type of customer or one service brings in most of their money, while they spend their time marketing something else.

Your task now: write out your last 20 sales and circle your best customers. You'll use this list in the next chapter.`,
    },
    {
      title: "2. Who exactly pays you",
      body: `"Everyone" isn't a target market. "Anyone who needs clothes" gives you nothing to say. "Young professional women in Abuja who need work clothes that fit and don't have time for market runs" gives you a message, a place to find them and a reason for them to choose you.

Focusing doesn't mean rejecting others. If someone else wants to buy, sell to them. Focus only decides where you spend your limited marketing effort and whom your words speak to.

Pick your focus customer using these questions:

Who's already buying from you and happy? Start there, as you already understand them.
Who has the money, and can pay your price without pain?
Who has an urgent problem, as opposed to one they could ignore?
Who can you actually reach? Perhaps they're in a group, an area or an association you can get to.
Who do you enjoy serving? You'll be doing it for years.

Now describe your customer in a few lines. Be specific, and use a real person if you can.

"Amina, 34, manages a school in Kaduna. She's responsible for fees and staff, and she's always stressed at resumption. She checks her phone at night. She's been let down by vendors. She wants something that works and won't embarrass her in front of the proprietor."

Now talk to five real customers. It's the most valuable research you can do, and it's free. Ask:

What was going on when you first looked for this?
What had you already tried?
What nearly stopped you from buying?
What changed after you bought?
What would you tell a friend about us?

Write down their exact words, because they will become your marketing. If a customer says "I was tired of explaining my fabric to tailors who don't listen", that line is better than anything you could invent.

You can have more than one kind of customer, but give each its own plan. For the next 90 days, choose one.

Your task now: write your WHO line, and speak with at least three customers this week.`,
    },
    {
      title: "3. A promise in one sentence",
      body: `Most small business marketing says nothing. "Quality service at affordable prices." "We are the best in the business." "Your satisfaction is our priority." Any business could say these, so nobody hears them.

Your promise should be specific enough that a competitor could not just copy it without changing something real. Use this form:

"I help [who] get [result] by [how], without [the thing they hate]."

Examples:

"We help busy Lagos families get home-cooked meals delivered weekly, without spending Sunday in the kitchen."

"I help small clinics fill empty appointment slots with a simple website and WhatsApp booking, without learning any tech."

"We repair laptops in Jos within 48 hours, and you see the price before we start."

Test yours with three questions:

Is it clear to a stranger? Read it to somebody outside your trade.
Is it about them or about you? "Founded in 2010" is about you. "Same-day delivery" is about them.
Can you deliver it every time? Don't promise what you can't keep.

Find what makes you different. Why do people choose you and not somebody else? Often it's a small thing: you open on Sundays, you always call back, you use a fixed price, you speak Hausa, you serve one industry only, or you give a 30-day guarantee. Your customers' words from chapter 2 will help. If there's truly nothing different about you, that's useful to know, and you could create something, like a guarantee or a faster turnaround.

Add your proof. People have heard many promises, particularly in Nigeria where scams have made buyers cautious. List your proof: number of customers served (only if true), reviews, before and after photos, CAC registration, known clients, years in business, a guarantee or a money-back condition. Choose your strongest three.

Use your promise everywhere: your Instagram bio, WhatsApp description, website headline, signboard, flyers and how you introduce yourself at events.

Your task now: write three versions of your promise and test them on a real customer. Ask which one makes them want to know more.`,
    },
    {
      title: "4. An offer people can say yes to",
      body: `A clear promise gets attention, and a clear offer gets the sale. An offer is exactly what someone gets, what it costs, and what to do next. "We do catering" isn't an offer. "Small-chops for up to 50 guests, delivered and set up in Abuja, ₦120,000, with 50% to book" is an offer.

Make the first step easy. For expensive or scary purchases, offer something smaller first. A gym could offer a ₦5,000 one-week pass, a consultant a ₦20,000 review session, and a caterer a tasting for people planning a wedding. Once people have tried you, it's much easier to buy more.

Reduce risk where you can. Fear of being cheated stops many sales. Think of a guarantee you can actually keep: "Free repair if it fails within 30 days", "Pay after delivery within Lagos", "Full refund if we miss your date." Then state it clearly, along with the conditions.

Package and price clearly. Three options often work: basic, standard and premium. Explain who each is for. A clear price saves everyone time, and it builds trust. Where prices vary, give a range or a "from" price.

Create a real reason to act now. Limits can be honest: "We only take 10 orders a week", "Christmas orders close on 15 December", or "Price rises on 1 March because our supplier has raised theirs." Never invent a false deadline. People notice when "ends today" runs for months, and you lose trust.

Check your margins before any discount. A 20% discount on a product with a 30% margin wipes out two-thirds of your profit. Our free profit margin and discount calculators will show you. Often, adding something useful beats cutting the price, for example free delivery, an extra item, or a faster service.

Write your offer in one short paragraph, then read it as a customer. Do you know exactly what you get? Do you know what it costs? Do you know what to do next?

Example: "The Resumption Pack: 3 uniforms, sewn to measure and delivered to your door in Jos within 7 days, for ₦45,000. Pay ₦20,000 to start. Free alterations within 2 weeks. WhatsApp us 'PACK' to book your measuring slot."

Your task now: write your main offer in that format.`,
    },
    {
      title: "5. Pick two channels at most",
      body: `Small businesses tend to spread themselves thin: a bit of Facebook, some TikTok, a newsletter and a flyer. With limited time and money, you can't do everything well. Choose two channels for the next 90 days and do them properly.

Think about where your customer goes when they have the problem you solve.

If they search for it, such as a plumber, a dentist or a lawyer: start with Google Business Profile and a simple website.

If they discover through pictures or videos, such as fashion, food, beauty or decor: choose Instagram or TikTok, plus WhatsApp to close.

If you sell to businesses, such as B2B services or software: LinkedIn, direct outreach, and referrals.

If you serve a local community, such as a school, a pharmacy, a laundry or a restaurant: flyers in the right places, local WhatsApp groups (used respectfully), Google Maps, signage, and partnerships with nearby businesses.

If your customers already trust someone: referrals and partners. Who already has your customers? A wedding photographer knows brides. A real estate agent knows new homeowners. Refer business to each other.

If your best customers came through word of mouth, build on it. Ask people to refer others and give them an easy way to do that: a short message they can forward, or a reward for both of them, within the rules of your trade.

Your first channel gets attention, and your second often closes. WhatsApp is usually one of the two in Nigeria because that's where the sale happens.

What about paid ads? Treat them as a way to speed up something that already works. Don't run ads to fix an unclear offer. If you do test, start small, send people to WhatsApp or a clear page, and track enquiries, not likes. Our Digital Marketing for SMEs book goes deeper into this.

Say no out loud. Write your "not now" list: "Not this quarter: TikTok, newsletter, YouTube." This protects you from the panic of seeing a competitor on another platform.

Your task now: fill in your CHANNELS line and write your "not now" list.`,
    },
    {
      title: "6. Weekly actions you'll actually do",
      body: `A plan you don't act on is only a nice piece of paper. Turn your channels into a small list of weekly actions you can keep up on your worst week, not just your best.

Choose three to five actions and write them with numbers. Here are examples for different businesses.

A tailor using Instagram and WhatsApp:

Post three finished pieces, with permission, and prices.
Reply to all enquiries within an hour.
Follow up with everyone who asked but didn't buy.
Message five past customers about upcoming events.

A B2B consultant using LinkedIn and direct outreach:

Post one useful insight on LinkedIn.
Send 10 personal messages to potential clients.
Book two conversations.
Ask one past client for a referral.

A local clinic using Google Maps and referrals:

Add one post and two photos to Google.
Ask every happy patient for a review.
Visit one nearby school or company to introduce your service.
Follow up on missed appointments.

Protect the time. Block out two sessions in your calendar. For example, Monday 8am to 9:30am to create the week's content and Friday 4pm for follow-up and counting. If it isn't scheduled, it will lose to urgent tasks.

Batch your content. Take photos and write captions all at once. It's much faster than thinking of something every day. Our AI book shows how to get ideas quickly.

Have a low-energy version. For a really busy week, what is the minimum? Perhaps one post and all your follow-ups. Doing the minimum keeps the habit alive. Stopping completely makes restarting hard.

Follow up. It's the highest-return action on the list, and it's the one most people skip. Many sales come after a second or third contact. Keep a simple list of everyone who has enquired, the date and the next step.

Keep it consistent for long enough to learn. Marketing rarely works in a week. Commit to your plan for 90 days unless something is clearly failing. Then you'll have real evidence to decide with, instead of just a feeling.

Your task now: write your weekly actions with numbers and put the two time blocks in your calendar.`,
    },
    {
      title: "7. The weekly scoreboard",
      body: `What you count determines what you pay attention to. Likes and followers feel good, but they don't pay rent. A small scoreboard, filled in every Friday, tells you whether marketing is working.

Track these five numbers each week:

Reach: how many people saw you. Rough numbers are fine. Include post views, Google profile views and flyers shared.
Enquiries: how many people actually contacted you. This is the most important marketing number.
Conversations or quotes: how many serious discussions took place.
Sales: how many people paid.
Money in: how much you received.

You can also work out two simple percentages:

Enquiries to sales: 40 enquiries and 10 sales is 25%.
Average sale: ₦500,000 from 10 sales is ₦50,000.

Keep it on a sheet of paper or a basic spreadsheet. It should take under 10 minutes. To know where your sales came from, ask each new customer "How did you hear about us?" and write it down. Add a column for this. After a month, you'll see which channel really works.

How to read it:

Low reach, low enquiries: not enough people know you. Do more of your outreach.
High reach, low enquiries: your message or offer isn't clear, or you're reaching the wrong people. Change your promise or your audience.
Many enquiries, few sales: the problem is in the conversation. It may be pricing, slow replies, poor follow-up or lack of trust.
Many sales, little money: your price is too low, or your costs are too high. Look at your margins.

Change one thing at a time. If you change your price, your platform and your offer in the same week, you won't know which one helped.

Be careful with numbers from a single week. A slow week after salary period may mean nothing. Look at four weeks together.

Finally, compare with your target. If you want ₦1,000,000 a month from an average sale of ₦50,000, you need 20 sales. With a 25% conversion rate, that means 80 enquiries a month, or about 20 a week. Now your marketing has a clear target. You can work out how much reach you need too.

Your task now: draw your scoreboard and fill in last week's numbers as best you can.`,
    },
    {
      title: "8. Fill in your page and run 90 days",
      body: `Now it's time to put it all on one page. Here's a finished example you can adapt.

WHO: Busy working parents in Wuse and Maitama, Abuja, with children in private primary schools.
PROBLEM: They have no time to cook healthy lunches, and their children hate school food.
PROMISE: We deliver fresh, home-style school lunches that children actually eat, so mornings are calmer.
PROOF: 40 families served, Google reviews, NAFDAC-compliant kitchen (only claim what's true for you), photos of the kitchen.
OFFER: 5-day lunch plan for ₦25,000 a week. First week money back if your child won't eat it.
CHANNELS: Parents' WhatsApp groups via school partners and Instagram. WhatsApp to close.
NEXT STEP: Send "LUNCH" on WhatsApp.
WEEKLY ACTIONS: 3 Instagram posts. Contact 5 schools or parent reps. Follow up all enquiries. Ask 2 happy parents to refer a friend.
SCOREBOARD: Enquiries, trials, weekly plans, money in. Counted on Fridays.
TARGET: 50 families on weekly plans in 90 days.

Now run it.

Week 1: Finish your page. Fix your bios, your WhatsApp profile and your Google listing, so they match your promise. Write your offer and scripts. Set up your scoreboard.

Weeks 2 to 4: Do your weekly actions. Don't change the plan. Collect questions and objections as they arrive.

Week 5: Review your first month. Which channel brings enquiries? What do people ask? Where do they drop off? Change one thing.

Weeks 6 to 8: Keep going with your change. Ask your happy customers for testimonials and referrals.

Week 9: Review again. Double down on what works, and cut what doesn't.

Weeks 10 to 12: Push. Add a limited offer or a partnership. In week 12, score your 90 days: did you hit your target? What did you learn? Write a new page for the next 90 days.

Stick your page where you'll see it every day. When a new idea or a shiny platform comes along, look at your page and ask: does this help my WHO, and is it one of my channels? If not, put it on the "not now" list.

Marketing is rarely about a single brilliant idea. It's mostly about making clear choices and repeating simple actions for longer than others are willing to. One page and 90 days of steady effort will beat most competitors, simply because most of them never stick with anything.`,
    },
  ],
};
