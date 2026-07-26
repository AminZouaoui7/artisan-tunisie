import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const distDirectory = path.resolve(projectDirectory, "dist");
const serverEntry = path.resolve(projectDirectory, "dist-ssr", "entry-server.js");

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
  html = upsertMeta(html, "property", "og:type", "article");
  html = upsertMeta(html, "property", "og:url", route.canonical);
  html = upsertMeta(html, "property", "og:image", route.image);
  html = upsertMeta(html, "property", "og:locale", route.lang === "fr" ? "fr_FR" : "en_US");
  html = upsertMeta(html, "name", "twitter:card", "summary_large_image");
  html = upsertMeta(html, "name", "twitter:title", route.title);
  html = upsertMeta(html, "name", "twitter:description", route.description);
  html = upsertMeta(html, "name", "twitter:image", route.image);
  html = setCanonical(html, route.canonical);

  const renderedPage = renderSeoRoute(route.pathname);
  html = html.replace(
    /<div\s+id=["']root["']><\/div>/i,
    `<div id="root" data-seo-prerendered="true">${renderedPage}</div>`
  );

  const outputName = `${route.pathname.slice(1)}.html`;
  await writeFile(path.join(distDirectory, outputName), html, "utf8");
}

console.log(`Prerendered ${seoRoutes.length} SEO pages.`);
