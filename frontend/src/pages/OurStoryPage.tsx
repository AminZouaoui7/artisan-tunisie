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
        <div className="story-hero-photo" />

        <div className="story-hero-panel">
          <p className="story-hero-kicker">Notre histoire</p>

          <h1 className="story-hero-title">
            Une boutique née
            <br />
            <em>après l’indépendance</em>
          </h1>

          <p className="story-hero-sub">
            Au cœur de la Médina, notre boutique ouvre ses portes dans une
            Tunisie nouvelle, portée par la fierté de son artisanat et la volonté
            de préserver les gestes anciens.
          </p>

          <div className="story-hero-highlight">
            Ouverture inaugurée en présence du Président Habib Bourguiba
          </div>

          <div className="story-ornament">
            <span className="story-ornament-line" />
            <span className="story-ornament-gem">✦</span>
            <span className="story-ornament-brand">L’ARTISAN DE LA MÉDINA</span>
            <span className="story-ornament-gem">✦</span>
            <span className="story-ornament-line" />
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
            <p className="story-kicker">Le fondateur</p>

            <h2 className="story-section-title">
              Haj Bechir
              <br />
              <em>Ben Ghorbel</em>
            </h2>

            <p className="story-body">
              L’histoire commence avec Haj Bechir Ben Ghorbel, fondateur
              visionnaire qui a donné naissance à l’une des premières boutiques
              dédiées à l’artisanat tunisien authentique.
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
              la même passion.
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
            <p className="story-kicker">Invités d’honneur</p>

            <h2 className="story-section-title">
              Des rencontres qui ont marqué notre histoire.
            </h2>

            <p className="story-body">
              Au fil des générations, L’Artisan de la Médina a eu l’honneur
              d’accueillir des personnalités importantes venues découvrir la
              richesse de l’artisanat tunisien.
            </p>

            <p className="story-body">
              Ces moments précieux témoignent de la place unique de notre maison
              dans la mémoire culturelle de la Médina.
            </p>

            <div className="story-legacy-cta-row">
              <Link to="/products" className="story-btn-primary">
                Découvrir nos tapis
              </Link>
            </div>
          </div>

          <div className="story-legacy-visual">
            <div className="story-guests-grid">
              <article className="story-guest-card story-guest-card--large">
                <img
                  src={founderDecorImage}
                  alt="Sophie de Grèce"
                  className="story-guest-image"
                />

                <div className="story-guest-caption">
                  <span>Invitée d’honneur</span>
                  <strong>Sophie de Grèce</strong>
                  <p>
                    Une visite prestigieuse au cœur de la Médina, symbole du
                    rayonnement de l’artisanat tunisien.
                  </p>
                </div>
              </article>

              <article className="story-guest-card">
                <img
                  src={ourstory1}
                  alt="Ministre tunisien"
                  className="story-guest-image"
                />

                <div className="story-guest-caption">
                  <span>Visite officielle</span>
                  <strong>Ministre tunisien</strong>
                  <p>
                    Une rencontre importante autour du patrimoine, du tapis et
                    du savoir-faire artisanal.
                  </p>
                </div>
              </article>

              <article className="story-guest-card">
                <img
                  src={ourstory2}
                  alt="Président Carlos Menem"
                  className="story-guest-image"
                />

                <div className="story-guest-caption">
                  <span>Invité international</span>
                  <strong>Président Carlos Menem</strong>
                  <p>
                    Un moment historique qui reflète l’élégance et l’ouverture
                    internationale de notre maison.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}