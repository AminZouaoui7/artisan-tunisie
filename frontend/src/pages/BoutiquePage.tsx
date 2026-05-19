// src/pages/BoutiquePage.tsx

import {
  ArrowRight,
  Clock,
  Gem,
  MapPin,
  Sparkles,
  Store,
  Sun,
  HandHeart,
  Eye,
} from "lucide-react";

import "../styles/BoutiquePage.css";

import boutiqueImg1 from "../assets/ChatGPT Image May 5, 2026, 02_21_18 PM.png";
import boutiqueImg2 from "../assets/ChatGPT Image May 5, 2026, 02_21_30 PM.png";
import boutiqueImg3 from "../assets/ChatGPT Image May 5, 2026, 02_21_36 PM.png";
import boutiqueImg4 from "../assets/ChatGPT Image May 5, 2026, 02_21_42 PM.png";
import boutiqueImg5 from "../assets/ChatGPT Image May 5, 2026, 02_21_46 PM.png";
import boutiqueImg6 from "../assets/ChatGPT Image May 5, 2026, 02_22_04 PM.png";
import boutiqueImg7 from "../assets/ChatGPT Image May 5, 2026, 02_22_16 PM.png";
import boutiqueImg8 from "../assets/ChatGPT Image May 5, 2026, 02_22_21 PM.png";
import boutiqueImg9 from "../assets/ChatGPT Image May 5, 2026, 02_22_27 PM.png";
import boutiqueImg10 from "../assets/ChatGPT Image May 5, 2026, 02_22_33 PM.png";
import boutiqueImg11 from "../assets/ChatGPT Image May 5, 2026, 02_22_39 PM.png";
import boutiqueImg12 from "../assets/ChatGPT Image May 5, 2026, 02_23_09 PM.png";
import boutiqueImg13 from "../assets/ChatGPT Image May 5, 2026, 02_23_17 PM.png";
import boutiqueImg14 from "../assets/ChatGPT Image May 5, 2026, 02_23_25 PM.png";
import boutiqueImg15 from "../assets/boutique/ChatGPT Image May 5, 2026, 02_23_31 PM.png";
import boutiqueImg16 from "../assets/boutique/ChatGPT Image May 5, 2026, 02_23_38 PM.png";

import rooftop1 from "../assets/image00103.png";
import rooftop2 from "../assets/image00108.png";

const boutiqueImages = [
  { image: boutiqueImg1, title: "L’entrée de la boutique", text: "Une première immersion dans notre univers, entre élégance, matières nobles et esprit médina." },
  { image: boutiqueImg2, title: "Le premier salon", text: "Un espace chaleureux où les tapis prennent vie dans une ambiance raffinée." },
  { image: boutiqueImg3, title: "Le coin tapis", text: "Chaque pièce est exposée avec soin pour révéler ses couleurs, ses motifs et son caractère." },
  { image: boutiqueImg4, title: "L’espace sélection", text: "Des créations choisies pour leur authenticité, leur histoire et leur finition." },
  { image: boutiqueImg5, title: "Les détails artisanaux", text: "Des textures, des motifs et des finitions qui racontent le geste de l’artisan." },
  { image: boutiqueImg6, title: "Le salon d’inspiration", text: "Un espace pensé pour imaginer votre intérieur avec nos pièces uniques." },
  { image: boutiqueImg7, title: "Les couleurs de la médina", text: "Une atmosphère inspirée des terres chaudes, des fibres naturelles et du savoir-faire." },
  { image: boutiqueImg8, title: "Le mur des pièces rares", text: "Des tapis et objets d’exception mis en scène comme dans une galerie." },
  { image: boutiqueImg9, title: "L’espace découverte", text: "Un lieu pour prendre le temps, observer les matières et choisir avec émotion." },
  { image: boutiqueImg10, title: "La galerie intérieure", text: "Une présentation élégante qui met en valeur chaque coin de notre boutique." },
  { image: boutiqueImg11, title: "L’ambiance maison", text: "Une boutique pensée comme un intérieur vivant, chaleureux et inspirant." },
  { image: boutiqueImg12, title: "Le coin conseil", text: "Un espace calme pour échanger, comparer les pièces et trouver le bon tapis." },
  { image: boutiqueImg13, title: "Les pièces signature", text: "Des créations fortes, uniques, sélectionnées pour leur âme et leur présence." },
  { image: boutiqueImg14, title: "Le parcours boutique", text: "Chaque passage révèle une matière, une couleur et une nouvelle histoire." },
  { image: boutiqueImg15, title: "Le dernier salon", text: "Une ambiance intime qui invite à ralentir et apprécier le travail fait main." },
  { image: boutiqueImg16, title: "L’expérience Artisan Medina", text: "Une immersion complète dans l’univers de l’artisanat et de la décoration." },
];

const featuredImages = boutiqueImages.slice(0, 8);

