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
import ceramic1 from "../assets/ceramic1.png";
import ceramic2 from "../assets/ceramic2.png";
import ceramic3 from "../assets/ceramic3.png";
import ceramic4 from "../assets/ceramic4.png";
import ceramic5 from "../assets/ceramic5.png";
import ceramic6 from "../assets/ceramic6.png";
import ceramic7 from "../assets/ceramic7.png";

import mosaiqueImg from "../assets/mosaique.png";
import bijouxImg from "../assets/bijoux.png";

import tab1 from "../assets/tab1.png";
import tab2 from "../assets/tab2.png";
import tab3 from "../assets/tab3.png";
import tab4 from "../assets/tab4.png";
import tab5 from "../assets/tab5.png";

const ceramicImages = [
  ceramicImg,
  ceramic1,
  ceramic2,
  ceramic3,
  ceramic4,
  ceramic5,
  ceramic6,
  ceramic7,
];

const tableauImages = [tab1, tab2, tab3, tab4, tab5];

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

      <section className="boutique-gallery-section" id="ceramique">
        <div className="boutique-gallery-header">
          <span className="boutique-eyebrow boutique-eyebrow--dark">
            <Store size={15} />
            {t("boutiquePage.sections.ceramic.eyebrow")}
          </span>

          <h2>{t("boutiquePage.sections.ceramic.title")}</h2>

          <p>{t("boutiquePage.sections.ceramic.text")}</p>
        </div>

        <div className="boutique-masonry">
          {ceramicImages.map((image, index) => (
            <div className="boutique-masonry__item" key={index}>
              <img
                src={image}
                alt={t("boutiquePage.sections.ceramic.imageAlt", {
                  index: index + 1,
                })}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="boutique-gallery-section" id="bijoux">
        <div className="boutique-gallery-header">
          <span className="boutique-eyebrow boutique-eyebrow--dark">
            <Gem size={15} />
            {t("boutiquePage.sections.jewelry.eyebrow")}
          </span>

          <h2>{t("boutiquePage.sections.jewelry.title")}</h2>

          <p>{t("boutiquePage.sections.jewelry.text")}</p>
        </div>

        <div className="boutique-feature-showcase boutique-feature-showcase--bijoux">
          <img src={bijouxImg} alt={t("boutiquePage.sections.jewelry.imageAlt")} />

          <div>
            <span>{t("boutiquePage.sections.jewelry.featureEyebrow")}</span>
            <h3>{t("boutiquePage.sections.jewelry.featureTitle")}</h3>
            <p>{t("boutiquePage.sections.jewelry.featureText")}</p>
          </div>
        </div>
      </section>

      <section className="boutique-gallery-section" id="mosaique">
        <div className="boutique-gallery-header">
          <span className="boutique-eyebrow boutique-eyebrow--dark">
            <Sparkles size={15} />
            {t("boutiquePage.sections.mosaic.eyebrow")}
          </span>

          <h2>{t("boutiquePage.sections.mosaic.title")}</h2>

          <p>{t("boutiquePage.sections.mosaic.text")}</p>
        </div>

        <div className="boutique-feature-showcase">
          <img src={mosaiqueImg} alt={t("boutiquePage.sections.mosaic.imageAlt")} />

          <div>
            <span>{t("boutiquePage.sections.mosaic.featureEyebrow")}</span>
            <h3>{t("boutiquePage.sections.mosaic.featureTitle")}</h3>
            <p>{t("boutiquePage.sections.mosaic.featureText")}</p>
          </div>
        </div>
      </section>

      <section className="boutique-gallery-section" id="tableaux">
        <div className="boutique-gallery-header">
          <span className="boutique-eyebrow boutique-eyebrow--dark">
            <Palette size={15} />
            {t("boutiquePage.sections.paintings.eyebrow")}
          </span>

          <h2>{t("boutiquePage.sections.paintings.title")}</h2>

          <p>{t("boutiquePage.sections.paintings.text")}</p>
        </div>

        <div className="boutique-tableaux-grid">
          {tableauImages.map((image, index) => (
            <div className="boutique-tableaux-card" key={index}>
              <img
                src={image}
                alt={t("boutiquePage.sections.paintings.imageAlt", {
                  index: index + 1,
                })}
              />
            </div>
          ))}
        </div>
      </section>

      
    </main>
  );
}
