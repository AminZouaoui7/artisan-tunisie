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

const categoryCards = [
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
                    Découvrir la collection
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
            Collection céramique
          </span>

          <h2>L’art de la céramique tunisienne.</h2>

          <p>
            Une collection artisanale riche en couleurs, motifs et détails
            peints à la main.
          </p>
        </div>

        <div className="boutique-masonry">
          {ceramicImages.map((image, index) => (
            <div className="boutique-masonry__item" key={index}>
              <img src={image} alt={`Céramique artisanale ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      <section className="boutique-gallery-section" id="bijoux">
        <div className="boutique-gallery-header">
          <span className="boutique-eyebrow boutique-eyebrow--dark">
            <Gem size={15} />
            Bijoux artisanaux
          </span>

          <h2>Des pièces fines et élégantes.</h2>

          <p>
            Des bijoux inspirés de l’art oriental et méditerranéen, disponibles
            uniquement en boutique.
          </p>
        </div>

        <div className="boutique-feature-showcase boutique-feature-showcase--bijoux">
          <img src={bijouxImg} alt="Bijoux artisanaux" />

          <div>
            <span>Accessoires faits main</span>
            <h3>Bijoux artisanaux</h3>
            <p>
              Une sélection raffinée de pièces lumineuses, idéales pour offrir
              ou compléter une tenue avec une touche orientale chic.
            </p>
          </div>
        </div>
      </section>

      <section className="boutique-gallery-section" id="mosaique">
        <div className="boutique-gallery-header">
          <span className="boutique-eyebrow boutique-eyebrow--dark">
            <Sparkles size={15} />
            Mosaïque
          </span>

          <h2>Des mosaïques décoratives lumineuses.</h2>

          <p>
            Des créations murales inspirées du patrimoine tunisien, pensées pour
            apporter couleur et caractère à votre intérieur.
          </p>
        </div>

        <div className="boutique-feature-showcase">
          <img src={mosaiqueImg} alt="Mosaïque tunisienne" />

          <div>
            <span>Décoration murale</span>
            <h3>Mosaïque tunisienne</h3>
            <p>
              Des motifs colorés, une finition artisanale et une présence forte
              pour transformer chaque mur en pièce unique.
            </p>
          </div>
        </div>
      </section>

      <section className="boutique-gallery-section" id="tableaux">
        <div className="boutique-gallery-header">
          <span className="boutique-eyebrow boutique-eyebrow--dark">
            <Palette size={15} />
            Tableaux artisanaux
          </span>

          <h2>Illustrations inspirées de la médina.</h2>

          <p>
            Des tableaux colorés représentant portes, ruelles et paysages
            tunisiens.
          </p>
        </div>

        <div className="boutique-tableaux-grid">
          {tableauImages.map((image, index) => (
            <div className="boutique-tableaux-card" key={index}>
              <img src={image} alt={`Tableau artisanal ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      <section className="boutique-final-cta">
        <span className="boutique-eyebrow boutique-eyebrow--dark">
          <Palette size={15} />
          Visite boutique
        </span>

        <h2>Venez découvrir les pièces en vrai.</h2>

        <p>
          Certaines créations ne peuvent être pleinement appréciées qu’en les
          voyant de près : les matières, les couleurs, les détails et la main de
          l’artisan.
        </p>

        <a href="/contact" className="boutique-btn boutique-btn--primary">
          Nous contacter
          <ArrowRight size={18} />
        </a>
      </section>
    </main>
  );
}