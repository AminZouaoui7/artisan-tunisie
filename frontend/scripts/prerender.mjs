import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const distDirectory = path.resolve(projectDirectory, "dist");
const serverEntry = path.resolve(projectDirectory, "dist-ssr", "entry-server.js");
const productOutputDirectory = path.join(distDirectory, "products");
const siteUrl = "https://www.artisansdelamedina.com";
const productApiUrl =
  process.env.VITE_API_URL ||
  "https://artisanmedinabackend.onrender.com/api";
const defaultSocialImage = `${siteUrl}/og-artisanat-tunisie.png`;

if (!distDirectory.startsWith(`${projectDirectory}${path.sep}`)) {
  throw new Error("Invalid prerender output directory.");
}

const { renderSeoRoute, seoRoutes } = await import(
  pathToFileURL(serverEntry).href
);
const template = await readFile(path.join(distDirectory, "index.html"), "utf8");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertMeta(html, attribute, key, content) {
  const pattern = new RegExp(
    `\\s*<meta\\s+${attribute}=["']${escapeRegExp(key)}["'][^>]*>`,
    "gi"
  );
  const withoutExisting = html.replace(pattern, "");
  const tag = `<meta ${attribute}="${escapeHtml(key)}" content="${escapeHtml(content)}">`;
  return withoutExisting.replace("</head>", `    ${tag}\n  </head>`);
}

