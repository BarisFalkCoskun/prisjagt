import { g as getDb, S as STORES, n as normalizeProduct } from "../../chunks/db.js";
const load = async ({ url }) => {
  const query = url.searchParams.get("q") || "";
  const category = url.searchParams.get("category") || "";
  const selectedStore = url.searchParams.get("store") || "";
  try {
    const storesToQuery = [
      { id: "rema1000", schema: "rema" },
      { id: "netto", schema: "salling" },
      { id: "bilkatogo", schema: "salling" },
      { id: "foetexplus", schema: "salling" },
      { id: "meny", schema: "dagrofa" },
      { id: "spar", schema: "dagrofa" }
    ];
    const filteredStores = selectedStore ? storesToQuery.filter((s) => s.id === selectedStore) : storesToQuery;
    const storeResults = await Promise.all(
      filteredStores.map(async (store) => {
        try {
          const db = await getDb(store.id);
          const collection = db.collection("products");
          const filter = {};
          if (query) {
            if (store.schema === "dagrofa") {
              filter.$or = [
                { productDisplayName: { $regex: query, $options: "i" } },
                { summary: { $regex: query, $options: "i" } }
              ];
            } else {
              filter.$or = [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
              ];
            }
          }
          if (category) {
            if (store.schema === "rema") {
              filter.category_name = { $regex: category, $options: "i" };
            }
          }
          if (store.schema === "rema") {
            filter["pricing.price"] = { $gt: 0 };
          } else if (store.schema === "dagrofa") {
            filter.price = { $gt: 0 };
          }
          const limit = selectedStore ? 50 : Math.ceil(60 / filteredStores.length);
          const products = await collection.find(filter).limit(limit).toArray();
          return {
            storeId: store.id,
            schema: store.schema,
            products
          };
        } catch (e) {
          console.error(`Error querying ${store.id}:`, e);
          return { storeId: store.id, schema: store.schema, products: [] };
        }
      })
    );
    const allProducts = [];
    for (const { storeId, schema, products } of storeResults) {
      const storeConfig = STORES.find((s) => s.id === storeId);
      if (!storeConfig) continue;
      for (const product of products) {
        const normalized = normalizeProduct(product, storeId, schema);
        if (!normalized.price || normalized.price <= 0) continue;
        allProducts.push({
          _id: `${storeId}_${normalized._id}`,
          name: normalized.name,
          description: normalized.description,
          brand: normalized.brand,
          images: normalized.images,
          image_primary: normalized.images[0] || null,
          category: normalized.category,
          gtin: normalized.gtin,
          price: normalized.price,
          originalPrice: normalized.originalPrice,
          inStock: normalized.inStock ?? true,
          storeId,
          storeName: storeConfig.name,
          storeColor: storeConfig.color
        });
      }
    }
    allProducts.sort((a, b) => a.price - b.price);
    const limitedProducts = allProducts.slice(0, 48);
    let categories = [];
    try {
      const remaDb = await getDb("rema1000");
      const remaCollection = remaDb.collection("products");
      const categoriesResult = await remaCollection.aggregate([
        { $match: { category_name: { $exists: true, $ne: null } } },
        { $group: { _id: "$category_name" } },
        { $sort: { _id: 1 } },
        { $limit: 12 }
      ]).toArray();
      categories = categoriesResult.map((c) => c._id).filter(Boolean).map((name) => ({
        id: name,
        name,
        icon: getCategoryIcon(name)
      }));
    } catch (e) {
      console.error("Error fetching categories:", e);
    }
    return {
      products: limitedProducts,
      categories,
      total: limitedProducts.length,
      query,
      selectedCategory: category,
      selectedStore,
      stores: STORES
    };
  } catch (error) {
    console.error("Error loading products:", error);
    return {
      products: [],
      categories: [],
      total: 0,
      query,
      selectedCategory: category,
      selectedStore: "",
      error: "Failed to load products",
      stores: STORES
    };
  }
};
function getCategoryIcon(name) {
  const lowerName = name.toLowerCase();
  const icons = {
    "frugt": "🍎",
    "grønt": "🥬",
    "mejeri": "🥛",
    "mælk": "🥛",
    "brød": "🥖",
    "bagværk": "🥐",
    "kød": "🥩",
    "fjerkræ": "🍗",
    "fisk": "🐟",
    "skaldyr": "🦐",
    "frost": "❄️",
    "drikkevarer": "🥤",
    "drikke": "🥤",
    "øl": "🍺",
    "vin": "🍷",
    "kolonial": "🥫",
    "slik": "🍬",
    "snacks": "🍿",
    "chips": "🍟",
    "husholdning": "🧹",
    "rengøring": "🧼",
    "baby": "👶",
    "personlig": "🧴",
    "pleje": "💆",
    "dyrefoder": "🐕",
    "kæledyr": "🐾"
  };
  for (const [key, icon] of Object.entries(icons)) {
    if (lowerName.includes(key)) {
      return icon;
    }
  }
  return "📦";
}
export {
  load
};
