import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBackendApiUrl } from "../api-config.mjs";

const SITE_URL = "https://www.artisansdelamedina.com";
const API_URL = getBackendApiUrl(process.env.VITE_API_URL);

const STATIC_ROUTES = [
  { path: "", lastModified: "2026-07-29" },
  { path: "/products" },
  { path: "/our-story" },
  { path: "/boutique" },
  { path: "/reservation" },
  { path: "/contact" },
  { path: "/artisanat-de-la-tunisie", lastModified: "2026-07-29" },
  { path: "/tapis-tunisiens", lastModified: "2026-07-29" },
  { path: "/tapis-artisanal-tunisie", lastModified: "2026-07-29" },
  { path: "/tapis-berbere-tunisie", lastModified: "2026-07-29" },
  { path: "/tapis-laine-tunisie", lastModified: "2026-07-29" },
  { path: "/margoum", lastModified: "2026-08-02" },
  { path: "/kilim", lastModified: "2026-08-02" },
  { path: "/tapis-noue", lastModified: "2026-08-02" },
  { path: "/en/tunisian-rugs", lastModified: "2026-08-02" },
  { path: "/en/handmade-rugs", lastModified: "2026-08-02" },
  { path: "/en/berber-rugs", lastModified: "2026-08-02" },
  { path: "/en/kilim-rugs", lastModified: "2026-08-02" },
  { path: "/en/margoum-rugs", lastModified: "2026-08-02" },
  { path: "/blog" },
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
    .filter((product) => {
      const slug = product.slug?.trim() || "";
      const status = product.status?.toLowerCase() || "";
      const hasSafeSlug = Boolean(slug) && !/[\\/<>:"|?*]/.test(slug);
      return hasSafeSlug && product.isAvailable !== false && status !== "hidden" && status !== "sold";
    })
    .map((product) =>
      urlEntry(
        `/products/${encodeURIComponent(product.slug || "")}`,
        product.updatedAt || product.createdAt
      )
    );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...STATIC_ROUTES.map((route) =>
      urlEntry(route.path, route.lastModified)
    ),
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
