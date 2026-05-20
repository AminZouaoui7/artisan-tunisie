import {
  ArrowRight,
  Gem,
  MapPin,
  MessageCircle,
  Sparkles,
  Eye,
  Store,
  Sun,
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

const boutiqueProducts = [
  {
    name: "Céramique artisanale",
    category: "Pièces peintes à la main",
    image: ceramicImg,
    text: "Assiettes, bols, vases et pièces décoratives inspirées du savoir-faire tunisien.",
  },
  {
    name: "Collection bleue",
    category: "Art de table",
    image: ceramic1,
    text: "Des créations uniques aux motifs méditerranéens pour sublimer votre intérieur.",
  },
  {
    name: "Poterie décorative",
    category: "Décoration",
    image: ceramic2,
    text: "Des formes authentiques, façonnées pour apporter chaleur et caractère.",
  },
  {
    name: "Céramique premium",
    category: "Pièce unique",
    image: ceramic3,
    text: "Une sélection raffinée disponible uniquement dans notre boutique.",
  },
  {
    name: "Motifs traditionnels",
    category: "Fait main",
    image: ceramic4,
    text: "Chaque détail raconte une histoire entre tradition, couleur et élégance.",
  },
  {
    name: "Objets d’intérieur",
    category: "Maison",
    image: ceramic5,
    text: "Des objets décoratifs pensés pour créer une ambiance artisanale chic.",
  },
  {
    name: "Céramique colorée",
    category: "Collection boutique",
    image: ceramic6,
    text: "Des couleurs vivantes et des finitions artisanales pour une touche unique.",
  },
  {
    name: "Édition artisanale",
    category: "Sélection limitée",
    image: ceramic7,
    text: "Des pièces disponibles en petite quantité, visibles uniquement sur place.",
  },
  {
    name: "Mosaïque tunisienne",
    category: "Décoration murale",
    image: mosaiqueImg,
    text: "Des créations en mosaïque pour décorer vos espaces avec authenticité.",
  },
  {
    name: "Bijoux artisanaux",
    category: "Accessoires",
    image: bijouxImg,
    text: "Une sélection de bijoux faits main, entre finesse et inspiration orientale.",
  },
];

const rooftopImages = [tab1, tab2, tab3, tab4, tab5];

export default function BoutiquePage() {
  return (
    <main className="boutique-page">
      <section className="boutique-hero">
        <img src={heroImage} alt="Boutique Artisan Medina" />

        <div className="boutique-hero__overlay" />

        <div className="boutique-hero__content">
          <span className="boutique-eyebrow">
            <Sparkles size={16} />
            Boutique Artisan Medina
          </span>

          <h1>Des pièces artisanales à découvrir uniquement sur place.</h1>

          <p>
            Notre boutique réunit une sélection raffinée de créations faites
            main : céramique, mosaïque, bijoux et objets décoratifs. Ces pièces
            ne sont pas vendues en ligne afin de préserver leur caractère rare
            et leur expérience de découverte.
          </p>

          <div className="boutique-hero__actions">
            <a href="#collection" className="boutique-btn boutique-btn--primary">
              Voir la collection
              <ArrowRight size={18} />
            </a>

            <a href="#rooftop" className="boutique-btn boutique-btn--ghost">
              Découvrir le rooftop
            </a>
          </div>
        </div>
      </section>

      <section className="boutique-intro">
        <div>
          <span className="boutique-eyebrow boutique-eyebrow--dark">
            <Store size={15} />
            Sélection exclusive
          </span>
          <h2>Une boutique pensée comme une galerie artisanale.</h2>
        </div>

        <p>
          Chaque objet est choisi pour sa beauté, son histoire et son lien avec
          l’artisanat méditerranéen. Les produits présentés ici sont disponibles
          uniquement dans notre espace boutique.
        </p>
      </section>

      <section className="boutique-products" id="collection">
        <div className="boutique-section-header">
          <span className="boutique-eyebrow boutique-eyebrow--dark">
            <Gem size={15} />
            Nos pièces en boutique
          </span>
          <h2>Des créations uniques, visibles sur place.</h2>
        </div>

        <div className="boutique-products__grid">
          {boutiqueProducts.map((product, index) => (
            <article
              className="boutique-product-card"
              key={product.name}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="boutique-product-card__image">
                <img src={product.image} alt={product.name} />
                <span>{product.category}</span>
              </div>

              <div className="boutique-product-card__content">
                <h3>{product.name}</h3>
                <p>{product.text}</p>

                <div className="boutique-product-card__footer">
                  <span>
                    <Eye size={15} />
                    Disponible en boutique
                  </span>
                  <MessageCircle size={18} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="boutique-rooftop" id="rooftop">
        <div className="boutique-rooftop__content">
          <span className="boutique-eyebrow">
            <Sun size={16} />
            Rooftop Artisan Medina
          </span>

          <h2>Un lieu chaleureux pour découvrir nos créations autrement.</h2>

          <p>
            Notre rooftop prolonge l’expérience boutique dans une ambiance
            lumineuse et méditerranéenne. Un espace idéal pour admirer nos
            pièces, prendre le temps d’échanger et vivre l’univers Artisan
            Medina.
          </p>

          <div className="boutique-rooftop__info">
            <span>
              <MapPin size={17} />
              Boutique & rooftop
            </span>
            <span>
              <Sparkles size={17} />
              Expérience artisanale
            </span>
          </div>
        </div>

        <div className="boutique-rooftop__gallery">
          {rooftopImages.map((image, index) => (
            <div className="boutique-rooftop__photo" key={index}>
              <img src={image} alt={`Rooftop Artisan Medina ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      <section className="boutique-final-cta">
        <span className="boutique-eyebrow boutique-eyebrow--dark">
          <MessageCircle size={15} />
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