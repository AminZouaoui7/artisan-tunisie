import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import PhoneInput from "../components/PhoneInput";
import { useNavigate } from "react-router-dom";
import {
  X,
  ShoppingCart,
  CheckCircle2,
  Ruler,
  Hand,
  HeartHandshake,
  Eye,
  ChevronLeft,
  ChevronRight,
  Palette,
  MapPin,
  Gem,
  Grid3X3,
  Sparkles,
  Search,
  SlidersHorizontal,
  Diamond,
  Layers3,
  ScanLine,
  Shapes,
  Frame,
  Volleyball,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import ActionSuccess from "../components/ActionSuccess";
import { useCart } from "../context/useCart";
import { getStoredUserLocation } from "../services/apiClient";
import {
  canProductBeAddedToCart,
  getOptimizedProductImageUrl,
  getProducts,
  getProductVariants,
  shouldShowPriceOnRequest,
  shouldShowProductPrice,
  type ProductViewDto,
} from "../services/productService";
import { createPriceRequest } from "../services/priceRequestService";
import { useCurrency } from "../context/CurrencyContext";
import photoHero from "../assets/photohero.optimized.webp";
import photoHero1 from "../assets/photohero1.optimized.webp";
import photoHero2 from "../assets/photohero2.optimized.webp";
import "../styles/ProductsPage.css";
import { useI18n } from "../i18n/i18n";

type SizeFilter = "all" | "small" | "medium" | "large" | "xl";
type SizeBucket = Exclude<SizeFilter, "all">;

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
  const [color, setColor] = useState("all");
  const [selectedSizes, setSelectedSizes] = useState<SizeBucket[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  const normalizeValue = (value?: string | null) =>
    (value ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim();

  const categoryFilters = [
    {
      key: "all",
      label: "Tous les tapis",
      subtitle: "Voir tout",
    },
    {
      key: "tapis",
      label: "Tapis noué",
      subtitle: "Fait main",
    },
    {
      key: "margoum tisser berber",
      label: "Margoum tissé",
      subtitle: "Brodée ",
    },
    {
      key: "margoum berber",
      label: "Margoum berbère",
      subtitle: "Tissé épais",
    },
    {
      key: "kilim berber",
      label: "Kilim berbère",
      subtitle: "Tissé à plat",
    },
    {
      key: "kilim toujen",
      label: "Kilim Toujen",
      subtitle: "Motifs traditionnels",
    },
    {
      key: "kilim extra fin",
      label: "Kilim extra fin",
      subtitle: "Finesse & élégance",
    },
  ];

  const priceOptions = [
    { key: "all", label: "Tous les prix", min: null as number | null, max: null as number | null },
    { key: "under500", label: "Moins de 500 €", min: 0, max: 500 },
    { key: "500to1000", label: "500 € – 1 000 €", min: 500, max: 1000 },
    { key: "1000to1500", label: "1 000 € – 1 500 €", min: 1000, max: 1500 },
    { key: "over1500", label: "Plus de 1 500 €", min: 1500, max: null },
  ];

  const productsCatalogRef = useRef<HTMLDivElement | null>(null);
  const collectionScrollRef = useRef<HTMLDivElement | null>(null);

  const handleCategoryClick = useCallback((categoryKey: string) => {
    setSelectedCategory(categoryKey);

    window.setTimeout(() => {
      productsCatalogRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }, []);

  const [selectedProduct, setSelectedProduct] =
    useState<ProductViewDto | null>(null);
  const [showPriceRequestModal, setShowPriceRequestModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [detailProduct, setDetailProduct] =
    useState<ProductViewDto | null>(null);
  const [detailVariants, setDetailVariants] = useState<ProductViewDto[]>([]);
  const [detailVariantsLoading, setDetailVariantsLoading] = useState(false);

  const [detailImageIndex, setDetailImageIndex] = useState(0);

  type DetailContentTab = "description" | "story" | "care";
  const [detailContentTab, setDetailContentTab] =
    useState<DetailContentTab>("description");

  const [lightboxImageIndex, setLightboxImageIndex] = useState<number | null>(
    null
  );

  const [addedProductId, setAddedProductId] = useState<string | number | null>(
    null
  );
  const [loadedProductImages, setLoadedProductImages] = useState<Set<number>>(
    () => new Set()
  );
  const [requestedHoverImages, setRequestedHoverImages] = useState<Set<number>>(
    () => new Set()
  );
  const [loadedHoverImages, setLoadedHoverImages] = useState<Set<number>>(
    () => new Set()
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

  useEffect(() => {
    document.body.classList.add("products-page-body");
    return () => {
      document.body.classList.remove("products-page-body");
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  function getSurfaceM2(product: ProductViewDto) {
    if (!product.lengthCm || !product.widthCm) return 0;
    return (product.lengthCm * product.widthCm) / 10000;
  }

  function getSizeBucket(product: ProductViewDto): SizeBucket | null {
    const surface = getSurfaceM2(product);
    if (!surface) return null;
    if (surface < 2) return "small";
    if (surface < 4) return "medium";
    if (surface < 6) return "large";
    return "xl";
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
    const normalized = normalizeText(rawKey);
    let key = normalized.replace(/[\s\-_]+/g, "").replace(/[^a-z0-9]/g, "");

    const colorSuffixes = [
      "bleuclair",
      "lightblue",
      "bleufoncee",
      "bleufonce",
      "darkblue",
      "multicolore",
      "multicolor",
      "multicouleur",
      "multicolour",
      "rosebleu",
      "bleurose",
      "rougebleu",
      "bleurouge",
      "vertbleu",
      "bleuvert",
      "noirblanc",
      "blancnoir",
      "beigebleu",
      "bleubeige",
      "rougevert",
      "vertrouge",
      "terracotta",
      "turquoise",
      "bordeaux",
      "burgundy",
      "saumon",
      "salmon",
      "argenté",
      "argente",
      "silver",
      "doré",
      "dore",
      "golden",
      "gold",
      "crème",
      "creme",
      "cream",
      "ivoire",
      "ivory",
      "naturelle",
      "naturel",
      "natural",
      "kaki",
      "khaki",
      "violette",
      "violet",
      "purple",
      "orange",
      "jaune",
      "yellow",
      "gris",
      "grise",
      "gray",
      "grey",
      "rose",
      "pink",
      "marron",
      "brown",
      "beige",
      "blanche",
      "blanc",
      "white",
      "noire",
      "noir",
      "black",
      "verte",
      "vert",
      "green",
      "rouge",
      "red",
      "bleu",
      "blue",
      "ocre",
      "ochre",
      "camel",
    ]
      .map((item) => normalizeText(item).replace(/\s+/g, ""))
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);

    const sizeSuffixes = ["xxl", "xl", "xs", "sm", "md", "lg", "s", "m", "l", "sb"]
      .map((item) => normalizeText(item))
      .sort((a, b) => b.length - a.length);

    const stripSuffixes = (suffixes: string[]) => {
      let changed = false;
      do {
        changed = false;
        for (const suffix of suffixes) {
          if (!suffix) continue;
          if (key.endsWith(suffix) && key.length > suffix.length + 2) {
            key = key.slice(0, -suffix.length);
            changed = true;
            break;
          }
        }
      } while (changed);
    };

    stripSuffixes(colorSuffixes);
    stripSuffixes(sizeSuffixes);

    if (key.length > 6) {
      if (key.endsWith("b")) key = key.slice(0, -1);
      if (key.endsWith("r")) key = key.slice(0, -1);
      if (key.endsWith("v")) key = key.slice(0, -1);
      if (key.endsWith("n")) key = key.slice(0, -1);
      if (key.endsWith("w")) key = key.slice(0, -1);
    }

    return key.trim();
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
    grey: { fr: "Gris", en: "Grey" },
    gray: { fr: "Gris", en: "Grey" },
    brown: { fr: "Marron", en: "Brown" },
    marron: { fr: "Marron", en: "Brown" },
    orange: { fr: "Orange", en: "Orange" },
    mustard: { fr: "Moutarde", en: "Mustard" },
    pink: { fr: "Rose", en: "Pink" },
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
    orange: { fr: "Orange", en: "Orange" },
    mustard: { fr: "Moutarde", en: "Mustard" },
    moutarde: { fr: "Moutarde", en: "Mustard" },
    pink: { fr: "Rose", en: "Pink" },
    rose: { fr: "Rose", en: "Pink" },
  };

  function canonicalColor(value?: string | null) {
    const key = normalizeText(value);
    if (["bleu", "blue"].includes(key)) return "blue";
    if (["rouge", "red"].includes(key)) return "red";
    if (["vert", "green"].includes(key)) return "green";
    if (["noir", "black"].includes(key)) return "black";
    if (["blanc", "white"].includes(key)) return "white";
    if (["beige", "cream", "creme", "crème", "ivoire", "ivory"].includes(key))
      return "beige";
    if (["gris", "grise", "grey", "gray"].includes(key)) return "grey";
    if (["marron", "brown"].includes(key)) return "brown";
    if (["rose", "pink"].includes(key)) return "pink";
    if (["moutarde", "mustard", "jaune", "yellow", "ocre", "ochre"].includes(key))
      return "mustard";
    if (["orange"].includes(key)) return "orange";
    if (["multicolore", "multicolor"].includes(key)) return "multicolore";
    return key;
  }

  function getColorBackground(key: string) {
    const map: Record<string, string> = {
      blue: "#163f7a",
      red: "#b31b1b",
      green: "#2f7d4f",
      black: "#171717",
      white: "#f7f3ea",
      grey: "#9b9b91",
      gray: "#9b9b91",
      beige: "#d7bc8f",
      brown: "#7a432b",
      marron: "#7a432b",
      orange: "#c46a2b",
      mustard: "#b98532",
      moutarde: "#b98532",
      pink: "#d8a39a",
      rose: "#d8a39a",
      multicolore:
        "linear-gradient(135deg, #b31b1b 0%, #c46a2b 30%, #163f7a 60%, #2f7d4f 100%)",
    };

    const normalizedKey = canonicalColor(key);
    return map[normalizedKey] || "#d7bc8f";
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

  function getDetailImages(product: ProductViewDto | null) {
    if (!product) return [];
    const allImages = getProductImages(product);
    if (allImages.length <= 1) return allImages;
    const mainUrl = product.fullMainImageUrl;
    if (!mainUrl || allImages[0] === mainUrl) return allImages;
    const mainIdx = allImages.indexOf(mainUrl);
    if (mainIdx <= 0) return allImages;
    return [mainUrl, ...allImages.filter((_, i) => i !== mainIdx)];
  }

  const visibleCatalogProducts = useMemo(() => {
    return diversifyProducts(products);
  }, [products]);

  const detailImages = getDetailImages(detailProduct);
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

  useEffect(() => {
    const shouldLock =
      showMobileFilters ||
      Boolean(detailProduct) ||
      showPriceRequestModal ||
      isLightboxOpen;

    if (!shouldLock) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showMobileFilters, detailProduct, showPriceRequestModal, isLightboxOpen]);

  useEffect(() => {
    if (!showMobileFilters) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowMobileFilters(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showMobileFilters]);

  async function openDetailProduct(product: ProductViewDto) {
    setDetailProduct(product);
    setDetailImageIndex(0);
    setDetailContentTab("description");
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

  const colorOptions = useMemo(() => {
    const map = new Map<
      string,
      {
        key: string;
        label: string;
      }
    >();

    visibleCatalogProducts.forEach((product) => {
      splitValues(product.colors).forEach((raw) => {
        const key = canonicalColor(raw);
        if (!key) return;

        if (!map.has(key)) {
          map.set(key, {
            key,
            label: getColorLabel(key, language === "FR" ? "fr" : "en"),
          });
        }
      });
    });

    return Array.from(map.values());
  }, [visibleCatalogProducts, language]);

  function getSizeLabel(product: ProductViewDto) {
    const surface = getSurfaceM2(product);

    if (!surface) return t("products.sizeLabels.unknown");
    if (surface < 2) return t("products.sizeLabels.small");
    if (surface < 4) return t("products.sizeLabels.medium");
    if (surface < 6) return t("products.sizeLabels.large");

    return t("products.sizeLabels.xl");
  }

  const sizeOptions: Array<{ key: SizeBucket; label: string }> = useMemo(
    () => [
      { key: "small", label: t("products.sizeFilter.small") },
      { key: "medium", label: t("products.sizeFilter.medium") },
      { key: "large", label: t("products.sizeFilter.large") },
      { key: "xl", label: t("products.sizeFilter.xl") },
    ],
    [t]
  );

  function getProductCategoryFamily(product: ProductViewDto): string {
    return normalizeText(
      [
        product.category,
        (product as ProductViewDto & { categorie?: string | null }).categorie,
        product.type,
        product.name,
        product.slug,
        product.variantGroupKey,
        product.technique,
      ]
        .filter(Boolean)
        .join(" ")
    );
  }

  function matchesCategoryFilter(
    product: ProductViewDto,
    categoryKey: string
  ): boolean {
    if (categoryKey === "all") return true;

    const family = getProductCategoryFamily(product);

    // For the margoum/berber distinction, only check category fields — not the product name,
    // because a product named "margoum berber" can have category="margoum" (tissé, not berbère).
    const categoryFields = normalizeText(
      [
        product.category,
        (product as ProductViewDto & { categorie?: string | null }).categorie,
        product.type,
        product.technique,
      ]
        .filter(Boolean)
        .join(" ")
    );

    const hasMargoum = family.includes("margoum");
    const hasBerberInCategory =
      categoryFields.includes("berber") || categoryFields.includes("berbere");
    const hasKilim =
      family.includes("kilim") ||
      family.includes("killim");
    const hasToujen = family.includes("toujen") || family.includes("toujane");
    const hasExtraFin =
      family.includes("extra fin") ||
      family.includes("extrafin") ||
      family.includes("extra-fin");

    switch (categoryKey) {
      case "tapis": {
        const productCategory = normalizeValue(
          product.category ??
            (product as ProductViewDto & { categorie?: string | null }).categorie
        );
        return (
          productCategory === "tapis" ||
          (!hasMargoum && !hasKilim && family.includes("noue"))
        );
      }
      case "margoum tisser berber":
        return hasMargoum && !hasBerberInCategory;
      case "margoum berber":
        return hasMargoum && hasBerberInCategory;
      case "kilim berber":
        return hasKilim && hasBerberInCategory && !hasToujen && !hasExtraFin;
      case "kilim toujen":
        return hasKilim && hasToujen;
      case "kilim extra fin":
        return hasKilim && hasExtraFin;
      default:
        return false;
    }
  }

  const hasActiveFilters = Boolean(
    search.trim() ||
      selectedCategory !== "all" ||
      color !== "all" ||
      selectedSizes.length > 0 ||
      selectedPrice !== "all"
  );

  const activeFiltersCount =
    (search.trim() ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (color !== "all" ? 1 : 0) +
    selectedSizes.length +
    (selectedPrice !== "all" ? 1 : 0);

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
      const matchCategory = matchesCategoryFilter(product, selectedCategory);

      const productColors = splitValues(product.colors).map(canonicalColor);
      const matchColor =
        color === "all" || productColors.includes(canonicalColor(color));

      const sizeBucket = getSizeBucket(product);
      const matchSize =
        selectedSizes.length === 0 ||
        (sizeBucket ? selectedSizes.includes(sizeBucket) : false);

      const selectedPriceOption = priceOptions.find(
        (item) => item.key === selectedPrice
      );

      const matchPrice =
        selectedPrice === "all" ||
        typeof product.price !== "number" ||
        !Number.isFinite(product.price) ||
        ((selectedPriceOption?.min == null || product.price >= selectedPriceOption.min) &&
          (selectedPriceOption?.max == null || product.price <= selectedPriceOption.max));

      return (
        matchSearch &&
        matchCategory &&
        matchColor &&
        matchSize &&
        matchPrice
      );
    });

    return hasActiveFilters ? result : diversifyProducts(result);
  }, [
    visibleCatalogProducts,
    search,
    selectedCategory,
    color,
    selectedSizes,
    selectedPrice,
    hasActiveFilters,
  ]);

  function resetFilters() {
    setSearch("");
    setSelectedCategory("all");
    setColor("all");
    setSelectedSizes([]);
    setSelectedPrice("all");
  }

  function FiltersContent() {
    return (
      <>
        <div className="sidebar-search">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un tapis..."
          />
          <Search size={14} className="sidebar-search-icon" />
        </div>

        <div className="filter-section">
          <h4>TAILLE</h4>
          {sizeOptions.map((option) => (
            <label key={option.key} className="filter-option">
              <span>{option.label}</span>
              <input
                type="checkbox"
                checked={selectedSizes.includes(option.key)}
                onChange={() =>
                  setSelectedSizes((prev) =>
                    prev.includes(option.key)
                      ? prev.filter((item) => item !== option.key)
                      : [...prev, option.key]
                  )
                }
              />
            </label>
          ))}
        </div>

        <div className="filter-section">
          <h4>COULEUR</h4>
          <div className="color-chip-list">
            {colorOptions.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-label={item.label}
                aria-pressed={canonicalColor(color) === item.key}
                className={`color-chip${
                  canonicalColor(color) === item.key ? " color-chip--active" : ""
                }`}
                onClick={() =>
                  setColor((prev) =>
                    canonicalColor(prev) === item.key ? "all" : item.key
                  )
                }
              >
                <span
                  className="color-chip-swatch"
                  style={{ background: getColorBackground(item.key) }}
                />
                <span className="color-chip-name">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h4>PRIX</h4>
          <div className="price-filter-list">
            {priceOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`price-filter-chip ${
                  selectedPrice === option.key ? "price-filter-chip--active" : ""
                }`}
                onClick={() => setSelectedPrice(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </>
    );
  }

  const detailContentTabs = useMemo(
    () =>
      detailProduct
        ? [
            {
              key: "description" as const,
              label: "Description",
              content:
                detailProduct.description ||
                detailProduct.shortStory ||
                t("home.selectedFallbackDescription"),
            },
            {
              key: "story" as const,
              label: "Notre histoire",
              content: detailProduct.shortStory,
            },
            {
              key: "care" as const,
              label: "Entretien",
              content: detailProduct.careInstructions,
            },
          ].filter((item) => Boolean(item.content?.trim()))
        : [],
    [detailProduct, t]
  );

  useEffect(() => {
    if (!detailProduct || detailContentTabs.length === 0) return;
    const activeTabExists = detailContentTabs.some(
      (tab) => tab.key === detailContentTab
    );
    if (!activeTabExists) {
      setDetailContentTab(detailContentTabs[0].key);
    }
  }, [detailProduct, detailContentTab, detailContentTabs]);

  const detailColorVariants = useMemo(() => {
    if (!detailProduct) return [];

    const currentFamilyKey = getVariantFamilyKey(detailProduct);
    if (!currentFamilyKey) return [];

    const excludedIds = new Set([detailProduct.id]);
    const uniqueById = new Map<number, ProductViewDto>();

    products.forEach((product) => {
      if (excludedIds.has(product.id)) return;
      if (getVariantFamilyKey(product) !== currentFamilyKey) return;

      uniqueById.set(product.id, product);
    });

    return Array.from(uniqueById.values()).sort((a, b) => {
      const groupA = String(a.variantGroupKey || "");
      const groupB = String(b.variantGroupKey || "");
      const groupDiff = groupA.localeCompare(groupB);
      if (groupDiff !== 0) return groupDiff;

      const surfaceDiff = getSurfaceM2(b) - getSurfaceM2(a);
      if (surfaceDiff !== 0) return surfaceDiff;

      return String(a.name || "").localeCompare(String(b.name || ""));
    });
  }, [detailProduct, products]);
  const getDetailIcon = (label: string) => {
  const value = label.toLowerCase();

  if (value.includes("mati")) {
    return <Gem size={16} />;
  }

  if (value.includes("technique")) {
    return <Hand size={16} />;
  }

  if (value.includes("couleur")) {
    return <Palette size={16} />;
  }

  if (value.includes("origine") || value.includes("région") || value.includes("region")) {
    return <MapPin size={16} />;
  }

  if (value.includes("dens")) {
    return <Grid3X3 size={16} />;
  }

  if (value.includes("dimension") || value.includes("épaisseur") || value.includes("epaisseur")) {
    return <Ruler size={16} />;
  }

  return <Sparkles size={16} />;
};

  function getCategoryIcon(categoryKey: string) {
    switch (categoryKey) {
      case "all":
        return <Grid3X3 size={24} strokeWidth={1.7} />;
      case "tapis":
        return <Frame size={24} strokeWidth={1.7} />;
      case "margoum tisser berber":
        return <Sparkles size={24} strokeWidth={1.7} />;
      case "margoum berber":
        return <Diamond size={24} strokeWidth={1.7} />;
      case "kilim berber":
        return <Shapes size={24} strokeWidth={1.7} />;
      case "kilim toujen":
        return <Layers3 size={24} strokeWidth={1.7} />;
      case "kilim extra fin":
        return <ScanLine size={24} strokeWidth={1.7} />;
      default:
        return <Sparkles size={24} strokeWidth={1.7} />;
    }
  }

  return (
    <section className="products-page">
      <section className="products-hero-premium">
        <div className="hero-slider" aria-hidden="true">
          {([photoHero, photoHero1, photoHero2] as const).map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className={`hero-slide${heroSlideIndex === i ? " hero-slide--active" : ""}`}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding="async"
            />
          ))}
        </div>

        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-content">
          <div className="products-breadcrumb">
            ACCUEIL <span>›</span> NOS TAPIS
          </div>

          <span className="products-hero-kicker">
            Artisanat tunisien d'exception
          </span>

          <h1>Des tapis façonnés<br />comme des œuvres</h1>

          <div className="products-hero-separator" />

         

       
        </div>
      </section>

      <section className="products-category-panel">
        <div className="products-category-inner">
          <div className="products-category-heading">
            <p className="products-category-title">PARCOURIR PAR CATÉGORIE</p>
            <span className="products-category-heading-line" aria-hidden="true" />
          </div>

          <div className="products-category-scroll">
            <div className="products-category-list">
              {categoryFilters.map((category) => {
                const isActive = selectedCategory === category.key;
                return (
                  <button
                    key={category.key}
                    type="button"
                    className={`products-category-card${isActive ? " products-category-card--active" : ""}`}
                    onClick={() => handleCategoryClick(category.key)}
                    aria-pressed={isActive}
                  >
                    <span className="products-category-icon">
                      {getCategoryIcon(category.key)}
                    </span>
                    <span className="products-category-content">
                      <strong>{category.label}</strong>
                      <small>{category.subtitle}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="products-layout">
        <aside className="products-sidebar-filters">
          <h3>AFFINER VOTRE RECHERCHE</h3>
          <FiltersContent />
          <button
            type="button"
            className="reset-filters-btn"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
          >
            RÉINITIALISER LES FILTRES
          </button>
        </aside>

        <main className="products-catalog" ref={productsCatalogRef}>
          <button
            type="button"
            className="mobile-filter-trigger"
            onClick={() => setShowMobileFilters(true)}
          >
            <SlidersHorizontal size={18} />
            <span>Filtrer les tapis</span>
            {activeFiltersCount > 0 && (
              <span className="mobile-filter-count">{activeFiltersCount}</span>
            )}
          </button>

          <div className="products-catalog-header">
            <div className="products-catalog-title-block">
              <h2 className="products-catalog-title">
                {language === "FR"
                  ? `${filteredProducts.length} tapis artisanaux`
                  : `${filteredProducts.length} artisan rug${filteredProducts.length === 1 ? "" : "s"}`}
              </h2>
              <p className="products-catalog-subtitle">
                {language === "FR" ? "Découvrez notre collection" : "Discover our collection"}
              </p>
            </div>

            <div className="products-sort-control">
              <span>Trier par :</span>
              <select defaultValue="newest" aria-label="Trier les produits">
                <option value="newest">Nouveautés</option>
              </select>
            </div>
          </div>

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
              {filteredProducts.map((product, index) => {
                const isAdded = addedProductId === product.id;
                const hasVisiblePrice = shouldShowProductPrice(product);
                const showPriceOnRequest = shouldShowPriceOnRequest(product);

                const productImages = getProductImages(product);
                const coverImage = productImages[0];
                const hoverImage = productImages[1] || productImages[0];
                const optimizedCoverImage =
                  getOptimizedProductImageUrl(coverImage);
                const optimizedHoverImage =
                  getOptimizedProductImageUrl(hoverImage);
                const isCoverLoaded = loadedProductImages.has(product.id);
                const shouldLoadHover =
                  requestedHoverImages.has(product.id) &&
                  optimizedHoverImage !== optimizedCoverImage;
                const isHoverReady = loadedHoverImages.has(product.id);

                return (
                  <article
                    key={product.id}
                    className={`product-card${
                      isHoverReady ? " product-card--hover-ready" : ""
                    }`}
                    onMouseEnter={() => {
                      setRequestedHoverImages((current) => {
                        if (current.has(product.id)) return current;
                        const next = new Set(current);
                        next.add(product.id);
                        return next;
                      });
                    }}
                  >

                    {/* ── IMAGE ── */}
                    <div className="pc-media">
                      <button
                        type="button"
                        className="pc-image-btn"
                        onClick={() => openDetailProduct(product)}
                        aria-label={`Voir ${product.name}`}
                      >
                        {optimizedCoverImage ? (
                          <div
                            className={`pc-image-wrap${
                              isCoverLoaded ? "" : " pc-image-wrap--loading"
                            }`}
                          >
                            <img
                              src={optimizedCoverImage}
                              alt={product.name}
                              className="pc-img pc-img--primary"
                              loading={index < 6 ? "eager" : "lazy"}
                              fetchPriority={index < 3 ? "high" : "auto"}
                              decoding="async"
                              onLoad={() => {
                                setLoadedProductImages((current) => {
                                  if (current.has(product.id)) return current;
                                  const next = new Set(current);
                                  next.add(product.id);
                                  return next;
                                });
                              }}
                            />
                            {shouldLoadHover && (
                              <img
                                src={optimizedHoverImage}
                                alt=""
                                aria-hidden="true"
                                className="pc-img pc-img--hover"
                                loading="lazy"
                                decoding="async"
                                onLoad={() => {
                                  setLoadedHoverImages((current) => {
                                    if (current.has(product.id)) return current;
                                    const next = new Set(current);
                                    next.add(product.id);
                                    return next;
                                  });
                                }}
                              />
                            )}
                          </div>
                        ) : (
                          <div className="product-image-placeholder">
                            {t("products.imageUnavailable")}
                          </div>
                        )}
                      </button>

                      <div className="pc-badges">
                        {product.isUniquePiece && (
                          <span className="pc-badge pc-badge--unique">
                            {t("products.unique")}
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="pc-badge pc-badge--featured">
                            {t("products.featured")}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        className="pc-quick-view"
                        onClick={() => openDetailProduct(product)}
                        aria-label={t("products.viewDetails")}
                      >
                        <Eye size={16} />
                      </button>
                    </div>

                    {/* ── BODY ── */}
                    <div className="pc-body">
                      <h2 className="pc-title">{product.name}</h2>

                      {(product.shortStory || product.description) && (
                        <p className="pc-desc">
                          {product.shortStory || product.description}
                        </p>
                      )}

                      <div className="pc-divider" />

                      <div className="pc-specs">
                        <div className="pc-spec">
                          <Ruler size={20} className="pc-spec-icon" />
                          <strong className="pc-spec-value">
                            {product.lengthCm && product.widthCm
                              ? `${product.lengthCm} × ${product.widthCm}`
                              : product.dimensions || "—"}
                          </strong>
                          <span className="pc-spec-label">Dimensions</span>
                        </div>
                        <div className="pc-spec">
                          <Volleyball size={20} className="pc-spec-icon" />
                          <strong className="pc-spec-value">
                            {product.material || "—"}
                          </strong>
                          <span className="pc-spec-label">Matière</span>
                        </div>
                        <div className="pc-spec">
                          <MapPin size={20} className="pc-spec-icon" />
                          <strong className="pc-spec-value">
                            {product.region || "—"}
                          </strong>
                          <span className="pc-spec-label">Origine</span>
                        </div>
                      </div>

                      <div className="pc-footer">
                        <strong
                          className={
                            hasVisiblePrice ? "pc-price" : "pc-price pc-price--request"
                          }
                        >
                          {hasVisiblePrice
                            ? formatPrice(product.price)
                            : showPriceOnRequest
                            ? t("products.priceOnRequest")
                            : "—"}
                        </strong>

                        {hasVisiblePrice ? (
                          <button
                            type="button"
                            className={`pc-cart-btn${isAdded ? " pc-cart-btn--added" : ""}`}
                            onClick={() => handleAddToCart(product)}
                            disabled={loadingAuth}
                            aria-label={isAdded ? t("products.added") : t("products.cart")}
                          >
                            {isAdded ? (
                              <CheckCircle2 size={18} />
                            ) : (
                              <ShoppingCart size={18} />
                            )}
                            <span>
                              {isAdded ? t("products.added") : t("products.cart")}
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="pc-request-btn"
                            onClick={() => openPriceRequest(product)}
                            disabled={loadingAuth}
                          >
                            {t("products.requestPrice")}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {showMobileFilters && (
        <div
          className="mobile-filter-overlay"
          onClick={() => setShowMobileFilters(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Filtres produits"
        >
          <aside
            className="mobile-filter-sheet"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-filter-handle" />

            <header className="mobile-filter-header">
              <div>
                <span className="mobile-filter-kicker">Collection</span>
                <h2>Filtrer les tapis</h2>
              </div>

              <button
                type="button"
                className="mobile-filter-close"
                onClick={() => setShowMobileFilters(false)}
                aria-label="Fermer les filtres"
              >
                <X size={20} />
              </button>
            </header>

            <div className="mobile-filter-content">
              <FiltersContent />
            </div>

            <footer className="mobile-filter-footer">
              <button
                type="button"
                className="mobile-filter-reset"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
              >
                Réinitialiser
              </button>

              <button
                type="button"
                className="mobile-filter-apply"
                onClick={() => setShowMobileFilters(false)}
              >
                Voir {filteredProducts.length} tapis
              </button>
            </footer>
          </aside>
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

            <div className="products-detail-top">
              {/* LEFT — Gallery */}
              <section className="products-detail-center-gallery">
                <div className="products-detail-image">
                  {detailImages[detailImageIndex] ? (
                    <button
                      type="button"
                      className="products-detail-image-button"
                      onClick={() => openLightbox(detailImageIndex)}
                      aria-label={detailProduct.name}
                    >
                      <img
                        src={getOptimizedProductImageUrl(
                          detailImages[detailImageIndex],
                          1200
                        )}
                        alt={detailProduct.name}
                        fetchPriority="high"
                        decoding="async"
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
                        className={`products-detail-thumb${
                          detailImageIndex === index
                            ? " products-detail-thumb--active"
                            : ""
                        }`}
                        onClick={() => setDetailImageIndex(index)}
                      >
                        <img
                          src={getOptimizedProductImageUrl(img, 180)}
                          alt={`${detailProduct.name} ${index + 1}`}
                          loading="lazy"
                          decoding="async"
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
              </section>

              {/* RIGHT — Purchase panel */}
              <aside className="products-detail-purchase-panel">
                <h2 className="products-detail-product-title">
                  {detailProduct.name}
                </h2>

                <strong
                  className={
                    shouldShowProductPrice(detailProduct)
                      ? "detail-price-main"
                      : "detail-price-main products-detail-price--request"
                  }
                >
                  {shouldShowProductPrice(detailProduct) &&
                  detailProduct.price != null
                    ? formatPrice(detailProduct.price)
                    : shouldShowPriceOnRequest(detailProduct)
                    ? t("products.priceOnRequest")
                    : "-"}
                </strong>

                {(() => {
                  const s = `${detailProduct.status || ""}`.toLowerCase();
                  const available =
                    detailProduct.isAvailable !== false &&
                    s !== "sold" &&
                    s !== "hidden";
                  const stockLabel = !available
                    ? s === "reserved"
                      ? "Réservé"
                      : s === "sold"
                      ? "Vendu"
                      : "Indisponible"
                    : typeof detailProduct.stock === "number" &&
                      detailProduct.stock <= 0
                    ? "Sur commande"
                    : "En stock";
                  const stockCls = !available
                    ? "products-detail-stock--unavailable"
                    : typeof detailProduct.stock === "number" &&
                      detailProduct.stock <= 0
                    ? "products-detail-stock--order"
                    : "products-detail-stock--available";
                  return (
                    <p className={`products-detail-stock ${stockCls}`}>
                      {stockLabel}
                      {stockCls === "products-detail-stock--available" && (
                        <CheckCircle2 size={14} />
                      )}
                    </p>
                  );
                })()}

                {(detailVariantsLoading || detailVariants.length > 0) && (
                  <div className="products-detail-variants-section">
                    <h3 className="products-detail-variants-title">
                      Dimensions disponibles{" "}
                      <span>
                        (
                        {
                          [detailProduct, ...detailVariants].filter(
                            (product, index, array) =>
                              array.findIndex(
                                (item) => item.id === product.id
                              ) === index
                          ).length
                        }
                        )
                      </span>
                    </h3>

                    <div className="products-detail-variants-scroll">
                      {detailVariantsLoading && detailVariants.length === 0 ? (
                        <p className="product-variants-premium-loading">
                          Chargement...
                        </p>
                      ) : (
                        <div className="product-variants-premium-options">
                          {(() => {
                            const dimensionVariants = [
                              detailProduct,
                              ...detailVariants,
                            ]
                              .filter(
                                (product, index, array) =>
                                  array.findIndex(
                                    (item) => item.id === product.id
                                  ) === index
                              )
                              .sort(
                                (a, b) => getSurfaceM2(a) - getSurfaceM2(b)
                              );

                            return dimensionVariants.map((variant) => {
                              const isActive = variant.id === detailProduct.id;
                              const variantImage = getProductImages(variant)[0];
                              const label =
                                variant.lengthCm && variant.widthCm
                                  ? `${variant.lengthCm} x ${variant.widthCm}`
                                  : variant.dimensions ||
                                    `${variant.name || ""}`.trim();
                              const priceLabel =
                                shouldShowProductPrice(variant) &&
                                variant.price != null
                                  ? formatPrice(variant.price)
                                  : t("products.priceOnRequest");
                              const normalizedStatus = `${
                                variant.status || ""
                              }`.toLowerCase();
                              const isVariantAvailable =
                                variant.isAvailable !== false &&
                                normalizedStatus !== "sold" &&
                                normalizedStatus !== "hidden";
                              const stockLabel = !isVariantAvailable
                                ? normalizedStatus === "reserved"
                                  ? "Réservé"
                                  : normalizedStatus === "sold"
                                  ? "Vendu"
                                  : "Indisponible"
                                : typeof variant.stock === "number" &&
                                  variant.stock <= 0
                                ? "Sur commande"
                                : "En stock";

                              return (
                                <button
                                  key={variant.id}
                                  type="button"
                                  className={`variant-size-button${
                                    isActive ? " active" : ""
                                  }`}
                                  onClick={() => openDetailProduct(variant)}
                                  disabled={isActive}
                                >
                                  {variantImage ? (
                                    <img
                                      src={getOptimizedProductImageUrl(
                                        variantImage,
                                        240
                                      )}
                                      alt={variant.name}
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  ) : (
                                    <span className="variant-size-placeholder" />
                                  )}
                                  <span className="variant-size-label">
                                    {label}
                                  </span>
                                  <span className="variant-size-meta">
                                    <strong>{priceLabel}</strong>
                                    <small>{stockLabel}</small>
                                    {isActive && <CheckCircle2 size={18} />}
                                  </span>
                                </button>
                              );
                            });
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="products-detail-purchase-actions">
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
              </aside>
            </div>

            {/* LEVEL 2 — Spec bar (always 5 items) */}
            <section className="products-detail-spec-bar">
              {[
                {
                  label: "Dimensions",
                  value:
                    detailProduct.dimensions ||
                    (detailProduct.lengthCm && detailProduct.widthCm
                      ? `${detailProduct.lengthCm} × ${detailProduct.widthCm} cm`
                      : null),
                },
                { label: "Matière", value: detailProduct.material },
                { label: "Région", value: detailProduct.region },
                { label: "Technique", value: detailProduct.technique },
                {
                  label: "Pièce unique",
                  value: detailProduct.isUniquePiece ? "Oui" : null,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="products-detail-spec-item"
                >
                  <span className="products-detail-spec-icon">
                    {getDetailIcon(item.label)}
                  </span>
                  <div>
                    <strong>{item.value || "—"}</strong>
                    <small>{item.label}</small>
                  </div>
                </div>
              ))}
            </section>

            <section className="products-detail-content-section">
              <div
                className="detail-content-tab-list"
                role="tablist"
                aria-label="Informations sur le tapis"
              >
                {detailContentTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={detailContentTab === tab.key}
                    className={`detail-content-tab${
                      detailContentTab === tab.key
                        ? " detail-content-tab--active"
                        : ""
                    }`}
                    onClick={() => setDetailContentTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="detail-content-panel" role="tabpanel">
                {
                  detailContentTabs.find(
                    (tab) => tab.key === detailContentTab
                  )?.content
                }
              </div>
            </section>

            {detailColorVariants.length > 0 && (
              <section className="products-detail-bottom-collection">
                <div className="products-detail-collection-header">
                  <h3>Autres tapis de la même collection</h3>
                  <button
                    type="button"
                    className="products-detail-collection-see-all"
                    onClick={closeDetailProduct}
                  >
                    Voir toute la collection →
                  </button>
                </div>
                <div className="products-detail-collection-nav-wrap">
                  <button
                    type="button"
                    className="products-detail-collection-nav products-detail-collection-nav--left"
                    onClick={() => collectionScrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
                    aria-label="Défiler à gauche"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="product-collection-scroll" ref={collectionScrollRef}>
                  {detailColorVariants.map((variant) => {
                    const variantImage = getProductImages(variant)[0];
                    const dimensions =
                      variant.lengthCm && variant.widthCm
                        ? `${variant.lengthCm} x ${variant.widthCm} cm`
                        : variant.dimensions || "-";

                    const priceLabel =
                      shouldShowProductPrice(variant) &&
                      variant.price != null
                        ? formatPrice(variant.price)
                        : t("products.priceOnRequest");

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        className="product-collection-card"
                        onClick={() => openDetailProduct(variant)}
                      >
                        {variantImage ? (
                          <img
                            src={getOptimizedProductImageUrl(
                              variantImage,
                              360
                            )}
                            alt={variant.name}
                            className="product-collection-thumb"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="product-collection-thumb product-collection-thumb--empty" />
                        )}

                        <div className="product-collection-content">
                          <strong className="product-collection-name">
                            {variant.name}
                          </strong>
                          <span className="product-collection-color">
                            {getTranslatedColor(variant.colors)}
                          </span>
                          <span className="product-collection-dimensions">
                            {dimensions}
                          </span>
                          <span className="product-collection-price">
                            {priceLabel}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  </div>
                  <button
                    type="button"
                    className="products-detail-collection-nav products-detail-collection-nav--right"
                    onClick={() => collectionScrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
                    aria-label="Défiler à droite"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </section>
            )}
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
                decoding="async"
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
                  src={getOptimizedProductImageUrl(
                    getProductImages(selectedProduct)[0],
                    320
                  )}
                  alt={selectedProduct.name}
                  loading="lazy"
                  decoding="async"
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
