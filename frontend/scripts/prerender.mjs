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
  if (route.pathname === "/tunisian-rugs") {
    return [
      { hreflang: "en", href: route.canonical },
      {
        hreflang: "fr-TN",
        href: `${siteUrl}/tapis-tunisiens`,
      },
      {
        hreflang: "x-default",
        href: `${siteUrl}/tapis-tunisiens`,
      },
    ];
  }

  const alternates = [
    { hreflang: "fr-TN", href: route.canonical },
    { hreflang: "x-default", href: route.canonical },
  ];

  if (route.pathname === "/tapis-tunisiens") {
    alternates.splice(1, 0, {
      hreflang: "en",
      href: `${siteUrl}/tunisian-rugs`,
    });
  }

  return alternates;
}

function normalizeText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function productDocument(product) {
  const name = normalizeText(product.name) || "Tapis artisanal tunisien";
  const slug = normalizeText(product.slug);
  const canonical = `${siteUrl}/products/${encodeURIComponent(slug)}`;
  const title = `${truncateText(name, 42)} | Tapis artisanal tunisien`;
  const description = truncateText(
    product.shortStory ||
      product.description ||
      `Découvrez ${name}, un tapis artisanal tunisien sélectionné par L’Artisan de la Médina à Tunis.`,
    158
  );
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
  ]
    .filter(Boolean)
    .join("");
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
        <p><a href="/products">Découvrir tous nos tapis tunisiens</a></p>
      </section>
    </article>
  </main>`;

  return html.replace(
    /<div\s+id=["']root["']><\/div>/i,
    `<div id="root" data-seo-prerendered="true">${snapshot}</div>`
  );
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
  await writeFile(path.join(distDirectory, outputName), html, "utf8");
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
    await writeFile(
      path.join(productOutputDirectory, `${slug}.html`),
      productDocument(product),
      "utf8"
    );
  }

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
