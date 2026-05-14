import { ShieldAlert, ArrowRight, House, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import logo from "../assets/color white.png";
import { useI18n } from "../i18n/i18n";
import "../styles/SessionExpiredPage.css";

export default function SessionExpiredPage() {
  const { t } = useI18n();
  return (
    <section className="session-expired-page">
      <div className="session-expired-noise" />
      <div className="session-expired-light session-expired-light-one" />
      <div className="session-expired-light session-expired-light-two" />

      <div className="session-expired-pattern">
        <span />
        <span />
        <span />
      </div>

      <div className="session-expired-card">
        <div className="session-expired-logo-wrap">
          <img src={logo} alt="Artisan Medina" className="session-expired-logo" />
        </div>

        <div className="session-expired-icon">
          <ShieldAlert size={38} />
        </div>

       

        <h1>{t("auth.sessionExpired.title")}</h1>

        <p className="session-expired-text">
          {t("auth.sessionExpired.description")}
        </p>

        <div className="session-expired-actions">
          <Link
            to="/login"
            className="session-expired-btn session-expired-btn-primary"
          >
            {t("auth.sessionExpired.reLogin")}
          </Link>

          <Link
            to="/"
            className="session-expired-btn session-expired-btn-secondary"
          >
            <House size={17} />
            {t("auth.sessionExpired.backHome")}
          </Link>
        </div>
      </div>
    </section>
  );
}
