import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { authService } from "../services/authService";
import { useI18n } from "../i18n/i18n";
import "../styles/VerifyEmailPage.css";

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmailPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const stateEmail =
    ((location.state as { email?: string } | null)?.email || "").trim();

  const email = (stateEmail || searchParams.get("email") || "")
    .trim()
    .toLowerCase();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [cooldownStarted, setCooldownStarted] = useState(false);

  useEffect(() => {
    if (!cooldownStarted) return;

    if (cooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown, cooldownStarted]);

  const startResendCooldown = () => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    setCooldownStarted(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError(t("auth.verifyEmail.errors.missingEmail"));
      return;
    }

    if (code.trim().length !== 6) {
      setError(t("auth.verifyEmail.errors.invalidCode"));
      return;
    }

    try {
      setLoading(true);

      await authService.verifyEmail({
        email,
        code: code.trim(),
      });

      setSuccess(t("auth.verifyEmail.successMessage"));

      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            verifiedEmail: email,
            emailVerified: true,
          },
        });
      }, 900);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("auth.verifyEmail.errors.unknown")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendError("");
    setResendMessage("");

    if (!email) {
      setResendError(t("auth.verifyEmail.errors.missingEmail"));
      return;
    }

    try {
      setResendLoading(true);

      await authService.resendVerificationEmail({ email });

      setResendMessage(t("auth.verifyEmail.resendSuccess"));
      startResendCooldown();
    } catch (err) {
      setResendError(
        err instanceof Error
          ? err.message
          : t("auth.verifyEmail.errors.resendUnknown")
      );
    } finally {
      setResendLoading(false);
    }
  };

  const canResend =
    authService.resendVerificationEmail !== undefined &&
    !resendLoading &&
    cooldown <= 0;

  return (
    <section className="verify-page">
      <div className="verify-card">
        <div className="verify-card-inner">
          <p className="verify-kicker">{t("auth.verifyEmail.kicker")}</p>

          <h1>{t("auth.verifyEmail.title")}</h1>

          <p className="verify-subtitle">{t("auth.verifyEmail.subtitle")}</p>

          <div className="verify-email-box">
            {email || t("auth.verifyEmail.emailNotFound")}
          </div>

          {error && <div className="verify-error">{error}</div>}

          {success && <div className="verify-success">{success}</div>}

          {resendError && <div className="verify-error">{resendError}</div>}

          {resendMessage && (
            <div className="verify-success">{resendMessage}</div>
          )}

          <form onSubmit={handleSubmit} className="verify-form">
            <input
              className="verify-code-input"
              type="text"
              placeholder={t("auth.verifyEmail.codePlaceholder")}
              value={code}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCode(e.target.value.replace(/\D/g, ""))
              }
              maxLength={6}
              inputMode="numeric"
            />

            <button type="submit" className="verify-button" disabled={loading}>
              {loading
                ? t("auth.verifyEmail.loading")
                : t("auth.verifyEmail.submit")}
            </button>
          </form>

          {authService.resendVerificationEmail !== undefined && (
            <div className="verify-resend">
              <p className="verify-resend-text">
                {t("auth.verifyEmail.resendHint")}
              </p>

              <button
                type="button"
                className="verify-resend-btn"
                onClick={handleResend}
                disabled={!canResend}
              >
                {resendLoading
                  ? t("auth.verifyEmail.resendLoading")
                  : cooldown > 0
                    ? t("auth.verifyEmail.resendCooldown", { seconds: String(cooldown) })
                    : t("auth.verifyEmail.resendAction")}
              </button>
            </div>
          )}

          <p className="verify-footer">
            {t("auth.verifyEmail.alreadyConfirmed")}{" "}
            <Link to="/login">{t("auth.common.loginNav")}</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
