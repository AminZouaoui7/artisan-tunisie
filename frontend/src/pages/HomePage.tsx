import {
  Sparkles,
  MapPin,
  Gem,
  Palette,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingCart,
  Ruler,
  Hand,
  CheckCircle2,
  Volleyball,
  HeartHandshake,
  Grid3X3,
} from "lucide-react";
import { useCart } from "../context/useCart";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import PhoneInput from "../components/PhoneInput";
import SeoHead from "../components/SeoHead";
import boutiqueImg1 from "../assets/ceramic3.optimized.webp";
import boutiqueImg2 from "../assets/rooftop1 (1).optimized.webp";
import boutiqueImg3 from "../assets/tab2.optimized.webp";
import boutiqueImg4 from "../assets/bijoux.optimized.webp";
import boutiqueImg5 from "../assets/mosaique.optimized.webp";
import boutiqueImg6 from "../assets/mosaique.optimized.webp";
//fix
import heroRug from "../assets/088fc89b-c8a7-49da-8450-cc19fc82ade1.optimized.webp";
import storyImage from "../assets/cbd0ea42-92dc-4cd6-a8e7-0b3133fe44f2.optimized.webp";

import "../styles/ProductsPage.css";
import "../styles/HomePage.css";

import { useAuth } from "../context/AuthContext";
import ActionSuccess from "../components/ActionSuccess";
import { getStoredUserLocation } from "../services/apiClient";
import {
  canProductBeAddedToCart,
  getOptimizedProductImageUrl,
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
import { FACEBOOK_URL, INSTAGRAM_URL } from "../constants/externalLinks";

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
  const { t, language } = useI18n();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const { isAuthenticated, loadingAuth } = useAuth();
  const shouldReduceMotion = useReducedMotion();
  const [isCompactViewport, setIsCompactViewport] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 820px)").matches;
  });
  const { addToCart, isInCart } = useCart();
  const visitorLocation = getStoredUserLocation();

  const [allProducts, setAllProducts] = useState<ProductViewDto[]>([]);
  const [products, setProducts] = useState<ProductViewDto[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsErrorKey, setProductsErrorKey] = useState<string | null>(null);

  const [boutiqueIndex, setBoutiqueIndex] = useState(0);

  const [detailProduct, setDetailProduct] = useState<ProductViewDto | null>(null);
  const [detailImageIndex, setDetailImageIndex] = useState(0);
  const [detailVariants, setDetailVariants] = useState<ProductViewDto[]>([]);
  const [detailVariantsLoading, setDetailVariantsLoading] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number | null>(null);

  const [priceRequestOpen, setPriceRequestOpen] = useState(false);
  const [priceRequestProduct, setPriceRequestProduct] = useState<ProductViewDto | null>(null);
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

  type DetailContentTab = "description" | "story" | "care";
  const [detailContentTab, setDetailContentTab] =
    useState<DetailContentTab>("description");

  const collectionScrollRef = useRef<HTMLDivElement | null>(null);
  const detailModalCardRef = useRef<HTMLDivElement | null>(null);
  const detailVariantsRequestRef = useRef(0);

  useEffect(() => {
    if (!detailProduct) return;

    const frameId = window.requestAnimationFrame(() => {
      detailModalCardRef.current?.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
      collectionScrollRef.current?.scrollTo({
        left: 0,
        behavior: "auto",
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [detailProduct]);

  const normalizeText = (value?: string | null) =>
    (value ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim();

  function splitValues(value?: string | null) {
    return (value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

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
      getColorLabel(key, lang) ||
      raw ||
      ""
    );
  }

  function getSurfaceM2(product: ProductViewDto) {
    if (!product.lengthCm || !product.widthCm) return 0;
    return (product.lengthCm * product.widthCm) / 10000;
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

  function getDetailIcon(label: string) {
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

  const detailImages = getDetailImages(detailProduct);
  const isLightboxOpen = lightboxImageIndex !== null;

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

    allProducts.forEach((product) => {
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
  }, [allProducts, detailProduct]);

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
    const requestId = ++detailVariantsRequestRef.current;

    setDetailProduct(product);
    setDetailImageIndex(0);
    setDetailContentTab("description");
    setDetailVariants([]);
    setLightboxImageIndex(null);
    setPriceRequestOpen(false);
    setShowSuccessModal(false);
    setPriceRequestSuccessProductName(null);
    setPriceRequestErrorKey(null);
    setPriceRequestProduct(null);

    try {
      setDetailVariantsLoading(true);
      const variants = await getProductVariants(product.id);
      if (requestId !== detailVariantsRequestRef.current) return;
      setDetailVariants(variants.filter((variant) => variant.id !== product.id));
    } catch (error) {
      if (requestId !== detailVariantsRequestRef.current) return;
      console.error("Erreur chargement variantes :", error);
      setDetailVariants([]);
    } finally {
      if (requestId === detailVariantsRequestRef.current) {
        setDetailVariantsLoading(false);
      }
    }
  };

  const closeProductModal = () => {
    detailVariantsRequestRef.current += 1;
    setDetailProduct(null);
    setDetailImageIndex(0);
    setDetailContentTab("description");
    setDetailVariants([]);
    setDetailVariantsLoading(false);
    setLightboxImageIndex(null);
  };

  function openPriceRequest(product: ProductViewDto) {
    if (loadingAuth) return;

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
        productName: product.name,
      }),
    });

    setPriceRequestSuccessProductName(null);
    setPriceRequestErrorKey(null);
    setShowSuccessModal(false);
    setPriceRequestProduct(product);
    setPriceRequestOpen(true);
  }

  const closePriceRequestForm = () => {
    setPriceRequestOpen(false);
    setPriceRequestErrorKey(null);
    setPriceRequestProduct(null);
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

    if (!priceRequestProduct) return;

    if (!isAuthenticated) {
      closePriceRequestForm();
      navigate("/login");
      return;
    }

    try {
      setPriceRequestLoading(true);
      setPriceRequestErrorKey(null);
      setPriceRequestSuccessProductName(null);

      await createPriceRequest({
        productId: priceRequestProduct.id,
        customerName: priceRequestForm.customerName,
        email: priceRequestForm.email,
        phone: priceRequestForm.phone,
        countryCode: priceRequestProduct.countryCode || visitorLocation.countryCode,
        message: priceRequestForm.message,
      });

      setPriceRequestSuccessProductName(priceRequestProduct.name);
      setPriceRequestOpen(false);
      setShowSuccessModal(true);
      setPriceRequestProduct(null);

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
        if (isMounted) setAllProducts(data);

       const getSurfaceM2 = (product: ProductViewDto) => {
  const length = product.lengthCm || 0;
  const width = product.widthCm || 0;

  if (!length || !width) return 0;

  return (length * width) / 10000;
};

const normalizeValue = (value?: string | null) =>
  (value || "").toLowerCase().trim();

const getVarietyScore = (product: ProductViewDto) => {
  let score = 0;

  if (product.isFeatured) score += 100;
  if (product.isUniquePiece) score += 40;
  if (product.fullMainImageUrl || product.mainImageUrl) score += 30;
  if (product.type) score += 10;
  if (product.region) score += 10;
  if (product.colors) score += 10;
  if (product.usageSpace) score += 8;
  if (product.dimensions) score += 8;

  return score;
};

const diversifyHomeProducts = (items: ProductViewDto[]) => {
  const selected: ProductViewDto[] = [];
  const remaining = [...items].sort((a, b) => {
    const scoreDiff = getVarietyScore(b) - getVarietyScore(a);
    if (scoreDiff !== 0) return scoreDiff;

    return getSurfaceM2(b) - getSurfaceM2(a);
  });

  while (selected.length < 6 && remaining.length > 0) {
    const index = remaining.findIndex((candidate) => {
      return !selected.some((chosen) => {
        const sameType =
          normalizeValue(chosen.type) &&
          normalizeValue(chosen.type) === normalizeValue(candidate.type);

        const sameColor =
          normalizeValue(chosen.colors) &&
          normalizeValue(chosen.colors) === normalizeValue(candidate.colors);

        const sameRegion =
          normalizeValue(chosen.region) &&
          normalizeValue(chosen.region) === normalizeValue(candidate.region);

        return sameType && (sameColor || sameRegion);
      });
    });

    const pickedIndex = index === -1 ? 0 : index;
    const [picked] = remaining.splice(pickedIndex, 1);
    selected.push(picked);
  }

  return selected;
};

const homeProducts = diversifyHomeProducts(
  keepLargestProductByVariantGroup(data)
);

if (isMounted) setProducts(homeProducts);
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

  function nextDetailImage() {
    if (!detailImages.length) return;
    setDetailImageIndex((prev) => (prev + 1) % detailImages.length);
  }

  function prevDetailImage() {
    if (!detailImages.length) return;
    setDetailImageIndex((prev) => (prev === 0 ? detailImages.length - 1 : prev - 1));
  }

  function openLightbox(index: number) {
    if (!detailImages.length) return;
    const safeIndex = Math.max(0, Math.min(index, detailImages.length - 1));
    setLightboxImageIndex(safeIndex);
  }

  function closeLightbox() {
    setLightboxImageIndex(null);
  }

  function nextLightboxImage() {
    if (!detailImages.length) return;
    setLightboxImageIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % detailImages.length;
    });
  }

  function prevLightboxImage() {
    if (!detailImages.length) return;
    setLightboxImageIndex((prev) => {
      if (prev === null) return prev;
      return prev === 0 ? detailImages.length - 1 : prev - 1;
    });
  }

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
  }, [isLightboxOpen, detailImages.length]);

  useEffect(() => {
    const shouldLock =
      Boolean(detailProduct) || priceRequestOpen || isLightboxOpen;

    if (!shouldLock) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [detailProduct, isLightboxOpen, priceRequestOpen]);

  async function openDetailProduct(product: ProductViewDto) {
    await openProductModal(product);
  }

  function closeDetailProduct() {
    closeProductModal();
  }

  return (
    <div className="home">
      <SeoHead
        title="Tapis artisanaux tunisiens à Tunis | L’Artisan de la Médina"
        description="Découvrez des tapis tunisiens faits main, Margoum, Kilim et tapis berbères. Visitez L’Artisan de la Médina au cœur de Tunis."
        canonical="/"
        image={heroRug}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["LocalBusiness", "Store"],
            name: "L’Artisan de la Médina",
            url: typeof window === "undefined" ? "/" : window.location.origin,
            image:
              typeof window === "undefined"
                ? heroRug
                : new URL(heroRug, window.location.origin).toString(),
            telephone: "+21656250910",
            email: "contact@artisan-medina.com",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Tunis",
              addressRegion: "Tunis",
              addressCountry: "TN",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 36.796468,
              longitude: 10.169834,
            },
            hasMap: GOOGLE_MAPS_URL,
            sameAs: [INSTAGRAM_URL, FACEBOOK_URL],
            priceRange: "€€",
            openingHours: "Mo-Su 09:00-21:00",
          }),
        }}
      />
 <section className="home-boutique-hero">
  <div className="home-boutique-hero-bg">
    {boutiqueImages.map((img, index) => (
      <motion.img
        key={index}
        src={img}
        alt={t("home.heroImageAlt")}
        loading={index === 0 ? "eager" : "lazy"}
        fetchPriority={index === 0 ? "high" : "low"}
        decoding="async"
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
              <img
                src={storyImage}
                alt={t("home.storyImageAlt")}
                className="home-story-image"
                loading="lazy"
                decoding="async"
              />
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
              const productImages = getProductImages(product);
              const coverImage = productImages[0];
              const hoverImage = productImages[1] || coverImage;
              const showVisiblePrice = shouldShowProductPrice(product);
              const showPriceOnRequest = shouldShowPriceOnRequest(product);
              const isAdded = isInCart(product.id);

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
                  {/* ── MEDIA ── */}
                  <div className="pc-media">
                    <button
                      type="button"
                      className="pc-image-btn"
                      onClick={() => openProductModal(product)}
                      aria-label={t("home.viewDetailsOf", { name: product.name })}
                    >
                      {coverImage ? (
                        <div className="pc-image-wrap">
                          <img
                            src={coverImage}
                            alt={product.name}
                            className="pc-img pc-img--primary"
                            loading="lazy"
                          />
                          {hoverImage && hoverImage !== coverImage && (
                            <img
                              src={hoverImage}
                              alt=""
                              aria-hidden="true"
                              className="pc-img pc-img--hover"
                              loading="lazy"
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
                      onClick={() => openProductModal(product)}
                      aria-label={t("products.viewDetails")}
                    >
                      <Eye size={16} />
                    </button>
                  </div>

                  {/* ── BODY ── */}
                  <div className="pc-body">
                    <h2 className="pc-title">
                      <Link to={`/products/${product.slug}`}>{product.name}</Link>
                    </h2>

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
                          showVisiblePrice
                            ? "pc-price"
                            : "pc-price pc-price--request"
                        }
                      >
                        {showVisiblePrice
                          ? formatPrice(product.price)
                          : showPriceOnRequest
                          ? t("products.priceOnRequest")
                          : "—"}
                      </strong>

                      {showVisiblePrice ? (
                        <button
                          type="button"
                          className={`pc-cart-btn${isAdded ? " pc-cart-btn--added" : ""}`}
                          onClick={() => handleAddToCart(product)}
                          disabled={loadingAuth}
                          aria-label={
                            isAdded ? t("products.added") : t("products.cart")
                          }
                        >
                          {isAdded ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <ShoppingCart size={18} />
                          )}
                          <span>
                            {isAdded
                              ? t("products.added")
                              : t("products.cart")}
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="pc-request-btn"
                          onClick={() => openProductModal(product)}
                          disabled={loadingAuth}
                        >
                          {t("products.requestPrice")}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
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
              <img
                src={heroRug}
                alt=""
                className="home-rug-3d-img"
                loading="lazy"
                decoding="async"
              />
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

            <div className="home-shop-hours">
              <span>{t("home.shopHoursLabel")}</span>
              <strong>{t("home.shopHoursValue")}</strong>
            </div>

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

      {detailProduct && (
        <div className="products-detail-modal" onClick={closeDetailProduct}>
          <div
            className="products-detail-card"
            ref={detailModalCardRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="products-detail-mobile-toolbar">
              <span
                className="products-detail-mobile-handle"
                aria-hidden="true"
              />
              <button
                type="button"
                className="products-detail-close"
                onClick={closeDetailProduct}
                aria-label={t("common.close")}
              >
                <X size={18} />
              </button>
            </div>

            <div className="products-detail-top">
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
                  {shouldShowProductPrice(detailProduct) && detailProduct.price != null
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
                    onClick={() =>
                      collectionScrollRef.current?.scrollBy({
                        left: -300,
                        behavior: "smooth",
                      })
                    }
                    aria-label="Défiler à gauche"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div
                    className="product-collection-scroll"
                    ref={collectionScrollRef}
                  >
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
                    onClick={() =>
                      collectionScrollRef.current?.scrollBy({
                        left: 300,
                        behavior: "smooth",
                      })
                    }
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

      {priceRequestOpen && priceRequestProduct && (
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
            <h2>{priceRequestProduct.name}</h2>

            <div className="home-price-product-mini">
              {priceRequestProduct.fullMainImageUrl && (
                <img
                  src={getOptimizedProductImageUrl(
                    priceRequestProduct.fullMainImageUrl,
                    320
                  )}
                  alt={priceRequestProduct.name}
                  loading="lazy"
                  decoding="async"
                />
              )}

              <div>
                <strong>{priceRequestProduct.name}</strong>
                <span>
                  {priceRequestProduct.dimensions || t("products.miniFallbackDimensions")}
                </span>
                <span>{priceRequestProduct.region || t("common.tunisia")}</span>
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
