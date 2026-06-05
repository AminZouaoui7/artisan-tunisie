import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import { useI18n } from "../i18n/i18n";
import "../styles/SeoPages.css";

export default function TapisLaineTunisiePage() {
  const { t } = useI18n();

  const canonical = "/tapis-laine-tunisie";
  const title = t("seo.tapisLaineTunisie.metaTitle");
  const description = t("seo.tapisLaineTunisie.metaDescription");

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
    name: t("seo.tapisLaineTunisie.h1"),
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
          <h1 className="seo-title">{t("seo.tapisLaineTunisie.h1")}</h1>
          <p className="seo-lead">{t("seo.tapisLaineTunisie.lead")}</p>

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
            <h2>{t("seo.tapisLaineTunisie.sections.naturalTitle")}</h2>
            <p>{t("seo.tapisLaineTunisie.sections.naturalP1")}</p>
          </section>

          <section className="seo-section">
            <h2>{t("seo.tapisLaineTunisie.sections.durabilityTitle")}</h2>
            <p>{t("seo.tapisLaineTunisie.sections.durabilityP1")}</p>
          </section>

          <section className="seo-section">
            <h2>{t("seo.tapisLaineTunisie.sections.careTitle")}</h2>
            <p>{t("seo.tapisLaineTunisie.sections.careP1")}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

