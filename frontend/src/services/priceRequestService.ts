import { apiFetch } from "./apiClient";

export type CreatePriceRequestPayload = {
  productId: number;
  customerName: string;
  email: string;
  phone: string;
  countryCode: string;
  message: string;
};

export async function createPriceRequest(
  payload: CreatePriceRequestPayload
) {
  const res = await apiFetch("/PriceRequests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => null);

    throw new Error(
      error?.message ||
        "Erreur lors de l’envoi de la demande."
    );
  }

  return res.json();
}
