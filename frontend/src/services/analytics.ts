const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || "";

const GA_SCRIPT_ATTRIBUTE = "data-artisan-ga4";
const RECENT_EVENT_WINDOW_MS = 1_000;

type GtagFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFunction;
    __artisanGa4MeasurementId?: string;
  }
}

export type AnalyticsProduct = {
  id: number | string;
  name: string;
  price?: number | null;
  category?: string | null;
  type?: string | null;
  quantity?: number;
};

type AnalyticsItem = {
  item_id: string;
  item_name: string;
  price?: number;
  item_category?: string;
  quantity: number;
};

type PurchaseDetails = {
  transactionId: string;
  products: AnalyticsProduct[];
  value: number;
  currency?: string;
};

let initialized = false;
let lastPagePath = "";
const recentEvents = new Map<string, number>();

function hasValidMeasurementId() {
  return /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID);
}

function shouldSendRecentEvent(key: string) {
  const now = Date.now();
  const previous = recentEvents.get(key);

  if (previous && now - previous < RECENT_EVENT_WINDOW_MS) {
    return false;
  }

  recentEvents.set(key, now);
  return true;
}

function toAnalyticsItem(product: AnalyticsProduct): AnalyticsItem {
  const item: AnalyticsItem = {
    item_id: String(product.id),
    item_name: product.name,
    quantity: product.quantity ?? 1,
  };

  if (typeof product.price === "number" && Number.isFinite(product.price)) {
    item.price = product.price;
  }

  const category = product.category?.trim() || product.type?.trim();
  if (category) {
    item.item_category = category;
  }

  return item;
}

function sendEvent(eventName: string, parameters: Record<string, unknown>) {
  if (!initializeGoogleAnalytics() || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, parameters);
}

function ecommerceValue(products: AnalyticsProduct[]) {
  return products.reduce((sum, product) => {
    const price =
      typeof product.price === "number" && Number.isFinite(product.price)
        ? product.price
        : 0;
    return sum + price * (product.quantity ?? 1);
  }, 0);
}

export function initializeGoogleAnalytics() {
  if (typeof window === "undefined" || !hasValidMeasurementId()) {
    return false;
  }

  if (
    initialized ||
    window.__artisanGa4MeasurementId === GA_MEASUREMENT_ID
  ) {
    initialized = true;
    return true;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[${GA_SCRIPT_ATTRIBUTE}="${GA_MEASUREMENT_ID}"]`
  );

  if (!existingScript) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      GA_MEASUREMENT_ID
    )}`;
    script.setAttribute(GA_SCRIPT_ATTRIBUTE, GA_MEASUREMENT_ID);
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });

  window.__artisanGa4MeasurementId = GA_MEASUREMENT_ID;
  initialized = true;
  return true;
}

export function trackPageView(pathname: string) {
  const safePath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (safePath === lastPagePath) {
    return;
  }

  lastPagePath = safePath;
  sendEvent("page_view", {
    page_title: document.title,
    page_location: `${window.location.origin}${safePath}`,
    page_path: safePath,
  });
}

export function trackViewItem(
  product: AnalyticsProduct,
  currency = "EUR"
) {
  if (!shouldSendRecentEvent(`view_item:${product.id}`)) {
    return;
  }

  const value =
    typeof product.price === "number" && Number.isFinite(product.price)
      ? product.price
      : undefined;

  sendEvent("view_item", {
    currency,
    ...(value === undefined ? {} : { value }),
    items: [toAnalyticsItem(product)],
  });
}

export function trackAddToCart(
  product: AnalyticsProduct,
  currency = "EUR"
) {
  const value =
    typeof product.price === "number" && Number.isFinite(product.price)
      ? product.price * (product.quantity ?? 1)
      : undefined;

  sendEvent("add_to_cart", {
    currency,
    ...(value === undefined ? {} : { value }),
    items: [toAnalyticsItem(product)],
  });
}

export function trackViewCart(
  products: AnalyticsProduct[],
  currency = "EUR"
) {
  const signature = products.map((product) => product.id).join(",");
  if (!shouldSendRecentEvent(`view_cart:${signature}`)) {
    return;
  }

  sendEvent("view_cart", {
    currency,
    value: ecommerceValue(products),
    items: products.map(toAnalyticsItem),
  });
}

export function trackBeginCheckout(
  products: AnalyticsProduct[],
  currency = "EUR"
) {
  const signature = products.map((product) => product.id).join(",");
  if (!shouldSendRecentEvent(`begin_checkout:${signature}`)) {
    return;
  }

  sendEvent("begin_checkout", {
    currency,
    value: ecommerceValue(products),
    items: products.map(toAnalyticsItem),
  });
}

export function trackPurchase({
  transactionId,
  products,
  value,
  currency = "EUR",
}: PurchaseDetails) {
  if (
    !transactionId ||
    !shouldSendRecentEvent(`purchase:${transactionId}`)
  ) {
    return;
  }

  sendEvent("purchase", {
    transaction_id: transactionId,
    currency,
    value,
    items: products.map(toAnalyticsItem),
  });
}

export function trackSearch(searchTerm: string) {
  const normalizedTerm = searchTerm.trim().replace(/\s+/g, " ").slice(0, 100);
  const looksLikeEmail = /\S+@\S+\.\S+/.test(normalizedTerm);
  const looksLikePhone = /(?:\+?\d[\s().-]*){7,}/.test(normalizedTerm);

  if (
    !normalizedTerm ||
    looksLikeEmail ||
    looksLikePhone ||
    !shouldSendRecentEvent(`search:${normalizedTerm.toLowerCase()}`)
  ) {
    return;
  }

  sendEvent("search", {
    search_term: normalizedTerm,
  });
}
