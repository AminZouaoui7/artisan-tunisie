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
  getProductVariants,
  shouldShowPriceOnRequest,
  shouldShowProductPrice,
  type ProductViewDto,
} from "../services/productService";
import { createPriceRequest } from "../services/priceRequestService";
import { useCurrency } from "../context/CurrencyContext";
import "../styles/ProductsPage.css";
import { useI18n } from "../i18n/i18n";

type SizeFilter = "all" | "small" | "medium" | "large" | "xl";

export default function ProductsPage() {
  const { t, language } = useI18n();
  const { formatPrice } = useCurrency();
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
  const [detailVariants, setDetailVariants] = useState<ProductViewDto[]>([]);
  const [detailVariantsLoading, setDetailVariantsLoading] = useState(false);

  const [detailImageIndex, setDetailImageIndex] = useState(0);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number | null>(
    null
  );

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

  function getSurfaceM2(product: ProductViewDto) {
    if (!product.lengthCm || !product.widthCm) return 0;
    return (product.lengthCm * product.widthCm) / 10000;
  }

  function normalizeText(value?: string | null) {
    return (value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function splitValues(value?: string | null) {
    return (value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function getVariantFamilyKey(product: ProductViewDto) {
    const rawKey = product.variantGroupKey || product.slug || product.name || "";

    return normalizeText(rawKey)
      .replace(
        /rouge|red|bleu|blue|noir|black|blanc|white|beige|vert|green|jaune|yellow|gris|gray|grey/g,
        ""
      )
      .replace(/\b(xs|s|m|l|xl|xxl)\b/g, "")
      .replace(/sb|sm|md|lg|xl/g, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();
  }

  const colorLabels: Record<string, { fr: string; en: string }> = {
    beige: { fr: "Beige", en: "Beige" },
    bleu: { fr: "Bleu", en: "Blue" },
    blue: { fr: "Bleu", en: "Blue" },
    rouge: { fr: "Rouge", en: "Red" },
    red: { fr: "Rouge", en: "Red" },
    vert: { fr: "Vert", en: "Green" },
    green: { fr: "Vert", en: "Green" },
    noir: { fr: "Noir", en: "Black" },
    black: { fr: "Noir", en: "Black" },
    blanc: { fr: "Blanc", en: "White" },
    white: { fr: "Blanc", en: "White" },
    multicolore: { fr: "Multicolore", en: "Multicolor" },
  };

  const colorTranslations: Record<string, { fr: string; en: string }> = {
    blue: { fr: "Bleu", en: "Blue" },
    bleu: { fr: "Bleu", en: "Blue" },
    red: { fr: "Rouge", en: "Red" },
    rouge: { fr: "Rouge", en: "Red" },
    green: { fr: "Vert", en: "Green" },
    vert: { fr: "Vert", en: "Green" },
    beige: { fr: "Beige", en: "Beige" },
    black: { fr: "Noir", en: "Black" },
    noir: { fr: "Noir", en: "Black" },
    white: { fr: "Blanc", en: "White" },
    blanc: { fr: "Blanc", en: "White" },
    brown: { fr: "Marron", en: "Brown" },
    marron: { fr: "Marron", en: "Brown" },
    grey: { fr: "Gris", en: "Grey" },
    gray: { fr: "Gris", en: "Grey" },
    gris: { fr: "Gris", en: "Grey" },
  };

  const spaceLabels: Record<string, { fr: string; en: string }> = {
    salon: { fr: "Salon", en: "Living room" },
    livingroom: { fr: "Salon", en: "Living room" },
    "living room": { fr: "Salon", en: "Living room" },
    chambre: { fr: "Chambre à coucher", en: "Bedroom" },
    bedroom: { fr: "Chambre à coucher", en: "Bedroom" },
    couloir: { fr: "Couloir", en: "Hallway" },
    hallway: { fr: "Couloir", en: "Hallway" },
    entree: { fr: "Entrée", en: "Entrance" },
    entrée: { fr: "Entrée", en: "Entrance" },
    entrance: { fr: "Entrée", en: "Entrance" },
    bureau: { fr: "Bureau", en: "Office" },
    office: { fr: "Bureau", en: "Office" },
  };

  function canonicalColor(value?: string | null) {
    const key = normalizeText(value);
    if (["bleu", "blue"].includes(key)) return "blue";
    if (["rouge", "red"].includes(key)) return "red";
    if (["vert", "green"].includes(key)) return "green";
    if (["noir", "black"].includes(key)) return "black";
    if (["blanc", "white"].includes(key)) return "white";
    if (["beige"].includes(key)) return "beige";
    if (["multicolore", "multicolor"].includes(key)) return "multicolore";
    return key;
  }

  function canonicalSpace(value?: string | null) {
    const key = normalizeText(value).replace(/\s+/g, " ");

    if (["salon", "living room", "livingroom"].includes(key)) return "salon";
    if (["chambre", "chambre a coucher", "bedroom"].includes(key))
      return "chambre";
    if (["couloir", "hallway"].includes(key)) return "couloir";
    if (["entree", "entrance"].includes(key)) return "entree";
    if (["bureau", "office"].includes(key)) return "bureau";

    return key;
  }

  function getColorLabel(value: string, lang: "fr" | "en") {
    const canonical = canonicalColor(value);
    return colorLabels[canonical]?.[lang] || value;
  }

  function getTranslatedColor(color?: string) {
    const lang = language === "FR" ? "fr" : "en";
    const raw = splitValues(color)[0] || color || "";
    const key = canonicalColor(raw) || normalizeText(raw);
    return (
      colorTranslations[key]?.[lang] ||
      colorLabels[key]?.[lang] ||
      raw ||
      ""
    );
  }

  function getSpaceLabel(value: string, lang: "fr" | "en") {
    const canonical = canonicalSpace(value);
    return spaceLabels[canonical]?.[lang] || value;
  }

  function getSuggestedSpacesBySize(product: ProductViewDto) {
    const surface = getSurfaceM2(product);

    if (!surface) return [];

    if (surface < 2) return ["couloir", "entree"];
    if (surface < 4) return ["chambre", "bureau", "couloir"];
    if (surface < 6) return ["salon", "chambre"];
    return ["salon"];
  }

  function getProductVarietyKey(product: ProductViewDto) {
    return [
      normalizeText(product.type),
      normalizeText(product.region),
      normalizeText(product.colors),
      normalizeText(product.usageSpace),
      getSizeLabel(product),
    ].join("|");
  }

  function getVarietyScore(product: ProductViewDto) {
    let score = 0;

    if (product.isFeatured) score += 100;
    if (product.isUniquePiece) score += 30;
    if (product.fullMainImageUrl || product.mainImageUrl || product.fullImages?.length)
      score += 20;
    if (product.type) score += 8;
    if (product.region) score += 6;
    if (product.colors) score += 6;
    if (product.usageSpace) score += 5;
    if (product.lengthCm && product.widthCm) score += 5;

    return score;
  }

  function diversifyProducts(list: ProductViewDto[]) {
    const sorted = [...list].sort((a, b) => {
      const scoreDiff = getVarietyScore(b) - getVarietyScore(a);
      if (scoreDiff !== 0) return scoreDiff;

      const surfaceDiff = getSurfaceM2(b) - getSurfaceM2(a);
      if (surfaceDiff !== 0) return surfaceDiff;

      return String(a.name || "").localeCompare(String(b.name || ""));
    });

    const buckets = new Map<string, ProductViewDto[]>();

    sorted.forEach((product) => {
      const varietyKey = getProductVarietyKey(product);
      const key =
        normalizeText(product.type) ||
        normalizeText(product.region) ||
        normalizeText(varietyKey) ||
        "other";
      const bucket = buckets.get(key) || [];
      bucket.push(product);
      buckets.set(key, bucket);
    });

    const result: ProductViewDto[] = [];
    const bucketValues = Array.from(buckets.values());

    while (bucketValues.some((bucket) => bucket.length > 0)) {
      bucketValues.forEach((bucket) => {
        const item = bucket.shift();
        if (item) result.push(item);
      });
    }

    return result;
  }

  function getVisibleVariantProducts(productsList: ProductViewDto[]) {
    const bestByGroup = new Map<string, ProductViewDto>();
    const productsWithoutGroup: ProductViewDto[] = [];

    productsList.forEach((product) => {
      const groupKey = product.variantGroupKey?.trim();

      if (!groupKey) {
        productsWithoutGroup.push(product);
        return;
      }

      const currentBest = bestByGroup.get(groupKey);
      const productSurface = getSurfaceM2(product);
      const currentSurface = currentBest ? getSurfaceM2(currentBest) : 0;

      if (!currentBest || productSurface > currentSurface) {
        bestByGroup.set(groupKey, product);
      }
    });

    return [...productsWithoutGroup, ...Array.from(bestByGroup.values())];
  }

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

  const visibleCatalogProducts = useMemo(() => {
    return diversifyProducts(getVisibleVariantProducts(products));
  }, [products]);

  const detailImages = getProductImages(detailProduct);
  const isLightboxOpen = lightboxImageIndex !== null;

  const openLightbox = useCallback(
    (index: number) => {
      if (!detailImages.length) return;
      const safeIndex = Math.max(0, Math.min(index, detailImages.length - 1));
      setLightboxImageIndex(safeIndex);
    },
    [detailImages.length]
  );

  const closeLightbox = useCallback(() => {
    setLightboxImageIndex(null);
  }, []);

  const nextLightboxImage = useCallback(() => {
    if (!detailImages.length) return;
    setLightboxImageIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % detailImages.length;
    });
  }, [detailImages.length]);

  const prevLightboxImage = useCallback(() => {
    if (!detailImages.length) return;
    setLightboxImageIndex((prev) => {
      if (prev === null) return prev;
      return prev === 0 ? detailImages.length - 1 : prev - 1;
    });
  }, [detailImages.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;

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
  }, [closeLightbox, isLightboxOpen, nextLightboxImage, prevLightboxImage]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    if (!detailImages.length) {
      closeLightbox();
      return;
    }

    setLightboxImageIndex((prev) => {
      if (prev === null) return prev;
      if (prev >= detailImages.length) return detailImages.length - 1;
      return prev;
    });
  }, [closeLightbox, detailImages.length, isLightboxOpen]);

  async function openDetailProduct(product: ProductViewDto) {
    setDetailProduct(product);
    setDetailImageIndex(0);
    closeLightbox();
    setSelectedProduct(null);
    setDetailVariants([]);

    try {
      setDetailVariantsLoading(true);
      const variants = await getProductVariants(
        product.id,
        product.countryCode ?? undefined
      );
      setDetailVariants(variants);
    } catch {
      setDetailVariants([]);
    } finally {
      setDetailVariantsLoading(false);
    }
  }

  function closeDetailProduct() {
    setDetailProduct(null);
    setDetailImageIndex(0);
    closeLightbox();
    setDetailVariants([]);
    setDetailVariantsLoading(false);
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
      priceLabel: formatPrice(product.price),
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
    const uniqueTypes = visibleCatalogProducts
      .map((product) => product.type?.trim())
      .filter((item): item is string => Boolean(item));

    return [
      "all",
      ...Array.from(new Set(uniqueTypes)).sort((a, b) => a.localeCompare(b)),
    ];
  }, [visibleCatalogProducts]);

  const colors = useMemo(() => {
    const allColors = visibleCatalogProducts.flatMap((product) =>
      splitValues(product.colors).map(canonicalColor)
    );

    return ["all", ...Array.from(new Set(allColors)).filter(Boolean).sort()];
  }, [visibleCatalogProducts]);

  const spaces = useMemo(() => {
    const values = visibleCatalogProducts.flatMap((product) => {
      const declaredSpaces = splitValues(product.usageSpace).map(canonicalSpace);
      const suggestedSpaces = getSuggestedSpacesBySize(product);
      return [...declaredSpaces, ...suggestedSpaces];
    });

    return ["all", ...Array.from(new Set(values)).filter(Boolean).sort()];
  }, [visibleCatalogProducts]);

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

  const hasActiveFilters = Boolean(
    search.trim() || type !== "all" || color !== "all" || size !== "all" || space !== "all"
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    const result = visibleCatalogProducts.filter((product) => {
      const text = normalizeText(`
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
        ${product.dimensions || ""}
      `);

      const matchSearch = !normalizedSearch || text.includes(normalizedSearch);
      const matchType =
        type === "all" || normalizeText(product.type) === normalizeText(type);

      const productColors = splitValues(product.colors).map(canonicalColor);
      const matchColor =
        color === "all" || productColors.includes(canonicalColor(color));

      const productSpaces = [
        ...splitValues(product.usageSpace).map(canonicalSpace),
        ...getSuggestedSpacesBySize(product),
      ];

      const matchSpace =
        space === "all" || productSpaces.includes(canonicalSpace(space));

      return (
        matchSearch &&
        matchType &&
        matchColor &&
        matchSizeFilter(product) &&
        matchSpace
      );
    });

    return hasActiveFilters ? result : diversifyProducts(result);
  }, [
    visibleCatalogProducts,
    search,
    type,
    color,
    space,
    matchSizeFilter,
    hasActiveFilters,
  ]);

  function resetFilters() {
    setSearch("");
    setType("all");
    setColor("all");
    setSize("all");
    setSpace("all");
  }

  const productDetailHighlights = detailProduct
    ? [
        { label: "Type", value: detailProduct.type },
        { label: "Technique", value: detailProduct.technique },
        { label: "Région", value: detailProduct.region },
        { label: "Matière", value: detailProduct.material },
        { label: "Couleurs", value: detailProduct.colors },
        { label: "Dimensions", value: detailProduct.dimensions },
        { label: "Style", value: detailProduct.style },
        { label: "Usage", value: detailProduct.usageSpace },
        {
          label: "Pièce unique",
          value: detailProduct.isUniquePiece ? "Oui" : undefined,
        },
        {
          label: "Fait main",
          value: detailProduct.isHandmade ? "Oui" : undefined,
        },
      ].filter((item) => item.value && item.value !== "-")
    : [];

  const detailColorVariants = useMemo(() => {
    if (!detailProduct) return [];

    const currentFamilyKey = getVariantFamilyKey(detailProduct);
    const currentGroupKey = normalizeText(detailProduct.variantGroupKey);

    if (!currentFamilyKey) return [];

    const alreadyDisplayedIds = new Set([
      detailProduct.id,
      ...detailVariants.map((variant) => variant.id),
    ]);

    return products
      .filter((product) => {
        if (alreadyDisplayedIds.has(product.id)) return false;

        const productFamilyKey = getVariantFamilyKey(product);
        const productGroupKey = normalizeText(product.variantGroupKey);

        return (
          productFamilyKey === currentFamilyKey &&
          productGroupKey !== currentGroupKey
        );
      })
      .sort((a, b) => getSurfaceM2(b) - getSurfaceM2(a));
  }, [detailProduct, detailVariants, products]);

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
              placeholder={
                language === "FR" ? "Rechercher un tapis..." : "Search for a rug..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={type} onChange={(e) => setType(e.target.value)}>
            {types.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "Type" : item}
              </option>
            ))}
          </select>

          <select
            value={size}
            onChange={(e) => setSize(e.target.value as SizeFilter)}
          >
            <option value="all">{language === "FR" ? "Taille" : "Size"}</option>
            <option value="small">{t("products.sizeFilter.small")}</option>
            <option value="medium">{t("products.sizeFilter.medium")}</option>
            <option value="large">{t("products.sizeFilter.large")}</option>
            <option value="xl">{t("products.sizeFilter.xl")}</option>
          </select>

          <select value={color} onChange={(e) => setColor(e.target.value)}>
            {colors.map((item) => (
              <option key={item} value={item}>
                {item === "all"
                  ? language === "FR"
                    ? "Couleur"
                    : "Color"
                  : getColorLabel(item, language === "FR" ? "fr" : "en")}
              </option>
            ))}
          </select>

          <select value={space} onChange={(e) => setSpace(e.target.value)}>
            {spaces.map((item) => (
              <option key={item} value={item}>
                {item === "all"
                  ? language === "FR"
                    ? "Pièce"
                    : "Space"
                  : getSpaceLabel(item, language === "FR" ? "fr" : "en")}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button type="button" onClick={resetFilters}>
              {language === "FR" ? "Réinitialiser" : "Reset"}
            </button>
          )}
        </div>
      </div>

      <p className="products-count-line">
        {language === "FR"
          ? `${filteredProducts.length} tapis ${
              filteredProducts.length === 1 ? "trouvé" : "trouvés"
            }`
          : `${filteredProducts.length} rug${
              filteredProducts.length === 1 ? "" : "s"
            } found`}
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
                          ? formatPrice(product.price)
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
                  <button
                    type="button"
                    className="products-detail-image-button"
                    onClick={() => openLightbox(detailImageIndex)}
                    aria-label={detailProduct.name}
                  >
                    <img
                      src={detailImages[detailImageIndex]}
                      alt={detailProduct.name}
                    />
                  </button>
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
                      <img
                        src={img}
                        alt={`${detailProduct.name} ${index + 1}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailImageIndex(index);
                          openLightbox(index);
                        }}
                      />
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
                  ? formatPrice(detailProduct.price)
                  : shouldShowPriceOnRequest(detailProduct)
                  ? t("products.priceOnRequest")
                  : "-"}
              </strong>

              {(detailVariantsLoading ||
                detailVariants.length > 0 ||
                detailColorVariants.length > 0) && (
                <section className="product-variants-premium">
                  {(() => {
                    const dimensionVariants = [detailProduct, ...detailVariants]
                      .filter(
                        (product, index, array) =>
                          array.findIndex((item) => item.id === product.id) ===
                          index
                      )
                      .sort((a, b) => getSurfaceM2(a) - getSurfaceM2(b));

                    function getVariantColorKey(product: ProductViewDto) {
                      const declared = splitValues(product.colors);
                      if (declared.length) return canonicalColor(declared[0]);

                      const raw = normalizeText(
                        `${product.slug || ""} ${product.name || ""} ${
                          product.variantGroupKey || ""
                        }`
                      );

                      const match = raw.match(
                        /(rouge|red|bleu|blue|noir|black|blanc|white|beige|vert|green|jaune|yellow|gris|gray|grey)/
                      );

                      return match ? canonicalColor(match[1]) : "";
                    }

                    const colorVariantMap = new Map<string, ProductViewDto>();
                    [detailProduct, ...detailColorVariants].forEach((variant) => {
                      const key = getVariantColorKey(variant);
                      if (!key) return;

                      const existing = colorVariantMap.get(key);
                      if (!existing || getSurfaceM2(variant) > getSurfaceM2(existing)) {
                        colorVariantMap.set(key, variant);
                      }
                    });

                    const colorOrder = [
                      "beige",
                      "blue",
                      "red",
                      "green",
                      "black",
                      "white",
                      "multicolore",
                    ];

                    const colorVariants = Array.from(colorVariantMap.entries())
                      .sort((a, b) => {
                        const aIndex = colorOrder.indexOf(a[0]);
                        const bIndex = colorOrder.indexOf(b[0]);

                        if (aIndex !== -1 || bIndex !== -1) {
                          return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
                        }

                        return a[0].localeCompare(b[0]);
                      })
                      .map(([, variant]) => variant);

                    return (
                      <>
                        <div className="product-variants-premium-section">
                          <div className="product-variants-premium-title">
                            <h3>
                              Dimensions disponibles{" "}
                              <span>({dimensionVariants.length})</span>
                            </h3>
                          </div>

                          {detailVariantsLoading && detailVariants.length === 0 ? (
                            <p className="product-variants-premium-loading">Chargement...</p>
                          ) : (
                            <div className="product-variants-premium-options">
                              {dimensionVariants.map((variant) => {
                                const isActive = variant.id === detailProduct.id;
                                const variantImage = getProductImages(variant)[0];
                                const label =
                                  variant.lengthCm && variant.widthCm
                                    ? `${variant.lengthCm} x ${variant.widthCm}`
                                    : variant.dimensions ||
                                      `${variant.name || ""}`.trim();

                                return (
                                  <button
                                    key={variant.id}
                                    type="button"
                                    className={`variant-size-button ${
                                      isActive ? "active" : ""
                                    }`}
                                    onClick={() => openDetailProduct(variant)}
                                    disabled={isActive}
                                  >
                                    {variantImage && (
                                      <img src={variantImage} alt={variant.name} />
                                    )}
                                    <span>{label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {colorVariants.length > 0 && (
                          <div className="product-variants-premium-section">
                            <div className="product-variants-premium-title">
                              <h3>
                                Couleurs disponibles{" "}
                                <span>({colorVariants.length})</span>
                              </h3>
                            </div>

                            <div className="product-variants-premium-options">
                              {colorVariants.map((variant) => {
                                const colorKey = getVariantColorKey(variant);
                                const isActive = variant.id === detailProduct.id;
                                const variantImage = getProductImages(variant)[0];

                                return (
                                  <button
                                    key={variant.id}
                                    type="button"
                                    className={`variant-color-button ${
                                      isActive ? "active" : ""
                                    }`}
                                    onClick={() => openDetailProduct(variant)}
                                    disabled={isActive}
                                  >
                                    {variantImage && (
                                      <img src={variantImage} alt={variant.name} />
                                    )}
                                    <span>
                                      {getTranslatedColor(colorKey || variant.colors)}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </section>
              )}

              {productDetailHighlights.length > 0 && (
                <div className="products-detail-highlights">
                  <div className="products-detail-section-title">
                    <span>Détails du tapis</span>
                    <small>Informations essentielles</small>
                  </div>

                  <div className="products-detail-highlight-grid">
                    {productDetailHighlights.map((item) => (
                      <div
                        className="products-detail-highlight-card"
                        key={item.label}
                      >
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailProduct.careInstructions && (
                <div className="products-detail-care">
                  <strong>{t("home.fields.carePrefix")}</strong>
                  <p>{detailProduct.careInstructions}</p>
                </div>
              )}

              {detailProduct.shortStory && (
                <div className="products-detail-care">
                  <strong>{t("products.fields.storyTitle")}</strong>
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

      {isLightboxOpen &&
        lightboxImageIndex !== null &&
        detailImages[lightboxImageIndex] && (
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
                aria-label={t("products.close")}
              >
                <X size={20} />
              </button>

              {detailImages.length > 1 && (
                <button
                  type="button"
                  className="products-image-lightbox-nav products-image-lightbox-nav--left"
                  onClick={prevLightboxImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={26} />
                </button>
              )}

              <img
                src={detailImages[lightboxImageIndex]}
                alt={detailProduct?.name || ""}
                className="products-image-lightbox-image"
              />

              {detailImages.length > 1 && (
                <button
                  type="button"
                  className="products-image-lightbox-nav products-image-lightbox-nav--right"
                  onClick={nextLightboxImage}
                  aria-label="Next image"
                >
                  <ChevronRight size={26} />
                </button>
              )}
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
                placeholder={t("products.phone")}
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
    </section>
  );
}
