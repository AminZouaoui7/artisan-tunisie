import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  CalendarDays,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  X,
} from "lucide-react";

import { getMyOrders, type CustomerOrder } from "../services/orderService";
import { formatEurPrice } from "../utils/price";
import { useI18n } from "../i18n/i18n";
import "../styles/AccountOrdersPage.css";

function formatDate(date: string, language: string) {
  return new Date(date).toLocaleDateString(language === "FR" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getPublicReference(order: CustomerOrder, language: string) {
  return (
    (order as any).publicReference ??
    (order as any).PublicReference ??
    `CMD-${formatDate(order.createdAt, language)}-${order.id.slice(0, 6).toUpperCase()}`
  );
}

function getItemImageUrl(item: any) {
  const url =
    item.productImageUrl ||
    item.ProductImageUrl ||
    item.fullMainImageUrl ||
    item.mainImageUrl ||
    item.imageUrl;

  if (!url) return "";
  if (url.startsWith("http")) return url;

  return `http://localhost:5163${url.startsWith("/") ? url : `/${url}`}`;
}

function getOrderStep(order: CustomerOrder) {
  const stepFromApi = (order as any).progressStep ?? (order as any).ProgressStep;

  if (typeof stepFromApi === "number") {
    return stepFromApi;
  }

  const status = order.status?.toLowerCase();
  const shipping = order.shippingStatus?.toLowerCase();

  if (status === "cancelled") return 0;
  if (status === "delivered" || shipping === "delivered") return 4;
  if (status === "shipped" || shipping === "shipped") return 3;
  if (status === "confirmed" || status === "validated") return 2;

  return 1;
}

function getStatusLabel(order: CustomerOrder, t: any) {
  const status = order.status?.toLowerCase();
  const shipping = order.shippingStatus?.toLowerCase();

  if (status === "cancelled") return t("account.orders.status.cancelled");
  if (status === "delivered" || shipping === "delivered") return t("account.orders.status.delivered");
  if (status === "shipped" || shipping === "shipped") return t("account.orders.status.shipped");
  if (status === "confirmed" || status === "validated") return t("account.orders.status.confirmed");

  return t("account.orders.status.pending");
}

function getPaymentLabel(method: string, t: any) {
  if (method === "Online") return t("account.orders.paymentMethods.online");
  if (method === "BankTransferIban") return t("account.orders.paymentMethods.iban");
  if (method === "BankTransferRib") return t("account.orders.paymentMethods.rib");

  return t("account.orders.paymentMethods.none");
}

function getShippingLabel(order: CustomerOrder, t: any) {
  const shipping = order.shippingStatus?.toLowerCase();

  if (shipping === "delivered") return t("account.orders.status.delivered");
  if (shipping === "shipped") {
    return order.shippingProvider || t("account.orders.status.shipped");
  }
  if (shipping === "preparing") return t("account.orders.status.pending");

  return t("account.orders.status.pending");
}

export default function AccountOrdersPage() {
  const { t, language } = useI18n();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const steps = useMemo(
    () => [
      {
        id: 1,
        title: t("account.orders.steps.request.title"),
        text: t("account.orders.steps.request.text"),
        icon: Clock,
      },
      {
        id: 2,
        title: t("account.orders.steps.validation.title"),
        text: t("account.orders.steps.validation.text"),
        icon: PackageCheck,
      },
      {
        id: 3,
        title: t("account.orders.steps.shipping.title"),
        text: t("account.orders.steps.shipping.text"),
        icon: Truck,
      },
      {
        id: 4,
        title: t("account.orders.steps.delivered.title"),
        text: t("account.orders.steps.delivered.text"),
        icon: CheckCircle2,
      },
    ],
    [t]
  );

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders();

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des commandes."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="account-orders-card">
        <h3>{t("account.orders.title")}</h3>
        <div className="account-orders-divider" />
        <p className="account-orders-muted">{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-orders-card">
        <h3>{t("account.orders.title")}</h3>
        <div className="account-orders-divider" />
        <p className="account-orders-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="account-orders-card">
      <h3>{t("account.orders.title")}</h3>
      <div className="account-orders-divider" />

      {orders.length === 0 ? (
        <p className="account-orders-muted">
          {t("account.orders.empty")}
        </p>
      ) : (
        <div className="account-orders-list">
          {orders.map((order) => (
            <article className="account-order-item" key={order.id}>
              <div className="account-order-main">
                <h4>{getPublicReference(order, language)}</h4>

                <div className="account-order-meta">
                  <span>
                    <CalendarDays size={15} />
                    {formatDate(order.createdAt, language)}
                  </span>

                  <span>
                    <PackageCheck size={15} />
                    {order.items?.length ?? 0} {order.items?.length === 1 ? t("account.orders.itemCountOne") : t("account.orders.itemCountMany", { count: order.items?.length ?? 0 })}
                  </span>

                  <span>
                    <CreditCard size={15} />
                    {getPaymentLabel(order.paymentMethod, t)}
                  </span>

                  <span>
                    <Truck size={15} />
                    {getShippingLabel(order, t)}
                  </span>
                </div>

                <p className="account-order-address">
                  <MapPin size={15} />
                  {order.city}, {order.country}
                </p>
              </div>

              <div className="account-order-side">
                <span className="account-order-status">
                  {getStatusLabel(order, t)}
                </span>

                <strong>{formatEurPrice(order.totalAmount)}</strong>

                <button
                  className="account-order-detail-btn"
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                >
                  <Eye size={16} />
                  {t("account.orders.viewDetails")}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="account-order-modal">
          <div
            className="account-order-modal-backdrop"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="account-order-detail-card">
            <button
              className="account-order-modal-close"
              type="button"
              onClick={() => setSelectedOrder(null)}
            >
              <X size={18} />
            </button>

            <p className="account-order-kicker">
              {t("account.orders.orderNumber", { id: getPublicReference(selectedOrder, language) })}
            </p>

            <h3>{t("account.orders.trackingTitle")}</h3>

            <div className="account-order-detail-grid">
              <div>
                <span>{t("account.orders.fields.date")}</span>
                <strong>{formatDate(selectedOrder.createdAt, language)}</strong>
              </div>

              <div>
                <span>{t("account.orders.fields.total")}</span>
                <strong>{formatEurPrice(selectedOrder.totalAmount)}</strong>
              </div>

              <div>
                <span>{t("account.orders.fields.payment")}</span>
                <strong>{getPaymentLabel(selectedOrder.paymentMethod, t)}</strong>
              </div>

              <div>
                <span>{t("account.orders.fields.shipping")}</span>
                <strong>{getShippingLabel(selectedOrder, t)}</strong>
              </div>
            </div>

            <div className="account-order-steps">
              {steps.map((step) => {
                const active = getOrderStep(selectedOrder);
                const done = active > 0 && step.id <= active;
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    className={`account-order-step ${
                      done ? "is-active" : "is-disabled"
                    }`}
                  >
                    <div className="account-order-step-icon">
                      <Icon size={18} />
                    </div>

                    <div>
                      <h4>{step.title}</h4>
                      <p>{step.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="account-order-products">
              <div className="account-order-products-head">
                <h4>{t("account.orders.orderedItems")}</h4>

                <span>
                  {selectedOrder.items?.length ?? 0} {selectedOrder.items?.length === 1 ? t("account.orders.itemCountOne") : t("account.orders.itemCountMany", { count: selectedOrder.items?.length ?? 0 })}
                </span>
              </div>

              <div className="account-order-products-list">
                {(selectedOrder.items ?? []).map((item: any, index: number) => {
                  const imageUrl = getItemImageUrl(item);

                  return (
                    <div
                      key={`${item.productId}-${index}`}
                      className="account-order-product"
                    >
                      <div className="account-order-product-img">
                        {imageUrl ? (
                          <img src={imageUrl} alt={item.productName} />
                        ) : (
                          <PackageCheck size={22} />
                        )}
                      </div>

                      <div className="account-order-product-info">
                        <span className="account-order-product-name">
                          {item.productName}
                        </span>

                        <small>{t("account.orders.quantity", { count: item.quantity ?? 1 })}</small>
                      </div>

                      <strong>{formatEurPrice(item.totalPrice)}</strong>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="account-order-delivery">
              <h4>{t("account.orders.deliveryAddress")}</h4>

              <p>
                {selectedOrder.addressLine1}
                {selectedOrder.addressLine2
                  ? `, ${selectedOrder.addressLine2}`
                  : ""}
                , {selectedOrder.postalCode} {selectedOrder.city},{" "}
                {selectedOrder.country}
              </p>

              {selectedOrder.trackingNumber && (
                <p>
                  {t("account.orders.tracking")} <strong>{selectedOrder.trackingNumber}</strong>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}