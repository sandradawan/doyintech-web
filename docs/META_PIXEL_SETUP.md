# Meta Pixel setup for DoyinTech (Phase 2 guide)

Official docs (source of truth):
- https://www.facebook.com/business/tools/meta-pixel
- https://developers.facebook.com/docs/meta-pixel/
- https://business.facebook.com/events_manager/

## A. What Meta Pixel is
A small browser script from Meta that records actions (PageView, Lead, Purchase, etc.) so you can measure ads and build audiences. The **Pixel ID** is a public numeric ID embedded in your site — it is not a password.

## B. Events Manager
Meta Events Manager is the dashboard where you create Pixels, see Test Events, and review activity. You need a Meta Business account.

## C–E. Create a Pixel and get the ID
1. Sign in at https://business.facebook.com/events_manager/ (use your Business account).
2. Create or select a data source of type **Web** / **Pixel** (labels can vary).
3. Copy the **Pixel ID** (digits only).
4. Paste it into Vercel as `NEXT_PUBLIC_META_PIXEL_ID`.

**Do not share your Facebook password or session cookies with anyone.**

## F. How DoyinTech installs the base code
- File: `components/analytics/MetaPixel.tsx`
- Loads `fbevents.js` only after analytics consent (`cookie-consent` = `all` or legacy `true`).
- Initializes once; tracks PageView on first load and App Router path changes (deduped).

## G. Standard events on this site
| Event | When |
|-------|------|
| PageView | After consent + init; each new path |
| ViewContent | `/hire`, `/products`, `/services` |
| InitiateCheckout | Paystack buy button starts payment |
| Purchase | `/hire/success` or `/products/success` after Paystack **verify** succeeds |
| Contact | Floating WhatsApp button click |

No emails, phones, or form field contents are sent as event parameters.

## H–J. Test after deploy
1. Set env vars on Vercel and redeploy.
2. Open https://www.doyintech.com — choose **Accept all** on the cookie banner.
3. Chrome: Meta Pixel Helper — look for Pixel ID and PageView.
4. Events Manager → **Test Events** — browse hire/products.
5. Purchase only fires after Paystack verify succeeds.
6. If nothing appears: consent not accepted, wrong ID, ad blocker, or delay in Events Manager.

## Vercel environment variables
```
NEXT_PUBLIC_META_PIXEL_ID=YOUR_DIGITS_ONLY_ID
NEXT_PUBLIC_META_PIXEL_ENABLED=true
NEXT_PUBLIC_SITE_URL=https://www.doyintech.com
```
Leave `NEXT_PUBLIC_META_PIXEL_ID` empty until you have a real ID — the site stays online with Pixel disabled.

## Consent
- **Essential only** — no Meta Pixel
- **Accept all** — Pixel may load
