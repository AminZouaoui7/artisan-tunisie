import {
  apiFetch,
  buildAssetUrl,
  getVisitorCountryCode,
  setVisitorCountryCode,
} from "./apiClient";

export type ProductStatus = "Available" | "Reserved" | "Sold" | "Hidden";

export type ProductDto = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category?: string;

  type?: string;
  technique?: string;
  region?: string;
  material?: string;
  colors?: string;
  lengthCm?: number;
  widthCm?: number;
  dimensions?: string;
  weightKg?: number;
  ageYears?: number;
  condition?: string;
  density?: string;
  shape?: string;
  style?: string;
  isHandmade: boolean;
  isUniquePiece: boolean;
  usageSpace?: string;
  careInstructions?: string;
  shortStory?: string;

  price: number | null;
  canShowPrice: boolean;
  isPriceHidden: boolean;
  priceLabel: string;
  requiresPriceRequest: boolean;
  countryCode?: string | null;

  stock: number;
  isFeatured: boolean;
  isAvailable: boolean;
  status: ProductStatus | string;

  mainImageUrl?: string | null;
  images: string[];

  createdAt: string;
};

export type ProductViewDto = ProductDto & {
  fullMainImageUrl: string | null;
  fullImages: string[];
};

function buildImageUrl(imageUrl?: string | null): string | null {
  return buildAssetUrl(imageUrl);
}

function sortByNewest(products: ProductViewDto[]): ProductViewDto[] {
  return [...products].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    return dateB - dateA;
  });
}

function onlyAvailableProducts(products: ProductViewDto[]): ProductViewDto[] {
  return products.filter((product) => {
    const status = product.status?.toLowerCase();

    return (
      product.isAvailable !== false &&
      status !== "hidden" &&
      status !== "sold"
    );
  });
}

function normalizeCountry(country?: string | null): string {
  const normalized = country?.trim().toUpperCase();

  if (!normalized || normalized === "NULL" || normalized === "UNDEFINED") {
    return "";
  }

  return normalized;
}

export function getVisitorCountry(): string {
  return normalizeCountry(getVisitorCountryCode());
}

export async function detectAndStoreVisitorCountry(): Promise<string> {
  const savedCountry = normalizeCountry(getVisitorCountryCode());

  if (savedCountry) {
    return savedCountry;
  }

  try {
    const res = await fetch("/api/visitor-country", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Impossible de détecter le pays.");
    }

    const data: { country?: string } = await res.json();
    const detectedCountry = normalizeCountry(data.country) || "FR";

    setVisitorCountryCode(detectedCountry);

    return detectedCountry;
  } catch {
    setVisitorCountryCode("FR");
    return "FR";
  }
}

export function isTunisiaVisitor(country = getVisitorCountry()): boolean {
  const normalized = country.trim().toLowerCase();

  return (
    normalized === "tn" ||
    normalized === "tunisia" ||
    normalized === "tunisie" ||
    normalized === "تونس"
  );
}

export function canProductBeAddedToCart(product: ProductDto): boolean {
  return (
    product.isAvailable !== false &&
    product.status?.toLowerCase() === "available" &&
    product.isPriceHidden !== true &&
    product.requiresPriceRequest !== true &&
    product.canShowPrice !== false &&
    product.price != null &&
    product.price > 0
  );
}

export function getProductPriceLabel(product: ProductDto): string {
  if (
    product.isPriceHidden ||
    product.requiresPriceRequest ||
    product.price == null
  ) {
    return product.priceLabel || "Prix disponible sur demande";
  }

  return product.priceLabel || `${product.price.toFixed(2)} EUR`;
}

function normalizeProduct(product: ProductDto): ProductViewDto {
  const fullImages = (product.images || [])
    .map((img) => buildImageUrl(img))
    .filter((img): img is string => Boolean(img));

  const fullMainImageUrl =
    buildImageUrl(product.mainImageUrl) || fullImages[0] || null;

  const shouldHidePrice =
    product.isPriceHidden ||
    product.requiresPriceRequest ||
    product.canShowPrice === false ||
    product.price == null;

  return {
    ...product,
    price: shouldHidePrice ? null : product.price,
    canShowPrice: shouldHidePrice ? false : product.canShowPrice,
    isPriceHidden: shouldHidePrice ? true : product.isPriceHidden,
    requiresPriceRequest: shouldHidePrice
      ? true
      : product.requiresPriceRequest,
    priceLabel: getProductPriceLabel(product),
    fullMainImageUrl,
    fullImages,
  };
}

export async function getProducts(country?: string): Promise<ProductViewDto[]> {
  const normalizedCountry =
    normalizeCountry(country) || (await detectAndStoreVisitorCountry());

  const res = await apiFetch(
    `/products?country=${encodeURIComponent(normalizedCountry)}`
  );

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des produits");
  }

  const products: ProductDto[] = await res.json();

  return products.map(normalizeProduct);
}

export async function getProductBySlug(
  slug: string,
  country?: string
): Promise<ProductViewDto> {
  const normalizedCountry =
    normalizeCountry(country) || (await detectAndStoreVisitorCountry());

  const res = await apiFetch(
    `/products/${encodeURIComponent(slug)}?country=${encodeURIComponent(
      normalizedCountry
    )}`
  );

  if (!res.ok) {
    throw new Error("Erreur lors du chargement du produit");
  }

  const product: ProductDto = await res.json();

  return normalizeProduct(product);
}

export async function getLatestProducts(limit = 6): Promise<ProductViewDto[]> {
  const products = await getProducts();

  return sortByNewest(onlyAvailableProducts(products)).slice(0, limit);
}