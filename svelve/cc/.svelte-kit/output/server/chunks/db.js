import { MongoClient } from "mongodb";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const IMAGE_BASE_URL = "http://127.0.0.1:8100";
let client = null;
async function getClient() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client;
}
async function getDb() {
  const c = await getClient();
  return c.db("beepr");
}
const CHAINS = [
  { id: "rema1000", name: "Rema 1000", color: "#003366" },
  { id: "netto", name: "Netto", color: "#FFD700" },
  { id: "foetex", name: "Føtex", color: "#00457C" },
  { id: "bilka", name: "Bilka", color: "#004B93" },
  { id: "nemlig", name: "Nemlig", color: "#FF6B00" },
  { id: "superbrugsen", name: "SuperBrugsen", color: "#E31937" },
  { id: "coop365", name: "Coop 365", color: "#00843D" },
  { id: "meny", name: "Meny", color: "#D4002A" }
];
function getImageUrl(product) {
  if (product.productImages && product.productImages.length > 0 && product.productImages[0]) {
    return `${IMAGE_BASE_URL}${product.productImages[0]}`;
  }
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }
  return null;
}
function getAllImageUrls(product) {
  const urls = [];
  if (product.productImages) {
    for (const path of product.productImages) {
      if (path) urls.push(`${IMAGE_BASE_URL}${path}`);
    }
  }
  if (urls.length === 0 && product.images) {
    for (const img of product.images) {
      if (img) urls.push(img);
    }
  }
  return urls;
}
function extractChainPrices(product) {
  const prices = [];
  if (!product.pricing) return prices;
  for (const chain of CHAINS) {
    const chainData = product.pricing[chain.id];
    if (!chainData || !chainData.price || chainData.price <= 0) continue;
    prices.push({
      chain,
      price: chainData.price,
      pricePerUnit: chainData.pricePerUnit,
      unit: chainData.unit,
      isOnDiscount: chainData.isOnDiscount,
      discountSaved: chainData.discount?.savedPerItem,
      link: chainData.link
    });
  }
  prices.sort((a, b) => a.price - b.price);
  return prices;
}
export {
  CHAINS as C,
  getImageUrl as a,
  getAllImageUrls as b,
  extractChainPrices as e,
  getDb as g
};
