/**
 * Company tax under the Nigeria Tax Act 2025 (effective 1 January 2026).
 *
 * Small company (s.56): gross turnover ≤ ₦50m AND total fixed assets ≤ ₦250m, and not
 * providing professional services. Small companies pay 0% companies income tax, no
 * development levy and no capital gains tax. Other companies: 30% CIT plus a 4% development
 * levy on assessable profits. (The ₦100m turnover figure in some guides is from the draft
 * bill; the signed Act uses ₦50m.)
 *
 * Sources reviewed Oct 2026: EY tax alert on the signed Act, KPMG updates on the NTA, PwC Nigeria.
 * Planning estimate only; not tax advice.
 */

export const SMALL_TURNOVER_LIMIT = 50_000_000;
export const SMALL_FIXED_ASSETS_LIMIT = 250_000_000;
export const CIT_RATE = 0.3;
export const DEVELOPMENT_LEVY_RATE = 0.04;
export const VAT_RATE = 0.075;
/** Companies at or above this turnover fall under the 15% minimum effective tax rate rules. */
export const MIN_ETR_TURNOVER = 20_000_000_000;

export type CompanyInput = {
  turnover: number;
  fixedAssets: number;
  professionalServices: boolean;
  /** Assessable profit, for estimating tax when not small. */
  profit?: number;
};

export type CompanyResult = {
  isSmall: boolean;
  /** Why the company does not qualify (empty when small). */
  reasons: string[];
  turnoverHeadroom: number;
  fixedAssetsHeadroom: number;
  cit: number;
  developmentLevy: number;
  totalTax: number;
  minimumEtrApplies: boolean;
};

const pos = (n: number | undefined) => (Number.isFinite(n) && (n as number) > 0 ? (n as number) : 0);

export function checkCompany(input: CompanyInput): CompanyResult {
  const turnover = pos(input.turnover);
  const fixedAssets = pos(input.fixedAssets);
  const profit = pos(input.profit);

  const reasons: string[] = [];
  if (turnover > SMALL_TURNOVER_LIMIT) reasons.push("Turnover is above ₦50 million.");
  if (fixedAssets > SMALL_FIXED_ASSETS_LIMIT) reasons.push("Fixed assets are above ₦250 million.");
  if (input.professionalServices) {
    reasons.push("Professional services businesses can't use the small company exemption.");
  }
  const isSmall = reasons.length === 0;

  const cit = isSmall ? 0 : profit * CIT_RATE;
  const developmentLevy = isSmall ? 0 : profit * DEVELOPMENT_LEVY_RATE;

  return {
    isSmall,
    reasons,
    turnoverHeadroom: SMALL_TURNOVER_LIMIT - turnover,
    fixedAssetsHeadroom: SMALL_FIXED_ASSETS_LIMIT - fixedAssets,
    cit,
    developmentLevy,
    totalTax: cit + developmentLevy,
    minimumEtrApplies: turnover >= MIN_ETR_TURNOVER,
  };
}
