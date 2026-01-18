import type { Product, Category } from '../types';
import { stores } from './stores';

// Helper to generate price history
const generatePriceHistory = (
  basePrice: number,
  days: number = 90,
  volatility: number = 0.15
) => {
  const history: { date: string; price: number; store: string }[] = [];
  const today = new Date();

  stores.forEach(store => {
    let price = basePrice * (0.9 + Math.random() * 0.2);

    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Random price fluctuation
      const change = (Math.random() - 0.5) * volatility * price;
      price = Math.max(price + change, basePrice * 0.7);
      price = Math.min(price, basePrice * 1.3);

      // Occasional sale
      const isOnSale = Math.random() < 0.1;
      const finalPrice = isOnSale ? price * 0.8 : price;

      history.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(finalPrice * 100) / 100,
        store: store.id,
      });
    }
  });

  return history;
};

// Generate store prices
const generateStorePrices = (basePrice: number) => {
  return stores.map(store => {
    const variance = (Math.random() - 0.5) * 0.3;
    const currentPrice = Math.round((basePrice * (1 + variance)) * 100) / 100;
    const previousPrice = Math.round((currentPrice * (1 + Math.random() * 0.2)) * 100) / 100;
    const isOnSale = Math.random() < 0.3;

    return {
      store,
      currentPrice: isOnSale ? Math.round(currentPrice * 0.85 * 100) / 100 : currentPrice,
      previousPrice: isOnSale ? currentPrice : undefined,
      isOnSale,
      pricePerUnit: `${(currentPrice / 1).toFixed(2)} kr/stk`,
      inStock: Math.random() > 0.1,
    };
  });
};

