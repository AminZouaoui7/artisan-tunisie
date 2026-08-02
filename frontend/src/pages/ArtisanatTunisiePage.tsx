import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import heroImage from "../assets/hero.optimized.webp";
import "../styles/SeoPages.css";

const SITE_URL = "https://www.artisansdelamedina.com";
const CANONICAL_PATH = "/artisanat-de-la-tunisie";
const TITLE = "Artisan tunisien à Tunis | Artisanat de la Tunisie";
const DESCRIPTION =
  "Artisan tunisien à Tunis : découvrez l’artisanat de la Tunisie, les tapis faits main, la poterie, la céramique et les savoir-faire de la Médina.";

const regionalCrafts = [
  {
    title: "Kairouan — tapis et tissage",
    text: "Tapis noués, Margoum et Kilim illustrent la richesse du travail de la laine, des motifs géométriques et des couleurs naturelles.",
  },
  {
    title: "Sejnane — poterie modelée",
    text: "Les potières façonnent la terre à la main et décorent leurs pièces de motifs bicolores. Ce savoir-faire est inscrit par l’UNESCO depuis 2018.",
  },
  {
    title: "Nabeul — céramique et faïence",
    text: "Vaisselle, carreaux et objets décoratifs prolongent une tradition de la terre cuite reconnaissable à ses couleurs et à ses motifs.",
  },
  {
    title: "Médina de Tunis — métiers d’art",
    text: "Cuivre ciselé, chéchia, broderie, bijoux et travail du cuir se rencontrent dans les souks et les ateliers historiques de la capitale.",
  },
  {
    title: "Mahdia et le Sahel — textiles",
    text: "Soie tissée, fouta, broderie et étoffes à rayures témoignent d’un patrimoine textile adapté aux usages contemporains.",
  },
  {
    title: "Sfax, Djerba et le Sud — matières locales",
    text: "Bois d’olivier, vannerie, bijoux en argent, tissages et objets du quotidien expriment des identités régionales très distinctes.",
  },
];

const faqItems = [
  {
    question: "Quels sont les artisanats les plus connus en Tunisie ?",
    answer:
      "Les tapis de Kairouan, le Margoum, le Kilim, la poterie modelée de Sejnane, la céramique de Nabeul, la fouta, le cuivre ciselé, le bois d’olivier, la chéchia, la broderie et les bijoux en argent comptent parmi les savoir-faire les plus emblématiques.",
  },
  {
    question: "Comment reconnaître une pièce artisanale tunisienne authentique ?",
    answer:
      "Observez la matière, la technique, les finitions et la provenance. Une pièce faite main présente souvent de légères variations régulières qui témoignent du geste de l’artisan. Le vendeur doit pouvoir expliquer où et comment elle a été fabriquée.",
  },
  {
    question: "Où découvrir l’artisanat tunisien à Tunis ?",
    answer:
      "La Médina de Tunis réunit de nombreux souks, ateliers et boutiques spécialisées. L’Artisan de la Médina accueille les visiteurs sur réservation pour présenter ses tapis et l’histoire des pièces sélectionnées.",
  },
  {
    question: "Peut-on intégrer l’artisanat tunisien dans une décoration moderne ?",
    answer:
      "Oui. Un tapis graphique, une céramique sobre, un luminaire en cuivre ou un objet en bois d’olivier apporte de la matière et une identité forte à un intérieur contemporain sans le surcharger.",
  },
];

