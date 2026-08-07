import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import {
  FlagImage,
  parseCountry,
  defaultCountries,
} from "react-international-phone";
import "react-international-phone/style.css";
import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

import { authService } from "../services/authService";
import { useAuth } from "../context/useAuth";
import { useI18n } from "../i18n/i18n";
import "../styles/RegisterPage.css";

const ALLOWED_ISO2 = [
  "tn",
  "fr",
  "be",
  "dz",
  "ma",
  "it",
  "de",
  "gb",
  "us",
] as const;
type AllowedIso2 = (typeof ALLOWED_ISO2)[number];

const NATIONAL_HINTS: Record<AllowedIso2, string> = {
  tn: "22 123 456",
  fr: "6 12 34 56 78",
  be: "470 12 34 56",
  dz: "551 23 45 67",
  ma: "6 12 34 56 78",
  it: "333 123 4567",
  de: "1512 1234567",
  gb: "7911 123456",
  us: "(201) 555-0123",
};

export default function RegisterPage() {
  const { t } = useI18n();

  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedCountryIso2, setSelectedCountryIso2] = useState<AllowedIso2>("tn");
  const [nationalPhoneDisplay, setNationalPhoneDisplay] = useState("");
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const phoneCountries = useMemo(() => {
    const list = defaultCountries.filter((c) =>
      ALLOWED_ISO2.includes(parseCountry(c).iso2 as AllowedIso2)
    );
    return list;
  }, []);

  const selectedCountry = useMemo(() => {
    const found = phoneCountries.find(
      (c) => parseCountry(c).iso2 === selectedCountryIso2
    );
    return found ? parseCountry(found) : null;
  }, [phoneCountries, selectedCountryIso2]);

  const phoneHint = useMemo(
    () => NATIONAL_HINTS[selectedCountryIso2] ?? "",
    [selectedCountryIso2]
  );

  const updatePhoneFromNational = (
    nationalRaw: string,
    iso2: AllowedIso2,
    reportError = false
  ) => {
    const digitsOnly = nationalRaw.replace(/\D/g, "");

    if (!digitsOnly) {
      setForm((prev) => ({ ...prev, phone: "" }));
      if (reportError) setPhoneError("");
      return true;
    }

    try {
      const parsed = parsePhoneNumberFromString(
        nationalRaw,
        iso2.toUpperCase() as CountryCode
      );

      if (!parsed || !parsed.isValid()) {
        if (reportError) setPhoneError(t("auth.register.errors.invalidPhone"));
        setForm((prev) => ({ ...prev, phone: "" }));
        return false;
      }

      const e164 = parsed.number;
      setForm((prev) => ({ ...prev, phone: e164 }));
      if (reportError) setPhoneError("");
      return true;
    } catch {
      if (reportError) setPhoneError(t("auth.register.errors.invalidPhone"));
      setForm((prev) => ({ ...prev, phone: "" }));
      return false;
    }
  };

  const formatNationalDisplay = (nationalRaw: string, iso2: AllowedIso2) => {
    const digitsOnly = nationalRaw.replace(/\D/g, "");
    if (!digitsOnly) return "";

    try {
      const parsed = parsePhoneNumberFromString(
        digitsOnly,
        iso2.toUpperCase() as CountryCode
      );
      if (parsed && parsed.isPossible()) {
        return parsed.formatNational();
      }
      return nationalRaw;
    } catch {
      return nationalRaw;
    }
  };

  useEffect(() => {
    if (!nationalPhoneDisplay) {
      setPhoneError("");
      return;
    }

    updatePhoneFromNational(nationalPhoneDisplay, selectedCountryIso2, true);
  }, [nationalPhoneDisplay, selectedCountryIso2]);

  const handleNationalPhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setNationalPhoneDisplay(raw);
  };

  const handleNationalPhoneBlur = () => {
    const formatted = formatNationalDisplay(nationalPhoneDisplay, selectedCountryIso2);
    if (formatted !== nationalPhoneDisplay) {
      setNationalPhoneDisplay(formatted);
    }
  };

  const handleCountryChange = (iso2: AllowedIso2) => {
    setSelectedCountryIso2(iso2);
    setPhoneDropdownOpen(false);

    if (nationalPhoneDisplay) {
      updatePhoneFromNational(nationalPhoneDisplay, iso2, true);
    } else {
      setPhoneError("");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGoogleSuccess = async (accessToken: string) => {
    setError("");

    try {
      setGoogleLoading(true);

      await loginWithGoogle(accessToken);

      window.dispatchEvent(new CustomEvent("artisan:auth-changed"));

      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof Error && err.message === "SESSION_EXPIRED") {
        setError("");
        navigate("/", { replace: true });
        return;
      }

      setError(
        err instanceof Error ? err.message : t("auth.common.googleUnavailable")
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleRegister = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      if (!tokenResponse.access_token) {
        setError(t("auth.common.googleTokenMissing"));
        return;
      }

      await handleGoogleSuccess(tokenResponse.access_token);
    },
    onError: () => {
      setError(t("auth.common.googleCancelled"));
      setGoogleLoading(false);
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setPhoneError("");

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError(t("auth.register.errors.missingName"));
      return;
    }

    if (!form.email.trim()) {
      setError(t("auth.register.errors.missingEmail"));
      return;
    }

    let normalizedPhone: string | undefined = undefined;
    if (nationalPhoneDisplay.trim()) {
      const digitsOnly = nationalPhoneDisplay.replace(/\D/g, "");
      if (!digitsOnly) {
        setPhoneError(t("auth.register.errors.invalidPhone"));
        return;
      }

      try {
        const parsed = parsePhoneNumberFromString(
          nationalPhoneDisplay,
          selectedCountryIso2.toUpperCase() as CountryCode
        );

        if (!parsed || !parsed.isValid()) {
          setPhoneError(t("auth.register.errors.invalidPhone"));
          return;
        }

        normalizedPhone = parsed.number;
      } catch {
        setPhoneError(t("auth.register.errors.invalidPhone"));
        return;
      }
    }

    if (form.password.length < 8) {
      setError(t("auth.register.errors.passwordTooShort"));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t("auth.register.errors.passwordMismatch"));
      return;
    }

    try {
      setLoading(true);

      const email = form.email.trim().toLowerCase();

      await authService.register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email,
        phone: normalizedPhone,
        password: form.password,
      });

      navigate(`/verify-email?email=${encodeURIComponent(email)}`, {
        replace: true,
        state: { email },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("auth.register.errors.unknown")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-page">
      <div className="register-visual">
        <div className="register-visual-corner" />

        <div className="register-visual-badge">
          <div className="register-visual-badge-dot" />
          <span>{t("auth.common.badge")}</span>
        </div>

        <div className="register-visual-content">
          <h1>
            {t("auth.register.visualTitleLine1")}
            <br />
            <em>{t("auth.register.visualTitleEmphasis")}</em>
          </h1>

          <div className="register-visual-rule" />
        </div>
      </div>

      <div className="register-card">
        <div className="register-strip" />

        <div className="register-card-inner">
          <>
            <div className="register-card-kicker">
              <span>{t("auth.common.kicker")}</span>
            </div>

            <h2 className="register-card-title">
              {t("auth.register.cardTitleLine1")}
              <br />
              <em>{t("auth.register.cardTitleEmphasis")}</em>
            </h2>

            <p className="register-subtitle">{t("auth.register.subtitle")}</p>

            {error && <div className="register-error">{error}</div>}

            <button
              type="button"
              className="register-google-btn"
              disabled={googleLoading || loading}
              onClick={() => googleRegister()}
            >
              {googleLoading && <span className="register-btn-spinner" />}

              {!googleLoading && (
                <svg
                  className="google-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.194 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.143 35.091 26.715 36 24 36c-5.173 0-9.625-3.327-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.058 3.066-3.249 5.482-6.084 6.957l.003-.002 6.19 5.238C35.004 40.459 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
              )}

              {googleLoading
                ? t("auth.register.loadingWithGoogle")
                : t("auth.register.continueWithGoogle")}
            </button>

            <div className="register-divider">
              <span>{t("auth.common.or")}</span>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              <div className="register-row">
                <div className="register-field">
                  <input
                    id="firstName"
                    name="firstName"
                    placeholder=" "
                    value={form.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                  />
                  <label htmlFor="firstName">
                    {t("auth.register.firstName")}
                  </label>
                </div>

                <div className="register-field">
                  <input
                    id="lastName"
                    name="lastName"
                    placeholder=" "
                    value={form.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                  />
                  <label htmlFor="lastName">
                    {t("auth.register.lastName")}
                  </label>
                </div>
              </div>

              <div className="register-field">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder=" "
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                <label htmlFor="email">{t("auth.common.emailLabel")}</label>
              </div>

              <div
                className={`register-field register-phone-field${
                  phoneError ? " register-phone-field--error" : ""
                }`}
              >
                <div className="register-phone-input-wrapper">
                  <div
                    className={`react-international-phone${
                      phoneFocused ? " react-international-phone--focus" : ""
                    }`}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <button
                      type="button"
                      className="register-phone-country"
                      onClick={() =>
                        setPhoneDropdownOpen((prev) => !prev)
                      }
                    >
                      <FlagImage iso2={selectedCountryIso2} size="24px" />
                      <span>+{selectedCountry?.dialCode ?? "216"}</span>
                      <span
                        style={{
                          fontSize: "10px",
                          opacity: 0.6,
                          marginLeft: "2px",
                        }}
                      >
                        {phoneDropdownOpen ? "⌃" : "⌄"}
                      </span>
                    </button>

                    <input
                      className="register-phone-input"
                      value={nationalPhoneDisplay}
                      onChange={handleNationalPhoneChange}
                      onFocus={() => setPhoneFocused(true)}
                      onBlur={() => {
                        setPhoneFocused(false);
                        handleNationalPhoneBlur();
                      }}
                      placeholder={phoneHint || " "}
                      autoComplete="tel-national"
                    />

                    <div className="react-international-phone__country-list-box">
                      {phoneDropdownOpen && (
                        <ul
                          className="register-phone-dropdown"
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            marginTop: "6px",
                            listStyle: "none",
                            margin: 0,
                            padding: 0,
                          }}
                        >
                          {phoneCountries.map((item) => {
                            const p = parseCountry(item);
                            return (
                              <li
                                key={p.iso2}
                                onClick={() =>
                                  handleCountryChange(p.iso2 as AllowedIso2)
                                }
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                <FlagImage iso2={p.iso2} size="20px" />
                                <span style={{ flex: 1 }}>{p.name}</span>
                                <strong>+{p.dialCode}</strong>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                <label className="register-phone-label" htmlFor="phone">
                  {t("auth.register.phone")}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="hidden"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              {phoneError && (
                <div className="register-phone-error">{phoneError}</div>
              )}

              <div className="register-field">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder=" "
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <label htmlFor="password">
                  {t("auth.common.passwordLabel")}
                </label>
              </div>

              <div className="register-field">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder=" "
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <label htmlFor="confirmPassword">
                  {t("auth.register.confirmPassword")}
                </label>
              </div>

              <button
                type="submit"
                className="register-btn"
                disabled={loading || googleLoading}
              >
                {loading && <span className="register-btn-spinner" />}
                {loading
                  ? t("auth.register.loading")
                  : t("auth.register.submit")}
              </button>
            </form>

            <p className="register-footer">
              {t("auth.register.alreadyAccount")}{" "}
              <Link to="/login">{t("auth.login.submit")}</Link>
            </p>
          </>
        </div>
      </div>
    </section>
  );
}