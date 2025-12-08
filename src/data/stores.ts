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
    color: '#E31937',
    bgColor: '#FEE2E2',
  },
  {
    id: 'bilka',
    name: 'Bilka',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bilka_logo.svg/200px-Bilka_logo.svg.png',
    color: '#0066B3',
    bgColor: '#E0F2FE',
  },
  {
    id: 'foetex',
    name: 'Fotex',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/F%C3%B8tex_logo.svg/200px-F%C3%B8tex_logo.svg.png',
    color: '#E31937',
    bgColor: '#FCE7F3',
  },
];

export const getStoreById = (id: string): Store | undefined => {
  return stores.find(store => store.id === id);
};
