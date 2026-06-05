import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import { useI18n } from "../i18n/i18n";
import "../styles/SeoPages.css";

export default function TapisTunisiensPage() {
  const { t } = useI18n();

  const canonical = "/tapis-tunisiens";
  const title = t("seo.tapisTunisiens.metaTitle");
  const description = t("seo.tapisTunisiens.metaDescription");

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
    name: t("seo.tapisTunisiens.h1"),
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
          <h1 className="seo-title">{t("seo.tapisTunisiens.h1")}</h1>
          <p className="seo-lead">{t("seo.tapisTunisiens.lead")}</p>

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
            <h2>{t("seo.tapisTunisiens.sections.heritageTitle")}</h2>
            <p>{t("seo.tapisTunisiens.sections.heritageP1")}</p>
            <p>{t("seo.tapisTunisiens.sections.heritageP2")}</p>
          </section>

          <section className="seo-section">
            <h2>{t("seo.tapisTunisiens.sections.savoirFaireTitle")}</h2>
            <p>{t("seo.tapisTunisiens.sections.savoirFaireP1")}</p>

            <div className="seo-cards">
              {(["0", "1", "2"] as const).map((index) => (
                <div key={index} className="seo-card">
                  <strong>{t(`seo.tapisTunisiens.cards.${index}.title`)}</strong>
                  <span>{t(`seo.tapisTunisiens.cards.${index}.text`)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="seo-section">
            <h2>{t("seo.tapisTunisiens.sections.decorationTitle")}</h2>
            <p>{t("seo.tapisTunisiens.sections.decorationP1")}</p>
          </section>

          <section className="seo-section">
            <h2>{t("seo.tapisTunisiens.sections.shippingTitle")}</h2>
            <p>{t("seo.tapisTunisiens.sections.shippingP1")}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

