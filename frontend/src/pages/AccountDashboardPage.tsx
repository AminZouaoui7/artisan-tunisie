import { useState, type FormEvent } from "react";

import {
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Send,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import { authService } from "../services/authService";
import { useI18n } from "../i18n/i18n";
import "../styles/AccountPage.css";

export default function AccountDashboardPage() {
  const { t } = useI18n();
  const { user, token, logout } = useAuth();

  const [loadingCode, setLoadingCode] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [errorRaw, setErrorRaw] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    code: "",
  });

  async function requestCode() {
    if (!token) return;

    try {
      setLoadingCode(true);
      setErrorKey(null);
      setErrorRaw("");
      setSuccessMessage("");

      const result = await authService.requestChangePasswordCode(token);
      setSuccessMessage(result.message);
    } catch (error) {
      if (error instanceof Error) {
        setErrorRaw(error.message);
      } else {
        setErrorKey("account.common.unknownError");
      }
    } finally {
      setLoadingCode(false);
    }
  }

  async function submitPasswordChange(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!token) return;

    try {
      setChangingPassword(true);
      setErrorKey(null);
      setErrorRaw("");
      setSuccessMessage("");

      const result = await authService.confirmChangePassword(
        token,
        passwordForm
      );

      setSuccessMessage(result.message);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        code: "",
      });

      setTimeout(() => logout(), 2500);
    } catch (error) {
      if (error instanceof Error) {
        setErrorRaw(error.message);
      } else {
        setErrorKey("account.common.unknownError");
      }
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <>
      <div className="account-card">
        <div className="account-card-head">
          <h3>{t("account.dashboard.personalInfoTitle")}</h3>
        </div>

        <div className="account-card-divider" />

        <div className="account-info-grid">
          <div className="account-info-item">
            <span>
              <UserRound size={14} />
              {t("account.dashboard.fullName")}
            </span>
            <strong>
              {user?.firstName} {user?.lastName}
            </strong>
          </div>

          <div className="account-info-item">
            <span>
              <Mail size={14} />
              {t("account.dashboard.email")}
            </span>
            <strong>{user?.email}</strong>
          </div>

          <div className="account-info-item">
            <span>
              <Phone size={14} />
              {t("account.dashboard.phone")}
            </span>
            <strong>{user?.phone || t("account.common.notProvided")}</strong>
          </div>
        </div>
      </div>

      <div className="account-card">
        <div className="account-card-head">
          <h3>{t("account.dashboard.securityTitle")}</h3>
        </div>

        <div className="account-card-divider" />

        <div className="account-security-top">
          <div>
            <h4>{t("account.dashboard.changePasswordTitle")}</h4>
            <p>
              {t("account.dashboard.changePasswordSubtitle")}
            </p>
          </div>

          <button
            type="button"
            className="account-send-code-btn"
            onClick={requestCode}
            disabled={loadingCode}
          >
            <Send size={14} />
            {loadingCode
              ? t("account.dashboard.sendingCode")
              : t("account.dashboard.sendCode")}
          </button>
        </div>

        <form className="account-password-form" onSubmit={submitPasswordChange}>
          <div className="account-password-grid">
            <div className="account-field">
              <label>{t("account.dashboard.currentPassword")}</label>
              <div className="account-input-wrap">
                <LockKeyhole size={15} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      currentPassword: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="account-field">
              <label>{t("account.dashboard.newPassword")}</label>
              <div className="account-input-wrap">
                <LockKeyhole size={15} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      newPassword: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="account-field">
              <label>{t("account.dashboard.verificationCode")}</label>
              <div className="account-input-wrap">
                <ShieldCheck size={15} />
                <input
                  type="text"
                  placeholder={t("account.dashboard.codePlaceholder")}
                  value={passwordForm.code}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      code: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          </div>

          {(errorRaw || errorKey) && (
            <div className="account-alert-error">
              {errorRaw || (errorKey ? t(errorKey) : "")}
            </div>
          )}

          {successMessage && (
            <div className="account-alert-success">{successMessage}</div>
          )}

          <button
            type="submit"
            className="account-change-password-btn"
            disabled={changingPassword}
          >
            {changingPassword
              ? t("account.dashboard.changingPassword")
              : t("account.dashboard.submitPassword")}
          </button>
        </form>
      </div>

      
    </>
  );
}
