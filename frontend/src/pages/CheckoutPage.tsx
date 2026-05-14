import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import rawCountries from "world-countries";
import {
  CheckCircle2,
  Search,
  ChevronDown,
  MapPin,
  CreditCard,
  Truck,
} from "lucide-react";

import { useCart } from "../context/useCart";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/apiClient";
import { formatEurPrice } from "../utils/price";
import { useI18n } from "../i18n/i18n";
import "../styles/CheckoutPage.css";

type CountryOption = {
  name: string;
  code: string;
  dial: string;
};

const countries: CountryOption[] = rawCountries
  .filter((country) => country.cca2 && country.idd?.root)
  .map((country) => ({
    name: country.translations?.fra?.common || country.name.common,
    code: country.cca2,
    dial: `${country.idd.root}${country.idd.suffixes?.[0] || ""}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "fr"));

const defaultCountry =
  countries.find((country) => country.code === "FR") || countries[0];

function flagUrl(code: string) {
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
}

export default function CheckoutPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [countryOpen, setCountryOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    country: defaultCountry.name,
    deliveryCountryCode: defaultCountry.code,
    phoneDialCode: defaultCountry.dial,
    phoneNumber: "",
    city: "",
    stateOrProvince: "",
    postalCode: "",
    addressLine1: "",
    addressLine2: "",
    paymentMethod: "BankTransferIban",
    notes: "",
  });

  const selectedCountry = useMemo(
    () =>
      countries.find((country) => country.code === form.deliveryCountryCode) ||
      defaultCountry,
    [form.deliveryCountryCode]
  );

  const selectedPhoneCountry = useMemo(
    () =>
      countries.find((country) => country.dial === form.phoneDialCode) ||
      selectedCountry,
    [form.phoneDialCode, selectedCountry]
  );

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return countries;

    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(q) ||
        country.code.toLowerCase().includes(q) ||
        country.dial.includes(q)
    );
  }, [countrySearch]);

  const filteredPhoneCountries = useMemo(() => {
    const q = phoneSearch.trim().toLowerCase();
    if (!q) return countries;

    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(q) ||
        country.code.toLowerCase().includes(q) ||
        country.dial.includes(q)
    );
  }, [phoneSearch]);

  const updateField = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const selectCountry = (country: CountryOption) => {
    setForm((prev) => ({
      ...prev,
      country: country.name,
      deliveryCountryCode: country.code,
      phoneDialCode: country.dial,
    }));

    setCountryOpen(false);
    setCountrySearch("");
  };

  const selectPhoneCountry = (country: CountryOption) => {
    setForm((prev) => ({
      ...prev,
      phoneDialCode: country.dial,
    }));

    setPhoneOpen(false);
    setPhoneSearch("");
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-zÀ-ÿ' -]{2,}$/;
    const phoneRegex = /^[0-9\s().-]{6,18}$/;
    const postalRegex = /^[A-Za-z0-9\s-]{3,14}$/;

    if (!nameRegex.test(form.firstName.trim())) {
      return t("checkout.validation.firstName");
    }

    if (!nameRegex.test(form.lastName.trim())) {
      return t("checkout.validation.lastName");
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      return t("checkout.validation.email");
    }

    if (!phoneRegex.test(form.phoneNumber.trim())) {
      return t("checkout.validation.phone");
    }

    if (!form.country.trim() || !form.deliveryCountryCode.trim()) {
      return t("checkout.validation.country");
    }

    if (form.city.trim().length < 2) {
      return t("checkout.validation.city");
    }

    if (!postalRegex.test(form.postalCode.trim())) {
      return t("checkout.validation.postalCode");
    }

    if (form.addressLine1.trim().length < 8) {
      return t("checkout.validation.addressLine1");
    }

    return "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError(t("checkout.validation.emptyCart"));
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: `${form.phoneDialCode} ${form.phoneNumber}`.trim(),
        country: form.country.trim(),
        deliveryCountryCode: form.deliveryCountryCode.trim(),
        currency: "EUR",
        city: form.city.trim(),
        stateOrProvince: form.stateOrProvince.trim(),
        postalCode: form.postalCode.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim(),
        paymentMethod: form.paymentMethod,
        notes: form.notes.trim(),
        items: items.map((item) => ({
          productId: item.id,
          quantity: 1,
        })),
      };

      const response = await apiFetch("/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || t("checkout.orderCreateError"));
      }

      clearCart();

      navigate("/account/orders", {
        state: {
          successMessage: data.message,
          orderId: data.id,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.unknownError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="checkout-page">
      <section className="checkout-hero">
        <div>
          <p className="checkout-kicker">{t("checkout.kicker")}</p>
          <h1>
            {t("checkout.title")} <em>{t("checkout.titleEmphasis")}</em>
          </h1>
        </div>

        <div className="checkout-hero-badges">
          <span>
            <Truck size={16} />
            International delivery
          </span>
          <span>
            <CheckCircle2 size={16} />
            Secure validation
          </span>
        </div>
      </section>

      <div className="checkout-layout">
        <div className="checkout-main">
          {error && <div className="checkout-error-banner">{error}</div>}

          <form id="checkout-form" onSubmit={handleSubmit}>
            <article className="checkout-card">
              <div className="checkout-card-header">
                <div className="checkout-step-number">
                  <MapPin size={20} />
                </div>
                <div>
                  <span>Step 1</span>
                  <h2>{t("checkout.deliveryTitle")}</h2>
                </div>
              </div>

              <div className="checkout-form-grid">
                <div className="checkout-field">
                  <label>First name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="Chaima"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label>Last name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Chalbi"
                    required
                  />
                </div>

                <div className="checkout-field checkout-field--full">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label>{t("checkout.fields.country")}</label>

                  <div className="country-combobox">
                    <button
                      type="button"
                      className="country-trigger"
                      onClick={() => {
                        setCountryOpen((prev) => !prev);
                        setPhoneOpen(false);
                      }}
                    >
                      <img
                        src={flagUrl(selectedCountry.code)}
                        alt={selectedCountry.name}
                      />
                      <span>{selectedCountry.name}</span>
                      <ChevronDown size={16} />
                    </button>

                    {countryOpen && (
                      <div className="country-menu">
                        <div className="country-search">
                          <Search size={16} />
                          <input
                            type="text"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            placeholder="Search country..."
                          />
                        </div>

                        <div className="country-list">
                          {filteredCountries.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => selectCountry(country)}
                            >
                              <img src={flagUrl(country.code)} alt={country.name} />
                              <span>{country.name}</span>
                              <strong>{country.dial}</strong>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="checkout-field">
                  <label>{t("checkout.fields.city")}</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="Paris, Tunis, New York..."
                    required
                  />
                </div>

                <div className="checkout-field checkout-field--full">
                  <label>{t("checkout.fields.address")}</label>
                  <input
                    type="text"
                    value={form.addressLine1}
                    onChange={(e) => updateField("addressLine1", e.target.value)}
                    placeholder="12 rue de la Paix"
                    required
                  />
                </div>

                <div className="checkout-field checkout-field--full">
                  <label>Address complement</label>
                  <input
                    type="text"
                    value={form.addressLine2}
                    onChange={(e) => updateField("addressLine2", e.target.value)}
                    placeholder="Apartment, floor, building..."
                  />
                </div>

                <div className="checkout-field">
                  <label>State / Province</label>
                  <input
                    type="text"
                    value={form.stateOrProvince}
                    onChange={(e) =>
                      updateField("stateOrProvince", e.target.value)
                    }
                    placeholder="Île-de-France"
                  />
                </div>

                <div className="checkout-field">
                  <label>{t("checkout.fields.zip")}</label>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    placeholder="75000"
                    required
                  />
                </div>

                <div className="checkout-field checkout-field--full">
                  <label>{t("checkout.fields.phone")}</label>

                  <div className="checkout-phone">
                    <div className="country-combobox">
                      <button
                        type="button"
                        className="country-trigger country-trigger--phone"
                        onClick={() => {
                          setPhoneOpen((prev) => !prev);
                          setCountryOpen(false);
                        }}
                      >
                        <img
                          src={flagUrl(selectedPhoneCountry.code)}
                          alt={selectedPhoneCountry.name}
                        />
                        <span>{form.phoneDialCode}</span>
                        <ChevronDown size={16} />
                      </button>

                      {phoneOpen && (
                        <div className="country-menu country-menu--phone">
                          <div className="country-search">
                            <Search size={16} />
                            <input
                              type="text"
                              value={phoneSearch}
                              onChange={(e) => setPhoneSearch(e.target.value)}
                              placeholder="Search..."
                            />
                          </div>

                          <div className="country-list">
                            {filteredPhoneCountries.map((country) => (
                              <button
                                key={`${country.code}-${country.dial}`}
                                type="button"
                                onClick={() => selectPhoneCountry(country)}
                              >
                                <img
                                  src={flagUrl(country.code)}
                                  alt={country.name}
                                />
                                <span>{country.name}</span>
                                <strong>{country.dial}</strong>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <input
                      type="tel"
                      value={form.phoneNumber}
                      onChange={(e) => updateField("phoneNumber", e.target.value)}
                      placeholder="55 123 456"
                      required
                    />
                  </div>
                </div>

                <div className="checkout-field checkout-field--full">
                  <label>Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="Delivery notes, preferred contact time..."
                    rows={4}
                  />
                </div>
              </div>
            </article>

            <article className="checkout-card">
              <div className="checkout-card-header">
                <div className="checkout-step-number">
                  <CreditCard size={20} />
                </div>
                <div>
                  <span>Step 2</span>
                  <h2>{t("checkout.paymentTitle")}</h2>
                </div>
              </div>

              <p className="checkout-payment-intro">
                {t("checkout.paymentIntro")}
              </p>

              <div className="checkout-payment-options">
                <label
                  className={`checkout-payment-option ${
                    form.paymentMethod === "BankTransferRib" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BankTransferRib"
                    checked={form.paymentMethod === "BankTransferRib"}
                    onChange={(e) => updateField("paymentMethod", e.target.value)}
                  />
                  <div className="checkout-payment-content">
                    <strong>{t("checkout.paymentMethods.rib.title")}</strong>
                    <span>{t("checkout.paymentMethods.rib.desc")}</span>
                  </div>
                </label>

                <label
                  className={`checkout-payment-option ${
                    form.paymentMethod === "BankTransferIban" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BankTransferIban"
                    checked={form.paymentMethod === "BankTransferIban"}
                    onChange={(e) => updateField("paymentMethod", e.target.value)}
                  />
                  <div className="checkout-payment-content">
                    <strong>{t("checkout.paymentMethods.iban.title")}</strong>
                    <span>{t("checkout.paymentMethods.iban.desc")}</span>
                  </div>
                </label>

                <label className="checkout-payment-option disabled">
                  <input type="radio" name="paymentMethod" disabled />
                  <div className="checkout-payment-content">
                    <strong>{t("checkout.paymentMethods.online.title")}</strong>
                    <span>{t("checkout.paymentMethods.online.desc")}</span>
                  </div>
                </label>
              </div>
            </article>
          </form>
        </div>

        <aside className="checkout-sidebar">
          <div className="checkout-card checkout-summary">
            <h3>{t("checkout.summaryTitle")}</h3>

            <div className="checkout-items-list">
              {items.map((item) => (
                <div key={item.id} className="checkout-item">
                  <div className="checkout-item-img">
                    {item.mainImageUrl ? (
                      <img src={item.mainImageUrl} alt={item.name} />
                    ) : (
                      <div className="checkout-item-placeholder" />
                    )}
                  </div>

                  <div className="checkout-item-info">
                    <strong>{item.name}</strong>
                    <span>{formatEurPrice(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-summary-divider" />

            <div className="checkout-summary-row">
              <span>{t("checkout.subtotal")}</span>
              <span>{formatEurPrice(cartTotal)}</span>
            </div>

            <div className="checkout-summary-row">
              <span>{t("checkout.shipping")}</span>
              <span className="checkout-shipping-confirm">
                {t("common.toBeConfirmed")}
              </span>
            </div>

            <div className="checkout-summary-total">
              <span>{t("checkout.total")}</span>
              <strong>{formatEurPrice(cartTotal)}</strong>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="checkout-submit-btn"
              disabled={loading}
            >
              {loading ? t("checkout.processing") : t("checkout.confirm")}
            </button>

            <div className="checkout-trust">
              <CheckCircle2 size={16} />
              <span>{t("checkout.securePayment")}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}