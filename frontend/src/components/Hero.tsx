import { useI18n } from "../i18n/i18n";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="hero" id="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <span className="hero-badge">{t("legacy.hero.badge")}</span>

          <h1>
            {t("legacy.hero.titleLine1")}
            <span> {t("legacy.hero.titleEmphasis")}</span>
          </h1>

          <p>{t("legacy.hero.description")}</p>

          <div className="hero-actions">
            <button className="btn btn-primary">{t("legacy.hero.ctaProducts")}</button>
            <button className="btn btn-light">{t("legacy.hero.ctaStory")}</button>
          </div>

          <div className="hero-stats">
            <div>
              <strong>{t("legacy.hero.stat1Value")}</strong>
              <span>{t("legacy.hero.stat1Label")}</span>
            </div>
            <div>
              <strong>{t("legacy.hero.stat2Value")}</strong>
              <span>{t("legacy.hero.stat2Label")}</span>
            </div>
            <div>
              <strong>{t("legacy.hero.stat3Value")}</strong>
              <span>{t("legacy.hero.stat3Label")}</span>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <img
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
            alt={t("legacy.hero.imageAlt")}
          />
        </div>
      </div>
    </section>
  );
}
