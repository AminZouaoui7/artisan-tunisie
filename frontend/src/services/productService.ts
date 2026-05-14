import {
  apiFetch,
  buildAssetUrl,
  getVisitorCountryCode,
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

export function getVisitorCountry(): string {
  return getVisitorCountryCode();
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

export async function getProducts(
  country = getVisitorCountry()
): Promise<ProductViewDto[]> {
  const normalizedCountry = country.trim().toUpperCase();

  const res = await apiFetch(
    `/products?country=${encodeURIComponent(normalizedCountry)}`
  );

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des produits");
  }

  const products: ProductDto[] = await res.json();

  return products.map((product) => {
    const fullImages = (product.images || [])
      .map((img) => buildImageUrl(img))
      .filter((img): img is string => Boolean(img));

    const fullMainImageUrl =
      buildImageUrl(product.mainImageUrl) || fullImages[0] || null;

    return {
      ...product,
      price:
        product.isPriceHidden || product.requiresPriceRequest
          ? null
          : product.price,
      canShowPrice:
        product.isPriceHidden || product.requiresPriceRequest
          ? false
          : product.canShowPrice,
      priceLabel: getProductPriceLabel(product),
      fullMainImageUrl,
      fullImages,
    };
  });
}

export async function getProductBySlug(
  slug: string,
  country = getVisitorCountry()
): Promise<ProductViewDto> {
  const normalizedCountry = country.trim().toUpperCase();

  const res = await apiFetch(
    `/products/${encodeURIComponent(slug)}?country=${encodeURIComponent(
      normalizedCountry
    )}`
  );

  if (!res.ok) {
    throw new Error("Erreur lors du chargement du produit");
  }

  const product: ProductDto = await res.json();

  const fullImages = (product.images || [])
    .map((img) => buildImageUrl(typeof img === "string" ? img : ""))
    .filter((img): img is string => Boolean(img));

  const fullMainImageUrl =
    buildImageUrl(product.mainImageUrl) || fullImages[0] || null;

  return {
    ...product,
    price:
      product.isPriceHidden || product.requiresPriceRequest
        ? null
        : product.price,
    canShowPrice:
      product.isPriceHidden || product.requiresPriceRequest
        ? false
        : product.canShowPrice,
    priceLabel: getProductPriceLabel(product),
    fullMainImageUrl,
    fullImages,
  };
}

export async function getLatestProducts(limit = 6): Promise<ProductViewDto[]> {
  const products = await getProducts();

  return sortByNewest(onlyAvailableProducts(products)).slice(0, limit);
}