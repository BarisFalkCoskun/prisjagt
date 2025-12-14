import { MongoClient, type Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

let client: MongoClient | null = null;

export async function getClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client;
}

export async function getDb(name: string): Promise<Db> {
  const client = await getClient();
  return client.db(name);
}

// Schema types for different store groups
export type StoreSchemaType = 'salling' | 'dagrofa' | 'rema';

export const STORES = [
  { id: 'netto', name: 'Netto', color: '#FFD700', schema: 'salling' as StoreSchemaType },
  { id: 'bilkatogo', name: 'Bilka To Go', color: '#004B93', schema: 'salling' as StoreSchemaType },
  { id: 'foetexplus', name: 'Føtex+', color: '#00457C', schema: 'salling' as StoreSchemaType },
  { id: 'fillop', name: 'Fillop', color: '#E31937', schema: 'salling' as StoreSchemaType },
  { id: 'rema1000', name: 'Rema 1000', color: '#003366', schema: 'rema' as StoreSchemaType },
  { id: 'meny', name: 'Meny', color: '#D4002A', schema: 'dagrofa' as StoreSchemaType },
  { id: 'spar', name: 'Spar', color: '#00843D', schema: 'dagrofa' as StoreSchemaType },
  { id: 'minkobmand', name: 'Min Købmand', color: '#1E3A5F', schema: 'dagrofa' as StoreSchemaType },
  { id: 'dagrofa', name: 'Dagrofa', color: '#FF6B00', schema: 'dagrofa' as StoreSchemaType },
] as const;

export type StoreId = typeof STORES[number]['id'];
export type Store = typeof STORES[number];

// Helper to get store by id
export function getStoreById(id: string): Store | undefined {
  return STORES.find(s => s.id === id);
}

// Normalize product data from different schemas
export interface NormalizedProduct {
  _id: string;
  name: string;
  description?: string;
  brand?: string;
  images: string[];
  price: number; // in øre
  originalPrice?: number;
  gtin?: string;
  sku?: string;
  category?: string;
  inStock?: boolean;
  storeId: string;
}

// Extract price from Salling schema (Netto, BilkaToGo, Foetexplus, Fillop)
// NOTE: Salling prices are in ØRE (250 = 2.50 kr), we convert to kroner
export function extractSallingPrice(product: any): { price: number; originalPrice?: number; inStock: boolean } {
  // Try storeData first
  if (product.storeData) {
    const storeKeys = Object.keys(product.storeData);
    if (storeKeys.length > 0) {
      const storeInfo = product.storeData[storeKeys[0]];
      const priceInOre = storeInfo.price || 0;
      const originalInOre = storeInfo.beforePrice || storeInfo.unitsOfMeasureOfferPrice;
      return {
        price: priceInOre / 100, // Convert øre to kroner
        originalPrice: originalInOre ? originalInOre / 100 : undefined,
        inStock: storeInfo.inStock !== false
      };
    }
  }
  // Fallback to direct price fields (also in øre)
  const priceInOre = product.sales_price || product.price || 0;
  return {
    price: priceInOre / 100,
    originalPrice: product.cpOriginalPrice ? product.cpOriginalPrice / 100 : undefined,
    inStock: true
  };
}

// Extract price from Dagrofa schema (Meny, Spar, MinKøbmand, Dagrofa)
export function extractDagrofaPrice(product: any): { price: number; originalPrice?: number; inStock: boolean } {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  return {
    price: hasDiscount ? product.discountPrice : product.price || 0,
    originalPrice: hasDiscount ? product.price : undefined,
    inStock: true
  };
}

// Extract price from Rema1000 schema
export function extractRemaPrice(product: any): { price: number; originalPrice?: number; inStock: boolean } {
  const pricing = product.pricing || {};
  return {
    price: pricing.price || product.price || 0,
    originalPrice: pricing.is_on_discount ? pricing.normal_price : undefined,
    inStock: true
  };
}

// Normalize product from any store schema
export function normalizeProduct(product: any, storeId: string, schema: StoreSchemaType): NormalizedProduct {
  let priceInfo: { price: number; originalPrice?: number; inStock: boolean };
  let name: string;
  let description: string | undefined;
  let images: string[];
  let gtin: string | undefined;
  let sku: string | undefined;
  let category: string | undefined;
  let brand: string | undefined;

  switch (schema) {
    case 'salling':
      priceInfo = extractSallingPrice(product);
      name = product.name || product.productName || '';
      description = product.description;
      brand = product.brand;
      images = product.images || [];
      gtin = product.gtin?.toString();
      sku = product.article?.toString();
      category = product.consumerFacingHierarchy?.lvl1?.[0] || product.categories?.lvl1?.[0];
      break;

    case 'dagrofa':
      priceInfo = extractDagrofaPrice(product);
      name = product.productDisplayName || '';
      description = product.summary;
      brand = undefined;
      images = [product.highResImg, product.medResImg, product.lowResImg].filter(Boolean);
      gtin = undefined;
      sku = product.sku?.toString();
      category = undefined;
      break;

    case 'rema':
      priceInfo = extractRemaPrice(product);
      name = product.name || '';
      description = product.description || product.description_short;
      brand = product.hf2 || product.underline?.split(' / ')[1]; // e.g., "REMA 1000" or "COLOMBIA KL. 1"
      // Rema images are nested objects with small/medium/large
      if (product.images && product.images.length > 0) {
        images = product.images.map((img: any) =>
          typeof img === 'string' ? img : (img.large || img.medium || img.small)
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
    _id: product._id?.toString() || '',
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
