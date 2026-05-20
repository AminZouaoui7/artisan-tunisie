import {
  ArrowRight,
  Gem,
  MessageCircle,
  Sparkles,
  Eye,
  Store,
  Palette,
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

const ceramicProducts = [
  {
    name: "Céramique artisanale",
    category: "Pièces peintes à la main",
    image: ceramicImg,
    text: "Assiettes, bols, vases et pièces décoratives inspirées du savoir-faire tunisien.",
  },
  {
    name: "Collection colorée",
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
    name: "Céramique murale",
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
];

const bijouProducts = [
  {
    name: "Bijoux artisanaux",
    category: "Accessoires faits main",
    image: bijouxImg,
    text: "Une sélection de bijoux fins, inspirés de l’artisanat oriental et méditerranéen.",
  },
];

const mosaiqueProducts = [
  {
    name: "Mosaïque tunisienne",
    category: "Décoration murale",
    image: mosaiqueImg,
    text: "Des créations en mosaïque colorées pour donner du caractère à vos espaces.",
  },
];

const tableauProducts = [
  {
    name: "Tableau médina",
    category: "Art mural",
    image: tab1,
    text: "Une pièce décorative inspirée des ruelles, portes et couleurs de la médina.",
  },
  {
    name: "Illustration artisanale",
    category: "Souvenir artistique",
    image: tab2,
    text: "Des tableaux lumineux qui racontent l’ambiance tunisienne avec douceur.",
  },
  {
    name: "Collection portes bleues",
    category: "Décoration murale",
    image: tab3,
    text: "Une série de tableaux inspirée des portes traditionnelles et paysages méditerranéens.",
  },
  {
    name: "Tableau oriental",
    category: "Pièce décorative",
    image: tab4,
    text: "Des compositions riches en détails, parfaites pour une décoration authentique.",
  },
  {
    name: "Mini tableaux",
    category: "Sélection boutique",
    image: tab5,
    text: "Des petits formats décoratifs faciles à offrir ou à collectionner.",
  },
];

function ProductSection({
  id,
  eyebrow,
  title,
  description,
  products,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  products: {
    name: string;
    category: string;
    image: string;
    text: string;
  }[];
}) {
  return (
    <section className="boutique-category-section" id={id}>
      <div className="boutique-section-header">
        <span className="boutique-eyebrow boutique-eyebrow--dark">
          <Gem size={15} />
          {eyebrow}
        </span>

        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div
        className={
          products.length <= 2
            ? "boutique-products__grid boutique-products__grid--small"
            : "boutique-products__grid"
        }
      >
        {products.map((product, index) => (
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
  );
}

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
            main : céramique, mosaïque, bijoux, tableaux et objets décoratifs.
            Ces pièces ne sont pas vendues en ligne afin de préserver leur
            caractère rare et leur expérience de découverte.
          </p>

          <div className="boutique-hero__actions">
            <a href="#ceramique" className="boutique-btn boutique-btn--primary">
              Voir la collection
              <ArrowRight size={18} />
            </a>

            <a href="#tableaux" className="boutique-btn boutique-btn--ghost">
              Découvrir les tableaux
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

      <ProductSection
        id="ceramique"
        eyebrow="Céramique"
        title="Céramiques artisanales peintes à la main."
        description="Une collection riche en couleurs, motifs et formes traditionnelles pour décorer votre maison avec authenticité."
        products={ceramicProducts}
      />

      <ProductSection
        id="bijoux"
        eyebrow="Bijoux"
        title="Bijoux artisanaux et accessoires raffinés."
        description="Des pièces délicates à découvrir en boutique, idéales pour offrir ou compléter une tenue avec une touche artisanale."
        products={bijouProducts}
      />

      <ProductSection
        id="mosaique"
        eyebrow="Mosaïque"
        title="Mosaïques décoratives inspirées de la tradition tunisienne."
        description="Des créations murales colorées, travaillées avec soin pour apporter du caractère à chaque intérieur."
        products={mosaiqueProducts}
      />

      <ProductSection
        id="tableaux"
        eyebrow="Tableaux"
        title="Tableaux et illustrations inspirés de la médina."
        description="Des œuvres murales lumineuses qui capturent les portes, les ruelles, les couleurs et l’âme de l’artisanat tunisien."
        products={tableauProducts}
      />

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
        </a>
      </section>
    </main>
  );
}