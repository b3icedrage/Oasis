const PESAPAL_BASE_URL = "https://pay.pesapal.com/v3";
const PESAPAL_SANDBOX_URL = "https://cybqa.pesapal.com/pesapalv3";

// Use sandbox for development, switch to production for live
const BASE_URL = __DEV__ ? PESAPAL_SANDBOX_URL : PESAPAL_BASE_URL;

const CONSUMER_KEY = "joTH53uK0qIM/YN5BUT22Z0TXpcim72R";
const CONSUMER_SECRET = "DSP4b3Vhybd0sL/HLLg0NX1OMys=";

let cachedToken: { token: string; expiry: number } | null = null;

/**
 * Get a Pesapal access token (valid for 5 minutes).
 * Tokens are cached and reused until expiry.
 */
export async function getPesapalToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiry) {
    return cachedToken.token;
  }

  const res = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
    }),
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(`Pesapal auth failed: ${data.error.message || JSON.stringify(data.error)}`);
  }

  // Cache token for 4 minutes (token expires in 5)
  cachedToken = {
    token: data.token,
    expiry: Date.now() + 4 * 60 * 1000,
  };

  return data.token;
}

export interface PesapalOrderRequest {
  /** Unique order ID from your system */
  id: string;
  /** Human-readable currency code (e.g. "KES", "USD") */
  currency: string;
  /** Total amount to charge */
  amount: number;
  /** Order description shown to the buyer */
  description: string;
  /** Buyer's full name */
  buyerName: string;
  /** Buyer's email address */
  buyerEmail: string;
  /** Buyer's phone number (optional) */
  buyerPhone?: string;
  /** Callback URL Pesapal redirects to after payment */
  callbackUrl: string;
  /** Your website/app name */
  merchantName?: string;
}

export interface PesapalOrderResponse {
  orderTrackingId: string;
  merchantRequestID: string;
  redirectUrl: string;
  error: unknown;
  status: string;
  message: string;
}

/**
 * Submit an order to Pesapal for payment.
 * Returns a redirectUrl the user opens to complete payment.
 */
export async function submitOrder(
  order: PesapalOrderRequest,
): Promise<PesapalOrderResponse> {
  const token = await getPesapalToken();

  const res = await fetch(`${BASE_URL}/api/SubmitOrderRequest`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      description: order.description,
      callback_url: order.callbackUrl,
      redirect_mode: "TOP_WINDOW",
      notification_id: "",
      merchant_name: order.merchantName || "GlitchIt",
      billing_address: {
        phone_number: order.buyerPhone || "",
        email_address: order.buyerEmail,
        first_name: order.buyerName.split(" ")[0] || "",
        last_name: order.buyerName.split(" ").slice(1).join(" ") || "",
        country_code: "",
        line_1: "",
        line_2: "",
        city: "",
        state: "",
        postal_code: "",
      },
    }),
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(`Pesapal order failed: ${data.error.message || JSON.stringify(data.error)}`);
  }

  return data;
}

export interface PesapalTransactionStatus {
  payment_status: string;
  payment_account: string;
  confirmation_code: string;
  payment_code: string;
  amount: number;
  currency: string;
  description: string;
  merchant_reference: string;
  status: string;
  message: string;
}

/**
 * Check the status of a Pesapal transaction.
 */
export async function getTransactionStatus(
  orderTrackingId: string,
): Promise<PesapalTransactionStatus> {
  const token = await getPesapalToken();

  const res = await fetch(
    `${BASE_URL}/api/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (data.error) {
    throw new Error(`Pesapal status check failed: ${data.error.message || JSON.stringify(data.error)}`);
  }

  return data;
}
