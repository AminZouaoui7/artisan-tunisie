import {
  ArrowRight,
  Eye,
  Gem,
  Home,
  Palette,
  Sparkles,
  Store,
} from "lucide-react";
import { useI18n } from "../i18n/i18n";

import "../styles/BoutiquePage.css";

import heroImage from "../assets/cbd0ea42-92dc-4cd6-a8e7-0b3133fe44f2.png";

import ceramicImg from "../assets/ceramic.png";
import mosaiqueImg from "../assets/mosaique.png";
import bijouxImg from "../assets/bijoux.png";
import tab1 from "../assets/tab1.png";

export default function BoutiquePage() {
  const { t } = useI18n();

  const categoryCards = [
    {
      id: "ceramique",
      title: t("boutiquePage.categories.ceramic.title"),
      image: ceramicImg,
      icon: Store,
      text: t("boutiquePage.categories.ceramic.text"),
    },
    {
      id: "bijoux",
      title: t("boutiquePage.categories.jewelry.title"),
      image: bijouxImg,
      icon: Gem,
      text: t("boutiquePage.categories.jewelry.text"),
    },
    {
      id: "mosaique",
      title: t("boutiquePage.categories.mosaic.title"),
      image: mosaiqueImg,
      icon: Sparkles,
      text: t("boutiquePage.categories.mosaic.text"),
    },
    {
      id: "tableaux",
      title: t("boutiquePage.categories.paintings.title"),
      image: tab1,
      icon: Palette,
      text: t("boutiquePage.categories.paintings.text"),
    },
  ];

  return (
    <main className="boutique-page">
      <section className="boutique-hero">
        <img src={heroImage} alt={t("boutiquePage.heroEyebrow")} />
        <div className="boutique-hero__overlay" />

        <div className="boutique-hero__content">
          <span className="boutique-eyebrow">
            <Sparkles size={15} />
            {t("boutiquePage.heroEyebrow")}
          </span>

          <h1>{t("boutiquePage.heroTitle")}</h1>

          <div className="boutique-ornament">
            <span />
            <i />
            <span />
          </div>

          <p>{t("boutiquePage.heroDescription")}</p>

          <div className="boutique-hero__actions">
            <a href="#collections" className="boutique-btn boutique-btn--primary">
              <Eye size={16} />
              {t("boutiquePage.heroPrimaryCta")}
            </a>

            <a href="/products" className="boutique-btn boutique-btn--ghost">
              <Home size={16} />
              {t("boutiquePage.heroSecondaryCta")}
            </a>
          </div>
        </div>
      </section>

      <section className="boutique-showcase" id="collections">
        <div className="boutique-showcase__header">
          <span className="boutique-eyebrow boutique-eyebrow--dark">
            <Sparkles size={15} />
            {t("boutiquePage.showcaseEyebrow")}
          </span>

          <h2>{t("boutiquePage.showcaseTitle")}</h2>

          <div className="boutique-ornament boutique-ornament--dark">
            <span />
            <i />
            <span />
          </div>

          <p>{t("boutiquePage.showcaseDescription")}</p>
        </div>

        <div className="boutique-category-grid">
          {categoryCards.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                className="boutique-category-card"
                key={item.id}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="boutique-category-card__image">
                  <img src={item.image} alt={item.title} />
                </div>

                <div className="boutique-category-card__icon">
                  <Icon size={27} />
                </div>

                <div className="boutique-category-card__content">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>

                  <a href={`#${item.id}`}>
                    {t("boutiquePage.discoverCollection")}
                    <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

     {categoryCards.map((section) => {
  const Icon = section.icon;

  return (
    <section
      className="boutique-gallery-section"
      id={section.id}
      key={section.id}
    >
      <div className="boutique-feature-showcase">
        <img src={section.image} alt={section.title} />

        <div>
          <span>
            <Icon size={15} />
            {section.title}
          </span>

          <h3>{section.title}</h3>
          <p>{section.text}</p>
        </div>
      </div>
    </section>
  );
})}
    </main>
  );
}