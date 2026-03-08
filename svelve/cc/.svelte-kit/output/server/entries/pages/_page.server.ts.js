import { g as getDb, e as extractChainPrices, a as getImageUrl, C as CHAINS } from "../../chunks/db.js";
const load = async ({ url }) => {
  const query = url.searchParams.get("q") || "";
  const category = url.searchParams.get("category") || "";
  const selectedStore = url.searchParams.get("store") || "";
  try {
    const db = await getDb();
    const collection = db.collection("final-products-dk");
    const filter = {};
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } }
      ];
    }
    if (category) {
      filter.categoryPath = { $regex: category, $options: "i" };
    }
    if (selectedStore) {
      filter[`pricing.${selectedStore}.price`] = { $gt: 0 };
    }
    filter.lowestPrice = { $gt: 0 };
    const products = await collection.find(filter).limit(48).toArray();
    const allProducts = [];
    for (const product of products) {
      const prices = extractChainPrices(product);
      if (prices.length === 0) continue;
      let displayPrice;
      if (selectedStore) {
        displayPrice = prices.find((p) => p.chain.id === selectedStore) || prices[0];
      } else {
        displayPrice = prices[0];
      }
      const imageUrl = getImageUrl(product);
      allProducts.push({
        _id: product._id.toString(),
        name: product.name || "",
        description: product.descriptions?.[0],
        brand: product.brand,
        images: imageUrl ? [imageUrl] : [],
        image_primary: imageUrl,
        category: product.categoryPath?.[0],
        price: displayPrice.price,
        originalPrice: displayPrice.isOnDiscount && displayPrice.discountSaved ? displayPrice.price + displayPrice.discountSaved : void 0,
        inStock: true,
        storeId: displayPrice.chain.id,
        storeName: displayPrice.chain.name,
        storeColor: displayPrice.chain.color
      });
    }
    allProducts.sort((a, b) => a.price - b.price);
    let categories = [];
    try {
      const categoriesResult = await collection.aggregate([
        { $match: { "categoryPath.0": { $exists: true } } },
        { $group: { _id: { $arrayElemAt: ["$categoryPath", 0] } } },
        { $sort: { _id: 1 } },
        { $limit: 15 }
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
      products: allProducts,
      categories,
      total: allProducts.length,
      query,
      selectedCategory: category,
      selectedStore,
      stores: CHAINS
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
      stores: CHAINS
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
    "kæledyr": "🐾",
    "mexikansk": "🌮",
    "pasta": "🍝",
    "ris": "🍚",
    "kaffe": "☕",
    "te": "🍵"
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
