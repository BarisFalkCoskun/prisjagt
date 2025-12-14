import { MongoClient } from "mongodb";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
let client = null;
async function getClient() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client;
}
async function getDb(name) {
  const client2 = await getClient();
  return client2.db(name);
}
const STORES = [
  { id: "netto", name: "Netto", color: "#FFD700", schema: "salling" },
  { id: "bilkatogo", name: "Bilka To Go", color: "#004B93", schema: "salling" },
  { id: "foetexplus", name: "Føtex+", color: "#00457C", schema: "salling" },
  { id: "fillop", name: "Fillop", color: "#E31937", schema: "salling" },
  { id: "rema1000", name: "Rema 1000", color: "#003366", schema: "rema" },
  { id: "meny", name: "Meny", color: "#D4002A", schema: "dagrofa" },
  { id: "spar", name: "Spar", color: "#00843D", schema: "dagrofa" },
  { id: "minkobmand", name: "Min Købmand", color: "#1E3A5F", schema: "dagrofa" },
  { id: "dagrofa", name: "Dagrofa", color: "#FF6B00", schema: "dagrofa" }
];
function extractSallingPrice(product) {
  if (product.storeData) {
    const storeKeys = Object.keys(product.storeData);
    if (storeKeys.length > 0) {
      const storeInfo = product.storeData[storeKeys[0]];
      const priceInOre2 = storeInfo.price || 0;
      const originalInOre = storeInfo.beforePrice || storeInfo.unitsOfMeasureOfferPrice;
      return {
        price: priceInOre2 / 100,
        // Convert øre to kroner
        originalPrice: originalInOre ? originalInOre / 100 : void 0,
        inStock: storeInfo.inStock !== false
      };
    }
  }
  const priceInOre = product.sales_price || product.price || 0;
  return {
    price: priceInOre / 100,
    originalPrice: product.cpOriginalPrice ? product.cpOriginalPrice / 100 : void 0,
    inStock: true
  };
}
function extractDagrofaPrice(product) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  return {
    price: hasDiscount ? product.discountPrice : product.price || 0,
    originalPrice: hasDiscount ? product.price : void 0,
    inStock: true
  };
}
function extractRemaPrice(product) {
  const pricing = product.pricing || {};
  return {
    price: pricing.price || product.price || 0,
    originalPrice: pricing.is_on_discount ? pricing.normal_price : void 0,
    inStock: true
  };
}
function normalizeProduct(product, storeId, schema) {
  let priceInfo;
  let name;
  let description;
  let images;
  let gtin;
  let sku;
  let category;
  let brand;
  switch (schema) {
    case "salling":
      priceInfo = extractSallingPrice(product);
      name = product.name || product.productName || "";
      description = product.description;
      brand = product.brand;
      images = product.images || [];
      gtin = product.gtin?.toString();
      sku = product.article?.toString();
      category = product.consumerFacingHierarchy?.lvl1?.[0] || product.categories?.lvl1?.[0];
      break;
    case "dagrofa":
      priceInfo = extractDagrofaPrice(product);
      name = product.productDisplayName || "";
      description = product.summary;
      brand = void 0;
      images = [product.highResImg, product.medResImg, product.lowResImg].filter(Boolean);
      gtin = void 0;
      sku = product.sku?.toString();
      category = void 0;
      break;
    case "rema":
      priceInfo = extractRemaPrice(product);
      name = product.name || "";
      description = product.description || product.description_short;
      brand = product.hf2 || product.underline?.split(" / ")[1];
      if (product.images && product.images.length > 0) {
        images = product.images.map(
          (img) => typeof img === "string" ? img : img.large || img.medium || img.small
        ).filter(Boolean);
      } else if (product.image_url) {
        images = [product.image_url];
      } else {
        images = [];
      }
      gtin = product.bar_codes?.[0]?.toString();
      sku = product.id?.toString();
      category = product.category_name;
      break;
  }
  return {
    _id: product._id?.toString() || "",
    name,
    description,
    brand,
    images,
    price: priceInfo.price,
    originalPrice: priceInfo.originalPrice,
    gtin,
    sku,
    category,
    inStock: priceInfo.inStock,
    storeId
  };
}
export {
  STORES as S,
  getDb as g,
  normalizeProduct as n
};
