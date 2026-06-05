import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import { useI18n } from "../i18n/i18n";
import "../styles/SeoPages.css";

export default function BlogPage() {
  const { t } = useI18n();

  const canonical = "/blog";
  const title = t("seo.blog.metaTitle");
  const description = t("seo.blog.metaDescription");

  const canonicalUrl =
    typeof window === "undefined"
      ? canonical
      : new URL(canonical, window.location.origin).toString();

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "L’Artisan de la Médina",
    url:
      typeof window === "undefined"
        ? "/"
        : new URL("/", window.location.origin).toString(),
  };

  const page = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("seo.blog.h1"),
    description,
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "L’Artisan de la Médina",
    },
  };

  const posts = (["0", "1", "2", "3", "4"] as const).map((index) => ({
    title: t(`seo.blog.posts.${index}.title`),
    excerpt: t(`seo.blog.posts.${index}.excerpt`),
    to: t(`seo.blog.posts.${index}.to`),
  }));

  return (
    <div className="seo-page">
      <SeoHead title={title} description={description} canonical={canonical} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([org, page]),
        }}
      />

      <div className="seo-page-inner">
        <header className="seo-hero">
          <p className="seo-kicker">{t("seo.common.kicker")}</p>
          <h1 className="seo-title">{t("seo.blog.h1")}</h1>
          <p className="seo-lead">{t("seo.blog.lead")}</p>

          <div className="seo-cta-row">
            <Link to="/products" className="seo-btn seo-btn--primary">
              {t("seo.common.ctaProducts")}
            </Link>
            <Link to="/reservation" className="seo-btn">
              {t("seo.common.ctaReservation")}
            </Link>
          </div>
        </header>

        <div className="seo-sections">
          <section className="seo-section">
            <h2>{t("seo.blog.sectionTitle")}</h2>

            <div className="seo-blog-grid">
              {posts.map((post) => (
                <Link key={post.title} to={post.to} className="seo-blog-card">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

