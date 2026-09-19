/**
 * Lightweight notification helpers.
 * Prefer WhatsApp deep links (reliable in NG) + optional email webhook.
 */

export function adminWhatsAppNotify(message: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348085343926";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function developerNotifyMessage(opts: {
  status: "approved" | "rejected" | "changes_requested" | "submitted";
  title: string;
  notes?: string;
}): string {
  const map = {
    submitted: `New store submission received: "${opts.title}". We'll review shortly.`,
    approved: `Good news — "${opts.title}" is approved and live on DoyinStore.`,
    rejected: `"${opts.title}" was not approved.${opts.notes ? ` Notes: ${opts.notes}` : ""}`,
    changes_requested: `"${opts.title}" needs changes.${opts.notes ? ` Notes: ${opts.notes}` : ""}`,
  };
  return map[opts.status];
}

export function buyerPurchaseMessage(opts: {
  title: string;
  downloadUrl?: string;
}): string {
  return [
    `Your DoyinStore purchase: ${opts.title}`,
    opts.downloadUrl ? `Download: ${opts.downloadUrl}` : "Check your email / purchases page for the download link.",
    "Support: doyintechnology@outlook.com",
  ].join("\n");
}

/** Fire-and-forget server log + optional webhook for ops. */
export async function notifyOps(event: string, payload: Record<string, unknown>) {
  console.log(JSON.stringify({ event, ...payload, at: new Date().toISOString() }));
  const hook = process.env.OPS_WEBHOOK_URL;
  if (!hook) return;
  try {
    await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ...payload, at: new Date().toISOString() }),
    });
  } catch {
    /* ignore */
  }
}
