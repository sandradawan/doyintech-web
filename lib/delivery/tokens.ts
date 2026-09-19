import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const TTL_MS = 7 * 24 * 60 * 60 * 1000;

function secret(): string {
  return (
    process.env.STORE_SESSION_SECRET ||
    process.env.PAYSTACK_SECRET_KEY ||
    "dev-delivery-secret-change-me"
  );
}

export type DeliveryGrant = {
  email: string;
  productId: string;
  paths: string[];
  exp: number;
};

export function issueDeliveryToken(grant: Omit<DeliveryGrant, "exp"> & { exp?: number }): string {
  const payload: DeliveryGrant = {
    email: grant.email.toLowerCase().trim(),
    productId: grant.productId,
    paths: grant.paths,
    exp: grant.exp || Date.now() + TTL_MS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyDeliveryToken(
  token: string
): { ok: true; grant: DeliveryGrant } | { ok: false; error: string } {
  const [body, sig] = token.split(".");
  if (!body || !sig) return { ok: false, error: "Invalid token" };
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, error: "Invalid token" };
    }
  } catch {
    return { ok: false, error: "Invalid token" };
  }
  try {
    const grant = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as DeliveryGrant;
    if (!grant.exp || Date.now() > grant.exp) return { ok: false, error: "Token expired" };
    if (!grant.email || !grant.productId) return { ok: false, error: "Invalid grant" };
    return { ok: true, grant };
  } catch {
    return { ok: false, error: "Invalid token payload" };
  }
}

export function newReferenceHint(): string {
  return randomBytes(4).toString("hex");
}
