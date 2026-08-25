import type { VercelRequest, VercelResponse } from "@vercel/node";

const FRANKFURTER_URL =
  "https://api.frankfurter.app/latest?from=EUR&to=USD";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const response = await fetch(FRANKFURTER_URL, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Frankfurter returned ${response.status}.`);
    }

    const data = (await response.json()) as { rates?: { USD?: number } };
    const rate = data.rates?.USD;

    if (typeof rate !== "number" || !Number.isFinite(rate)) {
      throw new Error("Frankfurter returned an invalid EUR/USD rate.");
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );
    return res.status(200).json({ rates: { USD: rate } });
  } catch {
    return res.status(502).json({
      message: "Unable to load the EUR/USD exchange rate.",
    });
  }
}
