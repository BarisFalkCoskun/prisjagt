import { S as STORES, g as getDb, n as normalizeProduct } from "../../../../chunks/db.js";
import { ObjectId } from "mongodb";
const load = async ({ params, url }) => {
  const { id } = params;
  let sourceStore;
  let productId;
  const idParts = id.split("_");
  if (idParts.length >= 2) {
    const potentialStoreId = idParts[0];
    const isValidStore = STORES.some((s) => s.id === potentialStoreId);
    if (isValidStore) {
      sourceStore = potentialStoreId;
      productId = idParts.slice(1).join("_");
    } else {
      sourceStore = url.searchParams.get("store") || "rema1000";
      productId = id;
    }
  } else {
    sourceStore = url.searchParams.get("store") || "rema1000";
    productId = id;
  }
  try {
    const sourceStoreConfig = STORES.find((s) => s.id === sourceStore) || STORES[4];
    const sourceDb = await getDb(sourceStoreConfig.id);
    let product = null;
    try {
      if (ObjectId.isValid(productId)) {
        product = await sourceDb.collection("products").findOne({ _id: new ObjectId(productId) });
      }
    } catch {
    }
    if (!product) {
      if (sourceStoreConfig.schema === "rema") {
        product = await sourceDb.collection("products").findOne({
          $or: [
            { id: parseInt(productId) || -1 },
            { bar_codes: productId }
          ]
        });
      } else if (sourceStoreConfig.schema === "dagrofa") {
        product = await sourceDb.collection("products").findOne({
          $or: [
            { sku: productId },
            { id: parseInt(productId) || -1 }
          ]
        });
      } else {
        product = await sourceDb.collection("products").findOne({
          $or: [
            { article: productId },
            { gtin: productId },
            { id: parseInt(productId) || -1 }
          ]
        });
      }
    }
    if (!product) {
      return { product: null, prices: [], priceHistory: [] };
    }
    const normalizedProduct = normalizeProduct(product, sourceStoreConfig.id, sourceStoreConfig.schema);
    const prices = [];
    if (normalizedProduct.price > 0) {
      prices.push({
        store: sourceStoreConfig,
        price: normalizedProduct.price,
        originalPrice: normalizedProduct.originalPrice,
        inStock: normalizedProduct.inStock ?? true
      });
    }
    const searchTerms = normalizedProduct.name.split(" ").slice(0, 3).join(" ");
    for (const storeConfig of STORES) {
      if (storeConfig.id === sourceStoreConfig.id) continue;
      try {
        const storeDb = await getDb(storeConfig.id);
        let storeProduct = null;
        if (normalizedProduct.gtin) {
          if (storeConfig.schema === "rema") {
            storeProduct = await storeDb.collection("products").findOne({
              bar_codes: normalizedProduct.gtin
            });
          } else if (storeConfig.schema === "salling") {
            storeProduct = await storeDb.collection("products").findOne({
              gtin: normalizedProduct.gtin
            });
          }
        }
        if (!storeProduct && searchTerms.length > 3) {
          if (storeConfig.schema === "dagrofa") {
            storeProduct = await storeDb.collection("products").findOne({
              productDisplayName: { $regex: searchTerms, $options: "i" }
            });
          } else {
            storeProduct = await storeDb.collection("products").findOne({
              name: { $regex: searchTerms, $options: "i" }
            });
          }
        }
        if (storeProduct) {
          const normalized = normalizeProduct(storeProduct, storeConfig.id, storeConfig.schema);
          if (normalized.price > 0) {
            prices.push({
              store: storeConfig,
              price: normalized.price,
              originalPrice: normalized.originalPrice,
              inStock: normalized.inStock ?? true
            });
          }
        }
      } catch (e) {
        console.log(`Could not fetch from ${storeConfig.id}:`, e);
      }
    }
    prices.sort((a, b) => a.price - b.price);
    const pricesWithLowest = prices.map((p, i) => ({
      ...p,
      isLowest: i === 0
    }));
    const priceHistory = generateMockPriceHistory(
      normalizedProduct.price || prices[0]?.price || 1e3,
      sourceStoreConfig.id
    );
    const transformedProduct = {
      _id: normalizedProduct._id,
      name: normalizedProduct.name,
      description: normalizedProduct.description,
      brand: normalizedProduct.brand,
      images: normalizedProduct.images,
      categories: { level1: normalizedProduct.category },
      gtin: normalizedProduct.gtin,
      article: normalizedProduct.sku,
      price: normalizedProduct.price
    };
    return {
      product: transformedProduct,
      prices: pricesWithLowest,
      priceHistory,
      lowestPrice: prices[0]?.price || 0,
      highestPrice: prices[prices.length - 1]?.price || 0,
      sourceStore: sourceStoreConfig
    };
  } catch (error) {
    console.error("Error loading product:", error);
    return { product: null, prices: [], priceHistory: [], error: "Failed to load product" };
  }
};
function generateMockPriceHistory(currentPrice, store) {
  const history = [];
  const now = /* @__PURE__ */ new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    let variation = 1;
    if (i % 7 === 0) {
      variation = 0.85 + Math.random() * 0.1;
    } else {
      variation = 0.95 + Math.random() * 0.1;
    }
    history.push({
      date: date.toLocaleDateString("da-DK", { day: "2-digit", month: "short" }),
      price: Math.round(currentPrice * variation),
      store
    });
  }
  return history;
}
export {
  load
};
