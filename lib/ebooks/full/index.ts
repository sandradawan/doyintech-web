import type { EbookChapter } from "@/lib/ebooks";

import ebook_affiliate_marketing from "./data/ebook-affiliate-marketing.json";
import ebook_ai_sme from "./data/ebook-ai-sme.json";
import ebook_cash_first from "./data/ebook-cash-first.json";
import ebook_culture_community from "./data/ebook-culture-community.json";
import ebook_digital_marketing from "./data/ebook-digital-marketing.json";
import ebook_education_lifelong from "./data/ebook-education-lifelong.json";
import ebook_first_clients from "./data/ebook-first-clients.json";
import ebook_fitness_busy from "./data/ebook-fitness-busy.json";
import ebook_founder_habits from "./data/ebook-founder-habits.json";
import ebook_founder_website from "./data/ebook-founder-website.json";
import ebook_gbp from "./data/ebook-gbp.json";
import ebook_home_food_budget from "./data/ebook-home-food-budget.json";
import ebook_ig_tiktok_local from "./data/ebook-ig-tiktok-local.json";
import ebook_negotiate_close from "./data/ebook-negotiate-close.json";
import ebook_one_page_marketing from "./data/ebook-one-page-marketing.json";
import ebook_personal_finance_ng from "./data/ebook-personal-finance-ng.json";
import ebook_price_web_ng from "./data/ebook-price-web-ng.json";
import ebook_sme_security from "./data/ebook-sme-security.json";
import ebook_smm from "./data/ebook-smm.json";
import ebook_student_productivity from "./data/ebook-student-productivity.json";
import ebook_virtual_assistant from "./data/ebook-virtual-assistant.json";
import ebook_wealth_habits from "./data/ebook-wealth-habits.json";
import ebook_whatsapp_sme from "./data/ebook-whatsapp-sme.json";

export const FULL_BOOK_CHAPTERS: Record<string, EbookChapter[]> = {
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
  "ebook-negotiate-close": ebook_negotiate_close as EbookChapter[],
  "ebook-one-page-marketing": ebook_one_page_marketing as EbookChapter[],
  "ebook-personal-finance-ng": ebook_personal_finance_ng as EbookChapter[],
  "ebook-price-web-ng": ebook_price_web_ng as EbookChapter[],
  "ebook-sme-security": ebook_sme_security as EbookChapter[],
  "ebook-smm": ebook_smm as EbookChapter[],
  "ebook-student-productivity": ebook_student_productivity as EbookChapter[],
  "ebook-virtual-assistant": ebook_virtual_assistant as EbookChapter[],
  "ebook-wealth-habits": ebook_wealth_habits as EbookChapter[],
  "ebook-whatsapp-sme": ebook_whatsapp_sme as EbookChapter[],
};

export function getFullChapters(id: string): EbookChapter[] | undefined {
  return FULL_BOOK_CHAPTERS[id];
}
