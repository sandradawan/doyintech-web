/**
 * Title-aligned ebook chapters — unique content per book title.
 */
import type { EbookChapter } from "@/lib/ebooks";
import ebook_affiliate_marketing from "./by-book/ebook-affiliate-marketing.json";
import ebook_ai_sme from "./by-book/ebook-ai-sme.json";
import ebook_cash_first from "./by-book/ebook-cash-first.json";
import ebook_culture_community from "./by-book/ebook-culture-community.json";
import ebook_digital_marketing from "./by-book/ebook-digital-marketing.json";
import ebook_education_lifelong from "./by-book/ebook-education-lifelong.json";
import ebook_first_clients from "./by-book/ebook-first-clients.json";
import ebook_fitness_busy from "./by-book/ebook-fitness-busy.json";
import ebook_founder_habits from "./by-book/ebook-founder-habits.json";
import ebook_founder_website from "./by-book/ebook-founder-website.json";
import ebook_gbp from "./by-book/ebook-gbp.json";
import ebook_home_food_budget from "./by-book/ebook-home-food-budget.json";
import ebook_ig_tiktok_local from "./by-book/ebook-ig-tiktok-local.json";
import ebook_law_of_money_wealth from "./by-book/ebook-law-of-money-wealth.json";
import ebook_negotiate_close from "./by-book/ebook-negotiate-close.json";
import ebook_one_page_marketing from "./by-book/ebook-one-page-marketing.json";
import ebook_personal_finance_ng from "./by-book/ebook-personal-finance-ng.json";
import ebook_price_web_ng from "./by-book/ebook-price-web-ng.json";
import ebook_prompt_engineering from "./by-book/ebook-prompt-engineering.json";
import ebook_sme_security from "./by-book/ebook-sme-security.json";
import ebook_smm from "./by-book/ebook-smm.json";
import ebook_student_productivity from "./by-book/ebook-student-productivity.json";
import ebook_virtual_assistant from "./by-book/ebook-virtual-assistant.json";
import ebook_wealth_habits from "./by-book/ebook-wealth-habits.json";
import ebook_whatsapp_sme from "./by-book/ebook-whatsapp-sme.json";

type TeachingBook = { title: string; body: string }[];

const teaching: Record<string, TeachingBook> = {
  "ebook-affiliate-marketing": ebook_affiliate_marketing as TeachingBook,
  "ebook-ai-sme": ebook_ai_sme as TeachingBook,
  "ebook-cash-first": ebook_cash_first as TeachingBook,
  "ebook-culture-community": ebook_culture_community as TeachingBook,
  "ebook-digital-marketing": ebook_digital_marketing as TeachingBook,
  "ebook-education-lifelong": ebook_education_lifelong as TeachingBook,
  "ebook-first-clients": ebook_first_clients as TeachingBook,
  "ebook-fitness-busy": ebook_fitness_busy as TeachingBook,
  "ebook-founder-habits": ebook_founder_habits as TeachingBook,
  "ebook-founder-website": ebook_founder_website as TeachingBook,
  "ebook-gbp": ebook_gbp as TeachingBook,
  "ebook-home-food-budget": ebook_home_food_budget as TeachingBook,
  "ebook-ig-tiktok-local": ebook_ig_tiktok_local as TeachingBook,
  "ebook-law-of-money-wealth": ebook_law_of_money_wealth as TeachingBook,
  "ebook-negotiate-close": ebook_negotiate_close as TeachingBook,
  "ebook-one-page-marketing": ebook_one_page_marketing as TeachingBook,
  "ebook-personal-finance-ng": ebook_personal_finance_ng as TeachingBook,
  "ebook-price-web-ng": ebook_price_web_ng as TeachingBook,
  "ebook-prompt-engineering": ebook_prompt_engineering as TeachingBook,
  "ebook-sme-security": ebook_sme_security as TeachingBook,
  "ebook-smm": ebook_smm as TeachingBook,
  "ebook-student-productivity": ebook_student_productivity as TeachingBook,
  "ebook-virtual-assistant": ebook_virtual_assistant as TeachingBook,
  "ebook-wealth-habits": ebook_wealth_habits as TeachingBook,
  "ebook-whatsapp-sme": ebook_whatsapp_sme as TeachingBook,
};

const cache = new Map<string, EbookChapter[]>();

export function getFullChapters(id: string): EbookChapter[] | undefined {
  if (cache.has(id)) return cache.get(id);
  const rows = teaching[id];
  if (!rows?.length) return undefined;
  const chapters: EbookChapter[] = rows.map((row) => ({
    title: row.title,
    body: row.body,
  }));
  cache.set(id, chapters);
  return chapters;
}

export function wordCountForBook(id: string): number {
  const ch = getFullChapters(id);
  if (!ch) return 0;
  return ch.reduce((n, c) => n + c.body.split(/\s+/).length, 0);
}
