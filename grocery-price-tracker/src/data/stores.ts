import type { Store } from '../types';

export const stores: Store[] = [
  {
    id: 'netto',
    name: 'Netto',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Netto_logo.svg/200px-Netto_logo.svg.png',
    color: '#FFD700',
    bgColor: '#FFF9E6',
  },
  {
    id: 'rema1000',
    name: 'Rema 1000',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Rema_1000_logo.svg/200px-Rema_1000_logo.svg.png',
    color: '#BA0C2F', // Norwegian red
    bgColor: '#FEE2E2',
  },
  {
    id: 'bilka',
    name: 'Bilka',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bilka_logo.svg/200px-Bilka_logo.svg.png',
    color: '#00A0E3', // Light blue
    bgColor: '#E0F7FF',
  },
  {
    id: 'foetex',
    name: 'Fotex',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/F%C3%B8tex_logo.svg/200px-F%C3%B8tex_logo.svg.png',
    color: '#002855', // Dark navy blue
    bgColor: '#E8EEF4',
  },
];

export const getStoreById = (id: string): Store | undefined => {
  return stores.find(store => store.id === id);
};