function setCanonical(html, canonical) {
  const withoutExisting = html.replace(
    /\s*<link\s+rel=["']canonical["'][^>]*>/gi,
    ""
  );
  return withoutExisting.replace(
    "</head>",
    `    <link rel="canonical" href="${escapeHtml(canonical)}">\n  </head>`
  );
}

function setAlternateLinks(html, alternates) {
  const withoutExisting = html.replace(
    /\s*<link\s+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>/gi,
    ""
  );
  const tags = alternates
    .map(
      ({ hreflang, href }) =>
        `    <link rel="alternate" hreflang="${escapeHtml(hreflang)}" href="${escapeHtml(href)}">`
    )
    .join("\n");

  return withoutExisting.replace("</head>", `${tags}\n  </head>`);
}

function routeAlternates(route) {
  const selfLanguage = route.lang === "en" ? "en" : "fr-TN";
  const alternates = [{ hreflang: selfLanguage, href: route.canonical }];

  if (route.alternatePath) {
    alternates.push({
      hreflang: route.lang === "en" ? "fr-TN" : "en",
      href: `${siteUrl}${route.alternatePath}`,
    });
  }

  alternates.push({
    hreflang: "x-default",
    href:
      route.lang === "en" && route.alternatePath
        ? `${siteUrl}${route.alternatePath}`
        : route.canonical,
  });

  return alternates;
}

function normalizeText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function meaningfulText(value) {
  const text = normalizeText(value);
  return text.length >= 24 && !/^x+$/i.test(text.replace(/\s+/g, ""));
}

function productSeoDescription(product, name) {
  const generated = `${name}, tapis artisanal tunisien${product.material ? ` en ${normalizeText(product.material)}` : ""}${product.dimensions ? ` de ${normalizeText(product.dimensions)}` : ""}, réalisé à la main${product.region ? ` en ${normalizeText(product.region)}` : " en Tunisie"}.`;
  const source = meaningfulText(product.shortStory)
    ? product.shortStory
    : meaningfulText(product.description)
      ? product.description
      : generated;
  return truncateText(source, 158);
}

function productCategoryPath(product) {
  const category = normalizeText(`${product.category || ""} ${product.type || ""}`).toLowerCase();
  if (category.includes("margoum")) return "/margoum";
  if (category.includes("kilim") || category.includes("killim")) return "/kilim";
  if (category.includes("berber") || category.includes("berbère")) return "/tapis-berbere-tunisie";
  return "/tapis-noue";
}

function truncateText(value, maxLength) {
  const text = normalizeText(value);
  if (text.length <= maxLength) return text;

  const shortened = text.slice(0, Math.max(0, maxLength - 1));
  const lastSpace = shortened.lastIndexOf(" ");
  const clean =
    lastSpace > Math.floor(maxLength * 0.65)
      ? shortened.slice(0, lastSpace)
      : shortened;

  return `${clean.trim()}…`;
}

function absoluteProductImage(value) {
  const image = normalizeText(value);
  if (!image) return defaultSocialImage;
  if (/^https?:\/\//i.test(image)) return image;

  return new URL(
    image,
    productApiUrl.replace(/\/api\/?$/i, "/")
  ).toString();
}

function productDocument(product, relatedProducts = []) {
  const name = normalizeText(product.name) || "Tapis artisanal tunisien";
  const slug = normalizeText(product.slug);
  const canonical = `${siteUrl}/products/${encodeURIComponent(slug)}`;
  const title = `${truncateText(name, 42)} | Tapis artisanal tunisien`;
  const description = productSeoDescription(product, name);
  const sourceImages = [
    product.mainImageUrl,
    ...(Array.isArray(product.images) ? product.images : []),
  ].filter(Boolean);
  const images = [...new Set(sourceImages.map(absoluteProductImage))];
  const socialImage = images[0] || defaultSocialImage;
  const hasPrice =
    product.canShowPrice === true &&
    typeof product.price === "number" &&
    Number.isFinite(product.price);
  const isInStock =
    product.isAvailable !== false &&
    normalizeText(product.status).toLowerCase() === "available";
  const dimensions =
    normalizeText(product.dimensions) ||
    (product.lengthCm && product.widthCm
      ? `${product.lengthCm} × ${product.widthCm} cm`
      : "");

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: images.length ? images : [socialImage],
    url: canonical,
    sku: String(product.id || slug),
    category:
      normalizeText(product.category || product.type) || "Tapis tunisien",
    material: normalizeText(product.material) || undefined,
    countryOfOrigin: {
      "@type": "Country",
      name: "Tunisia",
    },
    brand: {
      "@type": "Brand",
      name: "L’Artisan de la Médina",
    },
    additionalProperty: [
      dimensions
        ? {
            "@type": "PropertyValue",
            name: "Dimensions",
            value: dimensions,
          }
        : null,
      product.region
        ? {
            "@type": "PropertyValue",
            name: "Origine",
            value: normalizeText(product.region),
          }
        : null,
      product.technique
        ? {
            "@type": "PropertyValue",
            name: "Technique",
            value: normalizeText(product.technique),
          }
        : null,
    ].filter(Boolean),
    offers: hasPrice
      ? {
          "@type": "Offer",
          url: canonical,
          price: product.price,
          priceCurrency: "EUR",
          availability: isInStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        }
      : undefined,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Nos tapis",
        item: `${siteUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
        item: canonical,
      },
    ],
  };

  let html = template.replace(
    /<html\s+lang=["'][^"']*["']/i,
    '<html lang="fr"'
  );
  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(title)}</title>`
  );
  html = upsertMeta(html, "name", "description", description);
  html = upsertMeta(
    html,
    "name",
    "robots",
    "index, follow, max-image-preview:large"
  );
  html = upsertMeta(html, "property", "og:title", title);
  html = upsertMeta(html, "property", "og:description", description);
  html = upsertMeta(html, "property", "og:type", "product");
  html = upsertMeta(html, "property", "og:url", canonical);
  html = upsertMeta(html, "property", "og:image", socialImage);
  html = upsertMeta(html, "property", "og:image:alt", `${name}, tapis artisanal tunisien`);
  html = upsertMeta(html, "property", "og:locale", "fr_TN");
  html = upsertMeta(html, "name", "twitter:card", "summary_large_image");
  html = upsertMeta(html, "name", "twitter:title", title);
  html = upsertMeta(html, "name", "twitter:description", description);
  html = upsertMeta(html, "name", "twitter:image", socialImage);
  html = setCanonical(html, canonical);
  html = setAlternateLinks(html, [
    { hreflang: "fr-TN", href: canonical },
    { hreflang: "x-default", href: canonical },
  ]);

  const jsonLd = JSON.stringify([productSchema, breadcrumbSchema]).replaceAll(
    "<",
    "\\u003c"
  );
  const imageMarkup = socialImage
    ? `<img src="${escapeHtml(socialImage)}" alt="${escapeHtml(`${name}, tapis artisanal tunisien`)}" width="1200" height="900">`
    : "";
  const detailItems = [
    dimensions ? `<li><strong>Dimensions :</strong> ${escapeHtml(dimensions)}</li>` : "",
    product.material
      ? `<li><strong>Matière :</strong> ${escapeHtml(normalizeText(product.material))}</li>`
      : "",
      product.region
        ? `<li><strong>Origine :</strong> ${escapeHtml(normalizeText(product.region))}</li>`
        : "",
      product.technique
        ? `<li><strong>Technique :</strong> ${escapeHtml(normalizeText(product.technique))}</li>`
        : "",
  ]
    .filter(Boolean)
    .join("");
  const relatedMarkup = relatedProducts.length
    ? `<section class="seo-prerender-products" aria-labelledby="similar-products-title">
        <h2 id="similar-products-title">Tapis similaires de la même catégorie</h2>
        <div class="seo-prerender-product-grid">${relatedProducts
          .map((related) => {
            const relatedName = normalizeText(related.name);
            const relatedImage = absoluteProductImage(related.mainImageUrl || related.images?.[0]);
            return `<article><a href="/products/${encodeURIComponent(normalizeText(related.slug))}"><img src="${escapeHtml(relatedImage)}" alt="${escapeHtml(`${relatedName}, tapis artisanal tunisien`)}" width="520" height="390" loading="lazy"><h3>${escapeHtml(relatedName)}</h3><p>${escapeHtml(normalizeText(related.dimensions || related.material || "Pièce artisanale tunisienne"))}</p></a></article>`;
          })
          .join("")}</div>
      </section>`
    : "";
  const snapshot = `<main class="product-seo-page">
    <script type="application/ld+json">${jsonLd}</script>
    <nav class="product-seo-breadcrumb" aria-label="Fil d’Ariane">
      <a href="/">Accueil</a><span>/</span><a href="/products">Nos tapis</a><span>/</span><span>${escapeHtml(name)}</span>
    </nav>
    <article class="product-seo-card">
      <section class="product-seo-gallery">${imageMarkup}</section>
      <section class="product-seo-content">
        <p class="product-seo-kicker">Tapis artisanal tunisien</p>
        <h1>${escapeHtml(name)}</h1>
        <p class="product-seo-story">${escapeHtml(description)}</p>
        ${detailItems ? `<ul>${detailItems}</ul>` : ""}
        <p><a href="${productCategoryPath(product)}">Découvrir le guide de cette catégorie</a></p>
        <p><a href="/products">Découvrir tous nos tapis tunisiens</a></p>
      </section>
    </article>
    ${relatedMarkup}
  </main>`;

  return html.replace(
    /<div\s+id=["']root["']><\/div>/i,
    `<div id="root" data-seo-prerendered="true">${snapshot}</div>`
  );
}

function normalizeForMatch(value) {
  return normalizeText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function productsForSeoRoute(products, route) {
  const broadRoutes = new Set([
    "/tapis-tunisiens",
    "/tapis-artisanal-tunisie",
    "/en/tunisian-rugs",
    "/en/handmade-rugs",
  ]);
  if (broadRoutes.has(route.pathname)) return products.slice(0, 24);

  const keywords = (route.productKeywords || []).map(normalizeForMatch);
  return products
    .filter((product) => {
      const haystack = normalizeForMatch(
        `${product.name || ""} ${product.category || ""} ${product.type || ""} ${product.material || ""}`
      );
      return keywords.some((keyword) => haystack.includes(keyword));
    })
    .slice(0, 24);
}

function itemListSchema(products, name) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: normalizeText(product.name),
      url: `${siteUrl}/products/${encodeURIComponent(normalizeText(product.slug))}`,
    })),
  };
}

