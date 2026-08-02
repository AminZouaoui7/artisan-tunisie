import { Link } from "react-router-dom";

import SeoHead from "../components/SeoHead";
import "../styles/SeoPages.css";

export default function NotFoundPage() {
  return (
    <main className="seo-page">
      <SeoHead
        title="Page introuvable | L’Artisan de la Médina"
        description="La page demandée n’existe pas ou n’est plus disponible."
        canonical="/404"
        noIndex
      />
      <div className="seo-page-inner">
        <section className="seo-hero seo-not-found">
          <p className="seo-kicker">Erreur 404</p>
          <h1 className="seo-title">Cette page n’existe pas</h1>
          <p className="seo-lead">
            Retrouvez nos tapis artisanaux tunisiens ou revenez à l’accueil.
          </p>
          <div className="seo-cta-row">
            <Link className="seo-btn seo-btn--primary" to="/products">Voir les tapis</Link>
            <Link className="seo-btn" to="/">Retour à l’accueil</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
