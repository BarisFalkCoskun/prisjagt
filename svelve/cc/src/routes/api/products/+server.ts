import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb, STORES, normalizeProduct } from '$lib/db';

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('q') || '';
  const category = url.searchParams.get('category') || '';
  const storeId = url.searchParams.get('store') || 'rema1000';
  const limit = parseInt(url.searchParams.get('limit') || '24');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  try {
    // Find the store config
    const storeConfig = STORES.find(s => s.id === storeId) || STORES[4]; // Default to rema1000

    const db = await getDb(storeConfig.id);
    const collection = db.collection('products');

    // Build filter based on store schema
    const filter: Record<string, unknown> = {};

    if (query) {
      if (storeConfig.schema === 'dagrofa') {
        filter.$or = [
          { productDisplayName: { $regex: query, $options: 'i' } },
          { summary: { $regex: query, $options: 'i' } }
        ];
      } else {
        filter.$or = [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { brand: { $regex: query, $options: 'i' } }
        ];
      }
    }

    if (category) {
      if (storeConfig.schema === 'rema') {
        filter.category_name = { $regex: category, $options: 'i' };
      } else if (storeConfig.schema === 'dagrofa') {
        // Dagrofa doesn't have text categories
      } else {
        filter['categories.lvl0'] = { $regex: category, $options: 'i' };
      }
    }

    // Ensure we have valid prices
    if (storeConfig.schema === 'rema') {
      filter['pricing.price'] = { $gt: 0 };
    } else if (storeConfig.schema === 'dagrofa') {
      filter.price = { $gt: 0 };
    }

    const [products, total] = await Promise.all([
      collection.find(filter).skip(offset).limit(limit).toArray(),
      collection.countDocuments(filter)
    ]);

    // Normalize products
    const transformedProducts = products.map(product => {
      const normalized = normalizeProduct(product, storeConfig.id, storeConfig.schema);
      return {
        _id: normalized._id,
        name: normalized.name,
        description: normalized.description,
        brand: normalized.brand,
        images: normalized.images,
        categories: { level1: normalized.category },
        gtin: normalized.gtin,
        article: normalized.sku,
        price: normalized.price,
        originalPrice: normalized.originalPrice,
        storeId: normalized.storeId
      };
    });

    return json({
      products: transformedProducts,
      total,
      hasMore: offset + products.length < total,
      store: storeConfig
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return json({ products: [], total: 0, hasMore: false, error: 'Failed to fetch products' }, { status: 500 });
  }
};
