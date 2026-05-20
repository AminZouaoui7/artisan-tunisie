import { Link } from "react-router-dom";
import { useI18n } from "../i18n/i18n";
import lhajjImage from "../assets/lhajj.jpg";
import founderDecorImage from "../assets/imageeess.png";

import "../styles/OurStoryPage.css";

import ourstory1 from "../assets/ourstory1.jpg";
import ourstory2 from "../assets/ourstory2.jpg";

const IMG_FOUNDER = lhajjImage;

export default function OurStoryPage() {
  const { t } = useI18n();
  const guests = [
    {
      image: founderDecorImage,
      alt: t("ourStory.custom.guests.greece.alt"),
      label: t("ourStory.custom.guests.greece.label"),
      name: t("ourStory.custom.guests.greece.name"),
      text: t("ourStory.custom.guests.greece.text"),
      large: true,
    },
    {
      image: ourstory1,
      alt: t("ourStory.custom.guests.minister.alt"),
      label: t("ourStory.custom.guests.minister.label"),
      name: t("ourStory.custom.guests.minister.name"),
      text: t("ourStory.custom.guests.minister.text"),
      large: false,
    },
    {
      image: ourstory2,
      alt: t("ourStory.custom.guests.menem.alt"),
      label: t("ourStory.custom.guests.menem.label"),
      name: t("ourStory.custom.guests.menem.name"),
      text: t("ourStory.custom.guests.menem.text"),
      large: false,
    },
  ];

  return (
    <div className="story-page">
      <section className="story-hero">
        <div className="story-hero-photo" />

        <div className="story-hero-panel">
          <p className="story-hero-kicker">{t("nav.ourStory")}</p>

          <h1 className="story-hero-title">
            {t("ourStory.custom.hero.titleLine1")}
            <br />
            <em>{t("ourStory.custom.hero.titleEmphasis")}</em>
          </h1>

          <p className="story-hero-sub">{t("ourStory.custom.hero.description")}</p>

          <div className="story-hero-highlight">
            {t("ourStory.custom.hero.highlight")}
          </div>

          <div className="story-ornament">
            <span className="story-ornament-line" />
            <span className="story-ornament-gem">✦</span>
            <span className="story-ornament-brand">{t("common.brandName")}</span>
            <span className="story-ornament-gem">✦</span>
            <span className="story-ornament-line" />
          </div>
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
                <span className="story-founder-badge-label">{t("ourStory.badgePlace")}</span>
              </div>
            </div>
          </div>

          <div className="story-founder-text">
            <p className="story-kicker">{t("ourStory.custom.founder.kicker")}</p>

            <h2 className="story-section-title">
              {t("ourStory.page.generations.g1962.title")}
            </h2>

            <p className="story-body">{t("ourStory.custom.founder.body1")}</p>

            <div className="story-pullquote">
              <p>{t("ourStory.page.intro.text")}</p>
            </div>

            <p className="story-body">{t("ourStory.custom.founder.body2")}</p>

            <div className="story-stats">
              <div className="story-stat">
                <span className="story-stat-number">60+</span>
                <span className="story-stat-label">{t("ourStory.page.stats.history")}</span>
              </div>

              <div className="story-stat">
                <span className="story-stat-number">5</span>
                <span className="story-stat-label">{t("ourStory.page.stats.generations")}</span>
              </div>

              <div className="story-stat">
                <span className="story-stat-number">100%</span>
                <span className="story-stat-label">
                  {t("ourStory.custom.founder.statArtisansLine1")}
                  <br />
                  {t("ourStory.custom.founder.statArtisansLine2")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="story-legacy">
        <div className="story-legacy-inner">
          <div className="story-legacy-text">
            <p className="story-kicker">{t("ourStory.custom.guests.kicker")}</p>

            <h2 className="story-section-title">
              {t("ourStory.custom.guests.title")}
            </h2>

            <p className="story-body">{t("ourStory.custom.guests.body1")}</p>

            <p className="story-body">{t("ourStory.custom.guests.body2")}</p>

            <div className="story-legacy-cta-row">
              <Link to="/products" className="story-btn-primary">
                {t("ourStory.ctaProducts")}
              </Link>
            </div>
          </div>

          <div className="story-legacy-visual">
            <div className="story-guests-grid">
              {guests.map((guest) => (
                <article
                  key={guest.name}
                  className={`story-guest-card${guest.large ? " story-guest-card--large" : ""}`}
                >
                  <img
                    src={guest.image}
                    alt={guest.alt}
                    className="story-guest-image"
                  />

                  <div className="story-guest-caption">
                    <span>{guest.label}</span>
                    <strong>{guest.name}</strong>
                    <p>{guest.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
