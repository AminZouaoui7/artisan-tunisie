import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import { useI18n } from "../i18n/i18n";
import "../styles/SeoPages.css";

export default function TunisianRugsPage() {
  const { t } = useI18n();

  const canonical = "/tunisian-rugs";
  const title = t("seo.tunisianRugs.metaTitle");
  const description = t("seo.tunisianRugs.metaDescription");

  const canonicalUrl =
    typeof window === "undefined"
      ? canonical
      : new URL(canonical, window.location.origin).toString();

  const faq = (["0", "1", "2"] as const).map((index) => ({
    question: t(`seo.tunisianRugs.faq.${index}.q`),
    answer: t(`seo.tunisianRugs.faq.${index}.a`),
  }));

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
    name: t("seo.tunisianRugs.h1"),
    description,
    url: canonicalUrl,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "L’Artisan de la Médina",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="seo-page">
      <SeoHead title={title} description={description} canonical={canonical} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([org, page, faqSchema]),
        }}
      />

      <div className="seo-page-inner">
        <header className="seo-hero">
          <p className="seo-kicker">{t("seo.common.kicker")}</p>
          <h1 className="seo-title">{t("seo.tunisianRugs.h1")}</h1>
          <p className="seo-lead">{t("seo.tunisianRugs.lead")}</p>

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
            <h2>{t("seo.tunisianRugs.sections.authenticTitle")}</h2>
            <p>{t("seo.tunisianRugs.sections.authenticP1")}</p>
            <p>{t("seo.tunisianRugs.sections.authenticP2")}</p>
          </section>

          <section className="seo-section">
            <h2>{t("seo.common.faqTitle")}</h2>
            <div className="seo-faq">
              {faq.map((item) => (
                <div key={item.question} className="seo-faq-item">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

