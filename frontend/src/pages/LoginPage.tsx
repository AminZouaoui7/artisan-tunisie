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

import { useGoogleLogin } from "@react-oauth/google";

import { useI18n } from "../i18n/i18n";
import "../styles/LoginPage.css";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const { login, loginWithGoogle } = useAuth();

  const redirectTo =
    (location.state as { from?: string })?.from || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

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

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Connexion Google impossible."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      if (!tokenResponse.access_token) {
        setError("Token Google introuvable.");
        return;
      }

      await handleGoogleSuccess(tokenResponse.access_token);
    },
    onError: () => {
      setError("Connexion Google annulée ou impossible.");
      setGoogleLoading(false);
    },
  });

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

          <button
            type="button"
            className="login-google-btn"
            disabled={googleLoading || loading}
            onClick={() => googleLogin()}
          >
            {googleLoading && (
              <span className="login-btn-spinner" />
            )}

            {!googleLoading && (
<svg
  className="google-svg"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 48 48"
  aria-hidden="true"
>
  <path
    fill="#FFC107"
    d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.194 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
  />
  <path
    fill="#FF3D00"
    d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
  />
  <path
    fill="#4CAF50"
    d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.143 35.091 26.715 36 24 36c-5.173 0-9.625-3.327-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
  />
  <path
    fill="#1976D2"
    d="M43.611 20.083H42V20H24v8h11.303c-1.058 3.066-3.249 5.482-6.084 6.957l.003-.002 6.19 5.238C35.004 40.459 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
  />
</svg>            )}

            {googleLoading
              ? "Connexion avec Google..."
              : "Continuer avec Google"}
          </button>

          <div className="login-divider">
            <span>{t("auth.common.or")}</span>
          </div>

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
              disabled={loading || googleLoading}
            >
              {loading && (
                <span className="login-btn-spinner" />
              )}

              {loading
                ? t("auth.login.loading")
                : t("auth.login.submit")}
            </button>
          </form>

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