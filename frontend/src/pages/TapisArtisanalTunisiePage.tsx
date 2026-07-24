import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import heroImage from "../assets/hero.optimized.webp";
import "../styles/SeoPages.css";

export default function TapisArtisanalTunisiePage() {
  const canonical = "/tapis-artisanal-tunisie";
  const title =
    "Tapis artisanal Tunisie | Margoum, Kilim & tapis noués – L’Artisan de la Médina";
  const description =
    "Tapis artisanal Tunisie : guide complet (Margoum, Kilim, tapis noués), matières, motifs, tailles, entretien et conseils pour acheter un tapis fait main.";

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
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Nos tapis",
        item: productsUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Tapis artisanal Tunisie",
        item: canonicalUrl,
      },
    ],
  };

  const page = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tapis artisanal Tunisie",
    description,
    url: canonicalUrl,
    inLanguage: "fr",
    primaryImageOfPage: heroImage
      ? {
          "@type": "ImageObject",
          url:
            typeof window === "undefined"
              ? heroImage
              : new URL(heroImage, window.location.origin).toString(),
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
        name: "Quelle différence entre Margoum, Kilim et tapis noué ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Le Margoum est un tapis tissé puis brodé (reliefs et motifs riches). Le Kilim est tissé à plat, graphique et léger. Le tapis noué est plus dense, souvent plus épais, avec un toucher plus moelleux. Ces trois familles existent en Tunisie et se distinguent surtout par la technique et le rendu sous le pied.",
        },
      },
      {
        "@type": "Question",
        name: "Comment choisir la bonne taille de tapis artisanal ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "En salon, privilégiez un format qui structure l’espace : sous la table basse ou en partie sous le canapé. Dans une chambre, placez-le en descente de lit ou sous le lit avec un débord visible. Le bon choix dépend du mobilier, des circulations et du volume visuel recherché.",
        },
      },
      {
        "@type": "Question",
        name: "Un tapis artisanal tunisien est-il adapté à un usage quotidien ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, surtout si la laine est de qualité et la finition soignée. Un entretien régulier (aspiration douce, rotation, nettoyage ponctuel) suffit généralement. Pour les zones très passantes, privilégiez des tissages denses et des teintes nuancées.",
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
          <p className="seo-kicker">Guide tapis</p>
          <h1 className="seo-title">Tapis artisanal Tunisie</h1>
          <p className="seo-lead">
            Un tapis artisanal tunisien n’est pas un simple accessoire : c’est
            une pièce de caractère, tissée à la main, qui transforme une
            atmosphère. Ici, on parle Margoum, Kilim et tapis noués, matières
            naturelles, motifs hérités de la Médina de Tunis et gestes précis
            transmis de génération en génération.
          </p>

          <img
            src={heroImage}
            alt="Tapis artisanal en Tunisie : Margoum, Kilim et tapis noués – L’Artisan de la Médina"
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
              Découvrir les tapis
            </Link>
            <Link to="/reservation" className="seo-btn">
              Visiter la boutique
            </Link>
          </div>
        </header>

        <div className="seo-sections">
          <section className="seo-section">
            <h2>Qu’appelle-t-on “tapis artisanal” en Tunisie ?</h2>
            <p>
              Quand on cherche un tapis artisanal Tunisie, l’enjeu est souvent
              double : trouver un objet beau et durable, mais aussi comprendre
              ce qui fait la valeur d’une pièce faite main. Dans la tradition
              tunisienne, un tapis artisanal se reconnaît à la régularité du
              tissage, au choix des matières et à la cohérence des finitions.
              Les ateliers de la Médina travaillent des laines sélectionnées,
              jouent avec les nuances de couleurs, et construisent des motifs
              qui ont du sens : géométrie, symboles, rythmes et contrastes.
            </p>
            <p>
              Un tapis “fait main” n’est pas forcément ancien : il peut être
              contemporain, minimaliste, graphique, ou inspiré des codes
              berbères. L’essentiel est dans la technique et le temps consacré :
              tisser, broder, nouer, égaliser, laver, puis finaliser les bords.
              C’est cette somme de gestes qui donne un rendu premium : matière
              vivante, relief subtil et présence élégante dans la pièce.
            </p>
          </section>

          <section className="seo-section">
            <h2>Margoum, Kilim, tapis noués : repères simples pour choisir</h2>
            <p>
              Le Margoum est l’une des signatures tunisiennes les plus connues :
              il associe un tissage solide à une broderie qui crée du relief.
              On le choisit pour son raffinement et ses motifs riches, parfaits
              dans un salon ou une entrée. Le Kilim, lui, est tissé à plat :
              plus léger, très graphique, il s’intègre facilement dans une
              décoration contemporaine et fonctionne bien dans une salle à
              manger ou un bureau.
            </p>
            <p>
              Les tapis noués offrent souvent un toucher plus dense : la laine
              est travaillée pour donner du moelleux, et la surface peut
              présenter des variations de texture. Pour les zones très
              fréquentées, un tissage serré et des couleurs nuancées restent un
              excellent choix. Pour explorer ces familles, le plus simple est
              d’ouvrir le{" "}
              <Link to="/products" className="seo-btn" style={{ padding: "6px 12px" }}>
                catalogue de tapis
              </Link>{" "}
              puis de naviguer par catégories (Margoum, Kilim, tapis noué).
            </p>
          </section>

          <section className="seo-section">
            <h2>Matières, couleurs et finitions : ce qui fait le “haut de gamme”</h2>
            <p>
              La laine naturelle est au cœur du tapis tunisien premium : elle
              isole, régule l’humidité et garde un aspect chaleureux dans le
              temps. Selon les pièces, vous trouverez des nuances plus
              “miel”, “sable”, “ivoire” ou des contrastes plus marqués, typiques
              des influences berbères. Les coloris profonds et légèrement
              chinés ont un avantage : ils masquent mieux la vie quotidienne et
              donnent une profondeur visuelle immédiate.
            </p>
            <p>
              Un bon indicateur de qualité est la finition : bords réguliers,
              franges propres, dos stable, et une main agréable. Dans une
              logique de décoration haut de gamme, un tapis artisanal se
              choisit aussi pour la sensation globale : comment il dialogue
              avec le bois, la pierre, le lin, le cuir, et la lumière naturelle
              de la pièce.
            </p>
          </section>

          <section className="seo-section">
            <h2>Comment choisir la bonne taille pour votre intérieur</h2>
            <p>
              La taille conditionne la perception de l’espace. Dans un salon,
              un format généreux “ancre” le coin canapé et donne une impression
              d’ensemble plus soignée. À l’inverse, un tapis trop petit peut
              tasser la composition et couper les lignes du mobilier. En
              chambre, une descente de lit tissée main apporte du confort au
              réveil, tandis qu’un grand format sous le lit crée un effet hôtel
              plus prestigieux.
            </p>
            <p>
              Pensez aussi à l’usage : entrée, couloir, salle à manger,
              bureau… Chaque zone a ses contraintes. Un Kilim à tissage plat
              est pratique sous une table, un Margoum apporte un accent
              décoratif, et un tapis noué offre plus de douceur dans les pièces
              de détente. En cas de doute, vous pouvez{" "}
              <Link to="/reservation" className="seo-btn" style={{ padding: "6px 12px" }}>
                réserver une visite
              </Link>{" "}
              pour être conseillé sur place.
            </p>
          </section>

          <section className="seo-section">
            <h2>Entretien : préserver la beauté d’un tapis artisanal tunisien</h2>
            <p>
              Un entretien simple suffit la plupart du temps : aspirer
              régulièrement (sans brosse agressive), secouer délicatement, et
              tourner le tapis de temps en temps pour équilibrer l’exposition à
              la lumière. Sur un tapis en laine, les fibres se patinent : c’est
              normal et même recherché, car cela donne une nuance plus
              authentique.
            </p>
            <p>
              Pour une tache, agissez vite : tamponnez, évitez l’excès d’eau,
              et privilégiez un nettoyage doux. Si vous souhaitez une solution
              plus complète (nettoyage en profondeur ou conseil matière), passez
              par la boutique : les artisans connaissent les contraintes des
              tissages et les meilleures méthodes selon Margoum, Kilim ou tapis
              noué.
            </p>
          </section>

          <section className="seo-section">
            <h2>Liens internes utiles (produits & guides)</h2>
            <p>
              Pour voir des pièces disponibles et comparer les styles, consultez{" "}
              <Link to="/products">Nos tapis</Link>. Pour une vue plus large sur
              les traditions et les familles de tissage, lisez{" "}
              <Link to="/tapis-tunisiens">Tapis tunisiens</Link>. Si votre
              recherche se concentre sur les motifs et l’esthétique berbère, la
              page{" "}
              <Link to="/tapis-berbere-tunisie">Tapis berbère Tunisie</Link>{" "}
              complète ce guide. Et pour les matières naturelles,{" "}
              <Link to="/tapis-laine-tunisie">Tapis laine Tunisie</Link>.
            </p>
          </section>

          <section className="seo-section">
            <h2>FAQ</h2>
            <div className="seo-faq">
              <div className="seo-faq-item">
                <h3>Quelle différence entre Margoum, Kilim et tapis noué ?</h3>
                <p>
                  Le Margoum combine tissage et broderie (relief). Le Kilim est
                  tissé à plat, très graphique. Le tapis noué est plus dense et
                  souvent plus moelleux. Le meilleur choix dépend du style et de
                  l’usage (salon, salle à manger, chambre, entrée).
                </p>
              </div>
              <div className="seo-faq-item">
                <h3>Un tapis artisanal tunisien convient-il à une déco moderne ?</h3>
                <p>
                  Oui : les motifs géométriques, les palettes naturelles et la
                  laine chinée se marient très bien avec un intérieur
                  contemporain. L’astuce est d’équilibrer : un tapis riche (Margoum)
                  appelle des matières sobres, un Kilim graphique supporte des
                  lignes plus minimalistes.
                </p>
              </div>
              <div className="seo-faq-item">
                <h3>Comment voir les variantes (couleurs/dimensions) d’un modèle ?</h3>
                <p>
                  Dans le catalogue, cliquez sur un tapis : la fiche détail
                  permet d’explorer les variantes d’un même groupe (autres
                  couleurs et dimensions) pour choisir la version la plus adaptée.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
