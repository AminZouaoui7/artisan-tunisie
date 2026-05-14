import { apiFetch } from "./apiClient";

export type CustomerOrderItem = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

export type CustomerOrder = {
  id: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingStatus: string;
  trackingNumber?: string | null;
  shippingProvider?: string | null;
  totalAmount: number;
  currency: string;
  createdAt: string;

  country: string;
  city: string;
  addressLine1: string;
  addressLine2?: string | null;
  postalCode: string;
  stateOrProvince?: string | null;
  deliveryCountryCode?: string | null;

  items: CustomerOrderItem[];
};

export async function getMyOrders(): Promise<CustomerOrder[]> {
  const res = await apiFetch("/orders/my-orders", {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Impossible de charger vos commandes.");
  }

  return res.json();
}