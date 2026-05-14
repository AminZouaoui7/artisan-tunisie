export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <span className="hero-badge">Tapis artisanaux de Tunisie</span>

          <h1>
            Sublimez votre intérieur avec des tapis
            <span> faits main</span>
          </h1>

          <p>
            Découvrez une sélection élégante de tapis artisanaux tunisiens,
            créés avec passion par des artisans au savoir-faire authentique.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary">Voir les tapis</button>
            <button className="btn btn-light">Notre histoire</button>
          </div>

          <div className="hero-stats">
            <div>
              <strong>100%</strong>
              <span>Artisanal</span>
            </div>
            <div>
              <strong>Authentique</strong>
              <span>Made in Tunisia</span>
            </div>
            <div>
              <strong>Premium</strong>
              <span>Qualité & design</span>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <img
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
            alt="Tapis artisanal"
          />
        </div>
      </div>
    </section>
  );
}
