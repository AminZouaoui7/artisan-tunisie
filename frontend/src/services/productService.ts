import { apiFetch } from "./apiClient";

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

const API_BASE_URL = "http://localhost:5163";

function buildImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${API_BASE_URL}${imageUrl}`;
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
  const savedCountry = localStorage.getItem("artisan_madina_country");

  if (savedCountry) {
    return savedCountry;
  }

  return "fr";
}

export async function getProducts(
  country = getVisitorCountry()
): Promise<ProductViewDto[]> {
  const res = await apiFetch(`/products?country=${country}`);

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
      fullMainImageUrl,
      fullImages,
    };
  });
}

export async function getLatestProducts(limit = 6): Promise<ProductViewDto[]> {
  const products = await getProducts();

  return sortByNewest(onlyAvailableProducts(products)).slice(0, limit);
}