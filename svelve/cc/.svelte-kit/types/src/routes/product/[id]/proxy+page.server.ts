// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getDb, CHAINS, getAllImageUrls, extractChainPrices, type Chain } from '$lib/db';
import { ObjectId } from 'mongodb';
import type { PriceHistory } from '$lib/types';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
  const { id } = params;

  try {
    const db = await getDb();
    const productsCol = db.collection('final-products-dk');
    const priceHistoryCol = db.collection('final-priceHistory-dk');

    // Find product by ObjectId
    let product: any = null;
    if (ObjectId.isValid(id)) {
      product = await productsCol.findOne({ _id: new ObjectId(id) });
    }

    if (!product) {
      return { product: null, prices: [], priceHistory: [] };
    }

    // Extract all chain prices
    const chainPrices = extractChainPrices(product);
    const images = getAllImageUrls(product);

    // Build prices array for the frontend
    const prices = chainPrices.map((cp, i) => ({
      store: cp.chain,
      price: cp.price,
      originalPrice: cp.isOnDiscount && cp.discountSaved
        ? cp.price + cp.discountSaved
        : undefined,
      inStock: true,
      isLowest: i === 0,
      link: cp.link,
      pricePerUnit: cp.pricePerUnit,
      unit: cp.unit,
    }));

    // Fetch real price history using barcodes
    let priceHistory: PriceHistory[] = [];
    if (product.barcodes && product.barcodes.length > 0) {
      const historyDoc = await priceHistoryCol.findOne({
        barcodes: { $in: product.barcodes },
      });

      if (historyDoc && historyDoc.prices) {
        // Convert the prices object { "2023-08-06": { "rema1000": 15 }, ... } to array
        const entries = Object.entries(historyDoc.prices) as [string, Record<string, number>][];
        // Sort by date
        entries.sort(([a], [b]) => a.localeCompare(b));

        for (const [dateStr, chainPricesObj] of entries) {
          for (const [chainId, price] of Object.entries(chainPricesObj)) {
            const chain = CHAINS.find(c => c.id === chainId);
            priceHistory.push({
              date: formatDate(dateStr),
              price,
              store: chain?.name || chainId,
            });
          }
        }
      }
    }

    // If no real price history, keep it empty rather than generating mock data
    const lowestPrice = chainPrices[0]?.price || product.lowestPrice || 0;
    const highestPrice = chainPrices.length > 0
      ? chainPrices[chainPrices.length - 1].price
      : lowestPrice;

    const sourceChain: Chain = chainPrices[0]?.chain || CHAINS[0];

    const transformedProduct = {
      _id: product._id.toString(),
      name: product.name || '',
      description: product.descriptions?.[0],
      brand: product.brand,
      images,
      categories: { level1: product.categoryPath?.[0] },
      categoryPath: product.categoryPath,
      gtin: product.barcodes?.[0],
      units: product.units,
      unitsOfMeasure: product.unitsOfMeasure,
      price: lowestPrice,
    };

    return {
      product: transformedProduct,
      prices,
      priceHistory,
      lowestPrice,
      highestPrice,
      sourceStore: sourceChain,
    };
  } catch (error) {
    console.error('Error loading product:', error);
    return { product: null, prices: [], priceHistory: [], error: 'Failed to load product' };
  }
};

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('da-DK', { day: '2-digit', month: 'short' });
  } catch {
    return dateStr;
  }
}
