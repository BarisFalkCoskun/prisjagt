import { g as getDb, e as extractChainPrices, b as getAllImageUrls, C as CHAINS } from "../../../../chunks/db.js";
import { ObjectId } from "mongodb";
const load = async ({ params }) => {
  const { id } = params;
  try {
    const db = await getDb();
    const productsCol = db.collection("final-products-dk");
    const priceHistoryCol = db.collection("final-priceHistory-dk");
    let product = null;
    if (ObjectId.isValid(id)) {
      product = await productsCol.findOne({ _id: new ObjectId(id) });
    }
    if (!product) {
      return { product: null, prices: [], priceHistory: [] };
    }
    const chainPrices = extractChainPrices(product);
    const images = getAllImageUrls(product);
    const prices = chainPrices.map((cp, i) => ({
      store: cp.chain,
      price: cp.price,
      originalPrice: cp.isOnDiscount && cp.discountSaved ? cp.price + cp.discountSaved : void 0,
      inStock: true,
      isLowest: i === 0,
      link: cp.link,
      pricePerUnit: cp.pricePerUnit,
      unit: cp.unit
    }));
    let priceHistory = [];
    if (product.barcodes && product.barcodes.length > 0) {
      const historyDoc = await priceHistoryCol.findOne({
        barcodes: { $in: product.barcodes }
      });
      if (historyDoc && historyDoc.prices) {
        const entries = Object.entries(historyDoc.prices);
        entries.sort(([a], [b]) => a.localeCompare(b));
        for (const [dateStr, chainPricesObj] of entries) {
          for (const [chainId, price] of Object.entries(chainPricesObj)) {
            const chain = CHAINS.find((c) => c.id === chainId);
            priceHistory.push({
              date: formatDate(dateStr),
              price,
              store: chain?.name || chainId
            });
          }
        }
      }
    }
    const lowestPrice = chainPrices[0]?.price || product.lowestPrice || 0;
    const highestPrice = chainPrices.length > 0 ? chainPrices[chainPrices.length - 1].price : lowestPrice;
    const sourceChain = chainPrices[0]?.chain || CHAINS[0];
    const transformedProduct = {
      _id: product._id.toString(),
      name: product.name || "",
      description: product.descriptions?.[0],
      brand: product.brand,
      images,
      categories: { level1: product.categoryPath?.[0] },
      categoryPath: product.categoryPath,
      gtin: product.barcodes?.[0],
      units: product.units,
      unitsOfMeasure: product.unitsOfMeasure,
      price: lowestPrice
    };
    return {
      product: transformedProduct,
      prices,
      priceHistory,
      lowestPrice,
      highestPrice,
      sourceStore: sourceChain
    };
  } catch (error) {
    console.error("Error loading product:", error);
    return { product: null, prices: [], priceHistory: [], error: "Failed to load product" };
  }
};
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("da-DK", { day: "2-digit", month: "short" });
  } catch {
    return dateStr;
  }
}
export {
  load
};
