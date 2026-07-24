import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import tunisianImage from "../assets/7b8bc78c-67d9-4be5-9309-c8ac60f44393.optimized.webp";
import "../styles/SeoPages.css";

export default function TunisianRugsPage() {
  const canonical = "/tunisian-rugs";
  const title =
    "Tunisian rugs | Handmade rugs from Tunisia – L’Artisan de la Médina";
  const description =
    "Tunisian rugs guide: Medina of Tunis, berber-inspired motifs, kilim & margoum weaving, wool quality, sizing, care tips, and how to explore our rug collection.";

  const canonicalUrl =
    typeof window === "undefined"
      ? canonical
      : new URL(canonical, window.location.origin).toString();

  const homeUrl =
    typeof window === "undefined"
      ? "/"
      : new URL("/", window.location.origin).toString();

  const productsUrl =
    typeof window === "undefined"
      ? "/products"
      : new URL("/products", window.location.origin).toString();

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "L’Artisan de la Médina",
    url: homeUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
      { "@type": "ListItem", position: 2, name: "Rug catalog", item: productsUrl },
      { "@type": "ListItem", position: 3, name: "Tunisian rugs", item: canonicalUrl },
    ],
  };

  const page = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tunisian rugs",
    description,
    url: canonicalUrl,
    inLanguage: "en",
    primaryImageOfPage: tunisianImage
      ? {
          "@type": "ImageObject",
          url:
            typeof window === "undefined"
              ? tunisianImage
              : new URL(tunisianImage, window.location.origin).toString(),
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "L’Artisan de la Médina",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "L’Artisan de la Médina",
      url: homeUrl,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are the main types of Tunisian rugs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The most common families include kilim (flat-woven, graphic), margoum (woven then embroidered, textured), and knotted rugs (denser and often softer). Each technique changes the look, feel, and best room placement.",
        },
      },
      {
        "@type": "Question",
        name: "Do you show all variants in the catalog?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The catalog displays all rugs individually. When you open a rug, the detail popup helps you explore related variants (colors/sizes) within the same collection.",
        },
      },
      {
        "@type": "Question",
        name: "How do I choose the right rug size for a living room?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pick a size that anchors the seating area: either under the coffee table with enough margin, or partially under the front legs of the sofa. A rug that is too small can make the room look fragmented.",
        },
      },
    ],
  };

  return (
    <div className="seo-page">
      <SeoHead title={title} description={description} canonical={canonical} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([org, breadcrumbSchema, page, faqSchema]),
        }}
      />

      <div className="seo-page-inner">
        <header className="seo-hero">
          <p className="seo-kicker">Rug guide</p>
          <h1 className="seo-title">Tunisian rugs</h1>
          <p className="seo-lead">
            Tunisian rugs bring warmth, craft, and character to an interior.
            From the Medina of Tunis to contemporary homes, they combine natural
            wool, graphic geometry, and techniques such as kilim, margoum, and
            knotted weaving. This page is a practical guide to understanding the
            styles and choosing a rug that feels premium, balanced, and truly
            handmade.
          </p>

          <img
            src={tunisianImage}
            alt="Tunisian rugs: handmade wool rugs from the Medina of Tunis – L’Artisan de la Médina"
            loading="lazy"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 22,
              marginTop: 18,
              border: "1px solid rgba(94, 70, 35, 0.14)",
              background: "rgba(255, 255, 255, 0.6)",
              boxShadow: "0 18px 50px rgba(31, 16, 4, 0.08)",
            }}
          />

          <div className="seo-cta-row">
            <Link to="/products" className="seo-btn seo-btn--primary">
              Explore the collection
            </Link>
            <Link to="/reservation" className="seo-btn">
              Book a visit
            </Link>
          </div>
        </header>

        <div className="seo-sections">
          <section className="seo-section">
            <h2>Why Tunisian rugs feel different: craft, texture, and heritage</h2>
            <p>
              A good handmade rug has a presence you notice immediately. Tunisian
              rugs are made from natural fibers, with rhythms and textures that
              look “alive” rather than perfectly uniform. That subtle variation
              is part of the premium charm: it reflects time, handwork, and
              mastery. In the Medina of Tunis, weaving is more than production —
              it is a culture of materials: wool selection, dyeing, weaving,
              finishing, and a careful sense of balance.
            </p>
            <p>
              For interior design, Tunisian rugs are versatile. A graphic kilim
              can sharpen a modern space. A margoum adds depth and a richer
              tactile surface. A denser knotted rug brings softness to living
              rooms and bedrooms. If you want to browse real pieces, the easiest
              entry point is the{" "}
              <Link to="/products">rug catalog</Link>, where every item is visible
              and clickable.
            </p>
          </section>

          <section className="seo-section">
            <h2>Kilim, margoum, knotted: the main Tunisian rug families</h2>
            <p>
              Kilim rugs are flat-woven: lightweight, graphic, and easy to place.
              They work particularly well under dining tables or in hallways,
              because the surface is stable and the patterns stay crisp. Margoum
              rugs are a Tunisian signature: a woven base combined with
              embroidery that creates relief. They feel richer and often look
              more “decorative statement” in a living room or entry.
            </p>
            <p>
              Knotted rugs are usually denser and can feel more plush underfoot.
              If your priority is comfort, a denser structure is a good target.
              If your priority is graphic composition and easy maintenance, a
              flat weave is often the best choice. You can compare these styles
              directly in{" "}
              <Link to="/products">the collection</Link>, then open any rug to see
              related variants (colors/sizes) in the detail popup.
            </p>
          </section>

          <section className="seo-section">
            <h2>Choosing colors for a high-end look</h2>
            <p>
              Premium interiors often rely on controlled palettes: warm neutrals
              (ivory, sand, honey), deep browns, and subtle contrast. Tunisian
              rugs can be bold, but they can also be quiet and refined. If your
              space already has strong textures (stone, patterned textiles),
              choose a rug with calmer motifs. If your room is minimal, a rug
              with stronger geometry can become the focal point.
            </p>
            <p>
              A simple check: the rug should attract attention, then let the
              room breathe. If the rug competes with everything else, consider a
              larger, calmer pattern or a more natural palette. That is often
              the difference between “busy” and “designer”.
            </p>
          </section>

          <section className="seo-section">
            <h2>Size and placement: living room, bedroom, entry</h2>
            <p>
              Size is one of the biggest drivers of perceived luxury. In a
              living room, a rug that anchors the seating area makes the space
              look intentional. In a bedroom, wool brings comfort and warmth,
              either as a large rug under the bed or as bedside runners. In an
              entry or corridor, choose a durable weave and a pattern that can
              handle daily life.
            </p>
            <p>
              If you are unsure, you can{" "}
              <Link to="/reservation">book a visit</Link>{" "}
              to compare textures and dimensions in person. The goal is not only
              “a rug that fits”, but a rug that elevates the whole room.
            </p>
          </section>

          <section className="seo-section">
            <h2>Internal links (products and related guides)</h2>
            <p>
              Start with{" "}
              <Link to="/products">the rug catalog</Link>{" "}
              to explore all items. For French guides with more detail on
              specific searches, you can read{" "}
              <Link to="/tapis-tunisiens">tapis tunisiens</Link>,{" "}
              <Link to="/tapis-artisanal-tunisie">tapis artisanal Tunisie</Link>,{" "}
              <Link to="/tapis-berbere-tunisie">tapis berbère Tunisie</Link>, and{" "}
              <Link to="/tapis-laine-tunisie">tapis laine Tunisie</Link>.
            </p>
          </section>

          <section className="seo-section">
            <h2>FAQ</h2>
            <div className="seo-faq">
              <div className="seo-faq-item">
                <h3>Are Tunisian rugs good for everyday use?</h3>
                <p>
                  Yes. A well-made wool rug is durable and ages with a pleasant
                  patina. Choose a dense structure for heavy-traffic areas.
                </p>
              </div>
              <div className="seo-faq-item">
                <h3>Will the catalog hide similar variants?</h3>
                <p>
                  No. The catalog shows all rugs. Variants are explored inside the
                  product detail popup, so you can compare colors and sizes.
                </p>
              </div>
              <div className="seo-faq-item">
                <h3>What makes a rug feel “high-end”?</h3>
                <p>
                  Material quality, clean finishing, balanced proportions, and a
                  palette that fits your room. Handmade texture and subtle
                  variation often look more premium than perfect uniformity.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
