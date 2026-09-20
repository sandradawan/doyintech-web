import type { EbookChapter } from "@/lib/ebooks";

import { EBOOK_WHATSAPP_SME_CHAPTERS } from "./ebook-whatsapp-sme";
import { EBOOK_FIRST_CLIENTS_CHAPTERS } from "./ebook-first-clients";
import { EBOOK_SME_SECURITY_CHAPTERS } from "./ebook-sme-security";
import { EBOOK_FOUNDER_WEBSITE_CHAPTERS } from "./ebook-founder-website";
import { EBOOK_AI_SME_CHAPTERS } from "./ebook-ai-sme";
import { EBOOK_ONE_PAGE_MARKETING_CHAPTERS } from "./ebook-one-page-marketing";
import { EBOOK_CASH_FIRST_CHAPTERS } from "./ebook-cash-first";
import { EBOOK_FOUNDER_HABITS_CHAPTERS } from "./ebook-founder-habits";
import { EBOOK_NEGOTIATE_CLOSE_CHAPTERS } from "./ebook-negotiate-close";
import { EBOOK_DIGITAL_MARKETING_CHAPTERS } from "./ebook-digital-marketing";
import { EBOOK_AFFILIATE_MARKETING_CHAPTERS } from "./ebook-affiliate-marketing";
import { EBOOK_SMM_CHAPTERS } from "./ebook-smm";
import { EBOOK_VIRTUAL_ASSISTANT_CHAPTERS } from "./ebook-virtual-assistant";
import { EBOOK_IG_TIKTOK_LOCAL_CHAPTERS } from "./ebook-ig-tiktok-local";
import { EBOOK_PRICE_WEB_NG_CHAPTERS } from "./ebook-price-web-ng";
import { EBOOK_GBP_CHAPTERS } from "./ebook-gbp";
import { EBOOK_PERSONAL_FINANCE_NG_CHAPTERS } from "./ebook-personal-finance-ng";
import { EBOOK_STUDENT_PRODUCTIVITY_CHAPTERS } from "./ebook-student-productivity";
import { EBOOK_FITNESS_BUSY_CHAPTERS } from "./ebook-fitness-busy";
import { EBOOK_HOME_FOOD_BUDGET_CHAPTERS } from "./ebook-home-food-budget";
import { EBOOK_CULTURE_COMMUNITY_CHAPTERS } from "./ebook-culture-community";
import { EBOOK_WEALTH_HABITS_CHAPTERS } from "./ebook-wealth-habits";
import { EBOOK_EDUCATION_LIFELONG_CHAPTERS } from "./ebook-education-lifelong";

export const FULL_BOOK_CHAPTERS: Record<string, EbookChapter[]> = {
  "ebook-whatsapp-sme": EBOOK_WHATSAPP_SME_CHAPTERS,
  "ebook-first-clients": EBOOK_FIRST_CLIENTS_CHAPTERS,
  "ebook-sme-security": EBOOK_SME_SECURITY_CHAPTERS,
  "ebook-founder-website": EBOOK_FOUNDER_WEBSITE_CHAPTERS,
  "ebook-ai-sme": EBOOK_AI_SME_CHAPTERS,
  "ebook-one-page-marketing": EBOOK_ONE_PAGE_MARKETING_CHAPTERS,
  "ebook-cash-first": EBOOK_CASH_FIRST_CHAPTERS,
  "ebook-founder-habits": EBOOK_FOUNDER_HABITS_CHAPTERS,
  "ebook-negotiate-close": EBOOK_NEGOTIATE_CLOSE_CHAPTERS,
  "ebook-digital-marketing": EBOOK_DIGITAL_MARKETING_CHAPTERS,
  "ebook-affiliate-marketing": EBOOK_AFFILIATE_MARKETING_CHAPTERS,
  "ebook-smm": EBOOK_SMM_CHAPTERS,
  "ebook-virtual-assistant": EBOOK_VIRTUAL_ASSISTANT_CHAPTERS,
  "ebook-ig-tiktok-local": EBOOK_IG_TIKTOK_LOCAL_CHAPTERS,
  "ebook-price-web-ng": EBOOK_PRICE_WEB_NG_CHAPTERS,
  "ebook-gbp": EBOOK_GBP_CHAPTERS,
  "ebook-personal-finance-ng": EBOOK_PERSONAL_FINANCE_NG_CHAPTERS,
  "ebook-student-productivity": EBOOK_STUDENT_PRODUCTIVITY_CHAPTERS,
  "ebook-fitness-busy": EBOOK_FITNESS_BUSY_CHAPTERS,
  "ebook-home-food-budget": EBOOK_HOME_FOOD_BUDGET_CHAPTERS,
  "ebook-culture-community": EBOOK_CULTURE_COMMUNITY_CHAPTERS,
  "ebook-wealth-habits": EBOOK_WEALTH_HABITS_CHAPTERS,
  "ebook-education-lifelong": EBOOK_EDUCATION_LIFELONG_CHAPTERS,
};

export function getFullChapters(id: string): EbookChapter[] | undefined {
  return FULL_BOOK_CHAPTERS[id];
}
