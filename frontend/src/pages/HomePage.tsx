import { useCart } from "../context/useCart";
import { Link, useNavigate } from "react-router-dom";
import { Star, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import PhoneInput from "../components/PhoneInput";
import boutiqueImg1 from "../assets/ChatGPT Image May 5, 2026, 02_21_18 PM.png";
import boutiqueImg2 from "../assets/ChatGPT Image May 5, 2026, 02_21_30 PM.png";
import boutiqueImg3 from "../assets/ChatGPT Image May 5, 2026, 02_21_36 PM.png";
import boutiqueImg4 from "../assets/ChatGPT Image May 5, 2026, 02_21_42 PM.png";
import boutiqueImg5 from "../assets/ChatGPT Image May 5, 2026, 02_21_46 PM.png";
import boutiqueImg6 from "../assets/ChatGPT Image May 5, 2026, 02_22_04 PM.png";

import heroRug from "../assets/088fc89b-c8a7-49da-8450-cc19fc82ade1.png";
import storyImage from "../assets/cbd0ea42-92dc-4cd6-a8e7-0b3133fe44f2.png";

import "../styles/HomePage.css";

import { useAuth } from "../context/AuthContext";
import ActionSuccess from "../components/ActionSuccess";
import { getStoredUserLocation } from "../services/apiClient";
import {
  canProductBeAddedToCart,
  getLatestProducts,
  shouldShowPriceOnRequest,
  shouldShowProductPrice,
  type ProductViewDto,
} from "../services/productService";
import { createPriceRequest } from "../services/priceRequestService";
import { useI18n } from "../i18n/i18n";
import { formatEurPrice } from "../utils/price";

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
  const navigate = useNavigate();
  const { isAuthenticated, loadingAuth } = useAuth();
  const shouldReduceMotion = useReducedMotion();
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const { addToCart } = useCart();
  const visitorLocation = getStoredUserLocation();

  const [products, setProducts] = useState<ProductViewDto[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsErrorKey, setProductsErrorKey] = useState<string | null>(null);

  const [boutiqueIndex, setBoutiqueIndex] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState<ProductViewDto | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const openProductModal = (product: ProductViewDto) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    setPriceRequestOpen(false);
    setShowSuccessModal(false);
    setPriceRequestSuccessProductName(null);
    setPriceRequestErrorKey(null);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setSelectedImageIndex(0);
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

  const selectedImages = selectedProduct?.fullImages?.length
    ? selectedProduct.fullImages
    : selectedProduct?.fullMainImageUrl
    ? [selectedProduct.fullMainImageUrl]
    : [];

  const nextImage = () => {
    if (!selectedImages.length) return;
    setSelectedImageIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const prevImage = () => {
    if (!selectedImages.length) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1
    );
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

        const data = await getLatestProducts();

        const latestProducts = [...data]
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
  const motionViewport = disableScrollAnimations
    ? undefined
    : { once: true, amount: 0.16 };
  const motionTransition = disableScrollAnimations
    ? { duration: 0 }
    : scrollTransition;

  return (
    <div className="home">
 <section className="home-boutique-hero">
  <div className="home-boutique-hero-bg">
    {boutiqueImages.map((img, index) => (
      <motion.img
        key={index}
        src={img}
        alt="Boutique Artisan Madina"
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
    aria-label="Image précédente"
  >
    <ChevronLeft size={28} />
  </button>

  <button
    type="button"
    className="home-boutique-hero-btn home-boutique-hero-btn--right"
    onClick={nextBoutiqueImage}
    aria-label="Image suivante"
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
        aria-label={`Afficher l’image ${index + 1}`}
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
            whileInView={motionWhileInView}
            viewport={motionViewport}
          >
            {categories.map((cat, i) => (
              <MotionLink
                to="/products"
                key={cat.name}
                className={`home-cat-card home-cat-card--${i}`}
                variants={fadeUp}
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
              const mainImage = product.fullMainImageUrl;
              const isNewProduct = i < 2;
              const showVisiblePrice = shouldShowProductPrice(product);
              const showPriceOnRequest = shouldShowPriceOnRequest(product);

              return (
                <motion.article
                  key={product.id}
                  className="home-rug-card"
                  variants={fadeUp}
                  initial={motionInitial}
                  whileInView={motionWhileInView}
                  viewport={motionViewport}
                  transition={
                    disableScrollAnimations
                      ? { duration: 0 }
                      : { ...scrollTransition, delay: i * 0.06 }
                  }
                >
                  {isNewProduct && (
                    <div className="home-rug-new-badge">{t("home.newBadge")}</div>
                  )}

                  <button
                    className="home-rug-img"
                    type="button"
                    onClick={() => openProductModal(product)}
                    aria-label={t("home.viewDetailsOf", { name: product.name })}
                  >
                    {mainImage ? (
                      <img src={mainImage} alt={product.name} />
                    ) : (
                      <div className="home-rug-img-placeholder">
                        {t("home.imagePlaceholder")}
                      </div>
                    )}
                  </button>

                  <div className="home-rug-info">
                    <div className="home-rug-meta">
                      <span className="home-rug-origin">
                        ✦ {product.region || t("common.tunisia")}
                      </span>

                      <span className="home-rug-size">
                        {product.dimensions || t("products.miniFallbackDimensions")}
                      </span>
                    </div>

                    <h3 className="home-rug-name">{product.name}</h3>

                    <p className="home-rug-material">
                      {product.material || product.type || t("ourStory.values.handmadeTitle")}
                    </p>

                    <div className="home-rug-rating">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={12} fill="#c8a060" stroke="#c8a060" />
                      ))}
                      <span>{t("home.premiumLabel")}</span>
                    </div>

                    <div className="home-rug-footer">
                      <div className="home-rug-price-block">
                        <span
                          className={`home-rug-price ${
                            showPriceOnRequest ? "home-rug-price--request" : ""
                          }`}
                        >
                          {showVisiblePrice && product.price != null
                            ? formatEurPrice(product.price)
                            : showPriceOnRequest
                            ? t("home.priceOnRequest")
                            : "-"}
                        </span>
                      </div>

                      <button
                        className="home-rug-details-btn home-rug-details-btn--full"
                        type="button"
                        onClick={() => openProductModal(product)}
                      >
                        <Eye size={15} />
                        {showPriceOnRequest
                          ? t("home.requestPrice")
                          : t("home.viewDetails")}
                      </button>
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
          whileInView={motionWhileInView}
          viewport={motionViewport}
          transition={motionTransition}
        >
          <div className="home-boutique-map-text">
            <p className="page-kicker">{t("home.shopKicker")}</p>
            <h3>{t("home.findUsInTunis")}</h3>
            <p>{t("home.shopParagraph")}</p>

            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noreferrer"
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
        <div className="home-product-modal" onClick={closeProductModal}>
          <div className="home-product-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="home-product-modal-close"
              type="button"
              onClick={closeProductModal}
              aria-label={t("common.close")}
            >
              <X size={20} />
            </button>

            <div className="home-product-modal-gallery">
              <div className="home-product-modal-main-img">
                {selectedImages[selectedImageIndex] ? (
                  <img src={selectedImages[selectedImageIndex]} alt={selectedProduct.name} />
                ) : (
                  <div className="home-rug-img-placeholder">{t("home.imagePlaceholder")}</div>
                )}

                {selectedImages.length > 1 && (
                  <>
                    <button
                      className="home-product-gallery-btn home-product-gallery-btn--left"
                      type="button"
                      onClick={prevImage}
                    >
                      <ChevronLeft size={22} />
                    </button>

                    <button
                      className="home-product-gallery-btn home-product-gallery-btn--right"
                      type="button"
                      onClick={nextImage}
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}
              </div>

              {selectedImages.length > 1 && (
                <div className="home-product-thumbs">
                  {selectedImages.map((img, index) => (
                    <button
                      key={img}
                      className={`home-product-thumb${
                        selectedImageIndex === index ? " home-product-thumb--active" : ""
                      }`}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img src={img} alt={`${selectedProduct.name} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="home-product-modal-info">
              <p className="page-kicker">{t("home.productDetailKicker")}</p>
              <h2>{selectedProduct.name}</h2>

              <p className="home-product-modal-desc">
                {selectedProduct.description ||
                  selectedProduct.shortStory ||
                  t("home.selectedFallbackDescription")}
              </p>

              <div
                className={`home-product-modal-price ${
                  shouldShowPriceOnRequest(selectedProduct)
                    ? "home-product-modal-price--request"
                    : ""
                }`}
              >
                {shouldShowProductPrice(selectedProduct) &&
                selectedProduct.price != null
                  ? formatEurPrice(selectedProduct.price)
                  : shouldShowPriceOnRequest(selectedProduct)
                  ? t("home.priceOnRequest")
                  : "-"}
              </div>

              <div className="home-product-details-grid">
                <span>{t("home.fields.category")}</span>
                <strong>{selectedProduct.category || t("common.rug")}</strong>

                <span>{t("home.fields.type")}</span>
                <strong>{selectedProduct.type || "-"}</strong>

                <span>{t("home.fields.technique")}</span>
                <strong>{selectedProduct.technique || "-"}</strong>

                <span>{t("home.fields.region")}</span>
                <strong>{selectedProduct.region || t("common.tunisia")}</strong>

                <span>{t("home.fields.material")}</span>
                <strong>{selectedProduct.material || "-"}</strong>

                <span>{t("home.fields.colors")}</span>
                <strong>{selectedProduct.colors || "-"}</strong>

                <span>{t("home.fields.dimensions")}</span>
                <strong>{selectedProduct.dimensions || "-"}</strong>

                <span>{t("home.fields.weight")}</span>
                <strong>{selectedProduct.weightKg ? `${selectedProduct.weightKg} kg` : "-"}</strong>

                <span>{t("home.fields.condition")}</span>
                <strong>{selectedProduct.condition || "-"}</strong>

                <span>{t("home.fields.style")}</span>
                <strong>{selectedProduct.style || "-"}</strong>

                <span>{t("home.fields.usage")}</span>
                <strong>{selectedProduct.usageSpace || "-"}</strong>

                <span>{t("home.fields.stock")}</span>
                <strong>{selectedProduct.stock}</strong>
              </div>

              {selectedProduct.careInstructions && (
                <p className="home-product-care">
                  <strong>{t("home.fields.carePrefix")}</strong>{" "}
                  {selectedProduct.careInstructions}
                </p>
              )}

              <div className="home-product-modal-actions">
                {!canProductBeAddedToCart(selectedProduct) ? (
                  <button
                    type="button"
                    className="home-btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPriceRequestForm();
                    }}
                    disabled={loadingAuth}
                  >
                    {loadingAuth ? t("home.catalogLoading") : t("home.requestPrice")}
                  </button>
                ) : (
                  <div className="home-product-buy-actions">
                    <button
                      type="button"
                      className="home-btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!isAuthenticated) {
                          closeProductModal();
                          navigate("/login");
                          return;
                        }

                        const result = addToCart({
                          id: selectedProduct.id,
                          name: selectedProduct.name,
                          slug: selectedProduct.slug,
                          price: selectedProduct.price,
                          mainImageUrl: selectedProduct.fullMainImageUrl,
                          dimensions: selectedProduct.dimensions,
                          lengthCm: selectedProduct.lengthCm,
                          widthCm: selectedProduct.widthCm,
                          canShowPrice: selectedProduct.canShowPrice,
                          isPriceHidden: selectedProduct.isPriceHidden,
                          requiresPriceRequest: selectedProduct.requiresPriceRequest,
                        });

                        if (result.ok) {
                          closeProductModal();
                          navigate("/cart");
                        }
                      }}
                    >
                      {t("home.addToCart")}
                    </button>

                    <button
                      type="button"
                      className="home-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!isAuthenticated) {
                          closeProductModal();
                          navigate("/login");
                          return;
                        }

                        addToCart({
                          id: selectedProduct.id,
                          name: selectedProduct.name,
                          slug: selectedProduct.slug,
                          price: selectedProduct.price,
                          mainImageUrl: selectedProduct.fullMainImageUrl,
                          dimensions: selectedProduct.dimensions,
                          lengthCm: selectedProduct.lengthCm,
                          widthCm: selectedProduct.widthCm,
                          canShowPrice: selectedProduct.canShowPrice,
                          isPriceHidden: selectedProduct.isPriceHidden,
                          requiresPriceRequest: selectedProduct.requiresPriceRequest,
                        });

                        closeProductModal();
                        navigate("/checkout");
                      }}
                    >
                      {t("home.checkout")}
                    </button>
                  </div>
                )}
              </div>
            </div>
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
  placeholder="Téléphone"
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
              title="Demande de prix envoyee"
              message="Votre demande a bien ete recue. Notre equipe vous repondra rapidement avec les informations de prix et de disponibilite."
              details={
                <span>Piece concernee : {priceRequestSuccessProductName}</span>
              }
              primaryActionLabel="Voir mes demandes"
              primaryActionTo="/account/price-requests"
              secondaryActionLabel="Continuer a explorer"
              secondaryActionTo="/products"
              variant="priceRequest"
            />
          </div>
        </div>
      )}
    </div>
  );
}
