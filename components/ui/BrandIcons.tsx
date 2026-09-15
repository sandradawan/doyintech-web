"use client";

import type { IconType } from "react-icons";
import {
  HiOutlineDocumentText,
  HiOutlineCalculator,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineFolderOpen,
  HiOutlineLink,
  HiOutlineCheckCircle,
  HiOutlineRocketLaunch,
  HiOutlineExclamationTriangle,
  HiOutlineCube,
  HiOutlineDocumentDuplicate,
  HiOutlinePencilSquare,
  HiOutlineCloud,
  HiOutlineEnvelope,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCog6Tooth,
  HiOutlineSparkles,
  HiOutlineQrCode,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentList,
  HiOutlineArrowPath,
  HiOutlineGlobeAlt,
  HiOutlineServerStack,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineLightBulb,
  HiOutlineCurrencyDollar,
  HiOutlineDevicePhoneMobile,
  HiOutlinePuzzlePiece,
  HiOutlineQueueList,
  HiOutlineSignal,
  HiOutlineEye,
  HiOutlineWrenchScrewdriver,
  HiOutlineSquare3Stack3D,
} from "react-icons/hi2";
import { SiWhatsapp } from "react-icons/si";

const TOOL_ICON_MAP: Record<string, IconType> = {
  pdf: HiOutlineDocumentText,
  calculator: HiOutlineCalculator,
  audit: HiOutlineEye,
  orgsec: HiOutlineSignal,
  shield: HiOutlineShieldCheck,
  headers: HiOutlineQueueList,
  ssl: HiOutlineLockClosed,
  exposed: HiOutlineFolderOpen,
  cookie: HiOutlinePuzzlePiece,
  csp: HiOutlineShieldCheck,
  robots: HiOutlineGlobeAlt,
  mixed: HiOutlineLink,
  redirect: HiOutlineArrowPath,
  checklist: HiOutlineCheckCircle,
  golive: HiOutlineRocketLaunch,
  breach: HiOutlineExclamationTriangle,
  deps: HiOutlineCube,
  cv: HiOutlineDocumentDuplicate,
  readiness: HiOutlineChartBar,
  brief: HiOutlineClipboardDocumentList,
  proposal: HiOutlineDocumentText,
  contract: HiOutlinePencilSquare,
  status: HiOutlineSquare3Stack3D,
  stack: HiOutlineServerStack,
  hosting: HiOutlineCloud,
  roi: HiOutlineCurrencyDollar,
  invoice: HiOutlineDocumentText,
  wa: SiWhatsapp,
  maintain: HiOutlineCog6Tooth,
  email: HiOutlineEnvelope,
  salary: HiOutlineCurrencyDollar,
  skills: HiOutlineAcademicCap,
  letter: HiOutlinePencilSquare,
  ideas: HiOutlineLightBulb,
  interview: HiOutlineBriefcase,
  ai: HiOutlineSparkles,
  bot: HiOutlineSparkles,
  qr: HiOutlineQrCode,
  lock: HiOutlineLockClosed,
};

const STORE_SLUG_ICONS: Record<string, IconType> = {
  "invoice-helper": HiOutlineDocumentText,
  "client-tracker": HiOutlineUsers,
  "whatsapp-studio": SiWhatsapp,
  "quote-builder": HiOutlineClipboardDocumentList,
  "launch-checklist": HiOutlineRocketLaunch,
};

const STORE_CATEGORY_ICONS: Record<string, IconType> = {
  Business: HiOutlineBriefcase,
  Productivity: HiOutlineChartBar,
  Communication: HiOutlineChatBubbleLeftRight,
  Security: HiOutlineShieldCheck,
  Education: HiOutlineAcademicCap,
  Tools: HiOutlineWrenchScrewdriver,
  "Digital Products": HiOutlineCube,
};

function IconShell({
  Icon,
  className = "",
  size = 22,
}: {
  Icon: IconType;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center text-[#ff8c14] ${className}`}
      aria-hidden
    >
      <Icon size={size} strokeWidth={1.6} />
    </span>
  );
}

/** Professional tool tile icon (replaces emoji) */
export function ToolIcon({
  name,
  className = "",
  size = 22,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Icon = TOOL_ICON_MAP[name] || HiOutlineWrenchScrewdriver;
  return <IconShell Icon={Icon} className={className} size={size} />;
}

/** Store / app listing icon from slug or category */
export function StoreAppIcon({
  slug,
  category,
  className = "",
  size = 26,
}: {
  slug?: string;
  category?: string;
  className?: string;
  size?: number;
}) {
  const Icon =
    (slug && STORE_SLUG_ICONS[slug]) ||
    (category && STORE_CATEGORY_ICONS[category]) ||
    HiOutlineDevicePhoneMobile;
  return <IconShell Icon={Icon} className={className} size={size} />;
}

export function CategoryIcon({
  category,
  size = 16,
}: {
  category: string;
  size?: number;
}) {
  const map: Record<string, IconType> = {
    core: HiOutlineSquare3Stack3D,
    business: HiOutlineBriefcase,
    career: HiOutlineAcademicCap,
    ai: HiOutlineSparkles,
    utility: HiOutlineWrenchScrewdriver,
    security: HiOutlineShieldCheck,
    paid: HiOutlineCurrencyDollar,
    markets: HiOutlineChartBar,
  };
  const Icon = map[category] || HiOutlineCube;
  return <Icon size={size} className="text-[#ff8c14]" aria-hidden />;
}
