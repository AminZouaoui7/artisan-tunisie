import {
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

     

      <section className="boutique-collection-intro">
        <div className="boutique-collection-divider">
          <span />
          <i />
          <span />
        </div>

        <p>Take a look at our handmade boutique collections</p>
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