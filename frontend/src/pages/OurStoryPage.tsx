import { Link } from "react-router-dom";
import lhajjImage from "../assets/lhajj.jpg";
import bourguibaImage from "../assets/photoavecbourguiba.png";
import "../styles/OurStoryPage.css";
import ourstory1 from "../assets/ourstory1.jpg";
import ourstory2 from "../assets/ourstory2.jpg";
import { useI18n } from "../i18n/i18n";
const IMG_FOUNDER = lhajjImage;
const IMG_BOURGUIBA = bourguibaImage;

export default function OurStoryPage() {
  const { t } = useI18n();

  const TIMELINE = [
    {
      side: "left" as const,
      year: t("ourStory.page.generations.g1962.label"),
      title: t("ourStory.page.generations.g1962.title"),
      body: t("ourStory.page.generations.g1962.text"),
    },
    {
      side: "right" as const,
      year: t("ourStory.page.generations.g1980.label"),
      title: t("ourStory.page.generations.g1980.title"),
      body: t("ourStory.page.generations.g1980.text"),
    },
    {
      side: "left" as const,
      year: t("ourStory.page.generations.today.year"),
      title: t("ourStory.page.generations.today.title"),
      body: t("ourStory.page.generations.today.text"),
    },
  ];

  const PROMISE_ITEMS = [
    {
      icon: "✦",
      title: t("ourStory.values.selectedTitle"),
      body: t("ourStory.values.selectedDesc"),
    },
    {
      icon: "🪡",
      title: t("ourStory.values.handmadeTitle"),
      body: t("ourStory.values.handmadeDesc"),
    },
    {
      icon: "💎",
      title: t("ourStory.values.authenticityTitle"),
      body: t("ourStory.values.authenticityDesc"),
    },
  ];
  return (
    <div className="story-page">
      <section className="story-hero">
        <div className="story-hero-inner">
          <div className="story-hero-kicker">
            <span className="story-hero-kicker-line" />
            {t("nav.ourStory")}
            <span className="story-hero-kicker-line" />
          </div>

          <h1 className="story-hero-title">
            {t("ourStory.title")}
            <br />
            <em>{t("ourStory.titleEmphasis")}</em>
          </h1>

          <p className="story-hero-sub">
            {t("ourStory.description")}
          </p>

          <div className="story-ornament">
            <span className="story-ornament-line" />
            <span className="story-ornament-gem">✦</span>
            <span
              className="story-ornament-gem"
              style={{ fontSize: 13, letterSpacing: 4 }}
            >
              {t("common.brandNameAscii")}
            </span>
            <span className="story-ornament-gem">✦</span>
            <span className="story-ornament-line story-ornament-line--rev" />
          </div>
        </div>

        <div className="story-scroll-hint">
          <div className="story-scroll-line" />
        </div>
      </section>

      <section className="story-founder">
        <div className="story-founder-inner">
          <div className="story-founder-visual">
            <div className="story-founder-image-card">
              <img
                src={IMG_FOUNDER}
                alt={t("ourStory.page.generations.g1962.title")}
                className="story-founder-image"
              />

              <div className="story-founder-badge">
                <span className="story-founder-badge-year">1962</span>
                <span className="story-founder-badge-label">
                  {t("ourStory.badgePlace")}
                </span>
              </div>
            </div>
          </div>

          <div className="story-founder-text">
            <p className="story-kicker">{t("ourStory.page.generations.g1962.label")}</p>

            <h2 className="story-section-title">
              Haj Bechir
              <br />
              <em>Ben Ghorbel</em>
            </h2>

            <p className="story-body">
              {t("ourStory.page.generations.g1962.text")}
            </p>

            <div className="story-pullquote">
              <p>
                {t("ourStory.page.intro.text")}
              </p>
            </div>

            <p className="story-body">
              {t("ourStory.page.legacy.text")}
            </p>

            <div className="story-stats">
              <div className="story-stat">
                <span className="story-stat-number">60+</span>
                <span className="story-stat-label">
                  {t("ourStory.page.stats.history")}
                </span>
              </div>

              <div className="story-stat">
                <span className="story-stat-number">5</span>
                <span className="story-stat-label">
                  {t("ourStory.page.stats.generations")}
                </span>
              </div>

              <div className="story-stat">
                <span className="story-stat-number">100%</span>
                <span className="story-stat-label">
                  Tunisian
                  <br />
                  artisans
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="story-legacy">
  <div className="story-legacy-inner">
    
    <div className="story-legacy-text">
      <p className="story-kicker">{t("ourStory.page.legacy.kicker")}</p>

      <h2 className="story-section-title">
        {t("ourStory.page.legacy.title")}
      </h2>

      <p className="story-body">
        {t("ourStory.page.legacy.text")}
      </p>

      <p className="story-body">
        {t("ourStory.page.legacy.closing")}
      </p>

      <div className="story-legacy-cta-row">
        <Link to="/products" className="story-btn-primary">
          {t("ourStory.ctaProducts")}
        </Link>
      </div>
    </div>

    <div className="story-legacy-visual">
      <div className="story-legacy-grid">
        
        <div className="story-legacy-image-card story-legacy-image-card--large">
          <img
            src={ourstory1}
            alt="Artisanat tunisien"
            className="story-legacy-image"
          />

     
        </div>

        <div className="story-legacy-image-card story-legacy-image-card--small">
          <img
            src={ourstory2}
            alt="Patrimoine artisanal"
            className="story-legacy-image"
          />

         
        </div>

      </div>
    </div>
  </div>
</section>


    </div>
  );
}