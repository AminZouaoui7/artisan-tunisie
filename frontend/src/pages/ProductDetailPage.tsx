import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, MapPin, Ruler, ShoppingCart } from "lucide-react";

import SeoHead from "../components/SeoHead";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";
import { useCurrency } from "../context/CurrencyContext";
import {
  canProductBeAddedToCart,
  getOptimizedProductImageUrl,
  getProductBySlug,
  getProducts,
  shouldShowProductPrice,
  type ProductViewDto,
} from "../services/productService";
import { trackViewItem } from "../services/analytics";
import "../styles/ProductDetailPage.css";

function meaningfulText(value?: string | null) {
  const text = value?.trim() || "";
  return text.length >= 24 && !/^x+$/i.test(text.replace(/\s+/g, ""));
}

function productSeoDescription(product: ProductViewDto) {
  const source = meaningfulText(product.shortStory)
    ? product.shortStory
    : meaningfulText(product.description)
      ? product.description
      : `${product.name} est un tapis artisanal tunisien${product.material ? ` en ${product.material}` : ""}${product.dimensions ? ` de ${product.dimensions}` : ""}, réalisé selon un savoir-faire traditionnel.`;
  const text = (source || "").replace(/\s+/g, " ").trim();
  return text.length > 158 ? `${text.slice(0, 154).replace(/\s+\S*$/, "")}…` : text;
}

function categoryGuidePath(product: ProductViewDto) {
  const category = `${product.category || ""} ${product.type || ""}`.toLowerCase();
  if (category.includes("margoum")) return "/margoum";
  if (category.includes("kilim") || category.includes("killim")) return "/kilim";
  if (category.includes("berber") || category.includes("berbère")) return "/tapis-berbere-tunisie";
  return "/tapis-noue";
}

