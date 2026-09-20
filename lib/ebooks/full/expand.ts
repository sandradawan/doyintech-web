import type { EbookChapter } from "@/lib/ebooks";
import { EBOOK_AFFILIATE_MARKETING } from "./books/ebook-affiliate-marketing";
import { EBOOK_AI_SME } from "./books/ebook-ai-sme";
import { EBOOK_CASH_FIRST } from "./books/ebook-cash-first";
import { EBOOK_CULTURE_COMMUNITY } from "./books/ebook-culture-community";
import { EBOOK_DIGITAL_MARKETING } from "./books/ebook-digital-marketing";
import { EBOOK_EDUCATION_LIFELONG } from "./books/ebook-education-lifelong";
import { EBOOK_FIRST_CLIENTS } from "./books/ebook-first-clients";
import { EBOOK_FITNESS_BUSY } from "./books/ebook-fitness-busy";
import { EBOOK_FOUNDER_HABITS } from "./books/ebook-founder-habits";
import { EBOOK_FOUNDER_WEBSITE } from "./books/ebook-founder-website";
import { EBOOK_GBP } from "./books/ebook-gbp";
import { EBOOK_HOME_FOOD_BUDGET } from "./books/ebook-home-food-budget";
import { EBOOK_IG_TIKTOK_LOCAL } from "./books/ebook-ig-tiktok-local";
import { EBOOK_LAW_OF_MONEY_WEALTH } from "./books/ebook-law-of-money-wealth";
import { EBOOK_NEGOTIATE_CLOSE } from "./books/ebook-negotiate-close";
import { EBOOK_ONE_PAGE_MARKETING } from "./books/ebook-one-page-marketing";
import { EBOOK_PERSONAL_FINANCE_NG } from "./books/ebook-personal-finance-ng";
import { EBOOK_PRICE_WEB_NG } from "./books/ebook-price-web-ng";
import { EBOOK_PROMPT_ENGINEERING } from "./books/ebook-prompt-engineering";
import { EBOOK_SME_SECURITY } from "./books/ebook-sme-security";
import { EBOOK_SMM } from "./books/ebook-smm";
import { EBOOK_STUDENT_PRODUCTIVITY } from "./books/ebook-student-productivity";
import { EBOOK_VIRTUAL_ASSISTANT } from "./books/ebook-virtual-assistant";
import { EBOOK_WEALTH_HABITS } from "./books/ebook-wealth-habits";
import { EBOOK_WHATSAPP_SME } from "./books/ebook-whatsapp-sme";

const teaching: Record<string, EbookChapter[]> = {
  "ebook-affiliate-marketing": EBOOK_AFFILIATE_MARKETING,
  "ebook-ai-sme": EBOOK_AI_SME,
  "ebook-cash-first": EBOOK_CASH_FIRST,
  "ebook-culture-community": EBOOK_CULTURE_COMMUNITY,
  "ebook-digital-marketing": EBOOK_DIGITAL_MARKETING,
  "ebook-education-lifelong": EBOOK_EDUCATION_LIFELONG,
  "ebook-first-clients": EBOOK_FIRST_CLIENTS,
  "ebook-fitness-busy": EBOOK_FITNESS_BUSY,
  "ebook-founder-habits": EBOOK_FOUNDER_HABITS,
  "ebook-founder-website": EBOOK_FOUNDER_WEBSITE,
  "ebook-gbp": EBOOK_GBP,
  "ebook-home-food-budget": EBOOK_HOME_FOOD_BUDGET,
  "ebook-ig-tiktok-local": EBOOK_IG_TIKTOK_LOCAL,
  "ebook-law-of-money-wealth": EBOOK_LAW_OF_MONEY_WEALTH,
  "ebook-negotiate-close": EBOOK_NEGOTIATE_CLOSE,
  "ebook-one-page-marketing": EBOOK_ONE_PAGE_MARKETING,
  "ebook-personal-finance-ng": EBOOK_PERSONAL_FINANCE_NG,
  "ebook-price-web-ng": EBOOK_PRICE_WEB_NG,
  "ebook-prompt-engineering": EBOOK_PROMPT_ENGINEERING,
  "ebook-sme-security": EBOOK_SME_SECURITY,
  "ebook-smm": EBOOK_SMM,
  "ebook-student-productivity": EBOOK_STUDENT_PRODUCTIVITY,
  "ebook-virtual-assistant": EBOOK_VIRTUAL_ASSISTANT,
  "ebook-wealth-habits": EBOOK_WEALTH_HABITS,
  "ebook-whatsapp-sme": EBOOK_WHATSAPP_SME,
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
