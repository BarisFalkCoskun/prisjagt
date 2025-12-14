// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDb, STORES, normalizeProduct, type Store } from '$lib/db';
import { ObjectId } from 'mongodb';
import type { PriceHistory } from '$lib/types';

export const load = async ({ params, url }: Parameters<PageServerLoad>[0]) => {
  const { id } = params;
  const sourceStore = url.searchParams.get('store') || 'rema1000';

  try {
    // Find the source store config
    const sourceStoreConfig = STORES.find(s => s.id === sourceStore) || STORES[4];

    // Get product from source store
    const sourceDb = await getDb(sourceStoreConfig.id);
    let product: any = null;

    // Try to find by ObjectId first, then by other identifiers
    try {
      if (ObjectId.isValid(id)) {
        product = await sourceDb.collection('products').findOne({ _id: new ObjectId(id) });
      }
    } catch {
      // Not a valid ObjectId, continue
    }

    // Try by SKU/article/id based on schema
    if (!product) {
      if (sourceStoreConfig.schema === 'rema') {
        product = await sourceDb.collection('products').findOne({
          $or: [
            { id: parseInt(id) || -1 },
            { bar_codes: id }
          ]
        });
      } else if (sourceStoreConfig.schema === 'dagrofa') {
        product = await sourceDb.collection('products').findOne({
          $or: [
            { sku: id },
            { id: parseInt(id) || -1 }
          ]
        });
      } else {
        product = await sourceDb.collection('products').findOne({
          $or: [
            { article: id },
            { gtin: id },
            { id: parseInt(id) || -1 }
          ]
        });
      }
    }

    if (!product) {
      return { product: null, prices: [], priceHistory: [] };
    }

    // Normalize the source product
    const normalizedProduct = normalizeProduct(product, sourceStoreConfig.id, sourceStoreConfig.schema);

    // Collect prices from all stores
    const prices: {
      store: Store;
      price: number;
      originalPrice?: number;
      inStock: boolean;
      isLowest?: boolean;
    }[] = [];

    // Add source store price
    if (normalizedProduct.price > 0) {
      prices.push({
        store: sourceStoreConfig,
        price: normalizedProduct.price,
        originalPrice: normalizedProduct.originalPrice,
        inStock: normalizedProduct.inStock ?? true
      });
    }

    // Search for the same product in other stores
    const searchTerms = normalizedProduct.name.split(' ').slice(0, 3).join(' ');

    for (const storeConfig of STORES) {
      if (storeConfig.id === sourceStoreConfig.id) continue;

      try {
        const storeDb = await getDb(storeConfig.id);
        let storeProduct: any = null;

        // Try to find by GTIN/barcode first
        if (normalizedProduct.gtin) {
          if (storeConfig.schema === 'rema') {
            storeProduct = await storeDb.collection('products').findOne({
              bar_codes: normalizedProduct.gtin
            });
          } else if (storeConfig.schema === 'salling') {
            storeProduct = await storeDb.collection('products').findOne({
              gtin: normalizedProduct.gtin
            });
          }
        }

        // If not found by GTIN, try by name similarity
        if (!storeProduct && searchTerms.length > 3) {
          if (storeConfig.schema === 'dagrofa') {
            storeProduct = await storeDb.collection('products').findOne({
              productDisplayName: { $regex: searchTerms, $options: 'i' }
            });
          } else {
            storeProduct = await storeDb.collection('products').findOne({
              name: { $regex: searchTerms, $options: 'i' }
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
        // Store might not exist or have different schema
        console.log(`Could not fetch from ${storeConfig.id}:`, e);
      }
    }

    // Sort prices - lowest first
    prices.sort((a, b) => a.price - b.price);

    // Mark lowest price
    const pricesWithLowest = prices.map((p, i) => ({
      ...p,
      isLowest: i === 0
    }));

    // Generate mock price history (in a real app, this would come from historical data)
    const priceHistory: PriceHistory[] = generateMockPriceHistory(
      normalizedProduct.price || prices[0]?.price || 1000,
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
    console.error('Error loading product:', error);
    return { product: null, prices: [], priceHistory: [], error: 'Failed to load product' };
  }
};

function generateMockPriceHistory(currentPrice: number, store: string): PriceHistory[] {
  const history: PriceHistory[] = [];
  const now = new Date();

  // Generate 30 days of price history
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Add some realistic price variation (sales, etc.)
    let variation = 1;
    if (i % 7 === 0) {
      // Weekly sale
      variation = 0.85 + Math.random() * 0.1;
    } else {
      variation = 0.95 + Math.random() * 0.1;
    }

    history.push({
      date: date.toLocaleDateString('da-DK', { day: '2-digit', month: 'short' }),
      price: Math.round(currentPrice * variation),
      store
    });
  }

  return history;
}
