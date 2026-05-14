import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useI18n } from "../i18n/i18n";
import "../styles/LoginPage.css";
import { useAuth } from "../context/useAuth";
export default function LoginPage() {
  const { t } = useI18n();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  // Redirection vers la homepage après connexion
  const redirectTo =
    (location.state as { from?: string })?.from || "/";

  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      navigate(redirectTo, { replace: true });

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">

      {/* ── Left visual ───────────────────────────────────── */}
      <div className="login-visual">

        <div className="login-visual-corner" />

        <div className="login-visual-badge">
          <div className="login-visual-badge-dot" />
          <span>{t("auth.common.badge")}</span>
        </div>

        <div className="login-visual-content">
          <h1>
            {t("auth.login.visualTitleLine1")}
            <br />
            <em>{t("auth.login.visualTitleEmphasis")}</em>
          </h1>

          <div className="login-visual-rule" />

          
        </div>

      </div>

      {/* ── Right form card ───────────────────────────────── */}
      <div className="login-card">

        <div className="login-strip" />

        <div className="login-card-inner">

          <div className="login-card-kicker">
            <span>{t("auth.common.kicker")}</span>
          </div>

          <h2 className="login-card-title">
            {t("auth.login.cardTitleLine1")}
            <br />
            <em>{t("auth.login.cardTitleEmphasis")}</em>
          </h2>

          <p className="login-subtitle">
            {t("auth.login.subtitle")}
          </p>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            <div className="login-field">
              <input
                type="email"
                id="email"
                name="email"
                placeholder=" "
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />

              <label htmlFor="email">
                {t("auth.common.emailLabel")}
              </label>
            </div>

            <div className="login-field">
              <input
                type="password"
                id="password"
                name="password"
                placeholder=" "
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />

              <label htmlFor="password">
                {t("auth.common.passwordLabel")}
              </label>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading && (
                <span className="login-btn-spinner" />
              )}

              {loading
                ? t("auth.login.loading")
                : t("auth.login.submit")}
            </button>

          </form>

          <div className="login-divider">
            <span>{t("auth.common.or")}</span>
          </div>

          <p className="login-footer">
            {t("auth.login.noAccount")}{" "}
            <Link to="/register">
              {t("auth.login.createAccount")}
            </Link>
          </p>

        </div>
      </div>

    </section>
  );
}
