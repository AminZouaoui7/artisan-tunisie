import {
  ArrowRight,
  Eye,
  Gem,
  Home,
  Palette,
  Sparkles,
  Store,
} from "lucide-react";

import "../styles/BoutiquePage.css";

import heroImage from "../assets/cbd0ea42-92dc-4cd6-a8e7-0b3133fe44f2.png";

import ceramicImg from "../assets/ceramic.png";
import bijouxImg from "../assets/bijoux.png";
import mosaiqueImg from "../assets/mosaique.png";
import tab1 from "../assets/tab1.png";

const categories = [
  {
    id: "ceramique",
    title: "Céramique",
    image: ceramicImg,
    icon: Store,
    text: "Pièces peintes à la main, vases, bols et objets décoratifs aux motifs traditionnels.",
  },
  {
    id: "bijoux",
    title: "Bijoux",
    image: bijouxImg,
    icon: Gem,
    text: "Bijoux artisanaux et accessoires raffinés, inspirés de l’art oriental.",
  },
  {
    id: "mosaique",
    title: "Mosaïque",
    image: mosaiqueImg,
    icon: Sparkles,
    text: "Mosaïques décoratives faites main pour embellir vos espaces avec authenticité.",
  },
  {
    id: "tableaux",
    title: "Tableaux",
    image: tab1,
    icon: Palette,
    text: "Tableaux et illustrations inspirés de la médina, des portes et paysages tunisiens.",
  },
];

export default function BoutiquePage() {
  return (
    <main className="boutique-page">
      <section className="boutique-hero">
        <img src={heroImage} alt="Boutique Artisan Medina" />
        <div className="boutique-hero__overlay" />

        <div className="boutique-hero__content">
          <span className="boutique-eyebrow">
            <Sparkles size={15} />
            Boutique Artisan Medina
          </span>

          <h1>Des pièces artisanales à découvrir uniquement sur place.</h1>

          <div className="boutique-ornament">
            <span />
            <i />
            <span />
          </div>

          <p>
            Notre boutique réunit une sélection raffinée de créations faites
            main : céramique, mosaïque, bijoux, tableaux et objets décoratifs.
            Ces pièces ne sont pas vendues en ligne afin de préserver leur
            caractère rare et leur expérience de découverte.
          </p>

          <div className="boutique-hero__actions">
            <a href="#collections" className="boutique-btn boutique-btn--primary">
              <Eye size={16} />
              Voir la collection
            </a>

            <a href="/contact" className="boutique-btn boutique-btn--ghost">
              <Home size={16} />
              Visiter la boutique
            </a>
          </div>
        </div>
      </section>

      <section className="boutique-showcase" id="collections">
        <div className="boutique-showcase__header">
          <span className="boutique-eyebrow boutique-eyebrow--dark">
            <Sparkles size={15} />
            Sélection exclusive
          </span>

          <h2>Une boutique pensée comme une galerie artisanale.</h2>

          <div className="boutique-ornament boutique-ornament--dark">
            <span />
            <i />
            <span />
          </div>

          <p>
            Chaque objet est choisi pour sa beauté, son histoire et son lien
            avec l’artisanat méditerranéen. Les produits présentés ici sont
            disponibles uniquement dans notre espace boutique.
          </p>
        </div>

        <div className="boutique-category-grid">
          {categories.map((item, index) => {
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
                    Découvrir la collection
                    <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}