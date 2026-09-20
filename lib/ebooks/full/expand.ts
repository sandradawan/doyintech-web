import type { EbookChapter } from "@/lib/ebooks";

import ebook_affiliate_marketing from "./u/ebook-affiliate-marketing.json";
import ebook_ai_sme from "./u/ebook-ai-sme.json";
import ebook_cash_first from "./u/ebook-cash-first.json";
import ebook_culture_community from "./u/ebook-culture-community.json";
import ebook_digital_marketing from "./u/ebook-digital-marketing.json";
import ebook_education_lifelong from "./u/ebook-education-lifelong.json";
import ebook_first_clients from "./u/ebook-first-clients.json";
import ebook_fitness_busy from "./u/ebook-fitness-busy.json";
import ebook_founder_habits from "./u/ebook-founder-habits.json";
import ebook_founder_website from "./u/ebook-founder-website.json";
import ebook_gbp from "./u/ebook-gbp.json";
import ebook_home_food_budget from "./u/ebook-home-food-budget.json";
import ebook_ig_tiktok_local from "./u/ebook-ig-tiktok-local.json";
import ebook_law_of_money_wealth from "./u/ebook-law-of-money-wealth.json";
import ebook_negotiate_close from "./u/ebook-negotiate-close.json";
import ebook_one_page_marketing from "./u/ebook-one-page-marketing.json";
import ebook_personal_finance_ng from "./u/ebook-personal-finance-ng.json";
import ebook_price_web_ng from "./u/ebook-price-web-ng.json";
import ebook_prompt_engineering from "./u/ebook-prompt-engineering.json";
import ebook_sme_security from "./u/ebook-sme-security.json";
import ebook_smm from "./u/ebook-smm.json";
import ebook_student_productivity from "./u/ebook-student-productivity.json";
import ebook_virtual_assistant from "./u/ebook-virtual-assistant.json";
import ebook_wealth_habits from "./u/ebook-wealth-habits.json";
import ebook_whatsapp_sme from "./u/ebook-whatsapp-sme.json";

const teaching: Record<string, EbookChapter[]> = {
  "ebook-affiliate-marketing": ebook_affiliate_marketing as EbookChapter[],
  "ebook-ai-sme": ebook_ai_sme as EbookChapter[],
  "ebook-cash-first": ebook_cash_first as EbookChapter[],
  "ebook-culture-community": ebook_culture_community as EbookChapter[],
  "ebook-digital-marketing": ebook_digital_marketing as EbookChapter[],
  "ebook-education-lifelong": ebook_education_lifelong as EbookChapter[],
  "ebook-first-clients": ebook_first_clients as EbookChapter[],
  "ebook-fitness-busy": ebook_fitness_busy as EbookChapter[],
  "ebook-founder-habits": ebook_founder_habits as EbookChapter[],
  "ebook-founder-website": ebook_founder_website as EbookChapter[],
  "ebook-gbp": ebook_gbp as EbookChapter[],
  "ebook-home-food-budget": ebook_home_food_budget as EbookChapter[],
  "ebook-ig-tiktok-local": ebook_ig_tiktok_local as EbookChapter[],
  "ebook-law-of-money-wealth": ebook_law_of_money_wealth as EbookChapter[],
  "ebook-negotiate-close": ebook_negotiate_close as EbookChapter[],
  "ebook-one-page-marketing": ebook_one_page_marketing as EbookChapter[],
  "ebook-personal-finance-ng": ebook_personal_finance_ng as EbookChapter[],
  "ebook-price-web-ng": ebook_price_web_ng as EbookChapter[],
  "ebook-prompt-engineering": ebook_prompt_engineering as EbookChapter[],
  "ebook-sme-security": ebook_sme_security as EbookChapter[],
  "ebook-smm": ebook_smm as EbookChapter[],
  "ebook-student-productivity": ebook_student_productivity as EbookChapter[],
  "ebook-virtual-assistant": ebook_virtual_assistant as EbookChapter[],
  "ebook-wealth-habits": ebook_wealth_habits as EbookChapter[],
  "ebook-whatsapp-sme": ebook_whatsapp_sme as EbookChapter[],
};

const cache = new Map<string, EbookChapter[]>();
export function getFullChapters(id: string): EbookChapter[] | undefined {
  if (cache.has(id)) return cache.get(id);
  const rows = teaching[id];
  if (!rows?.length) return undefined;
  cache.set(id, rows);
  return rows;
}
export function wordCountForBook(id: string): number {
  const ch = getFullChapters(id);
  if (!ch) return 0;
  return ch.reduce((n, c) => n + c.body.split(/\s+/).length, 0);
}
