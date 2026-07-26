import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { trackAddToCart } from "../services/analytics";

export type CartProduct = {
  id: number;
  name: string;
  slug?: string;
  price: number | null;
  priceLabel?: string;
  mainImageUrl?: string | null;
  dimensions?: string | null;
  lengthCm?: number | null;
  widthCm?: number | null;
  category?: string | null;
  canShowPrice?: boolean;
  isPriceHidden?: boolean;
  requiresPriceRequest?: boolean;
};

type CartContextType = {
  items: CartProduct[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: CartProduct) => { ok: boolean; message: string };
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "artisan_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, loadingAuth } = useAuth();
  const [items, setItems] = useState<CartProduct[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      localStorage.removeItem(CART_KEY);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!loadingAuth && !isAuthenticated) {
      setItems([]);
      localStorage.removeItem(CART_KEY);
    }
  }, [isAuthenticated, loadingAuth]);

  const addToCart = (product: CartProduct) => {
    if (!isAuthenticated) {
      return {
        ok: false,
        message: "Vous devez vous connecter pour ajouter un produit au panier.",
      };
    }

    if (
      product.canShowPrice !== true ||
      product.isPriceHidden === true ||
      product.requiresPriceRequest === true ||
      product.price == null ||
      product.price <= 0
    ) {
      return {
        ok: false,
        message: "Ce produit nécessite une demande de prix.",
      };
    }

    if (items.some((x) => x.id === product.id)) {
      return {
        ok: false,
        message: "Ce produit est déjà dans votre panier.",
      };
    }

    setItems((prev) => [
      ...prev,
      {
        ...product,
        price: product.price,
      },
    ]);
    trackAddToCart(product);

    return {
      ok: true,
      message: "Produit ajouté au panier.",
    };
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((x) => x.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  };

  const isInCart = (productId: number) => {
    return isAuthenticated && items.some((x) => x.id === productId);
  };

  const visibleItems = isAuthenticated ? items : [];
  const cartCount = visibleItems.length;

  const cartTotal = useMemo(() => {
    return visibleItems.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }, [visibleItems]);

  return (
    <CartContext.Provider
      value={{
        items: visibleItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