export default function ProductDetailPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loadingAuth } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { formatPrice } = useCurrency();
  const [product, setProduct] = useState<ProductViewDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<ProductViewDto[]>([]);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setFailed(false);
        const result = await getProductBySlug(slug);
        if (active) setProduct(result);
      } catch {
        if (active) setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (product) {
      trackViewItem(product);
    }
  }, [product]);

  useEffect(() => {
    if (!product) {
      return;
    }

    let active = true;
    const category = (product.category || product.type || "").toLowerCase();

    getProducts()
      .then((products) => {
        if (!active) return;
        setRelatedProducts(
          products
            .filter((candidate) => {
              const candidateCategory = (candidate.category || candidate.type || "").toLowerCase();
              const status = candidate.status?.toLowerCase();
              return candidate.id !== product.id && candidate.isAvailable !== false && status !== "hidden" && status !== "sold" && candidateCategory === category;
            })
            .slice(0, 3)
        );
      })
      .catch(() => {
        if (active) setRelatedProducts([]);
      });

    return () => {
      active = false;
    };
  }, [product]);

  if (loading) {
    return (
      <main className="product-seo-page product-seo-state">
        <p>Chargement du tapis…</p>
      </main>
    );
  }

  if (failed || !product) {
    return (
      <main className="product-seo-page product-seo-state">
        <SeoHead
          title="Tapis introuvable | L’Artisan de la Médina"
          description="Ce tapis n’est plus disponible."
          canonical={`/products/${slug}`}
          noIndex
        />
        <h1>Ce tapis n’est plus disponible</h1>
        <Link to="/products">Retour à la collection</Link>
      </main>
    );
  }

  const images =
    product.fullImages.length > 0
      ? product.fullImages
      : product.fullMainImageUrl
        ? [product.fullMainImageUrl]
        : [];
  const mainImage = product.fullMainImageUrl || images[0] || null;
  const hasPrice = shouldShowProductPrice(product) && product.price != null;
  const added = isInCart(product.id);
  const canonicalPath = `/products/${product.slug}`;
  const canonicalUrl = new URL(canonicalPath, window.location.origin).toString();
  const seoDescription = productSeoDescription(product);
  const guidePath = categoryGuidePath(product);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: seoDescription,
    image: images,
    url: canonicalUrl,
    sku: String(product.id),
    category: product.category || product.type || "Tapis tunisien",
    material: product.material || undefined,
    countryOfOrigin: {
      "@type": "Country",
      name: "Tunisia",
    },
    brand: {
      "@type": "Brand",
      name: "L’Artisan de la Médina",
    },
    additionalProperty: [
      product.dimensions
        ? {
            "@type": "PropertyValue",
            name: "Dimensions",
            value: product.dimensions,
          }
        : null,
      product.region
        ? {
            "@type": "PropertyValue",
            name: "Origine",
            value: product.region,
          }
        : null,
      product.technique
        ? {
            "@type": "PropertyValue",
            name: "Technique",
            value: product.technique,
          }
        : null,
    ].filter(Boolean),
    offers: hasPrice
      ? {
          "@type": "Offer",
          url: canonicalUrl,
          price: product.price,
          priceCurrency: "EUR",
          availability:
            product.isAvailable && product.status?.toLowerCase() === "available"
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
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${window.location.origin}/` },
      { "@type": "ListItem", position: 2, name: "Nos tapis", item: `${window.location.origin}/products` },
      { "@type": "ListItem", position: 3, name: product.name, item: canonicalUrl },
    ],
  };

  function handleCart() {
    if (!product || loadingAuth) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: canonicalPath } });
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      priceLabel: formatPrice(product.price),
      mainImageUrl: mainImage,
      dimensions: product.dimensions,
      lengthCm: product.lengthCm,
      widthCm: product.widthCm,
      category: product.category || product.type,
      canShowPrice: product.canShowPrice,
      isPriceHidden: product.isPriceHidden,
      requiresPriceRequest: product.requiresPriceRequest,
    });
  }

  return (
    <main className="product-seo-page">
      <SeoHead
        title={`${product.name} | Tapis artisanal tunisien`}
        description={seoDescription}
        canonical={canonicalPath}
        image={mainImage}
        imageAlt={`${product.name}, tapis artisanal tunisien`}
        type="product"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productSchema, breadcrumbSchema]) }}
      />

      <nav className="product-seo-breadcrumb" aria-label="Fil d’Ariane">
        <Link to="/">Accueil</Link>
        <span>/</span>
        <Link to="/products">Nos tapis</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <Link to="/products" className="product-seo-back">
        <ArrowLeft size={18} />
        Retour à la collection
      </Link>

      <article className="product-seo-card">
        <section className="product-seo-gallery">
          {mainImage ? (
            <img
              src={getOptimizedProductImageUrl(mainImage, 1200)}
              alt={`${product.name}, tapis artisanal tunisien`}
              width="1200"
              height="900"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          ) : (
            <div className="product-seo-placeholder">Image indisponible</div>
          )}
        </section>

        <section className="product-seo-content">
          <p className="product-seo-kicker">Tapis artisanal tunisien</p>
          <h1>{product.name}</h1>
          <p className="product-seo-story">
            {product.shortStory || product.description}
          </p>

          <div className="product-seo-specs">
            <div>
              <Ruler size={21} />
              <span>Dimensions</span>
              <strong>{product.dimensions || "Sur demande"}</strong>
            </div>
            <div>
              <CheckCircle2 size={21} />
              <span>Matière</span>
              <strong>{product.material || "Artisanale"}</strong>
            </div>
            <div>
              <MapPin size={21} />
              <span>Origine</span>
              <strong>{product.region || "Tunisie"}</strong>
            </div>
            <div>
              <CheckCircle2 size={21} />
              <span>Technique</span>
              <strong>{product.technique || (product.isHandmade ? "Fait main" : "Artisanale")}</strong>
            </div>
          </div>

          <p className="product-seo-category-link">
            <Link to={guidePath}>Découvrir le guide de cette catégorie</Link>
          </p>

          <div className="product-seo-purchase">
            <strong>{hasPrice ? formatPrice(product.price) : "Prix sur demande"}</strong>
            {canProductBeAddedToCart(product) ? (
              <button type="button" onClick={handleCart} disabled={loadingAuth || added}>
                {added ? <CheckCircle2 size={18} /> : <ShoppingCart size={18} />}
                {added ? "Ajouté" : "Ajouter au panier"}
              </button>
            ) : (
              <Link to="/contact">Demander le prix</Link>
            )}
          </div>
        </section>
      </article>

      {product.description && (
        <section className="product-seo-description">
          <h2>À propos de ce tapis</h2>
          <p>{product.description}</p>
          {product.careInstructions && (
            <>
              <h2>Conseils d’entretien</h2>
              <p>{product.careInstructions}</p>
            </>
          )}
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="product-seo-related" aria-labelledby="related-rugs-title">
          <h2 id="related-rugs-title">Tapis similaires de la même catégorie</h2>
          <div className="product-seo-related-grid">
            {relatedProducts.map((related) => {
              const relatedImage = related.fullMainImageUrl || related.fullImages[0];
              return (
                <article key={related.id}>
                  <Link to={`/products/${related.slug}`}>
                    {relatedImage && (
                      <img
                        src={getOptimizedProductImageUrl(relatedImage, 520)}
                        alt={`${related.name}, tapis artisanal tunisien`}
                        width="520"
                        height="390"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <h3>{related.name}</h3>
                    <p>{related.dimensions || related.material || "Pièce artisanale tunisienne"}</p>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
