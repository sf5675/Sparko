import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const SERPAPI_KEY = process.env.SERPAPI_KEY || "";

app.use(express.static(path.join(__dirname, "public")));

function parseShipping(shippingText = "") {
  if (!shippingText) return null;
  const free = /free|kostenlos/i.test(shippingText);
  if (free) return 0;

  // Supports common strings such as "€4.99 delivery" or "4,99 € Versand".
  const match = shippingText.replace(",", ".").match(/(\d+(?:\.\d{1,2})?)\s*€/);
  return match ? Number(match[1]) : null;
}

function formatResult(item, index) {
  const price = Number.isFinite(item.extracted_price)
    ? item.extracted_price
    : null;
  const shippingText = item.delivery || item.shipping || "";
  const shipping = parseShipping(shippingText);
  const total = price !== null && shipping !== null ? price + shipping : null;

  return {
    id: `${item.product_id || item.position || index}`,
    title: item.title || "Produkt",
    shop: item.source || "Anbieter",
    price,
    total,
    shippingText,
    rating: item.rating ?? null,
    reviews: item.reviews ?? null,
    image: item.thumbnail || null,
    link: item.product_link || item.link || "#",
    badge: item.badge || null,
  };
}

app.get("/api/search", async (req, res) => {
  const q = String(req.query.q || "").trim();

  if (!q) {
    return res.status(400).json({ error: "Bitte einen Suchbegriff eingeben." });
  }

  if (q.length > 120) {
    return res.status(400).json({ error: "Der Suchbegriff ist zu lang." });
  }

  if (!SERPAPI_KEY) {
    return res.status(503).json({
      live: false,
      error: "Kein SERPAPI_KEY hinterlegt. Demo-Modus wird verwendet."
    });
  }

  const params = new URLSearchParams({
    engine: "google_shopping",
    q,
    location: "Germany",
    gl: "de",
    hl: "de",
    api_key: SERPAPI_KEY,
    no_cache: "true"
  });

  try {
    const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        live: false,
        error: data.error || "Die Preisdaten konnten gerade nicht geladen werden."
      });
    }

    const raw = Array.isArray(data.shopping_results) ? data.shopping_results : [];

    const offers = raw
      .map(formatResult)
      .filter(item => item.price !== null)
      .sort((a, b) => {
        const aPrice = a.total ?? a.price;
        const bPrice = b.total ?? b.price;
        return aPrice - bPrice;
      })
      .slice(0, 20);

    res.json({
      live: true,
      query: q,
      checkedAt: new Date().toISOString(),
      offers,
    });
  } catch (error) {
    console.error(error);
    res.status(502).json({
      live: false,
      error: "Verbindung zur Preissuche fehlgeschlagen."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Sparko läuft auf http://localhost:${PORT}`);
});
