/**
 * Discovery call booking.
 * Set NEXT_PUBLIC_CALENDAR_URL in Vercel to a Calendly / Google Calendar booking link.
 * Falls back to WhatsApp if unset.
 */

export const WHATSAPP_NUMBER = "2348085343926";

export function whatsappDiscoveryLink(
  message = "Hi DoyinTech, I'd like to book a free 15-minute discovery call about a project."
): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Primary calendar booking URL (Calendly, Google Appointment slots, etc.) */
export function calendarBookingUrl(): string | null {
  const url = (process.env.NEXT_PUBLIC_CALENDAR_URL || "").trim();
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

/**
 * Best available book-a-call link: calendar if configured, else WhatsApp.
 */
export function bookCallLink(context?: string): string {
  const cal = calendarBookingUrl();
  if (cal) {
    if (!context) return cal;
    try {
      const u = new URL(cal);
      if (!u.searchParams.has("a1")) u.searchParams.set("a1", context);
      return u.toString();
    } catch {
      return cal;
    }
  }
  const msg = context
    ? `Hi DoyinTech, I'd like to book a free 15-minute discovery call. Context: ${context}`
    : "Hi DoyinTech, I'd like to book a free 15-minute discovery call about a project.";
  return whatsappDiscoveryLink(msg);
}

export function hasCalendarBooking(): boolean {
  return Boolean(calendarBookingUrl());
}
