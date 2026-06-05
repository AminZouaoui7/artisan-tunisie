import { useEffect } from "react";

type SeoHeadProps = {
  title: string;
  description: string;
  canonical: string;
};

function toAbsoluteUrl(url: string) {
  if (typeof window === "undefined") return url;
  if (!url) return window.location.href;
  if (/^https?:\/\//i.test(url)) return url;
  return new URL(url, window.location.origin).toString();
}

export default function SeoHead({ title, description, canonical }: SeoHeadProps) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const metaName = "description";
    let meta = document.querySelector<HTMLMetaElement>(`meta[name="${metaName}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = metaName;
      document.head.appendChild(meta);
    }
    meta.content = description || "";

    const canonicalHref = toAbsoluteUrl(canonical);
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalHref;
  }, [canonical, description, title]);

  return null;
}

