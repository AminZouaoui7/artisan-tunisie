import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Send,
  Instagram,
  Facebook,
} from "lucide-react";
import { useState } from "react";
import "../styles/Footer.css";
import { useI18n } from "../i18n/i18n";
import {
  FACEBOOK_URL,
  GOOGLE_MAPS_URL,
  INSTAGRAM_URL,
} from "../constants/externalLinks";

export default function Footer() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer
      className="artisan-footer"
      style={{
        backgroundImage: `
          linear-gradient(rgba(236, 228, 216, 0.82), rgba(232, 222, 208, 0)),
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Decorative top border */}
      <div className="artisan-footer-ornament">
        <svg viewBox="0 0 1200 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            d="M0 12 Q150 0 300 12 Q450 24 600 12 Q750 0 900 12 Q1050 24 1200 12"
            fill="none"
            stroke="rgba(140, 100, 60, 0.25)"
            strokeWidth="1.5"
          />
          {[100, 300, 500, 700, 900, 1100].map((x) => (
            <g key={x} transform={`translate(${x}, 12)`}>
              <rect x="-4" y="-4" width="8" height="8" fill="none" stroke="rgba(140, 100, 60, 0.3)" strokeWidth="1" transform="rotate(45)" />
            </g>
          ))}
        </svg>
      </div>

      <div className="artisan-footer-inner">
        {/* Brand column */}
        <div className="artisan-footer-col artisan-footer-brand-col">
          <div className="artisan-footer-brand-block">
            {/* Geometric motif */}
            <div className="artisan-brand-motif" aria-hidden="true">
              <svg viewBox="0 0 48 48" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <polygon points="24,2 46,13 46,35 24,46 2,35 2,13" fill="none" stroke="rgba(140,100,60,0.5)" strokeWidth="1.5"/>
                <polygon points="24,8 40,16 40,32 24,40 8,32 8,16" fill="none" stroke="rgba(140,100,60,0.35)" strokeWidth="1"/>
                <rect x="18" y="18" width="12" height="12" fill="rgba(140,100,60,0.15)" stroke="rgba(140,100,60,0.4)" strokeWidth="1" transform="rotate(45 24 24)"/>
              </svg>
            </div>
            <h3 className="artisan-footer-brand">{t("common.brandNameAscii")}</h3>
          </div>
          <p className="artisan-footer-tagline">
            {t("footer.description")}
          </p>
          <div className="artisan-footer-socials">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="artisan-social-btn"
              aria-label={t("footer.instagram")}
            >
              <Instagram size={18} />
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="artisan-social-btn"
              aria-label={t("footer.facebook")}
            >
              <Facebook size={18} />
            </a>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="artisan-social-btn"
              aria-label={t("footer.googleMaps")}
            >
              <MapPin size={18} />
            </a>
          </div>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="artisan-footer-map-btn"
          >
            <MapPin size={18} />
            <span>{t("footer.viewOnGoogleMaps")}</span>
          </a>
        </div>

        {/* Vertical divider */}
        <div className="artisan-footer-divider" aria-hidden="true" />

        {/* Navigation column */}
        <div className="artisan-footer-col">
          <h4 className="artisan-footer-heading">
            <span className="artisan-heading-line" />
            {t("footer.quickLinks")}
          </h4>
          <nav className="artisan-footer-nav">
            {[
              { to: "/", label: t("nav.home") },
              { to: "/our-story", label: t("nav.ourStory") },
              { to: "/products", label: t("nav.products") },
              { to: "/reservation", label: t("nav.reservation") },
              { to: "/contact", label: t("nav.contact") },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="artisan-footer-link">
                <ArrowRight size={13} className="artisan-link-arrow" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Vertical divider */}
        <div className="artisan-footer-divider" aria-hidden="true" />

        {/* Contact column */}
        <div className="artisan-footer-col">
          <h4 className="artisan-footer-heading">
            <span className="artisan-heading-line" />
            {t("footer.contact")}
          </h4>
          <ul className="artisan-footer-contact">
            <li>
              <span className="artisan-contact-icon"><MapPin size={15} /></span>
              <span>{t("footer.address")}</span>
            </li>
            <li>
              <span className="artisan-contact-icon"><Phone size={15} /></span>
              <a href="tel:+21656250910">+216 56 250 910</a>
            </li>
            <li>
              <span className="artisan-contact-icon"><Mail size={15} /></span>
              <a href="mailto:contact@artisan-medina.com">contact@artisan-medina.com</a>
            </li>
          </ul>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="artisan-footer-contact-map"
          >
            <MapPin size={16} />
            <span>{t("footer.viewOnGoogleMaps")}</span>
          </a>
        </div>

        {/* Vertical divider */}
        <div className="artisan-footer-divider" aria-hidden="true" />

        {/* Newsletter column */}
        <div className="artisan-footer-col">
          <h4 className="artisan-footer-heading">
            <span className="artisan-heading-line" />
            {t("footer.newsletter")}
          </h4>
          <p className="artisan-newsletter-text">
            {t("footer.newsletterText")}
          </p>
          {subscribed ? (
            <div className="artisan-subscribed-msg">
              {t("footer.subscribed")}
            </div>
          ) : (
            <form className="artisan-newsletter-form" onSubmit={handleSubscribe}>
              <div className="artisan-input-wrapper">
                <Mail size={15} className="artisan-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("common.emailPlaceholder")}
                  className="artisan-newsletter-input"
                  required
                />
              </div>
              <button type="submit" className="artisan-newsletter-btn">
                <Send size={15} />
                {t("footer.subscribe")}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="artisan-footer-bottom">
        <div className="artisan-footer-bottom-inner">
          <span>{t("footer.copyright", { year: new Date().getFullYear() })}</span>
          <div className="artisan-footer-bottom-links">
            <Link to="/privacy">{t("footer.links.privacy")}</Link>
            <span className="artisan-dot" aria-hidden="true">✦</span>
            <Link to="/terms">{t("footer.links.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
