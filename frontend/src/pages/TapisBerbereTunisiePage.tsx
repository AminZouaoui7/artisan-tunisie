import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import berberImage from "../assets/middle-rug.optimized.webp";
import "../styles/SeoPages.css";

export default function TapisBerbereTunisiePage() {
  const canonical = "/tapis-berbere-tunisie";
  const title =
    "Tapis berbère Tunisie | Motifs berbères, Margoum & Kilim – L’Artisan de la Médina";
  const description =
    "Tapis berbère Tunisie : comprendre les motifs, les styles (Margoum berbère, Kilim berbère), choisir la taille, les couleurs et trouver un tapis fait main.";

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
        name: "Tapis berbère Tunisie",
        item: canonicalUrl,
      },
    ],
  };

  const page = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tapis berbère Tunisie",
    description,
    url: canonicalUrl,
    inLanguage: "fr",
    primaryImageOfPage: berberImage
      ? {
          "@type": "ImageObject",
          url:
            typeof window === "undefined"
              ? berberImage
              : new URL(berberImage, window.location.origin).toString(),
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
        name: "Un tapis berbère tunisien, c’est quel style exactement ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "En Tunisie, l’inspiration berbère se retrouve dans des motifs géométriques, des contrastes marqués et une composition symbolique. On parle souvent de Kilim berbère (tissage à plat) ou de Margoum berbère (tissé puis brodé), mais l’esprit berbère peut aussi se lire dans certaines pièces nouées.",
        },
      },
      {
        "@type": "Question",
        name: "Comment choisir les couleurs d’un tapis berbère ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Les tons naturels (ivoire, sable, miel) donnent un rendu doux et premium. Les contrastes (noir, brun, rouge profond) renforcent le caractère graphique. Pour un intérieur haut de gamme, associez le tapis à une palette de matières (bois, lin, cuir) plutôt qu’à une accumulation de motifs.",
        },
      },
      {
        "@type": "Question",
        name: "Où voir une collection de tapis berbères en Tunisie ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Le plus simple est d’explorer le catalogue en ligne puis de réserver une visite à la boutique pour comparer textures, tailles et finitions. Dans la fiche produit, vous pouvez aussi retrouver les variantes (couleurs/dimensions) d’une même collection.",
        },
      },
    ],
  };

  return (
    <div className="seo-page">
      <SeoHead title={title} description={description} canonical={canonical} image={berberImage} imageAlt="Tapis berbère tunisien fait main" alternates={[
        { hrefLang: "fr-TN", href: canonical },
        { hrefLang: "en", href: "/en/berber-rugs" },
        { hrefLang: "x-default", href: canonical },
      ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([org, breadcrumbSchema, page, faqSchema]),
        }}
      />

      <div className="seo-page-inner">
        <header className="seo-hero">
          <p className="seo-kicker">Guide motifs & styles</p>
          <h1 className="seo-title">Tapis berbère Tunisie</h1>
          <p className="seo-lead">
            Les tapis berbères tunisiens séduisent par leurs lignes franches,
            leurs rythmes géométriques et une présence décorative immédiate. Si
            vous cherchez un tapis berbère Tunisie pour un salon, une chambre
            ou une entrée, ce guide aide à comprendre les motifs, les
            techniques (Kilim, Margoum, noué) et les choix qui créent un rendu
            haut de gamme.
          </p>

          <img
            src={berberImage}
            alt="Tapis berbère en Tunisie : motifs géométriques et tissage traditionnel – L’Artisan de la Médina"
            width="2048"
            height="916"
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
              Voir tous les tapis
            </Link>
            <Link to="/reservation" className="seo-btn">
              Conseils en boutique
            </Link>
          </div>
        </header>

        <div className="seo-sections">
          <section className="seo-section">
            <h2>Motifs berbères : symboles, géométrie et équilibre</h2>
            <p>
              L’esthétique berbère est souvent résumée à “des formes
              géométriques”, mais c’est plus subtil. Les motifs racontent une
              origine, un territoire, une intention : losanges, lignes brisées,
              bandes, points et alternances. Dans une décoration premium, ces
              motifs fonctionnent très bien parce qu’ils structurent la pièce
              comme un dessin architectural : ils créent un centre, des axes et
              une cadence visuelle.
            </p>
            <p>
              Le piège est de surcharger : si le tapis est expressif, gardez le
              reste plus calme (rideaux en lin, canapé uni, bois ou pierre). Si
              votre intérieur est déjà chargé en textures, préférez un tapis
              berbère aux contrastes moins agressifs, avec des teintes naturelles
              et des reliefs discrets. Cela donne un rendu plus “mobilier
              haut de gamme” qu’un collage de motifs.
            </p>
          </section>

          <section className="seo-section">
            <h2>Kilim berbère ou Margoum berbère : quelles différences ?</h2>
            <p>
              Le Kilim berbère est tissé à plat : il est fin, graphique, facile
              à placer sous une table ou dans un espace de passage. Il met en
              valeur les contrastes et la netteté des motifs. Le Margoum berbère
              ajoute une dimension tactile : une base tissée et une broderie qui
              crée du relief. Visuellement, il capte la lumière et renforce
              l’effet “pièce artisanale” que l’on remarque dès l’entrée.
            </p>
            <p>
              Dans notre catalogue, vous pouvez comparer ces styles en allant
              sur{" "}
              <Link to="/products">Nos tapis</Link> puis en explorant les
              catégories “Kilim berbère” et “Margoum berbère”. L’intérêt est de
              voir comment une même inspiration berbère se décline selon la
              technique : finesse du tissage, densité, relief et sensations sous
              le pied.
            </p>
          </section>

          <section className="seo-section">
            <h2>Dans quelle pièce installer un tapis berbère tunisien ?</h2>
            <p>
              En salon, un tapis berbère donne du caractère et fait “signature”.
              L’astuce est de choisir une taille qui accompagne le canapé : soit
              un grand format sous la table basse, soit un format plus large qui
              passe sous les pieds avant du mobilier. En chambre, un tapis plus
              doux (noué ou Margoum) apporte du confort et une sensation
              chaleureuse. Dans une entrée, un Kilim berbère est pratique :
              solide, facile à vivre, et très accueillant.
            </p>
            <p>
              Pour une hiérarchie visuelle plus luxueuse, gardez une cohérence
              de matière : laine et fibres naturelles, bois, céramique, métal
              patiné. Les tapis berbères s’accordent particulièrement bien avec
              les intérieurs minimalistes où chaque pièce compte, et où le tapis
              devient un point focal.
            </p>
          </section>

          <section className="seo-section">
            <h2>Couleurs : comment obtenir un rendu premium (sans faute de goût)</h2>
            <p>
              Les palettes inspirées des maisons haut de gamme privilégient
              souvent les neutres : ivoire, crème, sable, noisette. Sur un tapis
              berbère, ces teintes mettent en valeur le dessin sans “crier”.
              Pour plus de caractère, choisissez un contraste contrôlé : noir
              profond, brun tabac, ou rouge terre cuite, en petites touches.
            </p>
            <p>
              L’objectif n’est pas d’être monochrome, mais de laisser le tapis
              respirer. Un bon test : si le tapis attire l’œil, puis que le
              regard revient naturellement au mobilier et à la lumière, vous
              avez l’équilibre. Si l’œil se fatigue, c’est souvent un excès de
              contrastes ou une taille trop petite.
            </p>
          </section>

          <section className="seo-section">
            <h2>Liens internes (collection, guides, réservation)</h2>
            <p>
              Pour voir toutes les pièces disponibles, allez sur{" "}
              <Link to="/products">Nos tapis</Link>. Pour comprendre l’ensemble
              des familles tunisiennes (Margoum, Kilim, noué) et l’histoire de la
              Médina de Tunis, consultez{" "}
              <Link to="/tapis-tunisiens">Tapis tunisiens</Link>. Pour un guide
              plus général sur le fait main,{" "}
              <Link to="/tapis-artisanal-tunisie">Tapis artisanal Tunisie</Link>.
              Et si vous souhaitez comparer les textures en direct, vous pouvez{" "}
              <Link to="/reservation">réserver une visite</Link>.
            </p>
          </section>

          <section className="seo-section">
            <h2>FAQ</h2>
            <div className="seo-faq">
              <div className="seo-faq-item">
                <h3>Un tapis berbère tunisien est-il forcément épais ?</h3>
                <p>
                  Non. Un Kilim berbère est souvent assez fin (tissé à plat),
                  tandis qu’un Margoum berbère apporte plus de relief. Le confort
                  dépend de la technique et de la densité, pas seulement du style.
                </p>
              </div>
              <div className="seo-faq-item">
                <h3>Comment vérifier qu’un motif “berbère” reste élégant ?</h3>
                <p>
                  Regardez la cohérence : répétition maîtrisée, couleurs
                  harmonieuses, et finitions nettes. Un tapis premium est
                  expressif mais pas brouillon.
                </p>
              </div>
              <div className="seo-faq-item">
                <h3>Le catalogue affiche-t-il toutes les variantes ?</h3>
                <p>
                  Oui : le catalogue présente tous les tapis. Dans la fiche
                  détail, le popup permet d’explorer les autres variantes (couleurs
                  et dimensions) d’une même collection.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