function productCollectionMarkup(products, lang, heading) {
  if (!products.length) return "";
  const isEnglish = lang === "en";
  const schema = JSON.stringify(itemListSchema(products, heading)).replaceAll("<", "\\u003c");
  const cards = products
    .map((product) => {
      const name = normalizeText(product.name);
      const image = absoluteProductImage(product.mainImageUrl || product.images?.[0]);
      const details = normalizeText(product.dimensions || product.material || (isEnglish ? "Handmade in Tunisia" : "Fait main en Tunisie"));
      return `<article><a href="/products/${encodeURIComponent(normalizeText(product.slug))}"><img src="${escapeHtml(image)}" alt="${escapeHtml(`${name}, ${isEnglish ? "handmade Tunisian rug" : "tapis artisanal tunisien"}`)}" width="520" height="390" loading="lazy"><h3>${escapeHtml(name)}</h3><p>${escapeHtml(details)}</p></a></article>`;
    })
    .join("");

  return `<script type="application/ld+json">${schema}</script><section class="seo-prerender-products" aria-label="${escapeHtml(heading)}"><h2>${escapeHtml(heading)}</h2><p>${isEnglish ? "These links are generated from the active production catalog." : "Ces liens sont générés à partir du catalogue actif en production."}</p><div class="seo-prerender-product-grid">${cards}</div><p><a href="/products">${isEnglish ? "Browse the complete rug catalog" : "Voir le catalogue complet des tapis"}</a></p></section>`;
}

