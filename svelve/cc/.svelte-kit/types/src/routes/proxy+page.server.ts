// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDb, CHAINS, getImageUrl, extractChainPrices } from '$lib/db';

interface ProductWithStore {
  _id: string;
  name: string;
  description?: string;
  brand?: string;
  images: string[];
  image_primary: string | null;
  category?: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  storeId: string;
  storeName: string;
  storeColor: string;
}

export const load = async ({ url }: Parameters<PageServerLoad>[0]) => {
  const query = url.searchParams.get('q') || '';
  const category = url.searchParams.get('category') || '';
  const selectedStore = url.searchParams.get('store') || '';

  try {
    const db = await getDb();
    const collection = db.collection('final-products-dk');

    // Build filter
    const filter: Record<string, unknown> = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
      ];
    }

    if (category) {
      filter.categoryPath = { $regex: category, $options: 'i' };
    }

    if (selectedStore) {
      // Only show products that have pricing from this chain
      filter[`pricing.${selectedStore}.price`] = { $gt: 0 };
    }

    // Require at least a lowestPrice > 0
    filter.lowestPrice = { $gt: 0 };

    const products = await collection.find(filter).limit(48).toArray();

    // Transform to the shape the frontend expects
    const allProducts: ProductWithStore[] = [];

    for (const product of products) {
      const prices = extractChainPrices(product);
      if (prices.length === 0) continue;

      // If filtering by store, use that store's price; otherwise use the lowest
      let displayPrice: typeof prices[0];
      if (selectedStore) {
        displayPrice = prices.find(p => p.chain.id === selectedStore) || prices[0];
      } else {
        displayPrice = prices[0]; // Already sorted lowest first
      }

      const imageUrl = getImageUrl(product);

      allProducts.push({
        _id: product._id.toString(),
        name: product.name || '',
        description: product.descriptions?.[0],
        brand: product.brand,
        images: imageUrl ? [imageUrl] : [],
        image_primary: imageUrl,
        category: product.categoryPath?.[0],
        price: displayPrice.price,
        originalPrice: displayPrice.isOnDiscount && displayPrice.discountSaved
          ? displayPrice.price + displayPrice.discountSaved
          : undefined,
        inStock: true,
        storeId: displayPrice.chain.id,
        storeName: displayPrice.chain.name,
        storeColor: displayPrice.chain.color,
      });
    }

    // Sort by price (lowest first)
    allProducts.sort((a, b) => a.price - b.price);

    // Get categories from categoryPath
    let categories: { id: string; name: string; icon: string }[] = [];
    try {
      const categoriesResult = await collection.aggregate([
        { $match: { 'categoryPath.0': { $exists: true } } },
        { $group: { _id: { $arrayElemAt: ['$categoryPath', 0] } } },
        { $sort: { _id: 1 } },
        { $limit: 15 },
      ]).toArray();

      categories = categoriesResult
        .map(c => c._id)
        .filter(Boolean)
        .map(name => ({
          id: name,
          name,
          icon: getCategoryIcon(name),
        }));
    } catch (e) {
      console.error('Error fetching categories:', e);
    }

    return {
      products: allProducts,
      categories,
      total: allProducts.length,
      query,
      selectedCategory: category,
      selectedStore,
      stores: CHAINS,
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
      stores: CHAINS,
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
    'kæledyr': '🐾',
    'mexikansk': '🌮',
    'pasta': '🍝',
    'ris': '🍚',
    'kaffe': '☕',
    'te': '🍵',
  };

  for (const [key, icon] of Object.entries(icons)) {
    if (lowerName.includes(key)) {
      return icon;
    }
  }
  return '📦';
}
