export interface Product {
  _id: string;
  name: string;
  description?: string;
  brand?: string;
  images: string[];
  categories: {
    level1?: string;
  };
  categoryPath?: string[];
  gtin?: string;
  units?: number;
  unitsOfMeasure?: string;
  price?: number;
}

export interface StorePrice {
  price: number;
  inStock: boolean;
  offerDescription?: string;
}

export interface PriceHistory {
  date: string;
  price: number;
  store: string;
}

export interface Store {
  id: string;
  name: string;
  color: string;
}

export interface ProductWithPrices extends Product {
  prices: {
    store: Store;
    price: number;
    originalPrice?: number;
    inStock: boolean;
    isLowest: boolean;
  }[];
  lowestPrice: number;
  highestPrice: number;
  priceHistory: PriceHistory[];
}
