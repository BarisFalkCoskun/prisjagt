// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDb, STORES, normalizeProduct, type StoreSchemaType } from '$lib/db';

interface ProductWithStore {
  _id: string;
  name: string;
  description?: string;
  brand?: string;
  images: string[];
  image_primary: string | null;
  category?: string;
  gtin?: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  // Store info
  storeId: string;
  storeName: string;
  storeColor: string;
}

export const load = async ({ url }: Parameters<PageServerLoad>[0]) => {
  const query = url.searchParams.get('q') || '';
  const category = url.searchParams.get('category') || '';
  const selectedStore = url.searchParams.get('store') || '';

  try {
    // Define which stores to query
    const storesToQuery = [
      { id: 'rema1000', schema: 'rema' as StoreSchemaType },
      { id: 'netto', schema: 'salling' as StoreSchemaType },
      { id: 'bilkatogo', schema: 'salling' as StoreSchemaType },
      { id: 'foetexplus', schema: 'salling' as StoreSchemaType },
      { id: 'meny', schema: 'dagrofa' as StoreSchemaType },
      { id: 'spar', schema: 'dagrofa' as StoreSchemaType },
    ];

    // Filter to specific store if selected
    const filteredStores = selectedStore
      ? storesToQuery.filter(s => s.id === selectedStore)
      : storesToQuery;

    // Query all stores in parallel
    const storeResults = await Promise.all(
      filteredStores.map(async (store) => {
        try {
          const db = await getDb(store.id);
          const collection = db.collection('products');

          // Build filter based on schema
          const filter: Record<string, unknown> = {};

          if (query) {
            if (store.schema === 'dagrofa') {
              filter.$or = [
                { productDisplayName: { $regex: query, $options: 'i' } },
                { summary: { $regex: query, $options: 'i' } }
              ];
            } else {
              filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
              ];
            }
          }

          if (category) {
            if (store.schema === 'rema') {
              filter.category_name = { $regex: category, $options: 'i' };
            }
          }

          // Add price filter
          if (store.schema === 'rema') {
            filter['pricing.price'] = { $gt: 0 };
          } else if (store.schema === 'dagrofa') {
            filter.price = { $gt: 0 };
          }

          // Get more products per store to have good variety
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

    // Collect all products with store info
    const allProducts: ProductWithStore[] = [];

    for (const { storeId, schema, products } of storeResults) {
      const storeConfig = STORES.find(s => s.id === storeId);
      if (!storeConfig) continue;

      for (const product of products) {
        const normalized = normalizeProduct(product, storeId, schema);

        // Skip products with invalid prices
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

    // Sort by price (lowest first)
    allProducts.sort((a, b) => a.price - b.price);

    // Limit results
    const limitedProducts = allProducts.slice(0, 48);

    // Get categories from Rema (has good category data)
    let categories: { id: string; name: string; icon: string }[] = [];
    try {
      const remaDb = await getDb('rema1000');
      const remaCollection = remaDb.collection('products');
      const categoriesResult = await remaCollection.aggregate([
        { $match: { category_name: { $exists: true, $ne: null } } },
        { $group: { _id: '$category_name' } },
        { $sort: { _id: 1 } },
        { $limit: 12 }
      ]).toArray();

      categories = categoriesResult
        .map(c => c._id)
        .filter(Boolean)
        .map(name => ({
          id: name,
          name: name,
          icon: getCategoryIcon(name)
        }));
    } catch (e) {
      console.error('Error fetching categories:', e);
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
    console.error('Error loading products:', error);
    return {
      products: [],
      categories: [],
      total: 0,
      query,
      selectedCategory: category,
      selectedStore: '',
      error: 'Failed to load products',
      stores: STORES
    };
  }
};

function getCategoryIcon(name: string): string {
  const lowerName = name.toLowerCase();
  const icons: Record<string, string> = {
    'frugt': '🍎',
    'grønt': '🥬',
    'mejeri': '🥛',
    'mælk': '🥛',
    'brød': '🥖',
    'bagværk': '🥐',
    'kød': '🥩',
    'fjerkræ': '🍗',
    'fisk': '🐟',
    'skaldyr': '🦐',
    'frost': '❄️',
    'drikkevarer': '🥤',
    'drikke': '🥤',
    'øl': '🍺',
    'vin': '🍷',
    'kolonial': '🥫',
    'slik': '🍬',
    'snacks': '🍿',
    'chips': '🍟',
    'husholdning': '🧹',
    'rengøring': '🧼',
    'baby': '👶',
    'personlig': '🧴',
    'pleje': '💆',
    'dyrefoder': '🐕',
    'kæledyr': '🐾'
  };

  for (const [key, icon] of Object.entries(icons)) {
    if (lowerName.includes(key)) {
      return icon;
    }
  }
  return '📦';
}
