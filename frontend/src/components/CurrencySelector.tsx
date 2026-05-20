import { useCurrency } from "../context/CurrencyContext";
import { useI18n } from "../i18n/i18n";
import "../styles/CurrencySelector.css";

export default function CurrencySelector() {
  const { t } = useI18n();
  const { currency, setCurrency, loadingRate } = useCurrency();

  return (
    <div className="currency-selector" aria-label={t("common.currencySwitch")}>
      {(["EUR", "USD"] as const).map((item) => (
        <button
          key={item}
          type="button"
          className={`currency-selector__btn${
            currency === item ? " currency-selector__btn--active" : ""
          }`}
          onClick={() => setCurrency(item)}
          aria-pressed={currency === item}
        >
          <span>{item === "EUR" ? "EUR €" : "USD $"}</span>
          {loadingRate && item === "USD" ? (
            <small aria-hidden="true">...</small>
          ) : null}
        </button>
      ))}
    </div>
  );
}
