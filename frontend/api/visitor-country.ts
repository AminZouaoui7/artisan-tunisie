import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const country =
    req.headers["x-vercel-ip-country"]?.toString() ||
    req.headers["cf-ipcountry"]?.toString() ||
    "FR";

  res.status(200).json({
    country: country.toUpperCase(),
  });
}