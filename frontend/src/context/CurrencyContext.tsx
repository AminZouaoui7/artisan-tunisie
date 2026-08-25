import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Currency = "EUR" | "USD";

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amountEur: number | null | undefined) => string;
  eurToUsdRate: number;
  loadingRate: boolean;
};

const STORAGE_KEY = "artisan_currency";
const FALLBACK_RATE = 1.08;

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

function readStoredCurrency(): Currency {
  if (typeof window === "undefined") {
    return "EUR";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "USD" ? "USD" : "EUR";
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(readStoredCurrency);
  const [eurToUsdRate, setEurToUsdRate] = useState(FALLBACK_RATE);
  const [loadingRate, setLoadingRate] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  useEffect(() => {
    let isMounted = true;

    async function loadRate() {
      try {
        setLoadingRate(true);

        const response = await fetch("/api/exchange-rate");

        if (!response.ok) {
          throw new Error("Unable to load EUR/USD rate.");
        }

        const data = (await response.json()) as { rates?: { USD?: number } };
        const rate = data?.rates?.USD;

        if (isMounted && typeof rate === "number" && Number.isFinite(rate)) {
          setEurToUsdRate(rate);
        } else if (isMounted) {
          setEurToUsdRate(FALLBACK_RATE);
        }
      } catch {
        if (isMounted) {
          setEurToUsdRate(FALLBACK_RATE);
        }
      } finally {
        if (isMounted) {
          setLoadingRate(false);
        }
      }
    }

    loadRate();

    return () => {
      isMounted = false;
    };
  }, []);

  const setCurrency = useCallback((nextCurrency: Currency) => {
    setCurrencyState(nextCurrency);
  }, []);

  const formatPrice = useCallback(
    (amountEur: number | null | undefined) => {
      if (
        amountEur === null ||
        amountEur === undefined ||
        Number.isNaN(amountEur)
      ) {
        return "Prix sur demande";
      }

      const displayAmount =
        currency === "USD" ? amountEur * eurToUsdRate : amountEur;

      return new Intl.NumberFormat(currency === "USD" ? "en-US" : "fr-FR", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(displayAmount);
    },
    [currency, eurToUsdRate]
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      formatPrice,
      eurToUsdRate,
      loadingRate,
    }),
    [currency, setCurrency, formatPrice, eurToUsdRate, loadingRate]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider.");
  }

  return context;
}