export default function ArtisanatTunisiePage() {
  const canonicalUrl =
    typeof window === "undefined"
      ? `${SITE_URL}${CANONICAL_PATH}`
      : new URL(CANONICAL_PATH, window.location.origin).toString();
  const homeUrl =
    typeof window === "undefined"
      ? `${SITE_URL}/`
      : new URL("/", window.location.origin).toString();
  const imageUrl =
    typeof window === "undefined"
      ? `${SITE_URL}/og-artisanat-tunisie.png`
      : new URL("/og-artisanat-tunisie.png", window.location.origin).toString();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Artisanat de la Tunisie : traditions, régions et savoir-faire",
      description: DESCRIPTION,
      url: canonicalUrl,
      image: imageUrl,
      inLanguage: "fr",
      datePublished: "2026-07-26",
      dateModified: "2026-07-29",
      author: {
        "@type": "Organization",
        name: "L’Artisan de la Médina",
        url: homeUrl,
      },
      publisher: {
        "@type": "Organization",
        name: "L’Artisan de la Médina",
        url: homeUrl,
      },
      about: [
        "Artisanat tunisien",
        "Tapis de Kairouan",
        "Poterie de Sejnane",
        "Céramique de Nabeul",
        "Médina de Tunis",
      ],
      citation: [
        "https://ich.unesco.org/en/RL/pottery-skills-of-the-women-of-sejnane-01406",
        "https://www.discovertunisia.com/tunisie-artisanat/artisanat-des-regions",
        "https://www.discovertunisia.com/en/tunisie-arts-and-crafts/weaving-and-carpets",
      ],
    },
    {
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
          name: "Artisanat de la Tunisie",
          item: canonicalUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <article className="seo-page">
      <SeoHead
        title={TITLE}
        description={DESCRIPTION}
        canonical={CANONICAL_PATH}
        image="/og-artisanat-tunisie.png"
        type="article"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="seo-page-inner">
        <header className="seo-hero">
          <p className="seo-kicker">Patrimoine & savoir-faire tunisiens</p>
          <h1 className="seo-title">
            Artisan tunisien à Tunis : l’artisanat de la Tunisie
          </h1>
          <p className="seo-lead">
            L’Artisan de la Médina présente à Tunis un artisanat de la Tunisie
            façonné par des gestes, des matières et des identités régionales
            transmis de génération en génération. Du tapis de Kairouan à la
            poterie de Sejnane, de la céramique de Nabeul aux métiers d’art de
            la Médina de Tunis, chaque pièce raconte un territoire et le temps
            nécessaire pour la façonner.
          </p>

          <img
            className="seo-hero-image"
            src={heroImage}
            alt="Artisanat de la Tunisie avec tapis tunisien fait main dans la Médina de Tunis"
            loading="eager"
            width="343"
            height="361"
            fetchPriority="high"
            decoding="async"
          />

          <div className="seo-cta-row">
            <Link to="/products" className="seo-btn seo-btn--primary">
              Découvrir nos tapis
            </Link>
            <Link to="/reservation" className="seo-btn">
              Visiter la boutique
            </Link>
          </div>
        </header>

        <div className="seo-sections">
          <section className="seo-section">
            <h2>Qu’est-ce que l’artisanat tunisien ?</h2>
            <p>
              L’artisanat tunisien est un ensemble de métiers où la main, la
              connaissance de la matière et la culture locale occupent une
              place centrale. Il ne se limite pas aux souvenirs : il comprend
              des objets d’usage, des textiles, du mobilier, des bijoux et des
              pièces décoratives capables de traverser les générations.
            </p>
            <p>
              Sa diversité vient de la géographie du pays. Les matières
              disponibles, les échanges historiques et les besoins quotidiens
              ont produit des styles différents du Nord au Sud. La laine, la
              terre, le cuivre, le bois d’olivier, l’alfa, la soie, le cuir et
              l’argent sont transformés par des techniques qui continuent
              d’évoluer sans perdre leur identité.
            </p>
          </section>

          <section className="seo-section">
            <h2>Les grands savoir-faire de l’artisanat de la Tunisie</h2>
            <p>
              Chaque région possède ses signatures. Ces repères permettent de
              mieux comprendre la provenance d’une pièce et la technique qui
              lui donne son caractère.
            </p>
            <div className="seo-cards seo-cards--regions">
              {regionalCrafts.map((craft) => (
                <div className="seo-card" key={craft.title}>
                  <h3>{craft.title}</h3>
                  <span>{craft.text}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="seo-section">
            <h2>Le tapis tunisien, un symbole majeur du fait main</h2>
            <p>
              Le tapis occupe une place particulière dans l’artisanat de la
              Tunisie. À Kairouan, les tapis noués se distinguent par leur
              densité, leur médaillon et leurs encadrements. Le Margoum associe
              tissage et motifs en relief, tandis que le Kilim, plus plat et
              graphique, s’intègre facilement dans les intérieurs
              contemporains.
            </p>
            <p>
              La valeur d’un tapis vient de la qualité de la laine, de la
              régularité du tissage, du temps de fabrication et des finitions.
              Pour approfondir ces différences, consultez nos guides sur les{" "}
              <Link to="/tapis-tunisiens">tapis tunisiens</Link>, le{" "}
              <Link to="/tapis-artisanal-tunisie">
                tapis artisanal en Tunisie
              </Link>
              , le <Link to="/tapis-berbere-tunisie">tapis berbère</Link> et le{" "}
              <Link to="/tapis-laine-tunisie">tapis en laine</Link>.
            </p>
          </section>

          <section className="seo-section">
            <h2>Comment reconnaître une pièce authentique ?</h2>
            <p>
              Commencez par demander la provenance, la matière et la technique
              de fabrication. Un interlocuteur sérieux doit pouvoir expliquer
              le travail réalisé, le temps nécessaire et les particularités de
              la région. Sur une pièce faite main, de légères différences de
              forme, de texture ou de couleur ne sont pas des défauts : elles
              peuvent être la trace naturelle du geste.
            </p>
            <p>
              Vérifiez également les finitions et la cohérence de l’objet. Sur
              un tapis, observez le dos, les bords, la densité et la laine. Sur
              une poterie, regardez le modelage et le décor. Sur le bois ou le
              métal, la précision des assemblages et des motifs indique le soin
              apporté. Une pièce authentique doit être belle, mais aussi
              adaptée à son usage.
            </p>
          </section>

          <section className="seo-section">
            <h2>Tradition et création contemporaine</h2>
            <p>
              L’artisanat tunisien n’est pas figé. Des artisans et créateurs
              simplifient les formes, renouvellent les palettes et adaptent les
              dimensions aux intérieurs actuels. Cette évolution permet aux
              savoir-faire de rester vivants et aux objets de conserver une
              fonction réelle dans la maison.
            </p>
            <p>
              Choisir une création artisanale, c’est donc soutenir une chaîne
              de compétences : sélection de la matière, préparation, tissage,
              modelage, gravure, finition et transmission. C’est aussi préférer
              un objet durable, réparable et porteur d’une histoire identifiable.
            </p>
          </section>

          <section className="seo-section">
            <h2>Découvrir l’artisanat tunisien dans la Médina de Tunis</h2>
            <p>
              La Médina est un lieu privilégié pour observer les matières,
              comparer les techniques et comprendre les objets au-delà de leur
              apparence. L’Artisan de la Médina y présente une sélection de
              tapis et accompagne les visiteurs dans le choix des dimensions,
              des motifs et des matières.
            </p>
            <p>
              Vous pouvez découvrir notre <Link to="/products">collection</Link>,
              lire <Link to="/our-story">l’histoire de la maison</Link> ou{" "}
              <Link to="/reservation">réserver une visite</Link> pour voir les
              pièces sur place à Tunis.
            </p>
          </section>

          <section className="seo-section">
            <h2>Sources patrimoniales pour aller plus loin</h2>
            <ul className="seo-source-list">
              <li>
                <a
                  href="https://ich.unesco.org/en/RL/pottery-skills-of-the-women-of-sejnane-01406"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  UNESCO — savoir-faire liés à la poterie des femmes de Sejnane
                </a>
              </li>
              <li>
                <a
                  href="https://www.discovertunisia.com/tunisie-artisanat/artisanat-des-regions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discover Tunisia — artisanat des régions tunisiennes
                </a>
              </li>
              <li>
                <a
                  href="https://www.discovertunisia.com/en/tunisie-arts-and-crafts/weaving-and-carpets"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discover Tunisia — tissage et tapis
                </a>
              </li>
            </ul>
          </section>

          <section className="seo-section">
            <h2>Questions fréquentes sur l’artisanat de la Tunisie</h2>
            <div className="seo-faq">
              {faqItems.map((item) => (
                <div className="seo-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
