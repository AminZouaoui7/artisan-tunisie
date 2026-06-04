import { useCart } from "../context/useCart";
import { Link, useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Eye, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import PhoneInput from "../components/PhoneInput";
import boutiqueImg1 from "../assets/ceramic3.png";
import boutiqueImg2 from "../assets/rooftop1 (1).png";
import boutiqueImg3 from "../assets/tab2.png";
import boutiqueImg4 from "../assets/bijoux.png";
import boutiqueImg5 from "../assets/mosaique.png";
import boutiqueImg6 from "../assets/mosaique.png";
//fix
import heroRug from "../assets/088fc89b-c8a7-49da-8450-cc19fc82ade1.png";
import storyImage from "../assets/cbd0ea42-92dc-4cd6-a8e7-0b3133fe44f2.png";

import "../styles/HomePage.css";
import "../styles/ProductsPage.css";

import { useAuth } from "../context/AuthContext";
import ActionSuccess from "../components/ActionSuccess";
import { getStoredUserLocation } from "../services/apiClient";
import {
  canProductBeAddedToCart,
  getProducts,
  getProductVariants,
  keepLargestProductByVariantGroup,
  shouldShowPriceOnRequest,
  shouldShowProductPrice,
  type ProductViewDto,
} from "../services/productService";
import { createPriceRequest } from "../services/priceRequestService";
import { useI18n } from "../i18n/i18n";
import { useCurrency } from "../context/CurrencyContext";
import { GOOGLE_MAPS_URL } from "../constants/externalLinks";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const fadeLeft = { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0 } };
const fadeRight = { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } };

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const scrollTransition = {
  duration: 0.75,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

const MotionLink = motion(Link);

const boutiqueImages = [
  boutiqueImg1,
  boutiqueImg2,
  boutiqueImg3,
  boutiqueImg4,
  boutiqueImg5,
  boutiqueImg6,
];

export default function HomePage() {
  const { t } = useI18n();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const { isAuthenticated, loadingAuth } = useAuth();
  const shouldReduceMotion = useReducedMotion();
  const [isCompactViewport, setIsCompactViewport] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 820px)").matches;
  });
  const { addToCart } = useCart();
  const visitorLocation = getStoredUserLocation();

  const [products, setProducts] = useState<ProductViewDto[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsErrorKey, setProductsErrorKey] = useState<string | null>(null);

  const [boutiqueIndex, setBoutiqueIndex] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState<ProductViewDto | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<ProductViewDto[]>([]);
  const [selectedVariantsLoading, setSelectedVariantsLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number | null>(null);

  const [priceRequestOpen, setPriceRequestOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [priceRequestLoading, setPriceRequestLoading] = useState(false);
  const [priceRequestErrorKey, setPriceRequestErrorKey] = useState<string | null>(null);
  const [priceRequestSuccessProductName, setPriceRequestSuccessProductName] =
    useState<string | null>(null);

  const [priceRequestForm, setPriceRequestForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    message: "",
  });

  const categories = [
    {
      tag: t("home.categories.items.0.tag"),
      name: t("home.categories.items.0.name"),
      desc: t("home.categories.items.0.desc"),
    },
    {
      tag: t("home.categories.items.1.tag"),
      name: t("home.categories.items.1.name"),
      desc: t("home.categories.items.1.desc"),
    },
    {
      tag: t("home.categories.items.2.tag"),
      name: t("home.categories.items.2.name"),
      desc: t("home.categories.items.2.desc"),
    },
  ];

  const openProductModal = async (product: ProductViewDto) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    setSelectedVariants([]);
    setLightboxOpen(false);
    setLightboxImageIndex(null);
    setPriceRequestOpen(false);
    setShowSuccessModal(false);
    setPriceRequestSuccessProductName(null);
    setPriceRequestErrorKey(null);

    try {
      setSelectedVariantsLoading(true);
      const variants = await getProductVariants(product.id);
      setSelectedVariants(variants.filter((variant) => variant.id !== product.id));
    } catch (error) {
      console.error("Erreur chargement variantes :", error);
      setSelectedVariants([]);
    } finally {
      setSelectedVariantsLoading(false);
    }
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setSelectedImageIndex(0);
    setSelectedVariants([]);
    setSelectedVariantsLoading(false);
    setLightboxOpen(false);
    setLightboxImageIndex(null);
    setPriceRequestOpen(false);
    setShowSuccessModal(false);
    setPriceRequestSuccessProductName(null);
    setPriceRequestErrorKey(null);
  };

  const openPriceRequestForm = () => {
    if (!selectedProduct || loadingAuth) return;

    if (!isAuthenticated) {
      closeProductModal();
      navigate("/login");
      return;
    }

    setPriceRequestForm({
      customerName: "",
      email: "",
      phone: "",
      message: t("home.priceRequestPrefill", {
        productName: selectedProduct.name,
      }),
    });

    setPriceRequestSuccessProductName(null);
    setPriceRequestErrorKey(null);
    setShowSuccessModal(false);
    setPriceRequestOpen(true);
  };

  const closePriceRequestForm = () => {
    setPriceRequestOpen(false);
    setPriceRequestErrorKey(null);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setPriceRequestSuccessProductName(null);
  };

  function handleAddToCart(product: ProductViewDto) {
    if (loadingAuth) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!canProductBeAddedToCart(product)) {
      openProductModal(product);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      mainImageUrl: product.fullMainImageUrl,
      dimensions: product.dimensions,
      lengthCm: product.lengthCm,
      widthCm: product.widthCm,
      canShowPrice: product.canShowPrice,
      isPriceHidden: product.isPriceHidden,
      requiresPriceRequest: product.requiresPriceRequest,
    });
  }

  const submitPriceRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProduct) return;

    if (!isAuthenticated) {
      closePriceRequestForm();
      closeProductModal();
      navigate("/login");
      return;
    }

    try {
      setPriceRequestLoading(true);
      setPriceRequestErrorKey(null);
      setPriceRequestSuccessProductName(null);

      await createPriceRequest({
        productId: selectedProduct.id,
        customerName: priceRequestForm.customerName,
        email: priceRequestForm.email,
        phone: priceRequestForm.phone,
        countryCode: selectedProduct.countryCode || visitorLocation.countryCode,
        message: priceRequestForm.message,
      });

      setPriceRequestSuccessProductName(selectedProduct.name);
      setPriceRequestOpen(false);
      setShowSuccessModal(true);

      setPriceRequestForm({
        customerName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setPriceRequestErrorKey("home.priceRequestError");
    } finally {
      setPriceRequestLoading(false);
    }
  };

  const nextBoutiqueImage = () => {
    setBoutiqueIndex((prev) => (prev + 1) % boutiqueImages.length);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 820px)");
    const updateViewport = () => setIsCompactViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = window.setInterval(() => {
      setBoutiqueIndex((prev) => (prev + 1) % boutiqueImages.length);
    }, isCompactViewport ? 12000 : 10000);

    return () => window.clearInterval(interval);
  }, [shouldReduceMotion, isCompactViewport]);

  const prevBoutiqueImage = () => {
    setBoutiqueIndex((prev) =>
      prev === 0 ? boutiqueImages.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoadingProducts(true);
        setProductsErrorKey(null);

        const data = await getProducts();

        const latestProducts = keepLargestProductByVariantGroup(data)
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 6);

        if (isMounted) setProducts(latestProducts);
      } catch (error) {
        console.error("Erreur chargement produits :", error);
        if (isMounted) setProductsErrorKey("home.productsLoadError");
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const disableScrollAnimations = shouldReduceMotion || isCompactViewport;
  const motionInitial = disableScrollAnimations ? false : "hidden";
  const motionWhileInView = disableScrollAnimations ? undefined : "visible";
  const motionAnimate = disableScrollAnimations ? "visible" : undefined;
  const motionViewport = disableScrollAnimations
    ? undefined
    : { once: true, amount: 0.16 };
  const motionTransition = disableScrollAnimations
    ? { duration: 0 }
    : scrollTransition;

  const selectedProductImages = selectedProduct
    ? [
        selectedProduct.fullMainImageUrl,
        ...selectedProduct.fullImages.filter(
          (image) => image !== selectedProduct.fullMainImageUrl
        ),
      ].filter((image): image is string => Boolean(image))
    : [];

  function nextSelectedImage() {
    if (!selectedProductImages.length) return;
    setSelectedImageIndex((prev) => (prev + 1) % selectedProductImages.length);
  }

  function prevSelectedImage() {
    if (!selectedProductImages.length) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? selectedProductImages.length - 1 : prev - 1
    );
  }

  function closeLightbox() {
    setLightboxOpen(false);
    setLightboxImageIndex(null);
  }

  function nextLightboxImage() {
    if (!selectedProductImages.length) return;
    setLightboxImageIndex((prev) => {
      const current = prev ?? selectedImageIndex;
      return (current + 1) % selectedProductImages.length;
    });
  }

  function prevLightboxImage() {
    if (!selectedProductImages.length) return;
    setLightboxImageIndex((prev) => {
      const current = prev ?? selectedImageIndex;
      return current === 0 ? selectedProductImages.length - 1 : current - 1;
    });
  }

  useEffect(() => {
    if (!lightboxOpen) return;
    if (lightboxImageIndex !== null) return;
    setLightboxImageIndex(selectedImageIndex);
  }, [lightboxImageIndex, lightboxOpen, selectedImageIndex]);

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextLightboxImage();
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevLightboxImage();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, selectedProductImages.length, selectedImageIndex]);

  return (
    <div className="home">
 <section className="home-boutique-hero">
  <div className="home-boutique-hero-bg">
    {boutiqueImages.map((img, index) => (
      <motion.img
        key={index}
        src={img}
        alt={t("home.heroImageAlt")}
        initial={false}
        animate={{ opacity: index === boutiqueIndex ? 1 : 0 }}
        transition={{
          duration: disableScrollAnimations ? 0.2 : 0.7,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    ))}
  </div>

  <div className="home-boutique-hero-overlay" />

  <motion.div
    className="home-boutique-hero-content"
    variants={fadeUp}
    initial={motionInitial}
    animate={motionAnimate}
    whileInView={motionWhileInView}
    viewport={motionViewport}
    transition={motionTransition}
  >
    <p className="home-boutique-hero-kicker">{t("home.boutiqueKicker")}</p>

    <h1>{t("home.boutiqueTitle")}</h1>

    <p>{t("home.boutiqueDescription")}</p>
  </motion.div>

  <button
    type="button"
    className="home-boutique-hero-btn home-boutique-hero-btn--left"
    onClick={prevBoutiqueImage}
    aria-label={t("home.prevImage")}
  >
    <ChevronLeft size={28} />
  </button>

  <button
    type="button"
    className="home-boutique-hero-btn home-boutique-hero-btn--right"
    onClick={nextBoutiqueImage}
    aria-label={t("home.nextImage")}
  >
    <ChevronRight size={28} />
  </button>

  <div className="home-boutique-hero-dots">
    {boutiqueImages.map((_, index) => (
      <button
        key={index}
        type="button"
        className={`home-boutique-hero-dot ${
          boutiqueIndex === index ? "home-boutique-hero-dot--active" : ""
        }`}
        onClick={() => setBoutiqueIndex(index)}
        aria-label={`${t("common.view")} ${t("home.nextImage").toLowerCase()} ${index + 1}`}
      />
    ))}
  </div>
</section>
    <div className="section-divider" />

      <section className="page-section home-categories-section">
        <div className="home-categories-inner">
          <motion.div
            className="home-categories-header"
            variants={fadeUp}
            initial={motionInitial}
            animate={motionAnimate}
            whileInView={motionWhileInView}
            viewport={motionViewport}
            transition={motionTransition}
          >
            <p className="page-kicker">{t("home.categoriesKicker")}</p>
            <h2>
              {t("home.categoriesTitleLine1")} <br />
              <em>{t("home.categoriesTitleEmphasis")}</em>
            </h2>
          </motion.div>

          <motion.div
            className="home-categories-grid"
            variants={staggerContainer}
            initial={motionInitial}
            animate={motionAnimate}
            whileInView={motionWhileInView}
            viewport={motionViewport}
          >
            {categories.map((cat, i) => (
              <MotionLink
                to="/products"
                key={cat.name}
                className={`home-cat-card home-cat-card--${i}`}
                variants={fadeUp}
                animate={motionAnimate}
                transition={motionTransition}
              >
                <div className="home-cat-card-motif" aria-hidden="true">
                  <svg viewBox="0 0 100 100">
                    <polygon
                      points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                    <polygon
                      points="50,18 82,34 82,66 50,82 18,66 18,34"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.2"
                    />
                    <rect
                      x="38"
                      y="38"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.25"
                      transform="rotate(45 50 50)"
                    />
                  </svg>
                </div>

                <div className="home-cat-tag">{cat.tag}</div>
                <h3 className="home-cat-name">{cat.name}</h3>
                <p className="home-cat-desc">{cat.desc}</p>
                <span className="home-cat-cta">{t("home.categories.cta")}</span>
              </MotionLink>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="home-catalog-section">
        <motion.div
          className="home-catalog-header"
          variants={fadeUp}
          initial={motionInitial}
          animate={motionAnimate}
          whileInView={motionWhileInView}
          viewport={motionViewport}
          transition={motionTransition}
        >
          <div>
            <p className="page-kicker" style={{ textAlign: "left", marginBottom: 8 }}>
              {t("home.catalogKicker")}
            </p>

            <h2 className="home-section-title" style={{ textAlign: "left", margin: 0 }}>
              {t("home.catalogTitle")}
            </h2>
          </div>

          <Link to="/products" className="home-catalog-see-all">
            <span>{t("home.catalogSeeAll")}</span>
          </Link>
        </motion.div>

        <div className="home-catalog-track">
          {loadingProducts ? (
            <div className="home-catalog-loading">{t("home.catalogLoading")}</div>
          ) : productsErrorKey ? (
            <div className="home-catalog-loading">{t(productsErrorKey)}</div>
          ) : products.length === 0 ? (
            <div className="home-catalog-loading">{t("home.catalogEmpty")}</div>
          ) : (
            products.map((product, i) => {
              const coverImage = product.fullMainImageUrl;
              const isNewProduct = i < 2;
              const showVisiblePrice = shouldShowProductPrice(product);
              const showPriceOnRequest = shouldShowPriceOnRequest(product);

              return (
                <motion.article
                  key={product.id}
                  className="product-card"
                  variants={fadeUp}
                  initial={motionInitial}
                  animate={motionAnimate}
                  whileInView={motionWhileInView}
                  viewport={motionViewport}
                  transition={
                    disableScrollAnimations
                      ? { duration: 0 }
                      : { ...scrollTransition, delay: i * 0.06 }
                  }
                >
                  <div className="product-card-media">
                    <button
                      type="button"
                      className="product-card-image-frame"
                      onClick={() => openProductModal(product)}
                      aria-label={t("home.viewDetailsOf", { name: product.name })}
                    >
                      {coverImage ? (
                        <img src={coverImage} alt={product.name} className="product-image" />
                      ) : (
                        <div className="product-image-placeholder">
                          {t("products.imageUnavailable")}
                        </div>
                      )}
                    </button>

                    <div className="product-card-badges">
                      {isNewProduct && (
                        <span className="product-badge product-badge-featured">
                          {t("home.newBadge")}
                        </span>
                      )}

                      {product.isUniquePiece && (
                        <span className="product-badge product-badge-unique">Pièce unique</span>
                      )}
                    </div>
                  </div>

                  <div className="product-content">
                    <div className="product-meta">
                      {product.type && <span>{product.type}</span>}
                      {product.region && <span>{product.region}</span>}
                      {product.usageSpace && <span>{product.usageSpace}</span>}
                    </div>

                    <h2>{product.name}</h2>

                    <div className="product-card-specs">
                      <div>
                        <span>Matière</span>
                        <strong>{product.material || "-"}</strong>
                      </div>

                      <div>
                        <span>Dimensions</span>
                        <strong>{product.dimensions || "-"}</strong>
                      </div>

                      <div>
                        <span>Technique</span>
                        <strong>{product.technique || "-"}</strong>
                      </div>
                    </div>

                    <div
                      className={`product-buy-zone ${
                        showPriceOnRequest ? "product-buy-zone--request" : ""
                      }`}
                    >
                      <div className="product-price-box">
                        <p className="product-price-label">{showPriceOnRequest ? "Prix" : "Prix"}</p>

                        <strong
                          className={showPriceOnRequest ? "product-price-request" : "product-price"}
                        >
                          {showVisiblePrice && product.price != null
                            ? formatPrice(product.price)
                            : showPriceOnRequest
                            ? t("home.priceOnRequest")
                            : "-"}
                        </strong>
                      </div>

                      <div className="product-actions-row">
                        <button
                          type="button"
                          className="product-detail-btn"
                          onClick={() => openProductModal(product)}
                        >
                          <Eye size={16} />
                          Détails
                        </button>

                        <button
                          type="button"
                          className={`product-cart-btn ${
                            showPriceOnRequest ? "product-cart-btn--request" : ""
                          }`}
                          onClick={() =>
                            showPriceOnRequest ? openProductModal(product) : handleAddToCart(product)
                          }
                          disabled={!showPriceOnRequest && !canProductBeAddedToCart(product)}
                        >
                          <ShoppingCart size={16} />
                          <span>{showPriceOnRequest ? t("home.requestPrice") : "Ajouter"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
        </div>
      </section>

      <div className="section-divider" />

      <section className="home-story">
        <div className="home-story-inner">
          <motion.div
            className="home-story-visual"
            variants={fadeLeft}
            initial={motionInitial}
            animate={motionAnimate}
            whileInView={motionWhileInView}
            viewport={motionViewport}
            transition={motionTransition}
          >
            <div className="home-story-image-card">
              <img src={storyImage} alt={t("home.storyImageAlt")} className="home-story-image" />
              <div className="home-story-image-badge">
                <span>{t("home.since")}</span>
                <strong>1982</strong>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="home-story-text"
            variants={fadeRight}
            initial={motionInitial}
            animate={motionAnimate}
            whileInView={motionWhileInView}
            viewport={motionViewport}
            transition={motionTransition}
          >
            <p className="page-kicker">{t("home.houseKicker")}</p>

            <h2 className="home-section-title">
              {t("home.storyTitleLine1")}
              <br />
              {t("home.storyTitleLine2")}
            </h2>

            <p className="home-story-body">{t("home.storyParagraph1")}</p>
            <p className="home-story-body">{t("home.storyParagraph2")}</p>

            <div className="home-story-stats">
              <div className="home-stat">
                <span className="home-stat-number">40+</span>
                <span className="home-stat-label">{t("home.statYears")}</span>
              </div>

              <div className="home-stat">
                <span className="home-stat-number">200+</span>
                <span className="home-stat-label">{t("home.statArtisans")}</span>
              </div>

              <div className="home-stat">
                <span className="home-stat-number">60+</span>
                <span className="home-stat-label">{t("home.statCountries")}</span>
              </div>
            </div>

            <Link to="/our-story" className="home-btn-primary">
              {t("home.discoverOurStory")}
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="home-hero home-hero--switched">
        <div className="home-sun-rays" aria-hidden="true" />
        <div className="home-sun-glow" aria-hidden="true" />
        <div className="home-light-overlay" aria-hidden="true" />
        <div className="home-light-noise" aria-hidden="true" />

        <div className="home-hero-bg" aria-hidden="true">
          <svg className="home-hero-pattern" viewBox="0 0 600 600">
            {[0, 60, 120, 180, 240, 300].map((r, i) => (
              <polygon
                key={i}
                points="300,20 580,160 580,440 300,580 20,440 20,160"
                fill="none"
                stroke="rgba(145,95,42,0.13)"
                strokeWidth="1"
                transform={`rotate(${r}, 300, 300) scale(${
                  1 - i * 0.14
                }) translate(${i * 42}, ${i * 42})`}
              />
            ))}
          </svg>
        </div>

        <div className="home-hero-inner">
          <motion.div
            className="home-hero-content"
            variants={fadeLeft}
            initial={motionInitial}
            animate={motionAnimate}
            whileInView={motionWhileInView}
            viewport={motionViewport}
            transition={motionTransition}
          >
            <p className="home-kicker">
              <span className="home-kicker-line" />
              {t("home.heroKicker")}
              <span className="home-kicker-line" />
            </p>

            <h1 className="home-hero-title">
              {t("home.heroTitleLine1")}
              <br />
              <em>{t("home.heroTitleEmphasis")}</em>
            </h1>

            <p className="home-hero-desc">{t("home.heroDescription")}</p>

            <div className="home-hero-actions">
              <Link to="/products" className="home-btn-primary">
                {t("home.heroPrimaryCta")}
              </Link>

              <Link to="/our-story" className="home-btn-ghost">
                {t("home.heroSecondaryCta")}
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="home-hero-3d"
            aria-hidden="true"
            variants={fadeRight}
            initial={motionInitial}
            animate={motionAnimate}
            whileInView={motionWhileInView}
            viewport={motionViewport}
            transition={motionTransition}
          >
            <div className="home-rug-3d-scene">
              <div className="home-rug-glow" />
              <img src={heroRug} alt="" className="home-rug-3d-img" />
              <div className="home-rug-shadow" />
            </div>
          </motion.div>
        </div>
      </section>



      <div className="section-divider" />

      <section className="page-section home-testimonials-section">
        <motion.div
          className="home-map-header"
          variants={fadeUp}
          initial={motionInitial}
          animate={motionAnimate}
          whileInView={motionWhileInView}
          viewport={motionViewport}
          transition={motionTransition}
        >
          <p className="page-kicker">{t("home.addressKicker")}</p>
          <h2 className="home-section-title">{t("home.visitShopTitle")}</h2>
        </motion.div>

        <motion.div
          className="home-boutique-map"
          variants={fadeUp}
          initial={motionInitial}
          animate={motionAnimate}
          whileInView={motionWhileInView}
          viewport={motionViewport}
          transition={motionTransition}
        >
          <div className="home-boutique-map-text">
            <p className="page-kicker">{t("home.shopKicker")}</p>
            <h3>{t("home.findUsInTunis")}</h3>
            <p>{t("home.shopParagraph")}</p>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="home-btn-primary"
            >
              {t("home.seeOnGoogleMaps")}
            </a>
          </div>

          <div className="home-map-frame">
            <iframe
              title={t("home.mapTitle")}
              src="https://www.google.com/maps?q=Medina%20de%20Tunis&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </section>

      {selectedProduct && (
        <div
          className="products-detail-modal"
          role="dialog"
          aria-modal="true"
          onClick={closeProductModal}
        >
          <div className="products-detail-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="products-detail-close"
              onClick={closeProductModal}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>

            <div className="products-detail-gallery">
              <div className="products-detail-image">
                {selectedProductImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="products-detail-gallery-btn products-detail-gallery-btn--left"
                      onClick={prevSelectedImage}
                      aria-label="Image précédente"
                    >
                      <ChevronLeft size={22} />
                    </button>

                    <button
                      type="button"
                      className="products-detail-gallery-btn products-detail-gallery-btn--right"
                      onClick={nextSelectedImage}
                      aria-label="Image suivante"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="products-detail-image-button"
                  onClick={() => setLightboxOpen(true)}
                >
                  {selectedProductImages[selectedImageIndex] ? (
                    <img
                      src={selectedProductImages[selectedImageIndex]}
                      alt={selectedProduct.name}
                    />
                  ) : (
                    <div className="product-image-placeholder">
                      {t("products.imageUnavailable")}
                    </div>
                  )}
                </button>
              </div>

              {selectedProductImages.length > 1 && (
                <div className="products-detail-thumbs">
                  {selectedProductImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      className={`products-detail-thumb ${
                        index === selectedImageIndex ? "products-detail-thumb--active" : ""
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img src={image} alt={`${selectedProduct.name} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="products-detail-info">
              <p className="page-kicker">Détail du produit</p>
              <h2>{selectedProduct.name}</h2>

              {selectedProduct.description && (
                <p className="products-detail-desc">{selectedProduct.description}</p>
              )}

              <strong
                className={`products-detail-price ${
                  shouldShowPriceOnRequest(selectedProduct)
                    ? "products-detail-price--request"
                    : ""
                }`}
              >
                {shouldShowProductPrice(selectedProduct) && selectedProduct.price != null
                  ? formatPrice(selectedProduct.price)
                  : t("products.priceOnRequest")}
              </strong>

              {(selectedVariantsLoading || selectedVariants.length > 0) && (
                <div className="products-detail-variants">
                  <strong>Autres dimensions disponibles</strong>

                  {selectedVariantsLoading ? (
                    <p className="products-detail-variants-loading">
                      Chargement des variantes...
                    </p>
                  ) : (
                    <div className="products-detail-variants-list">
                      {selectedVariants.map((variant) => (
                        <button
                          key={variant.id}
                          type="button"
                          className="products-detail-variant-card"
                          onClick={() => openProductModal(variant)}
                        >
                          {variant.fullMainImageUrl ? (
                            <img src={variant.fullMainImageUrl} alt={variant.name} />
                          ) : (
                            <div className="products-detail-variant-placeholder" />
                          )}

                          <span>{variant.dimensions || "Dimensions non précisées"}</span>

                          <small>
                            {shouldShowProductPrice(variant) && variant.price != null
                              ? formatPrice(variant.price)
                              : t("products.priceOnRequest")}
                          </small>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="products-detail-grid">
                <span>Catégorie</span>
                <strong>{selectedProduct.category || "-"}</strong>

                <span>Type</span>
                <strong>{selectedProduct.type || "-"}</strong>

                <span>Technique</span>
                <strong>{selectedProduct.technique || "-"}</strong>

                <span>Région</span>
                <strong>{selectedProduct.region || "-"}</strong>

                <span>Matière</span>
                <strong>{selectedProduct.material || "-"}</strong>

                <span>Couleurs</span>
                <strong>{selectedProduct.colors || "-"}</strong>

                <span>Dimensions</span>
                <strong>{selectedProduct.dimensions || "-"}</strong>

                <span>Poids</span>
                <strong>
                  {selectedProduct.weightKg ? `${selectedProduct.weightKg} kg` : "-"}
                </strong>

                <span>État</span>
                <strong>{selectedProduct.condition || "-"}</strong>

                <span>Style</span>
                <strong>{selectedProduct.style || "-"}</strong>

                <span>Usage</span>
                <strong>{selectedProduct.usageSpace || "-"}</strong>

                <span>Stock</span>
                <strong>{selectedProduct.isAvailable ? "Disponible" : "Indisponible"}</strong>
              </div>

              {selectedProduct.careInstructions && (
                <div className="products-detail-care">
                  <strong>Entretien</strong>
                  <p>{selectedProduct.careInstructions}</p>
                </div>
              )}

              <div className="products-detail-actions">
                {shouldShowPriceOnRequest(selectedProduct) ? (
                  <button
                    type="button"
                    className="product-cart-btn product-cart-btn--request"
                    onClick={openPriceRequestForm}
                    disabled={loadingAuth}
                  >
                    Demander le prix
                  </button>
                ) : (
                  <button
                    type="button"
                    className="product-cart-btn"
                    onClick={() => handleAddToCart(selectedProduct)}
                    disabled={loadingAuth || !canProductBeAddedToCart(selectedProduct)}
                  >
                    Ajouter au panier
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {lightboxOpen && (
        <div
          className="products-image-lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="products-image-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="products-image-lightbox-close"
              onClick={closeLightbox}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>

            {selectedProductImages.length > 1 && (
              <button
                type="button"
                className="products-image-lightbox-nav products-image-lightbox-nav--left"
                onClick={prevLightboxImage}
                aria-label="Image précédente"
              >
                <ChevronLeft size={26} />
              </button>
            )}

            {selectedProductImages[lightboxImageIndex ?? selectedImageIndex] ? (
              <img
                src={selectedProductImages[lightboxImageIndex ?? selectedImageIndex]}
                alt={selectedProduct?.name || ""}
                className="products-image-lightbox-image"
              />
            ) : (
              <div className="product-image-placeholder">
                {t("products.imageUnavailable")}
              </div>
            )}

            {selectedProductImages.length > 1 && (
              <button
                type="button"
                className="products-image-lightbox-nav products-image-lightbox-nav--right"
                onClick={nextLightboxImage}
                aria-label="Image suivante"
              >
                <ChevronRight size={26} />
              </button>
            )}
          </div>
        </div>
      )}

      {priceRequestOpen && selectedProduct && (
        <div className="home-price-request-modal" onClick={closePriceRequestForm}>
          <form
            className="home-price-request-card"
            onClick={(e) => e.stopPropagation()}
            onSubmit={submitPriceRequest}
          >
            <button
              type="button"
              className="home-price-close"
              onClick={closePriceRequestForm}
              aria-label={t("common.close")}
            >
              <X size={18} />
            </button>

            <p className="page-kicker">{t("home.priceRequestKicker")}</p>
            <h2>{selectedProduct.name}</h2>

            <div className="home-price-product-mini">
              {selectedProduct.fullMainImageUrl && (
                <img src={selectedProduct.fullMainImageUrl} alt={selectedProduct.name} />
              )}

              <div>
                <strong>{selectedProduct.name}</strong>
                <span>
                  {selectedProduct.dimensions || t("products.miniFallbackDimensions")}
                </span>
                <span>{selectedProduct.region || t("common.tunisia")}</span>
              </div>
            </div>

            <div className="home-price-fields">
              <input
                type="text"
                placeholder={t("home.yourName")}
                value={priceRequestForm.customerName}
                onChange={(e) =>
                  setPriceRequestForm((prev) => ({
                    ...prev,
                    customerName: e.target.value,
                  }))
                }
                required
              />

              <input
                type="email"
                placeholder={t("home.yourEmail")}
                value={priceRequestForm.email}
                onChange={(e) =>
                  setPriceRequestForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                required
              />

              <PhoneInput
                value={priceRequestForm.phone}
                onChange={(value) =>
                  setPriceRequestForm((prev) => ({
                    ...prev,
                    phone: value,
                  }))
                }
                placeholder={t("home.phone")}
              />

              <textarea
                placeholder={t("home.yourMessage")}
                value={priceRequestForm.message}
                onChange={(e) =>
                  setPriceRequestForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                required
              />
            </div>

            {priceRequestErrorKey && (
              <p className="home-price-request-error">{t(priceRequestErrorKey)}</p>
            )}

            <button
              type="submit"
              className="home-btn-primary home-price-submit"
              disabled={priceRequestLoading}
            >
              {priceRequestLoading ? t("home.sending") : t("home.send")}
            </button>
          </form>
        </div>
      )}

      {showSuccessModal && priceRequestSuccessProductName && (
        <div className="success-modal-overlay" onClick={closeSuccessModal}>
          <div
            className="success-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="success-modal-close"
              onClick={closeSuccessModal}
              aria-label={t("common.close")}
            >
              ×
            </button>

            <ActionSuccess
              title={t("products.priceRequestSuccessTitle")}
              message={t("products.priceRequestSuccessMessage")}
              details={
                <span>
                  {t("products.priceRequestProduct", {
                    name: priceRequestSuccessProductName,
                  })}
                </span>
              }
              primaryActionLabel={t("products.priceRequestPrimaryAction")}
              primaryActionTo="/account/price-requests"
              secondaryActionLabel={t("products.priceRequestSecondaryAction")}
              secondaryActionTo="/products"
              variant="priceRequest"
            />
          </div>
        </div>
      )}
    </div>
  );
}
