import {
  ArrowRight,
  Eye,
  Gem,
  HandHeart,
  MapPin,
  Palette,
  Shapes,
  Sparkles,
  Store,
  Sun,
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
import boutiqueImg15 from "../assets/ChatGPT Image May 5, 2026, 02_23_31 PM.png";
import boutiqueImg16 from "../assets/ChatGPT Image May 5, 2026, 02_23_38 PM.png";

import rooftop1 from "../assets/image00103.png";
import rooftop2 from "../assets/image00108.png";
import rooftop4 from "../assets/rooftop1 (1).png";
import rooftop6 from "../assets/rooftop1 (2).png";
import rooftop7 from "../assets/rooftop1 (3).png";

const univers = [
  {
    icon: Store,
    image: boutiqueImg2,
    title: "Tapis & textiles",
    text: "Des pièces uniques sélectionnées pour leurs matières, leurs couleurs et leur caractère.",
  },
  {
    icon: Palette,
    image: boutiqueImg3,
    title: "Céramique artisanale",
    text: "Assiettes, vases et objets décoratifs inspirés du savoir-faire tunisien.",
  },
  {
    icon: Gem,
    image: boutiqueImg4,
    title: "Bijoux & accessoires",
    text: "Des créations colorées et raffinées à découvrir directement en boutique.",
  },
  {
    icon: Shapes,
    image: boutiqueImg8,
    title: "Décoration & pièces rares",
    text: "Tableaux, objets muraux et pièces signature pour donner une âme à votre intérieur.",
  },
];

const boutiqueGallery = [
  { image: boutiqueImg1, title: "L’entrée galerie", category: "Accueil" },
  { image: boutiqueImg2, title: "Le salon principal", category: "Tapis" },
  { image: boutiqueImg3, title: "Le coin céramique", category: "Céramique" },
  { image: boutiqueImg4, title: "Les pièces colorées", category: "Objets" },
  { image: boutiqueImg5, title: "Les détails artisanaux", category: "Décoration" },
  { image: boutiqueImg6, title: "Le salon d’inspiration", category: "Ambiance" },
  { image: boutiqueImg7, title: "Les couleurs de la médina", category: "Matières" },
  { image: boutiqueImg8, title: "Le mur des pièces rares", category: "Galerie" },
  { image: boutiqueImg9, title: "L’espace découverte", category: "Visite" },
  { image: boutiqueImg10, title: "La galerie intérieure", category: "Parcours" },
  { image: boutiqueImg11, title: "L’ambiance maison", category: "Maison" },
  { image: boutiqueImg12, title: "Le coin conseil", category: "Conseil" },
  { image: boutiqueImg13, title: "Les pièces signature", category: "Signature" },
  { image: boutiqueImg14, title: "Le parcours boutique", category: "Showroom" },
  { image: boutiqueImg15, title: "Le dernier salon", category: "Inspiration" },
  { image: boutiqueImg16, title: "L’expérience complète", category: "Boutique" },
];

const rooftopGallery = [
  rooftop1,
  rooftop2,
  rooftop4,
  rooftop6,
  rooftop7,
];

const visitReasons = [
  {
    icon: Eye,
    title: "Voir les matières en vrai",
    text: "Les couleurs, les textures et les détails se découvrent mieux sur place.",
  },
  {
    icon: HandHeart,
    title: "Recevoir un conseil personnalisé",
    text: "Nous vous aidons à choisir selon votre intérieur, vos envies et votre style.",
  },
  {
    icon: Sparkles,
    title: "Découvrir l’inédit",
    text: "Certaines pièces artisanales sont uniquement visibles dans notre boutique.",
  },
];

export default function BoutiquePage() {
  return (
    <main className="boutique-page">
      <section className="boutique-showroom">
        <div className="boutique-showroom__text">
          <span className="boutique-kicker">
            <Sparkles size={15} />
            Notre boutique
          </span>

          <h1>Découvrez notre boutique au cœur de l’artisanat tunisien.</h1>

          <p>
            En ligne, nous mettons surtout en avant nos tapis. En boutique, vous
            découvrez tout un univers : céramique, bijoux, décoration, tableaux,
            objets artisanaux et pièces rares.
          </p>

          <div className="boutique-showroom__actions">
            <a href="/reservation" className="boutique-btn">
              Réserver une visite
              <ArrowRight size={18} />
            </a>

            <a href="#boutique-gallery" className="boutique-btn boutique-btn--light">
              Voir la boutique
            </a>
          </div>
        </div>

        <div className="boutique-showroom__visual">
          <div className="boutique-showroom__image boutique-showroom__image--main">
            <img src={boutiqueImg1} alt="Boutique Artisan Medina" />
          </div>

          <div className="boutique-showroom__image boutique-showroom__image--small">
            <img src={boutiqueImg3} alt="Céramique artisanale" />
          </div>

          <div className="boutique-showroom__image boutique-showroom__image--wide">
            <img src={boutiqueImg8} alt="Pièces rares Artisan Medina" />
          </div>

          <div className="boutique-showroom__badge">
            <strong>21</strong>
            <span>photos à découvrir</span>
          </div>
        </div>
      </section>

      <section className="boutique-univers">
        <div className="boutique-section-heading">
          <span className="boutique-kicker">Une boutique, plusieurs univers</span>
          <h2>Bien plus que des tapis.</h2>
          <p>
            Chaque espace révèle une sélection artisanale différente, pensée
            pour inspirer votre intérieur.
          </p>
        </div>

        <div className="boutique-univers__grid">
          {univers.map((item) => {
            const Icon = item.icon;

            return (
              <article className="boutique-universe-card" key={item.title}>
                <img src={item.image} alt={item.title} />

                <div className="boutique-universe-card__content">
                  <div className="boutique-universe-card__icon">
                    <Icon size={20} />
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="boutique-emotion">
        <img src={boutiqueImg6} alt="Ambiance boutique Artisan Medina" />
        <div className="boutique-emotion__overlay" />

        <div className="boutique-emotion__content">
          <span className="boutique-kicker">
            <Store size={15} />
            Expérience sur place
          </span>

          <h2>Un lieu pensé pour voir, toucher et choisir avec émotion.</h2>

          <p>
            La visite permet de ressentir les matières, comparer les couleurs et
            découvrir les pièces que les photos ne racontent jamais complètement.
          </p>
        </div>
      </section>

      <section id="boutique-gallery" className="boutique-gallery-full">
        <div className="boutique-section-heading">
          <span className="boutique-kicker">
            <Eye size={15} />
            Visite en images
          </span>

          <h2>Tous les coins de notre boutique.</h2>

          <p>
            Une galerie complète, plus grande et plus respirante, pour montrer
            la vraie richesse du showroom.
          </p>
        </div>

        <div className="boutique-gallery-full__grid">
          {boutiqueGallery.map((item, index) => (
            <article className="boutique-gallery-full__card" key={item.title}>
              <img src={item.image} alt={item.title} />

              <div className="boutique-gallery-full__content">
                <span>
                  {String(index + 1).padStart(2, "0")} · {item.category}
                </span>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="boutique-reasons">
        <div className="boutique-reasons__intro">
          <span className="boutique-kicker">
            <MapPin size={15} />
            Pourquoi venir ?
          </span>

          <h2>La boutique complète l’expérience du site.</h2>
        </div>

        <div className="boutique-reasons__grid">
          {visitReasons.map((item) => {
            const Icon = item.icon;

            return (
              <article className="boutique-reason-card" key={item.title}>
                <Icon size={24} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>
<section className="boutique-rooftop-hero">
  <div className="boutique-rooftop-hero__carousel">
    {rooftopGallery.map((image, index) => (
      <article className="boutique-rooftop-hero__slide" key={index}>
        <img src={image} alt={`Rooftop Artisan Medina ${index + 1}`} />
      </article>
    ))}
  </div>

  <div className="boutique-rooftop-hero__content">
    <span className="boutique-kicker">
      <Sun size={15} />
      Le rooftop
    </span>

    <h2>Une pause au-dessus de la médina.</h2>

    <p>
      Après la visite, le rooftop prolonge l’expérience dans une ambiance
      claire, lumineuse et ouverte sur l’esprit de la médina.
    </p>
  </div>
</section>

      <section className="boutique-final">
        <span className="boutique-kicker">
          <Sparkles size={15} />
          Visite privée
        </span>

        <h2>Envie de découvrir la boutique ?</h2>

        <p>
          Réservez un moment avec nous pour explorer les tapis, la céramique,
          les bijoux, les objets déco et les pièces artisanales disponibles sur
          place.
        </p>

        <a href="/reservation" className="boutique-btn boutique-btn--dark">
          Réserver une visite
          <ArrowRight size={18} />
        </a>
      </section>
    </main>
  );
}