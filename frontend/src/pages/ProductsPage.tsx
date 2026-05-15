import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import PhoneInput from "../components/PhoneInput";
import { useNavigate } from "react-router-dom";
import {
  X,
  ShoppingCart,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  HeartHandshake,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import ActionSuccess from "../components/ActionSuccess";
import { useCart } from "../context/useCart";
import { getStoredUserLocation } from "../services/apiClient";
import {
  canProductBeAddedToCart,
  getProducts,
  shouldShowPriceOnRequest,
  shouldShowProductPrice,
  type ProductViewDto,
} from "../services/productService";
import { createPriceRequest } from "../services/priceRequestService";
import "../styles/ProductsPage.css";
import { useI18n } from "../i18n/i18n";
import { formatEurPrice } from "../utils/price";

type SizeFilter = "all" | "small" | "medium" | "large" | "xl";

export default function ProductsPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { isAuthenticated, loadingAuth, user } = useAuth();
  const { addToCart } = useCart();
  const visitorLocation = getStoredUserLocation();

  const [products, setProducts] = useState<ProductViewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [color, setColor] = useState("all");
  const [size, setSize] = useState<SizeFilter>("all");
  const [space, setSpace] = useState("all");

  const [selectedProduct, setSelectedProduct] =
    useState<ProductViewDto | null>(null);
  const [showPriceRequestModal, setShowPriceRequestModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [detailProduct, setDetailProduct] =
    useState<ProductViewDto | null>(null);

  const [detailImageIndex, setDetailImageIndex] = useState(0);

  const [addedProductId, setAddedProductId] = useState<string | number | null>(
    null
  );

  const [priceRequestLoading, setPriceRequestLoading] = useState(false);
  const [priceRequestErrorKey, setPriceRequestErrorKey] =
    useState<string | null>(null);
  const [priceRequestSuccessProductName, setPriceRequestSuccessProductName] =
    useState<string | null>(null);

  const [priceRequestForm, setPriceRequestForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setErrorKey(null);
        const data = await getProducts();
        setProducts(data);
      } catch {
        setErrorKey("products.loadError");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  function getProductImages(product: ProductViewDto | null) {
    if (!product) return [];

    if (product.fullImages?.length) {
      return product.fullImages;
    }

    if (product.fullMainImageUrl) {
      return [product.fullMainImageUrl];
    }

    if (product.mainImageUrl) {
      return [product.mainImageUrl];
    }

    return [];
  }

  const detailImages = getProductImages(detailProduct);

  function openDetailProduct(product: ProductViewDto) {
    setDetailProduct(product);
    setDetailImageIndex(0);
    setSelectedProduct(null);
  }

  function closeDetailProduct() {
    setDetailProduct(null);
    setDetailImageIndex(0);
  }

  function nextDetailImage() {
    if (!detailImages.length) return;
    setDetailImageIndex((prev) => (prev + 1) % detailImages.length);
  }

  function prevDetailImage() {
    if (!detailImages.length) return;
    setDetailImageIndex((prev) =>
      prev === 0 ? detailImages.length - 1 : prev - 1
    );
  }

  function openPriceRequest(product: ProductViewDto) {
    if (loadingAuth) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/products" } });
      return;
    }

    setSelectedProduct(product);
    setShowPriceRequestModal(true);
    setShowSuccessModal(false);
    closeDetailProduct();
    setPriceRequestSuccessProductName(null);
    setPriceRequestErrorKey(null);

    setPriceRequestForm({
      customerName:
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "",
      email: user?.email || "",
      phone: "",
      message: t("products.priceRequestPrefill", {
        productName: product.name,
      }),
    });
  }

  function closePriceRequest() {
    setShowPriceRequestModal(false);
    setShowSuccessModal(false);
    setSelectedProduct(null);
    setPriceRequestSuccessProductName(null);
    setPriceRequestErrorKey(null);
  }

  function closeSuccessModal() {
    setShowSuccessModal(false);
    setPriceRequestSuccessProductName(null);
    setSelectedProduct(null);
  }

  function handleAddToCart(product: ProductViewDto) {
    if (loadingAuth) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/products" } });
      return;
    }

    if (!canProductBeAddedToCart(product)) {
      openPriceRequest(product);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      priceLabel: formatEurPrice(product.price),
      mainImageUrl:
        getProductImages(product)[0] || product.fullMainImageUrl || "",
      dimensions: product.dimensions,
      lengthCm: product.lengthCm,
      widthCm: product.widthCm,
      canShowPrice: product.canShowPrice,
      isPriceHidden: product.isPriceHidden,
      requiresPriceRequest: product.requiresPriceRequest,
    });

    setAddedProductId(product.id);
    window.setTimeout(() => setAddedProductId(null), 1600);
  }

  async function submitPriceRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedProduct) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/products" } });
      return;
    }

    try {
      setPriceRequestLoading(true);
      setPriceRequestErrorKey(null);
      setPriceRequestSuccessProductName(null);

      await createPriceRequest({
        productId: selectedProduct.id,
        customerName: priceRequestForm.customerName.trim(),
        email: priceRequestForm.email.trim(),
        phone: priceRequestForm.phone.trim(),
        countryCode: selectedProduct.countryCode || visitorLocation.countryCode,
        message: priceRequestForm.message.trim(),
      });

      setPriceRequestSuccessProductName(selectedProduct.name);
      setShowPriceRequestModal(false);
      setShowSuccessModal(true);
      setPriceRequestForm({
        customerName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch {
      setPriceRequestErrorKey("products.priceRequestError");
    } finally {
      setPriceRequestLoading(false);
    }
  }

  const types = useMemo(() => {
    const uniqueTypes = products
      .map((product) => product.type)
      .filter((item): item is string => Boolean(item));

    return ["all", ...Array.from(new Set(uniqueTypes))];
  }, [products]);

  const colors = useMemo(() => {
    const allColors = products.flatMap((product) =>
      product.colors
        ? product.colors
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : []
    );

    return ["all", ...Array.from(new Set(allColors))];
  }, [products]);

  const spaces = useMemo(() => {
    const allSpaces = products.flatMap((product) =>
      product.usageSpace
        ? product.usageSpace
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : []
    );

    return ["all", ...Array.from(new Set(allSpaces))];
  }, [products]);

  function getSurfaceM2(product: ProductViewDto) {
    if (!product.lengthCm || !product.widthCm) return 0;
    return (product.lengthCm * product.widthCm) / 10000;
  }

  function getSizeLabel(product: ProductViewDto) {
    const surface = getSurfaceM2(product);

    if (!surface) return t("products.sizeLabels.unknown");
    if (surface < 2) return t("products.sizeLabels.small");
    if (surface < 4) return t("products.sizeLabels.medium");
    if (surface < 6) return t("products.sizeLabels.large");

    return t("products.sizeLabels.xl");
  }

  const matchSizeFilter = useCallback(
    (product: ProductViewDto) => {
      const surface = getSurfaceM2(product);

      if (size === "all") return true;
      if (!surface) return false;
      if (size === "small") return surface < 2;
      if (size === "medium") return surface >= 2 && surface < 4;
      if (size === "large") return surface >= 4 && surface < 6;
      if (size === "xl") return surface >= 6;

      return true;
    },
    [size]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const text = `
        ${product.name || ""}
        ${product.description || ""}
        ${product.shortStory || ""}
        ${product.type || ""}
        ${product.technique || ""}
        ${product.region || ""}
        ${product.material || ""}
        ${product.colors || ""}
        ${product.style || ""}
        ${product.usageSpace || ""}
      `.toLowerCase();

      const matchSearch = text.includes(search.toLowerCase().trim());
      const matchType = type === "all" || product.type === type;

      const matchColor =
        color === "all" ||
        product.colors
          ?.toLowerCase()
          .split(",")
          .map((item) => item.trim())
          .includes(color.toLowerCase());

      const matchSpace =
        space === "all" ||
        product.usageSpace
          ?.toLowerCase()
          .split(",")
          .map((item) => item.trim())
          .includes(space.toLowerCase());

      return (
        matchSearch &&
        matchType &&
        matchColor &&
        matchSizeFilter(product) &&
        matchSpace
      );
    });
  }, [products, search, type, color, space, matchSizeFilter]);

  const hasActiveFilters =
    search ||
    type !== "all" ||
    color !== "all" ||
    size !== "all" ||
    space !== "all";

  function resetFilters() {
    setSearch("");
    setType("all");
    setColor("all");
    setSize("all");
    setSpace("all");
  }

  return (
    <section className="products-page">
      <div className="products-hero">
        <p className="page-kicker">{t("products.kicker")}</p>
        <h1 className="page-title">{t("products.title")}</h1>
        <p className="page-description">{t("products.description")}</p>
      </div>

      <div className="products-toolbar">
        <div className="products-toolbar-title">
          <SlidersHorizontal size={18} />
          <span>{t("products.filterTitle")}</span>
        </div>

        <div className="products-filter-bar">
          <div className="products-filter-search">
            <Search size={17} />
            <input
              type="text"
              placeholder={t("products.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={type} onChange={(e) => setType(e.target.value)}>
            {types.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? t("products.typeAllLabel") : item}
              </option>
            ))}
          </select>

          <select
            value={size}
            onChange={(e) => setSize(e.target.value as SizeFilter)}
          >
            <option value="all">{t("products.sizeAllLabel")}</option>
            <option value="small">{t("products.sizeFilter.small")}</option>
            <option value="medium">{t("products.sizeFilter.medium")}</option>
            <option value="large">{t("products.sizeFilter.large")}</option>
            <option value="xl">{t("products.sizeFilter.xl")}</option>
          </select>

          <select value={color} onChange={(e) => setColor(e.target.value)}>
            {colors.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? t("products.colorAllLabel") : item}
              </option>
            ))}
          </select>

          <select value={space} onChange={(e) => setSpace(e.target.value)}>
            {spaces.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? t("products.spaceAllLabel") : item}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button type="button" onClick={resetFilters}>
              {t("products.reset")}
            </button>
          )}
        </div>
      </div>

      <p className="products-count-line">
        {t("products.countLine", {
          count: filteredProducts.length,
          plural: filteredProducts.length !== 1 ? "s" : "",
        })}
      </p>

      {loading && (
        <div className="products-state">
          <div className="products-loader"></div>
          <p>{t("products.loading")}</p>
        </div>
      )}

      {!loading && errorKey && (
        <div className="products-state products-error">
          <p>{t(errorKey)}</p>
        </div>
      )}

      {!loading && !errorKey && filteredProducts.length === 0 && (
        <div className="products-state">
          <p>{t("products.empty")}</p>
        </div>
      )}

      {!loading && !errorKey && filteredProducts.length > 0 && (
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const isAdded = addedProductId === product.id;
            const hasVisiblePrice = shouldShowProductPrice(product);
            const showPriceOnRequest = shouldShowPriceOnRequest(product);

            const productImages = getProductImages(product);
            const coverImage = productImages[0];

            return (
              <article key={product.id} className="product-card">
                <div className="product-card-media">
                  <button
                    type="button"
                    className="product-card-image-frame"
                    onClick={() => openDetailProduct(product)}
                  >
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={product.name}
                        className="product-image"
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        {t("products.imageUnavailable")}
                      </div>
                    )}
                  </button>

                  <div className="product-card-badges">
                    {product.isFeatured && (
                      <span className="product-badge product-badge-featured">
                        {t("products.featured")}
                      </span>
                    )}

                    {product.isUniquePiece && (
                      <span className="product-badge product-badge-unique">
                        {t("products.unique")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="product-content">
                  <div className="product-meta product-meta--compact">
                    {product.type && <span>{product.type}</span>}
                    {product.region && <span>{product.region}</span>}
                    <span>{getSizeLabel(product)}</span>
                  </div>

                  <h2>{product.name}</h2>

                  <div className="product-card-specs">
                    {product.material && (
                      <div>
                        <span>{t("home.fields.material")}</span>
                        <strong>{product.material}</strong>
                      </div>
                    )}

                    {product.lengthCm && product.widthCm && (
                      <div>
                        <span>{t("home.fields.dimensions")}</span>
                        <strong>
                          {product.lengthCm} × {product.widthCm} cm
                        </strong>
                      </div>
                    )}

                    {product.technique && (
                      <div>
                        <span>{t("home.fields.technique")}</span>
                        <strong>{product.technique}</strong>
                      </div>
                    )}
                  </div>

                  <div
                    className={`product-buy-zone ${
                      showPriceOnRequest ? "product-buy-zone--request" : ""
                    }`}
                  >
                    <div className="product-price-box">
                      <p className="product-price-label">
                        {hasVisiblePrice
                          ? t("products.price")
                          : showPriceOnRequest
                          ? t("products.priceOnRequest")
                          : t("products.price")}
                      </p>

                      <strong
                        className={
                          hasVisiblePrice
                            ? "product-price"
                            : "product-price-request"
                        }
                      >
                        {hasVisiblePrice
                          ? formatEurPrice(product.price)
                          : showPriceOnRequest
                          ? t("products.priceOnRequest")
                          : "-"}
                      </strong>
                    </div>

                    <div className="product-actions-row">
                      <button
                        type="button"
                        className="product-detail-btn"
                        onClick={() => openDetailProduct(product)}
                      >
                        <Eye size={16} />
                        {t("products.viewDetails")}
                      </button>

                      {hasVisiblePrice ? (
                        <button
                          type="button"
                          className={`product-cart-btn ${
                            isAdded ? "product-cart-btn--added" : ""
                          }`}
                          onClick={() => handleAddToCart(product)}
                          disabled={loadingAuth}
                        >
                          <span className="product-cart-icon">
                            {isAdded ? (
                              <CheckCircle2 size={17} />
                            ) : (
                              <ShoppingCart size={17} />
                            )}
                          </span>
                          <span>
                            {isAdded ? t("products.added") : t("products.cart")}
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="product-cart-btn product-cart-btn--request"
                          onClick={() => openPriceRequest(product)}
                          disabled={loadingAuth}
                        >
                          <HeartHandshake size={17} />
                          <span>
                            {loadingAuth
                              ? t("products.loading")
                              : t("products.requestPrice")}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {detailProduct && (
        <div className="products-detail-modal" onClick={closeDetailProduct}>
          <div
            className="products-detail-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="products-detail-close"
              onClick={closeDetailProduct}
            >
              <X size={18} />
            </button>

            <div className="products-detail-gallery">
              <div className="products-detail-image">
                {detailImages[detailImageIndex] ? (
                  <img
                    src={detailImages[detailImageIndex]}
                    alt={detailProduct.name}
                  />
                ) : (
                  <div className="product-image-placeholder">
                    {t("products.imageUnavailable")}
                  </div>
                )}

                {detailImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="products-detail-gallery-btn products-detail-gallery-btn--left"
                      onClick={prevDetailImage}
                    >
                      <ChevronLeft size={22} />
                    </button>

                    <button
                      type="button"
                      className="products-detail-gallery-btn products-detail-gallery-btn--right"
                      onClick={nextDetailImage}
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}
              </div>

              {detailImages.length > 1 && (
                <div className="products-detail-thumbs">
                  {detailImages.map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      type="button"
                      className={`products-detail-thumb ${
                        detailImageIndex === index
                          ? "products-detail-thumb--active"
                          : ""
                      }`}
                      onClick={() => setDetailImageIndex(index)}
                    >
                      <img src={img} alt={`${detailProduct.name} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="products-detail-info">
              <p className="page-kicker">{t("home.productDetailKicker")}</p>
              <h2>{detailProduct.name}</h2>

              <p className="products-detail-desc">
                {detailProduct.description ||
                  detailProduct.shortStory ||
                  t("home.selectedFallbackDescription")}
              </p>

              <strong
                className={
                  shouldShowProductPrice(detailProduct)
                    ? "products-detail-price"
                    : "products-detail-price products-detail-price--request"
                }
              >
                {shouldShowProductPrice(detailProduct) &&
                detailProduct.price != null
                  ? formatEurPrice(detailProduct.price)
                  : shouldShowPriceOnRequest(detailProduct)
                  ? t("products.priceOnRequest")
                  : "-"}
              </strong>

              <div className="products-detail-grid">
                <span>{t("home.fields.category")}</span>
                <strong>{detailProduct.category || "-"}</strong>

                <span>{t("home.fields.type")}</span>
                <strong>{detailProduct.type || "-"}</strong>

                <span>{t("home.fields.technique")}</span>
                <strong>{detailProduct.technique || "-"}</strong>

                <span>{t("home.fields.region")}</span>
                <strong>{detailProduct.region || "-"}</strong>

                <span>{t("home.fields.material")}</span>
                <strong>{detailProduct.material || "-"}</strong>

                <span>{t("home.fields.colors")}</span>
                <strong>{detailProduct.colors || "-"}</strong>

                <span>{t("home.fields.dimensions")}</span>
                <strong>{detailProduct.dimensions || "-"}</strong>

                <span>{t("home.fields.length")}</span>
                <strong>
                  {detailProduct.lengthCm ? `${detailProduct.lengthCm} cm` : "-"}
                </strong>

                <span>{t("home.fields.width")}</span>
                <strong>
                  {detailProduct.widthCm ? `${detailProduct.widthCm} cm` : "-"}
                </strong>

                <span>{t("home.fields.weight")}</span>
                <strong>
                  {detailProduct.weightKg ? `${detailProduct.weightKg} kg` : "-"}
                </strong>

                <span>Âge</span>
                <strong>
                  {detailProduct.ageYears ? `${detailProduct.ageYears} ans` : "-"}
                </strong>

                <span>{t("home.fields.condition")}</span>
                <strong>{detailProduct.condition || "-"}</strong>

                <span>Densité</span>
                <strong>{detailProduct.density || "-"}</strong>

                <span>Forme</span>
                <strong>{detailProduct.shape || "-"}</strong>

                <span>{t("home.fields.style")}</span>
                <strong>{detailProduct.style || "-"}</strong>

                <span>{t("home.fields.usage")}</span>
                <strong>{detailProduct.usageSpace || "-"}</strong>

                <span>{t("products.unique")}</span>
                <strong>{detailProduct.isUniquePiece ? "Oui" : "Non"}</strong>

                <span>Fait main</span>
                <strong>{detailProduct.isHandmade ? "Oui" : "Non"}</strong>

                <span>{t("home.fields.stock")}</span>
                <strong>{detailProduct.stock ?? "-"}</strong>
              </div>

              {detailProduct.careInstructions && (
                <div className="products-detail-care">
                  <strong>{t("home.fields.carePrefix")}</strong>
                  <p>{detailProduct.careInstructions}</p>
                </div>
              )}

              {detailProduct.shortStory && (
                <div className="products-detail-care">
                  <strong>Histoire de la pièce</strong>
                  <p>{detailProduct.shortStory}</p>
                </div>
              )}

              <div className="products-detail-actions">
                {canProductBeAddedToCart(detailProduct) ? (
                  <button
                    type="button"
                    className="product-cart-btn"
                    onClick={() => {
                      handleAddToCart(detailProduct);
                      closeDetailProduct();
                    }}
                  >
                    <ShoppingCart size={17} />
                    {t("home.addToCart")}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="product-cart-btn product-cart-btn--request"
                    onClick={() => {
                      const product = detailProduct;
                      closeDetailProduct();
                      openPriceRequest(product);
                    }}
                  >
                    <HeartHandshake size={17} />
                    {t("products.requestPrice")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPriceRequestModal && selectedProduct && (
        <div className="products-price-modal" onClick={closePriceRequest}>
          <form
            className="products-price-card"
            onClick={(e) => e.stopPropagation()}
            onSubmit={submitPriceRequest}
          >
            <button
              type="button"
              className="products-price-close"
              onClick={closePriceRequest}
              aria-label={t("products.close")}
            >
              <X size={18} />
            </button>

            <p className="page-kicker">{t("products.priceRequestKicker")}</p>
            <h2>{selectedProduct.name}</h2>

            <div className="products-price-product-mini">
              {getProductImages(selectedProduct)[0] && (
                <img
                  src={getProductImages(selectedProduct)[0]}
                  alt={selectedProduct.name}
                />
              )}

              <div>
                <strong>{selectedProduct.name}</strong>
                <span>
                  {selectedProduct.dimensions ||
                    t("products.miniFallbackDimensions")}
                </span>
                <span>
                  {selectedProduct.region || t("products.miniFallbackRegion")}
                </span>
              </div>
            </div>

            <div className="products-price-fields">
              <input
                type="text"
                placeholder={t("products.yourName")}
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
                placeholder={t("products.yourEmail")}
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
  className="price-request-phone"
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
                placeholder={t("products.yourMessage")}
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
              <p className="products-price-error">{t(priceRequestErrorKey)}</p>
            )}

            <button
              type="submit"
              className="product-cart-btn products-price-submit"
              disabled={priceRequestLoading}
            >
              {priceRequestLoading
                ? t("products.sending")
                : t("products.sendRequest")}
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
              aria-label={t("products.close")}
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
    </section>
  );
}
