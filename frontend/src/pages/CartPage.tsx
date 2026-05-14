import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  PackageCheck,
} from "lucide-react";

import { useCart } from "../context/useCart";
import { formatEurPrice } from "../utils/price";
import { useI18n } from "../i18n/i18n";
import "../styles/CartPage.css";

export default function CartPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { items, cartTotal, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <section className="cart-card cart-empty">
        <div className="cart-empty-icon">
          <ShoppingBag size={38} />
        </div>

        <p className="cart-kicker">{t("cart.kicker")}</p>
        <h1>{t("cart.emptyTitle")}</h1>

        <p>
          {t("cart.emptyDescription")}
        </p>

        <Link to="/products" className="cart-primary-btn">
          {t("cart.viewCollection")}
          <ArrowRight size={17} />
        </Link>
      </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <section className="cart-hero cart-card">
        <Link to="/products" className="cart-back-link">
          <ArrowLeft size={17} />
          {t("cart.continueShopping")}
        </Link>

        <p className="cart-kicker">{t("cart.selectionKicker")}</p>

        <div className="cart-hero-row">
          <div>
            <h1>{t("cart.title")}</h1>
            <p>
              {t("cart.subtitle")}
            </p>
          </div>

          <div className="cart-hero-badge">
            <Sparkles size={18} />
            <span>
              {items.length === 1
                ? t("cart.pieceSelectedOne")
                : t("cart.pieceSelectedMany", { count: items.length })}
            </span>
          </div>
        </div>
      </section>

      <section className="cart-layout">
        <div className="cart-card cart-products-card">
          <div className="cart-section-header">
            <div>
              <p className="cart-kicker">{t("cart.items")}</p>
              <h2>{t("cart.selectedTitle")}</h2>
            </div>

            <button
              type="button"
              className="cart-clear-inline"
              onClick={clearCart}
            >
              {t("cart.clear")}
            </button>
          </div>

          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item-image-wrap">
                  {item.mainImageUrl ? (
                    <img
                      src={item.mainImageUrl}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  ) : (
                    <div className="cart-item-placeholder">
                      <ShoppingBag size={26} />
                    </div>
                  )}
                </div>

                <div className="cart-item-content">
                  <span>{t("cart.uniquePiece")}</span>
                  <h3>{item.name}</h3>

                  <p>
                    {item.dimensions ||
                      (item.lengthCm && item.widthCm
                        ? `${item.lengthCm} × ${item.widthCm} cm`
                        : t("cart.fallbackDimension"))}
                  </p>

                  <strong>{formatEurPrice(item.price)}</strong>
                </div>

                <button
                  type="button"
                  className="cart-remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={t("cart.removeAria")}
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
          </div>
        </div>

        <aside className="cart-card cart-summary">
          <p className="cart-kicker">{t("cart.orderKicker")}</p>
          <h2>{t("cart.summaryTitle")}</h2>

          <div className="cart-summary-box">
            <div className="cart-summary-row">
              <span>{t("cart.items")}</span>
              <strong>{items.length}</strong>
            </div>

            <div className="cart-summary-row">
              <span>{t("cart.subtotal")}</span>
              <strong>{formatEurPrice(cartTotal)}</strong>
            </div>

            <div className="cart-summary-row">
              <span>{t("cart.shipping")}</span>
              <strong>{t("common.toBeConfirmed")}</strong>
            </div>

            <div className="cart-summary-total">
              <span>{t("cart.estimatedTotal")}</span>
              <strong>{formatEurPrice(cartTotal)}</strong>
            </div>
          </div>

          <p className="cart-summary-note">
            {t("cart.shippingNote")}
          </p>

          <button
            type="button"
            className="cart-checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            {t("cart.checkout")}
          </button>

          <div className="cart-trust-list">
            <div>
              <ShieldCheck size={17} />
              <span>{t("cart.trust.secureOrder")}</span>
            </div>

            <div>
              <PackageCheck size={17} />
              <span>{t("cart.trust.reservedAfterValidation")}</span>
            </div>

            <div>
              <Truck size={17} />
              <span>{t("cart.trust.internationalShipping")}</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
