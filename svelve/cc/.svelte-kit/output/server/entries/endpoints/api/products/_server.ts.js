import { json } from "@sveltejs/kit";
import { g as getDb, e as extractChainPrices, a as getImageUrl } from "../../../../chunks/db.js";
const GET = async ({ url }) => {
  const query = url.searchParams.get("q") || "";
  const category = url.searchParams.get("category") || "";
  const storeId = url.searchParams.get("store") || "";
  const limit = parseInt(url.searchParams.get("limit") || "24");
  const offset = parseInt(url.searchParams.get("offset") || "0");
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
    if (storeId) {
      filter[`pricing.${storeId}.price`] = { $gt: 0 };
    }
    filter.lowestPrice = { $gt: 0 };
    const [products, total] = await Promise.all([
      collection.find(filter).skip(offset).limit(limit).toArray(),
      collection.countDocuments(filter)
    ]);
    const transformedProducts = products.map((product) => {
      const prices = extractChainPrices(product);
      const cheapest = prices[0];
      const imageUrl = getImageUrl(product);
      return {
        _id: product._id.toString(),
        name: product.name || "",
        description: product.descriptions?.[0],
        brand: product.brand,
        images: imageUrl ? [imageUrl] : [],
        categories: { level1: product.categoryPath?.[0] },
        price: cheapest?.price || product.lowestPrice || 0,
        originalPrice: cheapest?.isOnDiscount && cheapest?.discountSaved ? cheapest.price + cheapest.discountSaved : void 0,
        storeId: cheapest?.chain.id || product.lowestChain?.[0] || ""
      };
    });
    return json({
      products: transformedProducts,
      total,
      hasMore: offset + products.length < total
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return json({ products: [], total: 0, hasMore: false, error: "Failed to fetch products" }, { status: 500 });
  }
};
export {
  GET
};
