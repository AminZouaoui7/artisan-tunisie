import { apiFetch } from "./apiClient";

export type CreateDemoBookingPayload = {
  fullName: string;
  email: string;
  phone?: string;
  productIds: number[];
  demoDate: string;
  demoTime: string;
  guestsCount: number;
  durationMinutes: number;
  message?: string;
};

export async function createDemoBooking(
  payload: CreateDemoBookingPayload,
  token?: string
) {
  const fixedPayload = {
    ...payload,
    demoTime:
      payload.demoTime.length === 5
        ? `${payload.demoTime}:00`
        : payload.demoTime,
  };

  const res = await apiFetch("/demo-bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    body: JSON.stringify(fixedPayload),
  });

  if (!res.ok) {
    const errorText = await res.text();

    throw new Error(
      errorText || "Erreur lors de la réservation."
    );
  }

  return res.json();
}

export type CustomerDemoBooking = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  letTeamChooseProducts: boolean;
  demoDate: string;
  demoTime: string;
  guestsCount: number;
  durationMinutes: number;
  message?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  productsToSee: {
    productId: number;
    productName: string;
    productImage?: string;
  }[];
};

export async function getMyDemoBookings(
  token: string
): Promise<CustomerDemoBooking[]> {
  const res = await apiFetch(
    "/account/demo-bookings",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      "Impossible de charger vos réservations."
    );
  }

  return res.json();
}
