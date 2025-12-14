export interface Product {
  _id: string;
  name: string;
  description?: string;
  brand?: string;
  images: string[];
  categories: {
    lvl0?: string[];
    lvl1?: string[];
    lvl2?: string[];
    lvl3?: string[];
  };
  gtin?: string;
  article?: string;
  storeData?: Record<string, StorePrice>;
  price?: number;
  sales_price?: number;
  list_price?: number;
  image_primary?: string;
}

export interface StorePrice {
  price: number;
  inStock: boolean;
  offerDescription?: string;
  multiPromoPrice?: number;
  unitsOfMeasurePrice?: number;
  unitsOfMeasurePriceUnit?: string;
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
  logo: string;
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