export const categories: Category[] = [
  { id: 'fruits', name: 'Frugt & Gront', icon: '🍎', productCount: 156 },
  { id: 'dairy', name: 'Mejeri', icon: '🥛', productCount: 89 },
  { id: 'meat', name: 'Kod', icon: '🥩', productCount: 124 },
  { id: 'bread', name: 'Brod', icon: '🍞', productCount: 67 },
  { id: 'drinks', name: 'Drikkevarer', icon: '🥤', productCount: 203 },
  { id: 'frozen', name: 'Frost', icon: '🧊', productCount: 145 },
  { id: 'snacks', name: 'Snacks', icon: '🍿', productCount: 178 },
  { id: 'household', name: 'Husholdning', icon: '🧹', productCount: 92 },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Bananer',
    description: 'Friske bananer fra Colombia, Klasse 1. Perfekt modne og klar til at spise.',
    image: 'https://digitalassets.sallinggroup.com/image/upload/e_trim:2/b_white,c_pad,e_sharpen:80,f_auto,q_auto,w_690,h_690/6250dd9f-e862-446f-b17c-4517f66f5d9c',
    category: 'Frugt & Gront',
    unit: 'stk',
    storePrices: generateStorePrices(2.5),
    priceHistory: generatePriceHistory(2.5),
    lowestPrice: 1.95,
    highestPrice: 3.50,
    averagePrice: 2.45,
  },
  {
    id: '2',
    name: 'Aebler Royal Gala',
    description: 'Danske Royal Gala aebler. Sode og sprode med en let syrlig smag.',
    image: 'https://digitalassets.sallinggroup.com/image/upload/e_trim:2/b_white,c_pad,e_sharpen:80,f_auto,q_auto,w_690,h_690/f97c8b3d-c7c4-4e63-9e2a-a1b2c3d4e5f6',
    category: 'Frugt & Gront',
    unit: 'kg',
    storePrices: generateStorePrices(15.95),
    priceHistory: generatePriceHistory(15.95),
    lowestPrice: 12.95,
    highestPrice: 19.95,
    averagePrice: 15.50,
  },
  {
    id: '3',
    name: 'Letmaelk 1.5%',
    description: 'Dansk letmaelk med 1.5% fedt. Frisk og cremet smag.',
    image: 'https://digitalassets.sallinggroup.com/image/upload/e_trim:2/b_white,c_pad,e_sharpen:80,f_auto,q_auto,w_690,h_690/a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    category: 'Mejeri',
    unit: 'liter',
    storePrices: generateStorePrices(12.50),
    priceHistory: generatePriceHistory(12.50),
    lowestPrice: 9.95,
    highestPrice: 14.95,
    averagePrice: 12.25,
  },
  {
    id: '4',
    name: 'Hakket Oksekod 8-12%',
    description: 'Dansk hakket oksekod med 8-12% fedt. Perfekt til bolognese eller frikadeller.',
    image: 'https://digitalassets.sallinggroup.com/image/upload/e_trim:2/b_white,c_pad,e_sharpen:80,f_auto,q_auto,w_690,h_690/b2c3d4e5-f678-90ab-cdef-123456789012',
    category: 'Kod',
    unit: '500g',
    storePrices: generateStorePrices(45.00),
    priceHistory: generatePriceHistory(45.00),
    lowestPrice: 35.00,
    highestPrice: 55.00,
    averagePrice: 44.50,
  },
  {
    id: '5',
    name: 'Rugbrod',
    description: 'Traditionelt dansk rugbrod. Bagt med surdej og fulde kerner.',
    image: 'https://digitalassets.sallinggroup.com/image/upload/e_trim:2/b_white,c_pad,e_sharpen:80,f_auto,q_auto,w_690,h_690/c3d4e5f6-7890-abcd-ef12-345678901234',
    category: 'Brod',
    unit: 'stk',
    storePrices: generateStorePrices(22.00),
    priceHistory: generatePriceHistory(22.00),
    lowestPrice: 18.00,
    highestPrice: 28.00,
    averagePrice: 22.50,
  },
  {
    id: '6',
    name: 'Coca-Cola Original',
    description: 'Den klassiske Coca-Cola smag. Iskold er bedst!',
    image: 'https://digitalassets.sallinggroup.com/image/upload/e_trim:2/b_white,c_pad,e_sharpen:80,f_auto,q_auto,w_690,h_690/d4e5f678-90ab-cdef-1234-567890123456',
    category: 'Drikkevarer',
    unit: '1.5L',
    storePrices: generateStorePrices(18.95),
    priceHistory: generatePriceHistory(18.95),
    lowestPrice: 12.00,
    highestPrice: 24.95,
    averagePrice: 18.00,
  },
  {
    id: '7',
    name: 'Aeg Fritgaende Hons',
    description: '10 stk okoaeg fra fritgaende hons. Storrelse M/L.',
    image: 'https://digitalassets.sallinggroup.com/image/upload/e_trim:2/b_white,c_pad,e_sharpen:80,f_auto,q_auto,w_690,h_690/e5f67890-abcd-ef12-3456-789012345678',
    category: 'Mejeri',
    unit: '10 stk',
    storePrices: generateStorePrices(32.95),
    priceHistory: generatePriceHistory(32.95),
    lowestPrice: 27.95,
    highestPrice: 39.95,
    averagePrice: 33.00,
  },
  {
    id: '8',
    name: 'Smorrebrodspalaeg Leverpostej',
    description: 'Klassisk dansk leverpostej. Perfekt til rugbrod.',
    image: 'https://digitalassets.sallinggroup.com/image/upload/e_trim:2/b_white,c_pad,e_sharpen:80,f_auto,q_auto,w_690,h_690/f6789012-3456-7890-abcd-ef1234567890',
    category: 'Kod',
    unit: '200g',
    storePrices: generateStorePrices(15.95),
    priceHistory: generatePriceHistory(15.95),
    lowestPrice: 12.95,
    highestPrice: 19.95,
    averagePrice: 16.00,
  },
  {
    id: '9',
    name: 'Smiley Chips Original',
    description: 'Sprode kartoffelchips med salt. Den klassiske snack.',
    image: 'https://digitalassets.sallinggroup.com/image/upload/e_trim:2/b_white,c_pad,e_sharpen:80,f_auto,q_auto,w_690,h_690/g7890123-4567-8901-abcd-ef2345678901',
    category: 'Snacks',
    unit: '175g',
    storePrices: generateStorePrices(24.95),
    priceHistory: generatePriceHistory(24.95),
    lowestPrice: 15.00,
    highestPrice: 29.95,
    averagePrice: 22.00,
  },
  {
    id: '10',
    name: 'Avocado',
    description: 'Klar til at spise avocado. Cremet og laekkert.',
    image: 'https://digitalassets.sallinggroup.com/image/upload/e_trim:2/b_white,c_pad,e_sharpen:80,f_auto,q_auto,w_690,h_690/h8901234-5678-9012-abcd-ef3456789012',
    category: 'Frugt & Gront',
    unit: 'stk',
    storePrices: generateStorePrices(10.00),
    priceHistory: generatePriceHistory(10.00, 90, 0.25),
    lowestPrice: 6.00,
    highestPrice: 15.00,
    averagePrice: 10.50,
  },
  {
    id: '11',
    name: 'Tomat Cherry',
    description: 'Sode cherry tomater. Perfekt til salat eller snack.',
    image: 'https://digitalassets.sallinggroup.com/image/upload/e_trim:2/b_white,c_pad,e_sharpen:80,f_auto,q_auto,w_690,h_690/i9012345-6789-0123-abcd-ef4567890123',
    category: 'Frugt & Gront',
    unit: '250g',
    storePrices: generateStorePrices(18.00),
    priceHistory: generatePriceHistory(18.00),
    lowestPrice: 12.00,
    highestPrice: 25.00,
    averagePrice: 17.50,
  },
  {
    id: '12',
    name: 'Smor Lurpak',
    description: 'Dansk smor fra Lurpak. Lidt saltet.',
    image: 'https://digitalassets.sallinggroup.com/image/upload/e_trim:2/b_white,c_pad,e_sharpen:80,f_auto,q_auto,w_690,h_690/j0123456-7890-1234-abcd-ef5678901234',
    category: 'Mejeri',
    unit: '250g',
    storePrices: generateStorePrices(28.00),
    priceHistory: generatePriceHistory(28.00),
    lowestPrice: 22.00,
    highestPrice: 35.00,
    averagePrice: 27.50,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
  );
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};
