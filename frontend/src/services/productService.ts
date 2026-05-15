import {
  apiFetch,
  buildAssetUrl,
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

type ProductApiDto = ProductDto & {
  price?: number | null;
  Price?: number | null;
  canShowPrice?: boolean;
  CanShowPrice?: boolean;
  isPriceHidden?: boolean;
  IsPriceHidden?: boolean;
  requiresPriceRequest?: boolean;
  RequiresPriceRequest?: boolean;
  countryCode?: string | null;
  CountryCode?: string | null;
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

async function ensureVisitorCountryCode(): Promise<string> {
  return "FR";
}

export function shouldShowProductPrice(
  product: Pick<ProductDto, "canShowPrice" | "price">
): boolean {
  return product.canShowPrice === true && product.price != null;
}

export function shouldShowPriceOnRequest(
  product: Pick<
    ProductDto,
    "canShowPrice" | "isPriceHidden" | "requiresPriceRequest" | "price"
  >
): boolean {
  return (
    product.isPriceHidden === true ||
    product.requiresPriceRequest === true ||
    !shouldShowProductPrice(product)
  );
}

export function canProductBeAddedToCart(product: ProductDto): boolean {
  return (
    product.isAvailable !== false &&
    product.status?.toLowerCase() === "available" &&
    product.isPriceHidden !== true &&
    product.requiresPriceRequest !== true &&
    product.canShowPrice === true &&
    product.price != null &&
    product.price > 0
  );
}

export function getProductPriceLabel(product: ProductDto): string {
  if (product.isPriceHidden === true) {
    return "Prix sur demande";
  }

  if (product.requiresPriceRequest === true || !shouldShowProductPrice(product)) {
    return product.priceLabel || "Prix disponible sur demande";
  }

  const price = product.price ?? 0;
  return product.priceLabel || `${price.toFixed(2)} EUR`;
}

function normalizeProduct(product: ProductApiDto): ProductViewDto {
  console.log("product", product);

  const normalizedPrice = product.price ?? product.Price ?? null;
  const normalizedCanShowPrice =
    product.canShowPrice ?? product.CanShowPrice ?? false;
  const normalizedIsPriceHidden =
    product.isPriceHidden ?? product.IsPriceHidden ?? false;
  const normalizedRequiresPriceRequest =
    product.requiresPriceRequest ?? product.RequiresPriceRequest ?? false;
  const normalizedCountryCode =
    product.countryCode ?? product.CountryCode ?? null;

  const fullImages = (product.images || [])
    .map((img) => buildImageUrl(img))
    .filter((img): img is string => Boolean(img));

  const fullMainImageUrl =
    buildImageUrl(product.mainImageUrl) || fullImages[0] || null;

  return {
    ...product,
    price: normalizedPrice,
    canShowPrice: normalizedCanShowPrice,
    isPriceHidden: normalizedIsPriceHidden,
    requiresPriceRequest: normalizedRequiresPriceRequest,
    countryCode: normalizedCountryCode,
    priceLabel: getProductPriceLabel({
      ...product,
      price: normalizedPrice,
      canShowPrice: normalizedCanShowPrice,
      isPriceHidden: normalizedIsPriceHidden,
      requiresPriceRequest: normalizedRequiresPriceRequest,
    }),
    fullMainImageUrl,
    fullImages,
  };
}

export async function getProducts(country?: string): Promise<ProductViewDto[]> {
  const normalizedCountry =
    normalizeCountry(country) || (await ensureVisitorCountryCode());

  const res = await apiFetch(
    `/products?country=${encodeURIComponent(normalizedCountry)}`
  );

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des produits");
  }

  const products: ProductApiDto[] = await res.json();

  return products.map(normalizeProduct);
}

export async function getProductBySlug(
  slug: string,
  country?: string
): Promise<ProductViewDto> {
  const normalizedCountry =
    normalizeCountry(country) || (await ensureVisitorCountryCode());

  const res = await apiFetch(
    `/products/${encodeURIComponent(slug)}?country=${encodeURIComponent(
      normalizedCountry
    )}`
  );

  if (!res.ok) {
    throw new Error("Erreur lors du chargement du produit");
  }

  const product: ProductApiDto = await res.json();

  return normalizeProduct(product);
}

export async function getLatestProducts(limit = 6): Promise<ProductViewDto[]> {
  const products = await getProducts();

  return sortByNewest(onlyAvailableProducts(products)).slice(0, limit);
}
