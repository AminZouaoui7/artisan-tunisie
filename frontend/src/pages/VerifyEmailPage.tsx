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

import { authService } from "../services/authService";
import { useI18n } from "../i18n/i18n";
import "../styles/VerifyEmailPage.css";

export default function VerifyEmailPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

      const result = await authService.verifyEmail({
        email,
        code: code.trim(),
      });

      setSuccess(result.message);

      setTimeout(() => {
        navigate("/login");
      }, 1800);
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
    <section className="verify-page">
      <div className="verify-card">
        <div className="verify-card-inner">
          <p className="verify-kicker">{t("auth.verifyEmail.kicker")}</p>

          <h1>{t("auth.verifyEmail.title")}</h1>

          <p className="verify-subtitle">
            {t("auth.verifyEmail.subtitle")}
          </p>

          <div className="verify-email-box">
            {email || t("auth.verifyEmail.emailNotFound")}
          </div>

          {error && <div className="verify-error">{error}</div>}

          {success && <div className="verify-success">{success}</div>}

          <form onSubmit={handleSubmit} className="verify-form">
            <input
              className="verify-code-input"
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCode(e.target.value.replace(/\D/g, ""))
              }
              maxLength={6}
              inputMode="numeric"
            />

            <button
              type="submit"
              className="verify-button"
              disabled={loading}
            >
              {loading ? t("auth.verifyEmail.loading") : t("auth.verifyEmail.submit")}
            </button>
          </form>

          <p className="verify-footer">
            {t("auth.verifyEmail.alreadyConfirmed")} <Link to="/login">{t("auth.common.loginNav")}</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
