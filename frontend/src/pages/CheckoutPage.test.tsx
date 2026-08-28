import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import CheckoutPage from "./CheckoutPage";
import { getPathValue, interpolate } from "../i18n/i18n";
import { translations, type TranslationParams } from "../i18n/translations";
import type { CartProduct } from "../context/CartContext";

const clearCartMock = vi.fn();
const trackPurchaseMock = vi.fn();
const trackBeginCheckoutMock = vi.fn();

const cartItems: CartProduct[] = [
  {
    id: 1,
    name: "Tapis Berbere",
    price: 250,
    mainImageUrl: null,
  },
];

vi.mock("../context/CurrencyContext", () => ({
  useCurrency: () => ({
    currency: "EUR",
    formatPrice: (value: number) => `${value} EUR`,
  }),
}));

vi.mock("../context/useCart", () => ({
  useCart: () => ({
    items: cartItems,
    cartTotal: 250,
    clearCart: clearCartMock,
  }),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock("../services/analytics", () => ({
  trackBeginCheckout: (...args: unknown[]) => trackBeginCheckoutMock(...args),
  trackPurchase: (...args: unknown[]) => trackPurchaseMock(...args),
}));

vi.mock("../i18n/i18n", async () => {
  const actual = await vi.importActual<typeof import("../i18n/i18n")>(
    "../i18n/i18n"
  );
  const { translations } = await import("../i18n/translations");

  return {
    ...actual,
    useI18n: () => ({
      language: "FR",
      lang: "FR",
      setLanguage: vi.fn(),
      setLang: vi.fn(),
      changeLanguage: vi.fn(),
      t: (key: string, params?: TranslationParams) => {
        const value = actual.getPathValue(translations.FR, key);
        return actual.interpolate(
          typeof value === "string" ? value : key,
          params
        );
      },
    }),
  };
});

function renderCheckout() {
  return render(
    <MemoryRouter>
      <CheckoutPage />
    </MemoryRouter>
  );
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText("Votre prénom"), "Amine");
  await user.type(screen.getByPlaceholderText("Votre nom"), "Mimou");
  await user.type(
    screen.getByPlaceholderText("votre@email.com"),
    "amine@example.com"
  );
  await user.type(screen.getByPlaceholderText("Paris"), "Paris");
  await user.type(
    screen.getByPlaceholderText("Numéro, rue, bâtiment..."),
    "12 Rue de la Paix"
  );
  await user.type(screen.getByPlaceholderText("Code postal"), "75002");
  await user.type(screen.getByPlaceholderText("6 12 34 56 78"), "612345678");

  await user.click(
    screen.getByRole("button", { name: t("checkout.confirm") })
  );
}

function t(key: string): string {
  const value = getPathValue(translations.FR, key);
  return interpolate(typeof value === "string" ? value : key);
}

const NETWORK_ERROR_TEXT = t("checkout.networkError");
const ORDER_CREATE_ERROR_TEXT = t("checkout.orderCreateError");
const SUCCESS_TITLE_TEXT = t("checkout.successTitle");

function jsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe("CheckoutPage order submission", () => {
  const originalRandomUUID = window.crypto.randomUUID;

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    clearCartMock.mockClear();
    trackPurchaseMock.mockClear();
    trackBeginCheckoutMock.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    Object.defineProperty(window.crypto, "randomUUID", {
      value: originalRandomUUID,
      configurable: true,
    });
  });

  it("shows the confirmation screen when the backend response has no id, orderId or reference", async () => {
    const user = userEvent.setup();
    const randomUUIDSpy = vi.spyOn(window.crypto, "randomUUID");
    vi.mocked(fetch).mockResolvedValue(jsonResponse(201, {}));

    renderCheckout();
    await fillValidForm(user);

    await waitFor(() => {
      expect(screen.getByText(SUCCESS_TITLE_TEXT)).toBeInTheDocument();
    });

    expect(screen.queryByText(NETWORK_ERROR_TEXT)).not.toBeInTheDocument();
    expect(randomUUIDSpy).not.toHaveBeenCalled();
    expect(clearCartMock).toHaveBeenCalledTimes(1);
  });

  it("still succeeds when window.crypto.randomUUID is unavailable", async () => {
    Object.defineProperty(window.crypto, "randomUUID", {
      value: undefined,
      configurable: true,
    });

    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue(jsonResponse(201, {}));

    renderCheckout();
    await fillValidForm(user);

    await waitFor(() => {
      expect(screen.getByText(SUCCESS_TITLE_TEXT)).toBeInTheDocument();
    });

    expect(screen.queryByText(NETWORK_ERROR_TEXT)).not.toBeInTheDocument();
  });

  it("keeps the order validated even if analytics tracking throws", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    trackPurchaseMock.mockImplementation(() => {
      throw new Error("Blocked by tracking protection");
    });

    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue(jsonResponse(201, { id: 42 }));

    renderCheckout();
    await fillValidForm(user);

    await waitFor(() => {
      expect(screen.getByText(SUCCESS_TITLE_TEXT)).toBeInTheDocument();
    });

    expect(screen.queryByText(NETWORK_ERROR_TEXT)).not.toBeInTheDocument();
    expect(clearCartMock).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Analytics tracking failed after a successful order:",
      expect.any(Error)
    );
  });

  it("shows the network error message when the backend is unreachable", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    vi.mocked(fetch).mockRejectedValue(new TypeError("Failed to fetch"));

    renderCheckout();
    await fillValidForm(user);

    await waitFor(() => {
      expect(screen.getByText(NETWORK_ERROR_TEXT)).toBeInTheDocument();
    });

    expect(screen.queryByText(SUCCESS_TITLE_TEXT)).not.toBeInTheDocument();
  });

  it("shows the backend message (not the network error) on a 400 response", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse(400, { message: "Adresse de livraison invalide." })
    );

    renderCheckout();
    await fillValidForm(user);

    await waitFor(() => {
      expect(
        screen.getByText("Adresse de livraison invalide.")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText(NETWORK_ERROR_TEXT)).not.toBeInTheDocument();
  });

  it("shows the generic order-create error (not the network error) on a 500 response", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue(jsonResponse(500, {}));

    renderCheckout();
    await fillValidForm(user);

    await waitFor(() => {
      expect(screen.getByText(ORDER_CREATE_ERROR_TEXT)).toBeInTheDocument();
    });

    expect(screen.queryByText(NETWORK_ERROR_TEXT)).not.toBeInTheDocument();
  });

  it("shows the confirmation screen with the order reference on a valid 201 response", async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue(jsonResponse(201, { id: 77 }));

    renderCheckout();
    await fillValidForm(user);

    await waitFor(() => {
      expect(screen.getByText(SUCCESS_TITLE_TEXT)).toBeInTheDocument();
    });

    expect(screen.getByText(t("checkout.orderReference").replace("{id}", "77"))).toBeInTheDocument();
  });

  it("shows the confirmation screen (not a raw parser error) on a 201 with an empty/invalid JSON body", async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => {
        throw new SyntaxError("Unexpected end of JSON input");
      },
    } as unknown as Response);

    renderCheckout();
    await fillValidForm(user);

    await waitFor(() => {
      expect(screen.getByText(SUCCESS_TITLE_TEXT)).toBeInTheDocument();
    });

    expect(screen.queryByText(NETWORK_ERROR_TEXT)).not.toBeInTheDocument();
    expect(screen.queryByText(/Unexpected end of JSON input/)).not.toBeInTheDocument();
  });
});
