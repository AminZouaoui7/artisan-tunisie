import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useI18n } from "../i18n/i18n";
import SeoHead from "../components/SeoHead";

import "../styles/BoutiquePage.css";

import heroImage from "../assets/cbd0ea42-92dc-4cd6-a8e7-0b3133fe44f2.optimized.webp";

import ceramicImg from "../assets/ceramic.optimized.webp";
import ceramic2 from "../assets/ceramic2.optimized.webp";
import ceramic3 from "../assets/ceramic3.optimized.webp";
import ceramic4 from "../assets/ceramic4.optimized.webp";
import ceramic5 from "../assets/ceramic5.optimized.webp";
import ceramic6 from "../assets/ceramic6.optimized.webp";

import bijouxImg from "../assets/bijoux.optimized.webp";

import mosaiqueImg from "../assets/mosaique.optimized.webp";
import mosaique2 from "../assets/mosaique2.optimized.webp";

import boisImg from "../assets/bois.optimized.webp";
import bois2Img from "../assets/bois2.optimized.webp";

import tab1 from "../assets/tab1.optimized.webp";
import tab2 from "../assets/tab2.optimized.webp";
import tab3 from "../assets/tab3.optimized.webp";
import tab4 from "../assets/tab4.optimized.webp";
import tab5 from "../assets/tab5.optimized.webp";

type CategoryCard = {
  id: string;
  title: string;
  text: string;
  gallery: string[];
};

export default function BoutiquePage() {
  const { t } = useI18n();

  const categoryCards: CategoryCard[] = [
    {
      id: "ceramique",
      title: t("boutiquePage.categories.ceramic.title"),
      text: t("boutiquePage.categories.ceramic.text"),
      gallery: [ceramicImg, ceramic2, ceramic3, ceramic4, ceramic5, ceramic6],
    },
    {
      id: "bijoux",
      title: t("boutiquePage.categories.jewelry.title"),
      text: t("boutiquePage.categories.jewelry.text"),
      gallery: [bijouxImg],
    },
    {
      id: "mosaique",
      title: t("boutiquePage.categories.mosaic.title"),
      text: t("boutiquePage.categories.mosaic.text"),
      gallery: [mosaiqueImg, mosaique2],
    },
    {
      id: "bois",
      title: "Bois d'Olivier",
      text: "Découvrez notre collection d'objets artisanaux en bois d'olivier tunisien : plateaux, planches de présentation, jeux d'échecs, bols, mortiers et pièces uniques façonnées à la main par des artisans passionnés.",
      gallery: [boisImg, bois2Img],
    },
    {
      id: "tableaux",
      title: t("boutiquePage.categories.paintings.title"),
      text: t("boutiquePage.categories.paintings.text"),
      gallery: [tab1, tab2, tab3, tab4, tab5],
    },
  ];

  const [activeImages, setActiveImages] = useState<Record<string, number>>({});

  const getActiveIndex = (id: string) => activeImages[id] ?? 0;

  const goPrevious = (id: string, total: number) => {
    setActiveImages((prev) => ({
      ...prev,
      [id]: getActiveIndex(id) === 0 ? total - 1 : getActiveIndex(id) - 1,
    }));
  };

  const goNext = (id: string, total: number) => {
    setActiveImages((prev) => ({
      ...prev,
      [id]: getActiveIndex(id) === total - 1 ? 0 : getActiveIndex(id) + 1,
    }));
  };

  return (
    <main className="boutique-page">
      <SeoHead
        title="Boutique d’artisanat dans la Médina de Tunis | L’Artisan de la Médina"
        description="Visitez notre boutique d’artisanat tunisien dans la Médina de Tunis : tapis faits main, céramique, bijoux, mosaïque et bois d’olivier."
        canonical="/boutique"
        image={heroImage}
      />
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

          <div className="boutique-hero__actions boutique-hero__actions--single">
            <Link to="/products" className="boutique-btn boutique-btn--primary">
              <Eye size={16} />
              {t("boutiquePage.heroPrimaryCta")}
            </Link>
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

      {categoryCards.map((section) => {
        const activeIndex = getActiveIndex(section.id);
        const activeImage = section.gallery[activeIndex];

        return (
          <section
            className="boutique-gallery-section"
            id={section.id}
            key={section.id}
          >
            <div className="boutique-feature-showcase boutique-feature-showcase--slider">
              <div className="boutique-slider-card">
                <img src={activeImage} alt={section.title} />

                {section.gallery.length > 1 && (
                  <>
                    <button
                      className="boutique-slider-arrow boutique-slider-arrow--left"
                      onClick={() =>
                        goPrevious(section.id, section.gallery.length)
                      }
                      type="button"
                      aria-label="Image précédente"
                    >
                      <ChevronLeft size={24} />
                    </button>

                    <button
                      className="boutique-slider-arrow boutique-slider-arrow--right"
                      onClick={() => goNext(section.id, section.gallery.length)}
                      type="button"
                      aria-label="Image suivante"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                <div className="boutique-slider-counter">
                  {activeIndex + 1} / {section.gallery.length}
                </div>
              </div>

              <div className="boutique-feature-content">
                <span>{section.title}</span>
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
