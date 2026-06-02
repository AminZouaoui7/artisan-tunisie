import { Eye } from "lucide-react";
import { useI18n } from "../i18n/i18n";

import "../styles/BoutiquePage.css";

import heroImage from "../assets/cbd0ea42-92dc-4cd6-a8e7-0b3133fe44f2.png";

import ceramicImg from "../assets/ceramic.png";
import ceramic2 from "../assets/ceramic2.png";
import ceramic3 from "../assets/ceramic3.png";
import ceramic4 from "../assets/ceramic4.png";
import ceramic5 from "../assets/ceramic5.png";
import ceramic6 from "../assets/ceramic6.png";

import bijouxImg from "../assets/bijoux.png";

import mosaiqueImg from "../assets/mosaique.png";
import mosaique2 from "../assets/mosaique2.png";

import boisImg from "../assets/bois.png";
import bois2Img from "../assets/bois2.png";

import tab1 from "../assets/tab1.png";
import tab2 from "../assets/tab2.png";
import tab3 from "../assets/tab3.png";
import tab4 from "../assets/tab4.png";
import tab5 from "../assets/tab5.png";

export default function BoutiquePage() {
  const { t } = useI18n();

  const categoryCards = [
    {
      id: "ceramique",
      title: t("boutiquePage.categories.ceramic.title"),
      image: ceramicImg,
      text: t("boutiquePage.categories.ceramic.text"),
      gallery: [
        ceramicImg,
        ceramic2,
        ceramic3,
        ceramic4,
        ceramic5,
        ceramic6,
        
      ],
    },
    {
      id: "bijoux",
      title: t("boutiquePage.categories.jewelry.title"),
      image: bijouxImg,
      text: t("boutiquePage.categories.jewelry.text"),
      gallery: [bijouxImg],
    },
    {
      id: "mosaique",
      title: t("boutiquePage.categories.mosaic.title"),
      image: mosaiqueImg,
      text: t("boutiquePage.categories.mosaic.text"),
      gallery: [mosaiqueImg, mosaique2],
    },
    {
      id: "bois",
      title: "Bois d'Olivier",
      image: boisImg,
      text: "Découvrez notre collection d'objets artisanaux en bois d'olivier tunisien : plateaux, planches de présentation, jeux d'échecs, bols, mortiers et pièces uniques façonnées à la main par des artisans passionnés.",
      gallery: [boisImg, bois2Img],
    },
    {
      id: "tableaux",
      title: t("boutiquePage.categories.paintings.title"),
      image: tab1,
      text: t("boutiquePage.categories.paintings.text"),
      gallery: [tab1, tab2, tab3, tab4, tab5],
    },
  ];

  return (
    <main className="boutique-page">
      <section className="boutique-hero">
        <img src={heroImage} alt="Boutique artisanale tunisienne" />
        <div className="boutique-hero__overlay" />

        <div className="boutique-hero__content">
          <h1>{t("boutiquePage.heroTitle")}</h1>

          <div className="boutique-ornament">
            <span />
            <i />
            <span />
          </div>

          <p>{t("boutiquePage.heroDescription")}</p>

          <div className="boutique-hero__actions">
            <a href="#ceramique" className="boutique-btn boutique-btn--primary">
              <Eye size={16} />
              {t("boutiquePage.heroPrimaryCta")}
            </a>

            <a href="/products" className="boutique-btn boutique-btn--ghost">
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
      </section>

      {categoryCards.map((section) => (
        <section
          className="boutique-gallery-section"
          id={section.id}
          key={section.id}
        >
          <div className="boutique-feature-showcase">
            <img src={section.image} alt={section.title} />

            <div>
              <span>{section.title}</span>
              <h3>{section.title}</h3>
              <p>{section.text}</p>
            </div>
          </div>

          <div className="boutique-category-gallery">
            {section.gallery.map((img, index) => (
              <div className="boutique-category-gallery__item" key={index}>
                <img src={img} alt={`${section.title} ${index + 1}`} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}