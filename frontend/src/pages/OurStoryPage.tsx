import { Link } from "react-router-dom";
import lhajjImage from "../assets/lhajj.jpg";
import founderDecorImage from "../assets/imageeess.png";

import "../styles/OurStoryPage.css";

import ourstory1 from "../assets/ourstory1.jpg";
import ourstory2 from "../assets/ourstory2.jpg";

const IMG_FOUNDER = lhajjImage;

export default function OurStoryPage() {
  return (
    <div className="story-page">
      <section className="story-hero">
        <div className="story-hero-inner">
          <div className="story-hero-kicker">
            <span className="story-hero-kicker-line" />
            Notre histoire
            <span className="story-hero-kicker-line" />
          </div>

          <h1 className="story-hero-title">
            Une boutique née
            <br />
            <em>après l’indépendance</em>
          </h1>

          <p className="story-hero-sub">
            Au cœur de la Médina, notre histoire commence dans une Tunisie
            nouvelle, portée par la fierté de son artisanat. Après
            l’indépendance, la boutique ouvre ses portes avec une ambition
            claire : préserver les gestes anciens, soutenir les artisans et
            transmettre l’âme du tapis tunisien.
          </p>

          <div className="story-hero-highlight">
            <span>
              Ouverture inaugurée en présence du Président Habib Bourguiba
            </span>
          </div>

          <div className="story-ornament">
            <span className="story-ornament-line" />
            <span className="story-ornament-gem">✦</span>
            <span
              className="story-ornament-gem"
              style={{ fontSize: 13, letterSpacing: 4 }}
            >
              L’ARTISAN DE LA MÉDINA
            </span>
            <span className="story-ornament-gem">✦</span>
            <span className="story-ornament-line story-ornament-line--rev" />
          </div>
        </div>
      </section>

      <section className="story-founder">
        <div className="story-founder-inner">
          <div className="story-founder-visual">
            <div className="story-founder-image-card">
              <img
                src={IMG_FOUNDER}
                alt="Haj Bechir Ben Ghorbel"
                className="story-founder-image"
              />

              <div className="story-founder-badge">
                <span className="story-founder-badge-year">1962</span>
                <span className="story-founder-badge-label">La Médina</span>
              </div>
            </div>
          </div>

          <div className="story-founder-text">
            <div className="story-founder-top-image">
              <img src={founderDecorImage} alt="Patrimoine tunisien" />
            </div>

            <p className="story-kicker">Le fondateur</p>

            <h2 className="story-section-title">
              Haj Bechir
              <br />
              <em>Ben Ghorbel</em>
            </h2>

            <p className="story-body">
              L’histoire commence avec Haj Bechir Ben Ghorbel, fondateur
              visionnaire qui a donné naissance à l’une des premières boutiques
              dédiées à l’artisanat tunisien authentique. Plus qu’un commerce,
              il a construit un héritage familial.
            </p>

            <div className="story-pullquote">
              <p>
                Chaque objet sélectionné porte une trace : celle d’une main,
                d’une région, d’un geste ancien et d’une famille qui a choisi
                de protéger ce patrimoine.
              </p>
            </div>

            <p className="story-body">
              Depuis 1962, chaque génération ajoute sa touche à cette histoire.
              La boutique continue de faire rayonner l’artisanat tunisien avec
              la même passion : préserver les gestes, soutenir les artisans et
              transmettre une part de notre patrimoine.
            </p>

            <div className="story-stats">
              <div className="story-stat">
                <span className="story-stat-number">60+</span>
                <span className="story-stat-label">ans d’histoire</span>
              </div>

              <div className="story-stat">
                <span className="story-stat-number">5</span>
                <span className="story-stat-label">générations</span>
              </div>

              <div className="story-stat">
                <span className="story-stat-number">100%</span>
                <span className="story-stat-label">
                  artisans
                  <br />
                  tunisiens
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="story-legacy">
        <div className="story-legacy-inner">
          <div className="story-legacy-text">
            <p className="story-kicker">Héritage familial</p>

            <h2 className="story-section-title">
              Un savoir-faire transmis avec passion.
            </h2>

            <p className="story-body">
              De génération en génération, L’Artisan de la Médina garde le même
              engagement : choisir des pièces authentiques, valoriser le travail
              fait main et proposer des tapis qui racontent une histoire.
            </p>

            <p className="story-body">
              Chaque tapis est choisi avec soin pour apporter chaleur, caractère
              et authenticité à votre intérieur.
            </p>

            <div className="story-legacy-cta-row">
              <Link to="/products" className="story-btn-primary">
                Découvrir nos tapis
              </Link>
            </div>
          </div>

          <div className="story-legacy-visual">
            <div className="story-legacy-grid">
              <div className="story-legacy-image-card story-legacy-image-card--large">
                <img
                  src={ourstory1}
                  alt="Artisanat tunisien"
                  className="story-legacy-image"
                />
              </div>

              <div className="story-legacy-image-card story-legacy-image-card--small">
                <img
                  src={ourstory2}
                  alt="Patrimoine artisanal"
                  className="story-legacy-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}