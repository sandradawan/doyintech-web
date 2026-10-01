const LIVE = "https://vtpass.com/api";
const SANDBOX = "https://sandbox.vtpass.com/api";

function baseUrl() {
  return process.env.VTPASS_SANDBOX === "1" ? SANDBOX : LIVE;
}

function headers(): HeadersInit {
  const key = process.env.VTPASS_API_KEY || "";
  const secret = process.env.VTPASS_SECRET_KEY || "";
  return {
    "Content-Type": "application/json",
    "api-key": key,
    "secret-key": secret,
  };
}

export function vtpassConfigured() {
  return Boolean(process.env.VTPASS_API_KEY && process.env.VTPASS_SECRET_KEY);
}

export function requestId(prefix = "DT") {
  return `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
}

export async function buyAirtime(opts: {
  serviceID: string;
  phone: string;
  amount: number;
  request_id?: string;
}) {
  if (!vtpassConfigured()) {
    return {
      demo: true as const,
      code: "demo",
      response_description: "Demo mode — add VTPASS_API_KEY & VTPASS_SECRET_KEY",
      requestId: opts.request_id || requestId("AIR"),
      amount: opts.amount,
      phone: opts.phone,
    };
  }

  const request_id = opts.request_id || requestId("AIR");
  const res = await fetch(`${baseUrl()}/pay`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      request_id,
      serviceID: opts.serviceID,
      amount: opts.amount,
      phone: opts.phone,
    }),
  });
  const data = await res.json().catch(() => ({}));
  return { demo: false as const, requestId: request_id, ...data };
}

export async function buyData(opts: {
  serviceID: string;
  phone: string;
  variation_code: string;
  amount: number;
  request_id?: string;
}) {
  if (!vtpassConfigured()) {
    return {
      demo: true as const,
      code: "demo",
      response_description: "Demo mode — add VTPASS_API_KEY & VTPASS_SECRET_KEY",
      requestId: opts.request_id || requestId("DATA"),
      amount: opts.amount,
      phone: opts.phone,
      variation_code: opts.variation_code,
    };
  }

  const request_id = opts.request_id || requestId("DATA");
  const res = await fetch(`${baseUrl()}/pay`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      request_id,
      serviceID: opts.serviceID,
      billersCode: opts.phone,
      variation_code: opts.variation_code,
      amount: opts.amount,
      phone: opts.phone,
    }),
  });
  const data = await res.json().catch(() => ({}));
  return { demo: false as const, requestId: request_id, ...data };
}
