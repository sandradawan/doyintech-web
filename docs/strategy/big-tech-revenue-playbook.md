# How big tech makes money, and what DoyinTech should copy

_Researched October 2026 from company filings and earnings coverage (sources at the end)._

## 1. Where the money comes from

| Company | 2025 revenue | Main engines | The model underneath |
|---|---|---|---|
| Alphabet (Google) | ≈ $403B | Search ads (≈ $225B), YouTube ads + subscriptions (> $60B), Cloud (> $70B run rate), 325M+ paid subscriptions | **Paid placement in front of intent**, plus subscriptions and infrastructure |
| Amazon | ≈ $717B | Own store sales, third-party seller services, advertising (≈ $69B), subscriptions (≈ $45–50B), AWS (≈ $129B) | **Marketplace take rate + ads to sellers + Prime-style membership** |
| Meta (Facebook, Instagram) | ad-funded (≈ 97% ads) | Feed and Reels ads; Instagram > half of US ad revenue | **Sell attention to businesses** |
| TikTok | ≈ $32–33B ads (est.) | Ads, TikTok Shop commission, coins bought to send creators gifts | **Ads + shop commission + virtual currency** |
| Apple | ≈ $416B (FY25) | iPhone and devices; Services ≈ $109B (App Store commission, iCloud, Music, Apple Pay, gift cards) | **Hardware, then a high-margin services and store-credit layer on top** |
| Tesla | ≈ $95B | Cars; energy storage $12.8B (+27%); services $12.5B; regulatory credits (shrinking) | **Hardware plus recurring software and services** |

### Five patterns that repeat
1. **Paid placement / ads** (Google, Meta, TikTok, Amazon): businesses pay to be seen first by people already looking.
2. **Marketplace take rate** (Amazon, App Store, TikTok Shop): a small cut of every sale made through the platform.
3. **Subscriptions / membership** (YouTube Premium, Prime, iCloud, Google One): predictable monthly income.
4. **Store credit and virtual currency** (Apple and Amazon gift cards, TikTok coins): money is paid in before it is spent, and it can only be spent inside the ecosystem.
5. **Free, high-traffic utilities that feed the paid layer** (Search, Maps, Gmail): give away the tool people search for, then sell the upgrade.

## 2. What DoyinTech already has (and which pattern it is)

| Pattern | Already live |
|---|---|
| Marketplace take rate | DoyinTech Store: 1.5% per online payment on free shops, payment links |
| Subscriptions | Pro (₦5,000/mo), Care plans, Store plan |
| Free utilities → paid upgrade | Invoice/receipt, PAYE, tax checkers, branded invoice and payslip unlocks |
| Services | Fixed-price websites + add-ons, Report Studio, student projects |

**Gaps:** no paid placement (ads), no discovery surface where buyers browse many shops, and no store credit. The highest-demand free utility we have — the QR code generator — is a thin wrapper around a third-party API with no upgrade.

## 3. What to build, ranked by value for effort

| # | Build | Big-tech model copied | How it earns | Status |
|---|---|---|---|---|
| 1 | **QR Code Studio**: links, WhatsApp, Wi-Fi, contact cards, payment links; PNG/SVG download; branded upgrade with logo, colours and "Scan to order" frame | Google's free utility → paid layer | ₦1,500 branded unlock or Pro; brings search traffic that converts to websites and shops | Built in this release |
| 2 | **Shop directory + Sponsored listings**: `/shops` lets buyers browse shops by category and city; sellers pay to appear first with a "Sponsored" label | Amazon Sponsored Products / Google Ads | ₦2,000 for 7 days, ₦6,000 for 30 days; also grows the Store (more buyers → more sellers → more 1.5% fees) | Built in this release |
| 3 | **DoyinTech gift cards and credit (closed-loop)**: buy a code, gift it, redeem against any DoyinTech product, plan or service | Apple / Amazon gift cards, TikTok coins | Cash collected up front, breakage, gifting brings new customers | Next phase (see §4) |
| 4 | **Link-in-bio pages** for creators and sellers (TikTok/Instagram bio link) | Linktree on top of Instagram/TikTok | Free plan with badge; Pro removes badge, adds analytics | Later |
| 5 | **Domains, email and hosting resale** | AWS / Google Cloud | Margin on every domain and mailbox, renews yearly | Later; needs a registrar reseller account |

Not worth building now: our own ad network for other websites (no traffic scale yet), AI chat products that compete with free assistants, hardware.

## 4. Gift card system: design rules (next phase)

- **Closed-loop only.** Codes are redeemable only for DoyinTech's own products, plans and services; no cash-out, no transfers to sellers, no top-ups to spend elsewhere. Under the CBN's stored-value/prepaid card guidelines, open-loop prepaid value is issued by licensed deposit-taking institutions; keeping credit closed-loop is meant to stay outside that. **Confirm with a Nigerian fintech lawyer before launch.**
- **Fast:** buy with Paystack, code emailed instantly; redeem at checkout in one field; partial balances carry over.
- **Secure:** codes are random and long enough to make guessing hopeless; only a hash is stored; rate-limited redemption; every movement is written to a ledger, never a single editable balance.
- **Easy:** printable card PDF and WhatsApp-shareable link for gifting; balance check page; admin view of every card and ledger entry.

## Sources
- Alphabet Q4 2025 earnings release: https://s206.q4cdn.com/479360582/files/doc_financials/2025/q4/2025q4-alphabet-earnings-release.pdf
- Alphabet segment analysis: https://beancount.io/blog/2026/02/08/alphabet-q4-2025-earnings-analysis
- Amazon FY2025 annual report: https://www.sec.gov/Archives/edgar/data/1018724/000110465926041036/tm263815d4_ars.pdf
- How Amazon makes money: https://www.revenuememo.com/p/how-does-amazon-make-money
- Instagram share of Meta US ad revenue: https://www.emarketer.com/press-releases/instagram-will-make-up-more-than-half-of-metas-us-ad-revenues-in-2025
- TikTok ad revenue forecast: https://www.advanced-television.com/2025/03/05/forecast-tiktok-ad-revenue-to-top-32bn-in-2025/
- Apple services revenue: https://www.constellationr.com/index%2Ephp/insights/news/apples-annual-services-revenue-tops-109-billion
- Tesla FY2025 10-K: https://www.sec.gov/Archives/edgar/data/1318605/000162828026003952/tsla-20251231.htm
- CBN stored value / prepaid card guidelines (2012 circular): https://www.cbn.gov.ng/Out/2012/CCD/Circular%20iro%20Stored%20Value%20Prepaid%20card%20Issuance%20and%20Operations.pdf
