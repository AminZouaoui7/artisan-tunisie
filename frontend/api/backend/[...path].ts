import type { VercelRequest, VercelResponse } from "@vercel/node";

const DEFAULT_API_URL = "https://artisanmedinabackend.onrender.com/api";
const API_URL = (process.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/+$/, "");

const REQUEST_HEADERS = ["accept", "authorization", "content-type"] as const;
const RESPONSE_HEADERS = ["content-type", "cache-control"] as const;

function getProxyPath(req: VercelRequest): string {
  const path = req.query.path;
  const segments = Array.isArray(path) ? path : path ? [path] : [];

  return segments.map(encodeURIComponent).join("/");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const proxyPath = getProxyPath(req);

  if (!proxyPath) {
    return res.status(400).json({ message: "Chemin API manquant." });
  }

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key === "path") continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== undefined) query.append(key, item);
    }
  }

  const targetUrl = `${API_URL}/${proxyPath}${query.size ? `?${query}` : ""}`;
  const headers = new Headers();

  for (const name of REQUEST_HEADERS) {
    const value = req.headers[name];
    if (typeof value === "string") headers.set(name, value);
  }

  const method = req.method || "GET";
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody
    ? typeof req.body === "string"
      ? req.body
      : Buffer.isBuffer(req.body)
        ? req.body.toString()
        : JSON.stringify(req.body ?? {})
    : undefined;

  try {
    const backendResponse = await fetch(targetUrl, { method, headers, body });
    const responseBody = Buffer.from(await backendResponse.arrayBuffer());

    for (const name of RESPONSE_HEADERS) {
      const value = backendResponse.headers.get(name);
      if (value) res.setHeader(name, value);
    }

    return res.status(backendResponse.status).send(responseBody);
  } catch {
    return res.status(502).json({
      message:
        "Le service de commande est momentanément indisponible. Veuillez réessayer.",
    });
  }
}
