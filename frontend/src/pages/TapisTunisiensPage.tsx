import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import tunisiaImage from "../assets/088fc89b-c8a7-49da-8450-cc19fc82ade1.optimized.webp";
import "../styles/SeoPages.css";

export default function TapisTunisiensPage() {
  const canonical = "/tapis-tunisiens";
  const title =
    "Tapis tunisiens | Margoum, Kilim & tapis noués – L’Artisan de la Médina";
  const description =
    "Tapis tunisiens : guide complet des styles (Margoum, Kilim, tapis noués), histoire, régions, matières, conseils déco et liens vers la collection de tapis.";

  const canonicalUrl =
    typeof window === "undefined"
      ? canonical
      : new URL(canonical, window.location.origin).toString();

  const homeUrl =
    typeof window === "undefined"
      ? "/"
      : new URL("/", window.location.origin).toString();

  const productsUrl =
    typeof window === "undefined"
      ? "/products"
      : new URL("/products", window.location.origin).toString();

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "L’Artisan de la Médina",
    url: homeUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: homeUrl },
      { "@type": "ListItem", position: 2, name: "Nos tapis", item: productsUrl },
      {
        "@type": "ListItem",
        position: 3,
        name: "Tapis tunisiens",
        item: canonicalUrl,
      },
    ],
  };

  const page = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tapis tunisiens",
    description,
    url: canonicalUrl,
    inLanguage: "fr",
    primaryImageOfPage: tunisiaImage
      ? {
          "@type": "ImageObject",
          url:
            typeof window === "undefined"
              ? tunisiaImage
              : new URL(tunisiaImage, window.location.origin).toString(),
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "L’Artisan de la Médina",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "L’Artisan de la Médina",
      url: homeUrl,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quels sont les principaux types de tapis tunisiens ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Les familles les plus connues sont le Margoum (tissé et brodé), le Kilim (tissé à plat, très graphique) et les tapis noués (plus denses et souvent plus moelleux). Chaque technique influence le rendu, le relief et l’usage idéal.",
        },
      },
      {
        "@type": "Question",
        name: "Pourquoi les tapis tunisiens sont-ils appréciés en décoration ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ils apportent des matières naturelles, des motifs structurants et une patine artisanale qui rehausse instantanément un intérieur. Ils s’intègrent autant dans des décors contemporains que traditionnels.",
        },
      },
      {
        "@type": "Question",
        name: "Comment voir toutes les pièces sans perdre les variantes ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Le catalogue affiche tous les tapis individuellement. Ensuite, en ouvrant un tapis, la fiche détail permet de consulter les autres variantes (couleurs/dimensions) d’une même collection.",
        },
      },
    ],
  };

  return (
    <div className="seo-page">
      <SeoHead title={title} description={description} canonical={canonical} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([org, breadcrumbSchema, page, faqSchema]),
        }}
      />

      <div className="seo-page-inner">
        <header className="seo-hero">
          <p className="seo-kicker">Guide & collection</p>
          <h1 className="seo-title">Tapis tunisiens</h1>
          <p className="seo-lead">
            Les tapis tunisiens incarnent un artisanat vivant : laine, motifs,
            tissage et finitions qui traversent le temps. De la Médina de Tunis
            aux intérieurs contemporains, ils créent une ambiance chaleureuse,
            élégante et authentique. Ce guide présente les grandes familles
            (Margoum, Kilim, tapis noués), des conseils déco, et des liens directs
            vers la collection.
          </p>

          <img
            src={tunisiaImage}
            alt="Tapis tunisiens artisanaux : Margoum, Kilim et tapis noués – L’Artisan de la Médina"
            loading="lazy"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 22,
              marginTop: 18,
              border: "1px solid rgba(94, 70, 35, 0.14)",
              background: "rgba(255, 255, 255, 0.6)",
              boxShadow: "0 18px 50px rgba(31, 16, 4, 0.08)",
            }}
          />

          <div className="seo-cta-row">
            <Link to="/products" className="seo-btn seo-btn--primary">
              Voir la collection
            </Link>
            <Link to="/reservation" className="seo-btn">
              Réserver une visite
            </Link>
          </div>
        </header>

        <div className="seo-sections">
          <section className="seo-section">
            <h2>Un héritage vivant : la Médina de Tunis et les gestes du tissage</h2>
            <p>
              Dans la Médina de Tunis, le tapis fait partie des objets qui
              racontent une maison : il accueille, protège du froid, structure la
              pièce et transmet une identité. Les savoir-faire s’expriment dans
              des gestes précis : préparation de la laine, teinture, choix des
              trames, tissage, broderie ou nouage, puis finitions. Cette chaîne
              artisanale explique pourquoi les tapis tunisiens ont une présence
              différente : ils ont une texture, une patine, et une irrégularité
              maîtrisée qui font “pièce unique”.
            </p>
            <p>
              Aujourd’hui, ces codes se marient très bien avec une décoration
              haut de gamme. Un tapis tunisien peut être graphique et minimal,
              ou au contraire riche et ornemental. L’essentiel est de choisir une
              pièce cohérente avec votre mobilier : taille, palette et relief.
              Si vous aimez les matériaux nobles (bois, pierre, lin, cuir), la
              laine tunisienne apporte un supplément de chaleur sans alourdir.
            </p>
          </section>

          <section className="seo-section">
            <h2>Margoum, Kilim, tapis noués : les grandes familles tunisiennes</h2>
            <p>
              Le Margoum est une signature tunisienne : une base tissée, puis
              une broderie qui dessine des motifs en relief. Il donne un rendu
              riche et très décoratif. Le Kilim est tissé à plat : plus fin,
              plus graphique, idéal pour les espaces contemporains et les zones
              de passage. Les tapis noués sont souvent plus denses : ils apportent
              un toucher moelleux et une sensation de confort immédiat.
            </p>

            <div className="seo-cards">
              <div className="seo-card">
                <strong>Margoum</strong>
                <span>
                  Tissage + broderie : relief, motifs expressifs, présence premium
                  dès l’entrée.
                </span>
              </div>
              <div className="seo-card">
                <strong>Kilim</strong>
                <span>
                  Tissage à plat : lignes nettes, esprit graphique, facile sous une
                  table ou dans un bureau.
                </span>
              </div>
              <div className="seo-card">
                <strong>Tapis noué</strong>
                <span>
                  Densité et douceur : idéal pour les pièces de vie où l’on cherche
                  du confort au quotidien.
                </span>
              </div>
            </div>
          </section>

          <section className="seo-section">
            <h2>Conseils déco : intégrer un tapis tunisien dans un intérieur haut de gamme</h2>
            <p>
              Pour un effet luxe, la taille est souvent la clé : un tapis trop
              petit “coupe” l’espace, tandis qu’un format plus généreux unifie la
              pièce. En salon, placez-le sous la table basse ou sous les pieds
              avant du canapé. En chambre, une descente de lit tissée main
              apporte une sensation hôtel. Dans une entrée, un Kilim graphique
              structure sans alourdir.
            </p>
            <p>
              Côté couleurs, les palettes naturelles (ivoire, sable, miel)
              créent une ambiance lumineuse. Les contrastes plus profonds (brun,
              noir, rouge terre cuite) donnent une signature, surtout si le reste
              de la pièce est sobre. Pour explorer et comparer, ouvrez{" "}
              <Link to="/products">Nos tapis</Link> : chaque pièce est visible,
              et la fiche détail permet de voir les variantes d’une même
              collection.
            </p>
          </section>

          <section className="seo-section">
            <h2>Choisir en confiance : conseils d’achat, variantes et visite</h2>
            <p>
              Un achat réussi repose sur trois critères : la technique (Kilim,
              Margoum, noué), la taille, et l’usage réel (passage, chaleur,
              entretien). Si plusieurs tapis partagent un même esprit (mêmes
              motifs ou même famille), le catalogue les montre tous : vous ne
              perdez pas de variantes. Ensuite, au clic sur un tapis, le popup
              détail vous aide à naviguer entre différentes couleurs et
              dimensions d’une même collection.
            </p>
            <p>
              Pour une expérience plus accompagnée, vous pouvez{" "}
              <Link to="/reservation">réserver une visite</Link> : comparer
              matières et reliefs en boutique est souvent décisif. Et si votre
              recherche est plus ciblée, consultez aussi{" "}
              <Link to="/tapis-artisanal-tunisie">Tapis artisanal Tunisie</Link>{" "}
              (guide fait main),{" "}
              <Link to="/tapis-berbere-tunisie">Tapis berbère Tunisie</Link>{" "}
              (motifs), ou{" "}
              <Link to="/tapis-laine-tunisie">Tapis laine Tunisie</Link>{" "}
              (matière).
            </p>
          </section>

          <section className="seo-section">
            <h2>FAQ</h2>
            <div className="seo-faq">
              <div className="seo-faq-item">
                <h3>Quel tapis tunisien pour une salle à manger ?</h3>
                <p>
                  Un Kilim (tissage à plat) est souvent très pratique sous une
                  table : stable, graphique, et facile à vivre au quotidien.
                </p>
              </div>
              <div className="seo-faq-item">
                <h3>Comment reconnaître une finition soignée ?</h3>
                <p>
                  Bords réguliers, franges propres, tenue au sol, et cohérence
                  du motif. Un tapis premium est net dans ses détails.
                </p>
              </div>
              <div className="seo-faq-item">
                <h3>Où voir toutes les pièces disponibles ?</h3>
                <p>
                  Dans{" "}
                  <Link to="/products">le catalogue</Link>, chaque tapis est
                  affiché. La fiche détail sert ensuite à parcourir les variantes
                  liées à une même collection.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
