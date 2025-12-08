export type Store = {
  id: string;
  name: string;
  logo: string;
  color: string;
  bgColor: string;
};

export type PricePoint = {
  date: string;
  price: number;
  store: string;
};

export type StorePrice = {
  store: Store;
  currentPrice: number;
  previousPrice?: number;
  isOnSale: boolean;
  pricePerUnit?: string;
  inStock: boolean;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  unit: string;
  storePrices: StorePrice[];
  priceHistory: PricePoint[];
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  productCount: number;
};
