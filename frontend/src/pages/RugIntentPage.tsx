import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import SeoHead from "../components/SeoHead";
import { getOptimizedProductImageUrl, getProducts, type ProductViewDto } from "../services/productService";
import heroImage from "../assets/hero.optimized.webp";
import berberImage from "../assets/middle-rug.optimized.webp";
import kilimImage from "../assets/7b8bc78c-67d9-4be5-9309-c8ac60f44393.optimized.webp";
import margoumImage from "../assets/loader-rug.optimized.webp";
import {
  SITE_URL,
  rugIntentDefinitions,
  type RugIntentDefinition,
} from "../seo/rugIntentDefinitions";
import "../styles/SeoPages.css";

const images = {
  berber: berberImage,
  kilim: kilimImage,
  knotted: heroImage,
  margoum: margoumImage,
};

const imageDimensions = {
  berber: { width: 2048, height: 916 },
  kilim: { width: 1536, height: 1024 },
  knotted: { width: 343, height: 361 },
  margoum: { width: 1536, height: 1024 },
};

const frenchLinks = [
  ["/tapis-artisanal-tunisie", "Tapis artisanaux tunisiens"],
  ["/tapis-berbere-tunisie", "Tapis berbères"],
  ["/margoum", "Margoum"],
  ["/kilim", "Kilim"],
  ["/tapis-noue", "Tapis noués"],
  ["/tapis-laine-tunisie", "Tapis en laine"],
];

const englishLinks = [
  ["/en/tunisian-rugs", "Tunisian rugs"],
  ["/en/handmade-rugs", "Handmade rugs"],
  ["/en/berber-rugs", "Berber rugs"],
  ["/en/kilim-rugs", "Kilim rugs"],
  ["/en/margoum-rugs", "Margoum rugs"],
];

function absolute(path: string) {
  return `${SITE_URL}${path}`;
}

export default function RugIntentPage({ pathname }: { pathname?: string }) {
  const location = useLocation();
  const definition = rugIntentDefinitions[pathname || location.pathname] as
    | RugIntentDefinition
    | undefined;
  const [products, setProducts] = useState<ProductViewDto[]>([]);

  useEffect(() => {
    if (!definition) return;
    let active = true;
    const keywords = definition.productKeywords.map((keyword) => keyword.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""));
    getProducts()
      .then((catalog) => {
        if (!active) return;
        setProducts(catalog.filter((product) => {
          const status = product.status?.toLowerCase();
          const haystack = `${product.name} ${product.category || ""} ${product.type || ""} ${product.material || ""}`.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
          return product.isAvailable !== false && status !== "hidden" && status !== "sold" && keywords.some((keyword) => haystack.includes(keyword));
        }).slice(0, 12));
      })
      .catch(() => {
        if (active) setProducts([]);
      });
    return () => { active = false; };
  }, [definition]);

  if (!definition) return null;

  const image = images[definition.imageKey];
  const imageSize = imageDimensions[definition.imageKey];
  const canonical = absolute(definition.path);
  const isEnglish = definition.lang === "en";
  const links = isEnglish ? englishLinks : frenchLinks;
  const alternateLanguage = isEnglish ? "fr-TN" : "en";
  const xDefault = isEnglish ? definition.alternatePath : definition.path;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: definition.h1,
      description: definition.description,
      url: canonical,
      inLanguage: isEnglish ? "en" : "fr-TN",
      isPartOf: { "@id": `${SITE_URL}/#site` },
      publisher: { "@id": `${SITE_URL}/#boutique` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isEnglish ? "Home" : "Accueil", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: isEnglish ? "Rug catalog" : "Nos tapis", item: `${SITE_URL}/products` },
        { "@type": "ListItem", position: 3, name: definition.h1, item: canonical },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: definition.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    ...(products.length > 0
      ? [{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: isEnglish ? "Available handmade Tunisian rugs" : "Tapis artisanaux tunisiens disponibles",
          numberOfItems: products.length,
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: product.name,
            url: `${SITE_URL}/products/${product.slug}`,
          })),
        }]
      : []),
  ];

  return (
    <main className="seo-page">
      <SeoHead
        title={definition.title}
        description={definition.description}
        canonical={definition.path}
        image={image}
        imageAlt={definition.imageAlt}
        lang={definition.lang}
        alternates={[
          { hrefLang: isEnglish ? "en" : "fr-TN", href: definition.path },
          { hrefLang: alternateLanguage, href: definition.alternatePath },
          { hrefLang: "x-default", href: xDefault },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="seo-page-inner">
        <nav className="seo-breadcrumb" aria-label={isEnglish ? "Breadcrumb" : "Fil d’Ariane"}>
          <Link to="/">{isEnglish ? "Home" : "Accueil"}</Link>
          <span>/</span>
          <Link to="/products">{isEnglish ? "Rug catalog" : "Nos tapis"}</Link>
          <span>/</span>
          <span aria-current="page">{definition.h1}</span>
        </nav>

        <header className="seo-hero">
          <p className="seo-kicker">{definition.kicker}</p>
          <h1 className="seo-title">{definition.h1}</h1>
          <p className="seo-lead">{definition.lead}</p>
          <img className="seo-hero-image" src={image} alt={definition.imageAlt} width={imageSize.width} height={imageSize.height} loading="eager" fetchPriority="high" decoding="async" />
          <div className="seo-cta-row">
            <Link className="seo-btn seo-btn--primary" to="/products">{isEnglish ? "Browse available rugs" : "Voir les tapis disponibles"}</Link>
            <Link className="seo-btn" to="/reservation">{isEnglish ? "Visit the shop" : "Visiter la boutique"}</Link>
          </div>
        </header>

        <div className="seo-sections">
          {definition.sections.map((section) => (
            <section className="seo-section" key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}

          {products.length > 0 && (
            <section className="seo-section" aria-labelledby="intent-products-title">
              <h2 id="intent-products-title">{isEnglish ? "Available rugs from this collection" : "Tapis disponibles dans cette collection"}</h2>
              <div className="seo-prerender-product-grid">
                {products.map((product) => {
                  const productImage = product.fullMainImageUrl || product.fullImages[0];
                  return (
                    <article key={product.id}>
                      <Link to={`/products/${product.slug}`}>
                        {productImage && <img src={getOptimizedProductImageUrl(productImage, 520)} alt={`${product.name}, ${isEnglish ? "handmade Tunisian rug" : "tapis artisanal tunisien"}`} width="520" height="390" loading="lazy" decoding="async" />}
                        <h3>{product.name}</h3>
                        <p>{product.dimensions || product.material || (isEnglish ? "Handmade in Tunisia" : "Fait main en Tunisie")}</p>
                      </Link>
                    </article>
                  );
                })}
              </div>
              <p><Link to="/products">{isEnglish ? "Browse the complete catalog" : "Voir le catalogue complet"}</Link></p>
            </section>
          )}

          <section className="seo-section">
            <h2>{isEnglish ? "Explore related collections and guides" : "Explorer les collections et guides associés"}</h2>
            <div className="seo-link-grid">
              {links.filter(([to]) => to !== definition.path).map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
            </div>
          </section>

          <section className="seo-section">
            <h2>{isEnglish ? "Frequently asked questions" : "Questions fréquentes"}</h2>
            <div className="seo-faq">
              {definition.faq.map((item) => <div className="seo-faq-item" key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
