import { useEffect } from "react";

type SeoHeadProps = {
  title: string;
  description: string;
  canonical: string;
  image?: string | null;
  type?: "website" | "product" | "article";
  noIndex?: boolean;
};

function toAbsoluteUrl(url: string) {
  if (typeof window === "undefined") return url;
  if (!url) return window.location.href;
  if (/^https?:\/\//i.test(url)) return url;
  return new URL(url, window.location.origin).toString();
}

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

export default function SeoHead({
  title,
  description,
  canonical,
  image,
  type = "website",
  noIndex = false,
}: SeoHeadProps) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    setMeta('meta[name="description"]', "name", "description", description || "");
    setMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"
    );

    const canonicalHref = toAbsoluteUrl(canonical);
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalHref;

    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description
    );
    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalHref);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", "L’Artisan de la Médina");
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description
    );

    if (image) {
      const imageUrl = toAbsoluteUrl(image);
      setMeta('meta[property="og:image"]', "property", "og:image", imageUrl);
      setMeta('meta[name="twitter:image"]', "name", "twitter:image", imageUrl);
    } else {
      document.querySelector('meta[property="og:image"]')?.remove();
      document.querySelector('meta[name="twitter:image"]')?.remove();
    }
  }, [canonical, description, image, noIndex, title, type]);

  return null;
}
