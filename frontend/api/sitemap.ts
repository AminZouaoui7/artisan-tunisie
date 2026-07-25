import type { VercelRequest, VercelResponse } from "@vercel/node";

const SITE_URL = "https://www.artisansdelamedina.com";
const API_URL =
  process.env.VITE_API_URL || "https://artisanmedinabackend.onrender.com/api";

const STATIC_ROUTES = [
  "",
  "/products",
  "/our-story",
  "/boutique",
  "/reservation",
  "/contact",
  "/tapis-tunisiens",
  "/tapis-artisanal-tunisie",
  "/tapis-berbere-tunisie",
  "/tapis-laine-tunisie",
  "/tunisian-rugs",
  "/blog",
];

type SitemapProduct = {
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
  status?: string;
  isAvailable?: boolean;
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function urlEntry(path: string, lastModified?: string) {
  const lastmod = lastModified
    ? `<lastmod>${escapeXml(lastModified.slice(0, 10))}</lastmod>`
    : "";

  return `<url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc>${lastmod}</url>`;
}

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  let products: SitemapProduct[] = [];

  try {
    const response = await fetch(`${API_URL}/products`);
    if (response.ok) {
      products = (await response.json()) as SitemapProduct[];
    }
  } catch {
    // Le sitemap général reste disponible si le catalogue est temporairement indisponible.
  }

  const productUrls = products
    .filter(
      (product) =>
        product.slug &&
        product.isAvailable !== false &&
        product.status?.toLowerCase() !== "hidden"
    )
    .map((product) =>
      urlEntry(
        `/products/${encodeURIComponent(product.slug || "")}`,
        product.updatedAt || product.createdAt
      )
    );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...STATIC_ROUTES.map((route) => urlEntry(route)),
    ...productUrls,
    "</urlset>",
  ].join("");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.status(200).send(xml);
}