function snapshotDocument({ pathName, title, description, body, lang = "fr", image = defaultSocialImage, alternates = [] }) {
  const canonical = `${siteUrl}${pathName === "/" ? "/" : pathName}`;
  let html = template.replace(/<html\s+lang=["'][^"']*["']/i, `<html lang="${lang}"`);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = upsertMeta(html, "name", "description", description);
  html = upsertMeta(html, "name", "robots", "index, follow, max-image-preview:large");
  html = upsertMeta(html, "property", "og:title", title);
  html = upsertMeta(html, "property", "og:description", description);
  html = upsertMeta(html, "property", "og:type", "website");
  html = upsertMeta(html, "property", "og:url", canonical);
  html = upsertMeta(html, "property", "og:image", image);
  html = upsertMeta(html, "property", "og:image:alt", title);
  html = upsertMeta(html, "property", "og:locale", lang === "en" ? "en_US" : "fr_TN");
  html = upsertMeta(html, "name", "twitter:card", "summary_large_image");
  html = upsertMeta(html, "name", "twitter:title", title);
  html = upsertMeta(html, "name", "twitter:description", description);
  html = upsertMeta(html, "name", "twitter:image", image);
  html = setCanonical(html, canonical);
  html = setAlternateLinks(html, alternates.length ? alternates : [
    { hreflang: lang === "en" ? "en" : "fr-TN", href: canonical },
    { hreflang: "x-default", href: canonical },
  ]);
  return html.replace(/<div\s+id=["']root["']><\/div>/i, `<div id="root" data-seo-prerendered="true">${body}</div>`);
}

for (const route of seoRoutes) {
  let html = template.replace(
    /<html\s+lang=["'][^"']*["']/i,
    `<html lang="${route.lang}"`
  );

  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(route.title)}</title>`
  );
  html = upsertMeta(html, "name", "description", route.description);
  html = upsertMeta(
    html,
    "name",
    "robots",
    "index, follow, max-image-preview:large"
  );
  html = upsertMeta(html, "property", "og:title", route.title);
  html = upsertMeta(html, "property", "og:description", route.description);
  html = upsertMeta(
    html,
    "property",
    "og:type",
    route.pathname === "/artisanat-de-la-tunisie" ? "article" : "website"
  );
  html = upsertMeta(html, "property", "og:url", route.canonical);
  html = upsertMeta(html, "property", "og:image", route.image);
  html = upsertMeta(
    html,
    "property",
    "og:image:alt",
    route.title
  );
  html = upsertMeta(
    html,
    "property",
    "og:locale",
    route.lang === "fr" ? "fr_TN" : "en_US"
  );
  html = upsertMeta(html, "name", "twitter:card", "summary_large_image");
  html = upsertMeta(html, "name", "twitter:title", route.title);
  html = upsertMeta(html, "name", "twitter:description", route.description);
  html = upsertMeta(html, "name", "twitter:image", route.image);
  html = setCanonical(html, route.canonical);
  html = setAlternateLinks(html, routeAlternates(route));

  const renderedPage = renderSeoRoute(route.pathname);
  html = html.replace(
    /<div\s+id=["']root["']><\/div>/i,
    `<div id="root" data-seo-prerendered="true">${renderedPage}</div>`
  );

  const outputName = `${route.pathname.slice(1)}.html`;
  const outputPath = path.join(distDirectory, outputName);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, "utf8");
}

let productPageCount = 0;

try {
  const response = await fetch(`${productApiUrl}/products`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Product API returned ${response.status}.`);
  }

  const payload = await response.json();
  const products = Array.isArray(payload) ? payload : [];
  const indexableProducts = products.filter((product) => {
    const status = normalizeText(product.status).toLowerCase();
    const slug = normalizeText(product.slug);
    const hasSafeOutputName =
      slug &&
      slug !== "." &&
      slug !== ".." &&
      !/[\/\\<>:"|?*\u0000-\u001F]/.test(slug) &&
      !/[. ]$/.test(slug);

    return (
      hasSafeOutputName &&
      product.isAvailable !== false &&
      status !== "hidden" &&
      status !== "sold"
    );
  });

  await mkdir(productOutputDirectory, { recursive: true });

  for (const product of indexableProducts) {
    const slug = normalizeText(product.slug);
    const category = normalizeText(product.category || product.type).toLowerCase();
    const relatedProducts = indexableProducts
      .filter(
        (candidate) =>
          candidate.id !== product.id &&
          normalizeText(candidate.category || candidate.type).toLowerCase() === category
      )
      .slice(0, 3);
    await writeFile(
      path.join(productOutputDirectory, `${slug}.html`),
      productDocument(product, relatedProducts),
      "utf8"
    );
  }

  for (const route of seoRoutes) {
    const routeProducts = productsForSeoRoute(indexableProducts, route);
    if (!routeProducts.length) continue;
    const outputPath = path.join(distDirectory, `${route.pathname.slice(1)}.html`);
    let routeHtml = await readFile(outputPath, "utf8");
    const heading = route.lang === "en" ? "Available handmade Tunisian rugs" : "Tapis artisanaux disponibles";
    const collection = productCollectionMarkup(routeProducts, route.lang, heading);
    routeHtml = routeHtml.replace(/<\/div>\s*<\/body>/i, `${collection}</div>\n  </body>`);
    await writeFile(outputPath, routeHtml, "utf8");
  }

  const homeFaq = [
    { question: "Quel tapis tunisien choisir ?", answer: "Choisissez un Kilim pour un tissage plat et léger, un Margoum pour ses motifs brodés, ou un tapis noué en laine pour une surface plus dense et moelleuse." },
    { question: "Les tapis sont-ils faits main en Tunisie ?", answer: "Le catalogue met en avant les pièces artisanales et indique la technique, la matière et la région tunisienne lorsque ces informations sont disponibles." },
    { question: "Proposez-vous la livraison internationale ?", answer: "La livraison internationale est possible pour les pièces éligibles. La boutique confirme les conditions selon le tapis et la destination." },
  ];
  const homeFaqJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  }).replaceAll("<", "\\u003c");
  const homeBody = `<main class="seo-page seo-static-snapshot"><script type="application/ld+json">${homeFaqJson}</script><div class="seo-page-inner">
    <header class="seo-hero"><p class="seo-kicker">Artisanat tunisien authentique</p><h1 class="seo-title">Tapis artisanaux tunisiens faits main</h1><p class="seo-lead">Découvrez des pièces tissées et nouées à la main en Tunisie : Margoum, Kilim berbère, Kilim Toujane et tapis noués en laine, sélectionnés avec leurs caractéristiques réelles.</p><div class="seo-cta-row"><a class="seo-btn seo-btn--primary" href="/products">Voir les tapis disponibles</a><a class="seo-btn" href="/reservation">Visiter la boutique à Tunis</a></div></header>
    <div class="seo-sections"><section class="seo-section"><h2>Margoum, Kilim berbère et tapis noués</h2><p>Le Margoum associe tissage et broderie en relief. Le Kilim est un tapis plat, léger et graphique. Le tapis noué offre une surface plus dense et moelleuse. Chaque famille reflète un geste, une région et une manière particulière de travailler la laine.</p><div class="seo-link-grid"><a href="/margoum">Margoum tunisien</a><a href="/kilim">Kilim tunisien</a><a href="/tapis-noue">Tapis noué</a><a href="/tapis-berbere-tunisie">Tapis berbère</a><a href="/tapis-laine-tunisie">Tapis en laine</a><a href="/artisanat-de-la-tunisie">Artisanat de la Tunisie</a></div></section>
    <section class="seo-section"><h2>Matières naturelles, entretien et livraison</h2><p>La laine naturelle est appréciée pour son confort, sa résistance et la profondeur de ses couleurs. Un entretien doux, une rotation régulière et un nettoyage spécialisé préservent le tissage. Les modalités de livraison sont confirmées selon le format et la destination, sans publier de prix masqué.</p></section>
    <section class="seo-section"><h2>Questions fréquentes</h2><div class="seo-faq">${homeFaq.map((item) => `<div class="seo-faq-item"><h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p></div>`).join("")}</div></section></div>
    ${productCollectionMarkup(indexableProducts.slice(0, 12), "fr", "Tapis tunisiens actuellement disponibles")}
  </div></main>`;
  await writeFile(
    path.join(distDirectory, "index.html"),
    snapshotDocument({ pathName: "/", title: "Tapis Artisanaux Tunisiens Faits Main | Artisan de la Médina", description: "Découvrez des tapis artisanaux tunisiens faits main : Margoum, Kilim berbère, Kilim Toujane et tapis noués en laine. Pièces uniques et livraison internationale.", body: homeBody }),
    "utf8"
  );

  const productsBody = `<main class="seo-page seo-static-snapshot"><div class="seo-page-inner">
    <nav class="seo-breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span>/</span><span aria-current="page">Nos tapis</span></nav>
    <header class="seo-hero"><p class="seo-kicker">Collection en ligne</p><h1 class="seo-title">Tapis tunisiens faits main</h1><p class="seo-lead">Explorez les Margoums, Kilims berbères, Kilims de Toujane et tapis noués actuellement actifs dans le catalogue. Chaque lien ouvre une fiche avec les informations réelles fournies par l’API.</p></header>
    <section class="seo-section"><h2>Choisir par technique et matière</h2><p>Comparez le relief brodé du Margoum, la légèreté du Kilim et le confort d’un tapis noué en laine. Les dimensions, matières, techniques et régions sont affichées lorsqu’elles sont disponibles.</p><div class="seo-link-grid"><a href="/margoum">Margoum</a><a href="/kilim">Kilim</a><a href="/tapis-noue">Tapis noué</a><a href="/tapis-berbere-tunisie">Tapis berbère</a><a href="/tapis-laine-tunisie">Tapis en laine</a><a href="/tapis-artisanal-tunisie">Guide d’achat</a></div></section>
    ${productCollectionMarkup(indexableProducts, "fr", "Catalogue complet des tapis disponibles")}
  </div></main>`;
  await writeFile(
    path.join(distDirectory, "products.html"),
    snapshotDocument({ pathName: "/products", title: "Tapis tunisiens faits main | Margoum, Kilim et tapis berbères", description: "Explorez notre collection de tapis artisanaux tunisiens : Margoum, Kilim, tapis berbères et tapis en laine faits main.", body: productsBody }),
    "utf8"
  );

  const staticPages = [
    { pathName: "/boutique", fileName: "boutique.html", title: "Boutique d’artisanat dans la Médina de Tunis | L’Artisan de la Médina", description: "Visitez notre boutique d’artisanat tunisien dans la Médina de Tunis : tapis faits main, céramique, bijoux, mosaïque et bois d’olivier.", h1: "Boutique d’artisanat tunisien dans la Médina de Tunis", lead: "Découvrez sur place des tapis faits main, de la céramique, des bijoux, de la mosaïque et des objets en bois d’olivier sélectionnés auprès d’artisans tunisiens.", links: [["/products", "Voir les tapis"], ["/reservation", "Réserver une visite"], ["/artisanat-de-la-tunisie", "Découvrir les savoir-faire"]] },
    { pathName: "/our-story", fileName: "our-story.html", title: "Notre histoire | L’Artisan de la Médina à Tunis", description: "Découvrez l’histoire de L’Artisan de la Médina, maison tunisienne dédiée aux tapis faits main et aux savoir-faire artisanaux depuis 1982.", h1: "Une histoire d’artisanat tunisien depuis 1982", lead: "La maison transmet la connaissance des tapis, des matières et des gestes artisanaux au cœur de la Médina de Tunis.", links: [["/artisanat-de-la-tunisie", "Artisanat tunisien"], ["/products", "Nos tapis"]] },
    { pathName: "/reservation", fileName: "reservation.html", title: "Réserver une présentation de tapis à Tunis | Artisan de la Médina", description: "Réservez une présentation personnalisée de tapis artisanaux tunisiens dans notre boutique de la Médina de Tunis.", h1: "Réserver une présentation de tapis artisanaux", lead: "Organisez une visite personnalisée pour découvrir les pièces disponibles, leurs techniques et leur histoire.", links: [["/boutique", "Voir la boutique"], ["/contact", "Nous contacter"]] },
    { pathName: "/contact", fileName: "contact.html", title: "Contact | L’Artisan de la Médina à Tunis", description: "Contactez L’Artisan de la Médina pour une question sur un tapis tunisien, une visite en boutique ou une livraison internationale.", h1: "Contacter L’Artisan de la Médina", lead: "Notre équipe répond aux questions sur les pièces, les dimensions, la disponibilité et les modalités de livraison.", links: [["/products", "Voir les tapis"], ["/reservation", "Réserver une visite"]] },
    { pathName: "/blog", fileName: "blog.html", title: "Guides sur les tapis et l’artisanat tunisien | Blog", description: "Consultez nos guides sur le tapis tunisien, le Margoum, le Kilim, la laine et les savoir-faire artisanaux de Tunisie.", h1: "Guides sur les tapis et l’artisanat tunisien", lead: "Des repères utiles pour comprendre les techniques, choisir une pièce et entretenir un tapis fait main.", links: [["/tapis-artisanal-tunisie", "Guide du tapis artisanal"], ["/margoum", "Margoum"], ["/kilim", "Kilim"], ["/tapis-noue", "Tapis noué"]] },
  ];

  for (const page of staticPages) {
    const links = page.links.map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`).join("");
    const body = `<main class="seo-page seo-static-snapshot"><div class="seo-page-inner"><nav class="seo-breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span>/</span><span aria-current="page">${escapeHtml(page.h1)}</span></nav><header class="seo-hero"><h1 class="seo-title">${escapeHtml(page.h1)}</h1><p class="seo-lead">${escapeHtml(page.lead)}</p><div class="seo-link-grid">${links}</div></header></div></main>`;
    await writeFile(path.join(distDirectory, page.fileName), snapshotDocument({ pathName: page.pathName, title: page.title, description: page.description, body }), "utf8");
  }

  let notFoundHtml = snapshotDocument({ pathName: "/404", title: "Page introuvable | L’Artisan de la Médina", description: "La page demandée n’existe pas ou n’est plus disponible.", body: `<main class="seo-page"><div class="seo-page-inner"><section class="seo-hero seo-not-found"><p class="seo-kicker">Erreur 404</p><h1 class="seo-title">Cette page n’existe pas</h1><p class="seo-lead">Retrouvez nos tapis artisanaux tunisiens ou revenez à l’accueil.</p><div class="seo-cta-row"><a class="seo-btn seo-btn--primary" href="/products">Voir les tapis</a><a class="seo-btn" href="/">Retour à l’accueil</a></div></section></div></main>` });
  notFoundHtml = upsertMeta(notFoundHtml, "name", "robots", "noindex, follow");
  await writeFile(path.join(distDirectory, "404.html"), notFoundHtml, "utf8");

  let privateHtml = snapshotDocument({ pathName: "/private", title: "Espace client | L’Artisan de la Médina", description: "Espace client sécurisé.", body: `<main class="seo-page"><div class="seo-page-inner"><section class="seo-hero"><h1 class="seo-title">Espace client sécurisé</h1><p class="seo-lead">Connectez-vous pour accéder à vos commandes, réservations et demandes.</p></section></div></main>` });
  privateHtml = upsertMeta(privateHtml, "name", "robots", "noindex, nofollow");
  await writeFile(path.join(distDirectory, "private.html"), privateHtml, "utf8");

  productPageCount = indexableProducts.length;
} catch (error) {
  console.warn(
    `Product prerender skipped: ${
      error instanceof Error ? error.message : String(error)
    }`
  );
}

console.log(
  `Prerendered ${seoRoutes.length} SEO pages and ${productPageCount} product pages.`
);
