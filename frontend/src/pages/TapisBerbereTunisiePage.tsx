import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import { useI18n } from "../i18n/i18n";
import "../styles/SeoPages.css";

export default function TapisBerbereTunisiePage() {
  const { t } = useI18n();

  const canonical = "/tapis-berbere-tunisie";
  const title = t("seo.tapisBerbereTunisie.metaTitle");
  const description = t("seo.tapisBerbereTunisie.metaDescription");

  const canonicalUrl =
    typeof window === "undefined"
      ? canonical
      : new URL(canonical, window.location.origin).toString();

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "L’Artisan de la Médina",
    url:
      typeof window === "undefined"
        ? "/"
        : new URL("/", window.location.origin).toString(),
  };

  const page = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("seo.tapisBerbereTunisie.h1"),
    description,
    url: canonicalUrl,
    inLanguage: "fr",
    publisher: {
      "@type": "Organization",
      name: "L’Artisan de la Médina",
    },
  };

  return (
    <div className="seo-page">
      <SeoHead title={title} description={description} canonical={canonical} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([org, page]),
        }}
      />

      <div className="seo-page-inner">
        <header className="seo-hero">
          <p className="seo-kicker">{t("seo.common.kicker")}</p>
          <h1 className="seo-title">{t("seo.tapisBerbereTunisie.h1")}</h1>
          <p className="seo-lead">{t("seo.tapisBerbereTunisie.lead")}</p>

          <div className="seo-cta-row">
            <Link to="/products" className="seo-btn seo-btn--primary">
              {t("seo.common.ctaProducts")}
            </Link>
            <Link to="/reservation" className="seo-btn">
              {t("seo.common.ctaReservation")}
            </Link>
          </div>
        </header>

        <div className="seo-sections">
          <section className="seo-section">
            <h2>{t("seo.tapisBerbereTunisie.sections.motifsTitle")}</h2>
            <p>{t("seo.tapisBerbereTunisie.sections.motifsP1")}</p>
            <p>{t("seo.tapisBerbereTunisie.sections.motifsP2")}</p>
          </section>

          <section className="seo-section">
            <h2>{t("seo.tapisBerbereTunisie.sections.roomsTitle")}</h2>
            <p>{t("seo.tapisBerbereTunisie.sections.roomsP1")}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

