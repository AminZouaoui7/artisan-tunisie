import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import woolImage from "../assets/loader-rug.optimized.webp";
import "../styles/SeoPages.css";

export default function TapisLaineTunisiePage() {
  const canonical = "/tapis-laine-tunisie";
  const title =
    "Tapis laine Tunisie | Tapis en laine faits main – L’Artisan de la Médina";
  const description =
    "Tapis laine Tunisie : avantages de la laine naturelle, densité, confort, durabilité, entretien et conseils pour choisir un tapis en laine fait main.";

  const siteUrl = "https://www.artisansdelamedina.com";
  const canonicalUrl = `${siteUrl}${canonical}`;
  const homeUrl = `${siteUrl}/`;
  const productsUrl = `${siteUrl}/products`;

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
        name: "Tapis laine Tunisie",
        item: canonicalUrl,
      },
    ],
  };

  const page = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tapis laine Tunisie",
    description,
    url: canonicalUrl,
    inLanguage: "fr",
    primaryImageOfPage: woolImage
      ? {
          "@type": "ImageObject",
          url:
            typeof window === "undefined"
              ? woolImage
              : new URL(woolImage, window.location.origin).toString(),
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
        name: "Pourquoi choisir un tapis en laine fait main ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La laine est naturellement isolante, résistante et confortable. Sur un tapis fait main, elle offre un toucher vivant et une tenue dans le temps supérieure, avec une patine élégante plutôt qu’une usure rapide.",
        },
      },
      {
        "@type": "Question",
        name: "Un tapis en laine perd-il ses poils ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Un léger relargage de fibres peut exister au début, surtout sur certaines laines. Il diminue avec l’usage et un entretien adapté (aspiration douce, brosse non agressive).",
        },
      },
      {
        "@type": "Question",
        name: "Comment entretenir un tapis laine Tunisie au quotidien ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Aspirez régulièrement, tournez le tapis pour équilibrer la lumière et agissez rapidement en cas de tache. Pour un nettoyage plus complet, privilégiez une méthode douce et adaptée à la laine et au type de tissage.",
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
          <p className="seo-kicker">Matière & confort</p>
          <h1 className="seo-title">Tapis laine Tunisie</h1>
          <p className="seo-lead">
            Un tapis en laine fait main combine confort immédiat et durabilité.
            En Tunisie, la laine est travaillée pour produire des textures
            chaleureuses, des nuances naturelles et une tenue qui traverse les
            saisons. Ce guide explique comment reconnaître un beau tapis laine
            Tunisie, choisir la bonne densité, et l’intégrer dans une décoration
            haut de gamme.
          </p>

          <img
            src={woolImage}
            alt="Tapis en laine fait main en Tunisie : confort et durabilité – L’Artisan de la Médina"
            width="1536"
            height="1024"
            loading="eager"
            fetchPriority="high"
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
              Explorer les tapis
            </Link>
            <Link to="/reservation" className="seo-btn">
              Obtenir un conseil
            </Link>
          </div>
        </header>

        <div className="seo-sections">
          <section className="seo-section">
            <h2>La laine : une matière premium, naturellement performante</h2>
            <p>
              La laine n’est pas “juste” une fibre : c’est une matière qui
              travaille avec votre intérieur. Elle isole du froid, apporte un
              confort acoustique et garde une sensation chaleureuse sous le pied.
              Sur un tapis artisanal, la laine crée aussi une présence visuelle :
              elle capte la lumière, nuance les teintes et donne un aspect plus
              vivant qu’une surface synthétique uniforme.
            </p>
            <p>
              Un tapis laine Tunisie s’apprécie dans le détail : densité,
              élasticité, finesse des finitions et cohérence des couleurs. Les
              tons naturels (ivoire, miel, sable) donnent une ambiance douce et
              luxueuse, tandis que des contrastes plus profonds créent une
              signature décorative. L’objectif est d’obtenir une pièce
              intemporelle, qui s’accorde aussi bien à un salon contemporain qu’à
              un intérieur plus traditionnel.
            </p>
          </section>

          <section className="seo-section">
            <h2>Densité, tissage, relief : comment juger la durabilité</h2>
            <p>
              La durabilité ne se résume pas à l’épaisseur : elle dépend surtout
              de la structure du tissage et de la qualité de la laine. Un tissage
              serré résiste mieux au passage et garde plus longtemps son aspect.
              Les pièces nouées ont souvent une sensation plus moelleuse, tandis
              que les tissages à plat (type Kilim) offrent une grande stabilité
              et un entretien facile, idéal sous une table.
            </p>
            <p>
              Un repère simple : regardez la régularité et la tenue du bord. Sur
              un tapis haut de gamme, les finitions sont nettes, les franges sont
              propres et le tapis “tombe” bien au sol. Si vous hésitez entre
              plusieurs styles, le catalogue{" "}
              <Link to="/products">Nos tapis</Link>{" "}
              permet de comparer des textures proches et, en fiche détail, de
              consulter les variantes (couleurs/dimensions) d’une même collection.
            </p>
          </section>

          <section className="seo-section">
            <h2>Entretien d’un tapis en laine : simple, mais régulier</h2>
            <p>
              La laine s’entretient très bien quand on adopte quelques bons
              réflexes : aspiration douce, rotation du tapis pour équilibrer
              l’exposition au soleil, et nettoyage ponctuel en cas de tache.
              Dans la vie quotidienne, un tapis en laine gagne une patine : il
              devient plus “habité”, plus noble, sans perdre son allure.
            </p>
            <p>
              Pour une tache, tamponnez plutôt que frotter, évitez l’excès d’eau,
              et privilégiez des produits doux. Si le tapis est une pièce maîtresse
              de votre décoration, une visite en boutique peut aider : on peut
              vous conseiller selon le type de tissage (noué, Margoum, Kilim) et
              l’usage (salon, chambre, entrée).
            </p>
          </section>

          <section className="seo-section">
            <h2>Quel tapis en laine pour quelle pièce ?</h2>
            <p>
              En salon, la laine apporte une sensation d’accueil immédiate. Un
              grand format renforce l’impression de luxe et unifie l’espace. En
              chambre, la laine est parfaite pour le confort : une descente de
              lit ou un tapis sous le lit change l’ambiance dès le premier pas.
              Dans un couloir, un tissage plus plat, dense et facile à vivre
              tient mieux aux passages répétés.
            </p>
            <p>
              Pour garder un rendu haut de gamme, choisissez une palette qui
              dialogue avec vos matières : bois, pierre, lin, cuir. La laine
              supporte très bien les intérieurs épurés, car elle ajoute une
              texture “vivante” sans encombrer visuellement la pièce.
            </p>
          </section>

          <section className="seo-section">
            <h2>Liens internes (catalogue & autres guides)</h2>
            <p>
              Pour comparer des tapis en laine disponibles, accédez à{" "}
              <Link to="/products">Nos tapis</Link>. Pour une vision plus large
              des styles tunisiens (Margoum, Kilim, tapis noués), consultez{" "}
              <Link to="/tapis-tunisiens">Tapis tunisiens</Link>. Si vous cherchez
              surtout des motifs d’inspiration berbère,{" "}
              <Link to="/tapis-berbere-tunisie">Tapis berbère Tunisie</Link>. Et
              pour un guide général sur le fait main,{" "}
              <Link to="/tapis-artisanal-tunisie">Tapis artisanal Tunisie</Link>.
            </p>
          </section>

          <section className="seo-section">
            <h2>FAQ</h2>
            <div className="seo-faq">
              <div className="seo-faq-item">
                <h3>La laine est-elle adaptée si j’ai un usage intensif ?</h3>
                <p>
                  Oui, surtout sur un tissage dense. Une laine de qualité se
                  comporte très bien au quotidien et se patine avec élégance.
                </p>
              </div>
              <div className="seo-faq-item">
                <h3>Comment choisir la bonne densité pour un tapis en laine ?</h3>
                <p>
                  Plus la structure est serrée, plus le tapis résiste aux passages.
                  Le confort dépend ensuite du relief (noué ou brodé) et de
                  l’épaisseur de la laine.
                </p>
              </div>
              <div className="seo-faq-item">
                <h3>Les variantes d’un même modèle restent-elles visibles ?</h3>
                <p>
                  Oui : tous les tapis sont affichés dans la grille catalogue.
                  La fiche détail permet ensuite d’explorer d’autres variantes
                  (couleurs/dimensions) d’une même collection.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