const rooftopImages = [
  {
    image: rooftop1,
    title: "Le rooftop de la boutique",
    text: "Un espace lumineux et apaisant pour prolonger l’expérience Artisan Medina.",
  },
  {
    image: rooftop2,
    title: "Une pause au-dessus de la médina",
    text: "Un lieu ouvert, chaleureux et inspirant, entre ciel, lumière et matières naturelles.",
  },
];

export default function BoutiquePage() {
  return (
    <main className="boutique-page">
      <section className="boutique-hero">
        <div className="boutique-hero__bg">
          <img src={boutiqueImg1} alt="Notre boutique Artisan Medina" />
        </div>

        <div className="boutique-hero__overlay" />

        <div className="boutique-hero__content">
          <span className="boutique-kicker">
            <Sparkles size={16} />
            Notre boutique
          </span>

          <h1>Un lieu vivant dédié à l’artisanat.</h1>

          <p>
            Entrez dans notre boutique et découvrez chaque coin comme une scène :
            tapis uniques, matières naturelles, lumière douce et âme artisanale.
          </p>

          <div className="boutique-hero__actions">
            <a href="#boutique-scroll" className="boutique-btn">
              Explorer la boutique
              <ArrowRight size={18} />
            </a>

            <a href="/reservation" className="boutique-btn boutique-btn--glass">
              Réserver une visite
            </a>
          </div>
        </div>
      </section>

      <section className="boutique-intro">
        <div className="boutique-intro__card">
          <span className="boutique-kicker">L’expérience Artisan Medina</span>

          <h2>Plus qu’une boutique, une maison d’inspiration.</h2>

          <p>
            Chaque espace a été pensé pour révéler la beauté des pièces :
            couleurs profondes, textures naturelles, savoir-faire tunisien et
            atmosphère chaleureuse.
          </p>
        </div>

        <div className="boutique-intro__stats">
          <div>
            <Store size={24} />
            <strong>Showroom</strong>
            <span>Un espace dédié à nos pièces uniques.</span>
          </div>

          <div>
            <Gem size={24} />
            <strong>Pièces rares</strong>
            <span>Sélectionnées pour leur qualité et leur histoire.</span>
          </div>

          <div>
            <HandHeart size={24} />
            <strong>Artisanat</strong>
            <span>Des créations faites main avec âme et caractère.</span>
          </div>
        </div>
      </section>

      <section id="boutique-scroll" className="boutique-scroll">
        <div className="boutique-scroll__header">
          <span className="boutique-kicker">
            <Eye size={15} />
            Visite immersive
          </span>

          <h2>Parcourez les plus beaux coins de notre boutique.</h2>

          <p>
            Faites défiler horizontalement pour découvrir l’ambiance, les salons,
            les détails et les pièces signature.
          </p>
        </div>

        <div className="boutique-scroll__track">
          {featuredImages.map((item, index) => (
            <article className="boutique-scroll__card" key={item.title}>
              <img src={item.image} alt={item.title} />

              <div className="boutique-scroll__content">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="boutique-gallery" className="boutique-gallery">
        <div className="boutique-section-header">
          <span className="boutique-kicker">Chaque coin a son histoire</span>

          <h2>Une galerie pensée comme un parcours.</h2>

          <p>
            Une composition visuelle premium pour mettre en valeur l’ambiance,
            les espaces, les matières et l’âme de la boutique.
          </p>
        </div>

        <div className="boutique-gallery__grid">
          {boutiqueImages.map((item, index) => (
            <article className="boutique-gallery__card" key={item.title}>
              <img src={item.image} alt={item.title} />

              <div className="boutique-gallery__content">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="boutique-rooftop">
        <div className="boutique-section-header boutique-section-header--light">
          <span className="boutique-kicker">
            <Sun size={15} />
            Le rooftop
          </span>

          <h2>Un coin lumineux pour prolonger la visite.</h2>

          <p>
            Notre rooftop offre une parenthèse calme et inspirante, entre ciel,
            lumière naturelle et ambiance méditerranéenne.
          </p>
        </div>

        <div className="boutique-rooftop__grid">
          {rooftopImages.map((item) => (
            <article className="boutique-rooftop__card" key={item.title}>
              <img src={item.image} alt={item.title} />

              <div className="boutique-rooftop__content">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="boutique-visit">
        <div className="boutique-visit__text">
          <span className="boutique-kicker">
            <MapPin size={15} />
            Venez nous voir
          </span>

          <h2>Une visite pour ressentir les matières en vrai.</h2>

          <p>
            Les photos montrent l’ambiance, mais la vraie magie se vit sur
            place : toucher les fibres, comparer les couleurs, découvrir les
            détails et choisir la pièce qui vous ressemble.
          </p>

          <div className="boutique-visit__meta">
            <div>
              <Clock size={18} />
              <span>Visite calme et personnalisée</span>
            </div>

            <div>
              <Sparkles size={18} />
              <span>Conseil décoration sur place</span>
            </div>
          </div>

          <a href="/reservation" className="boutique-btn boutique-btn--dark">
            Réserver une visite
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="boutique-visit__image">
          <img src={boutiqueImg2} alt="Visiter notre boutique" />
        </div>
      </section>
    </main>
  );
}