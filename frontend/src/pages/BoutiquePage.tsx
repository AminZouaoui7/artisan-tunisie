import {
  ArrowRight,
  Gem,
  MapPin,
  MessageCircle,
  Sparkles,
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


import rooftop2 from "../assets/rooftop1 (1).png";
import rooftop4 from "../assets/rooftop1 (2).png";
import rooftop5 from "../assets/rooftop1 (3).png";

const collections = [
  {
    title: "Céramique artisanale tunisienne",
    text: "Des pièces façonnées et décorées avec patience, entre couleurs méditerranéennes et gestes traditionnels.",
    image: ceramicImg,
    tag: "Fait main",
  },
  {
    title: "Tableaux décoratifs",
    text: "Des œuvres choisies pour habiller les intérieurs avec une présence chaleureuse et authentique.",
    image: tab1,
    tag: "Galerie",
  },
  {
    title: "Mosaïque & décoration",
    text: "Des objets rares qui racontent la matière, la lumière et l’âme des maisons tunisiennes.",
    image: mosaiqueImg,
    tag: "Pièces rares",
  },
  {
    title: "Bijoux & accessoires",
    text: "Des détails artisanaux élégants, pensés comme de petites pièces de caractère.",
    image: bijouxImg,
    tag: "Sélection",
  },
];

const gallery = [
  ceramic1,
  ceramic2,
  ceramic3,
  ceramic4,
  ceramic5,
  ceramic6,
  ceramic7,
  tab2,
  tab3,
  tab4,
  tab5,
  mosaiqueImg,
];

const rooftopImages = [ rooftop2, rooftop4, rooftop5];

export default function BoutiquePage() {
  return (
    <main className="boutique-page">
      <section className="boutique-hero">
        <img src={heroImage} alt="Boutique Artisan de la Médina" />

        <div className="boutique-hero__overlay" />

        <div className="boutique-hero__content">
          <span className="boutique-kicker">
            <Sparkles size={16} />
            Showroom artisanal
          </span>

          <h1>Nos Collections</h1>

          <p>
            Un univers intime où la céramique, les tableaux, les objets rares et
            les pièces faites à la main prolongent l’héritage familial
            d’Artisan de la Médina.
          </p>

          <div className="boutique-hero__actions">
            <a href="#boutique-showroom" className="boutique-btn boutique-btn--primary">
              Visiter la boutique
              <ArrowRight size={18} />
            </a>

            <a href="#disponibilite" className="boutique-btn boutique-btn--glass">
              Demander disponibilité
            </a>
          </div>
        </div>
      </section>

      <section className="boutique-intro">
        <div>
          <span className="boutique-eyebrow">L’âme de la médina</span>
          <h2>Une sélection vivante, disponible en boutique.</h2>
        </div>

        <p>
          Au-delà des tapis artisanaux, notre boutique physique réunit des
          objets choisis avec soin : céramiques tunisiennes, tableaux, cuivre,
          accessoires, pièces décoratives et créations rares. Chaque collection
          évolue selon les arrivages, les rencontres avec les artisans et les
          coups de cœur de la famille.
        </p>
      </section>

      <section className="boutique-cards" id="boutique-showroom">
        {collections.map((item) => (
          <article className="boutique-card" key={item.title}>
            <img src={item.image} alt={item.title} />

            <div className="boutique-card__shade" />

            <div className="boutique-card__content">
              <span>{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="boutique-gallery-section">
        <div className="boutique-section-header">
          <span className="boutique-eyebrow">Galerie boutique</span>
          <h2>Des pièces à découvrir comme dans un showroom.</h2>
          <p>
            Pas de fiches produits, pas de panier : seulement des matières, des
            couleurs et des objets qui se découvrent en vrai.
          </p>
        </div>

        <div className="boutique-masonry">
          {gallery.map((image, index) => (
            <figure className="boutique-masonry__item" key={index}>
              <img src={image} alt={`Collection artisanale ${index + 1}`} />
              <figcaption>
                {index % 3 === 0
                  ? "Disponible en boutique"
                  : index % 3 === 1
                  ? "Sélection artisanale"
                  : "Pièce sur demande"}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="boutique-rooftop">
        <div className="boutique-rooftop__content">
          <span className="boutique-eyebrow">Notre rooftop</span>
          <h2>Un lieu chaleureux pour vivre l’expérience Artisan de la Médina.</h2>
          <p>
            Notre rooftop prolonge l’univers de la boutique : un espace
            méditerranéen, intime et élégant, pensé pour accueillir les visiteurs
            et présenter les pièces dans une ambiance authentique.
          </p>
        </div>

        <div className="boutique-rooftop__grid">
          {rooftopImages.map((image, index) => (
            <img src={image} alt={`Rooftop Artisan de la Médina ${index + 1}`} key={index} />
          ))}
        </div>
      </section>

      <section className="boutique-availability" id="disponibilite">
        <div className="boutique-availability__icon">
          <Gem size={28} />
        </div>

        <h2>Des pièces disponibles en boutique ou sur demande.</h2>

        <p>
          Chaque objet est sélectionné en petite quantité. Certaines pièces sont
          uniques, d’autres peuvent être réservées ou commandées selon leur
          disponibilité auprès de nos artisans partenaires.
        </p>

        <div className="boutique-availability__actions">
          <a href="/reservation-privee" className="boutique-btn boutique-btn--primary">
            <MapPin size={18} />
            Visiter la boutique
          </a>

          <a href="/contact" className="boutique-btn boutique-btn--light">
            Demander disponibilité
          </a>

          <a
            href="https://wa.me/21600000000"
            target="_blank"
            rel="noreferrer"
            className="boutique-btn boutique-btn--whatsapp"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
        </div>

        <p className="boutique-note">
          Les tapis artisanaux sont disponibles à l’achat en ligne dans notre
          boutique dédiée.
        </p>
      </section>
    </main>
  );
}