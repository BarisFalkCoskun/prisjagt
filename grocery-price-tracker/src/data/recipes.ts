export interface Recipe {
  id: string;
  name: string;
  image: string;
  time: string;
  difficulty: 'Let' | 'Medium' | 'Svær';
  servings: number;
  ingredients: string[];
}

// Map product IDs to relevant recipes
export const productRecipes: Record<string, Recipe[]> = {
  // Ground beef recipes
  'hakket-oksekod': [
    {
      id: 'bolognese',
      name: 'Spaghetti Bolognese',
      image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=400&h=300&fit=crop',
      time: '45 min',
      difficulty: 'Let',
      servings: 4,
      ingredients: ['Hakket oksekød', 'Løg', 'Hvidløg', 'Tomater', 'Pasta'],
    },
    {
      id: 'frikadeller',
      name: 'Hjemmelavede Frikadeller',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop',
      time: '30 min',
      difficulty: 'Let',
      servings: 4,
      ingredients: ['Hakket oksekød', 'Løg', 'Æg', 'Rasp', 'Mælk'],
    },
    {
      id: 'tacos',
      name: 'Mexicanske Tacos',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
      time: '25 min',
      difficulty: 'Let',
      servings: 4,
      ingredients: ['Hakket oksekød', 'Tacoskaller', 'Salat', 'Tomat', 'Ost'],
    },
    {
      id: 'lasagne',
      name: 'Klassisk Lasagne',
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop',
      time: '90 min',
      difficulty: 'Medium',
      servings: 6,
      ingredients: ['Hakket oksekød', 'Lasagneplader', 'Bechamel', 'Ost', 'Tomatsauce'],
    },
  ],
  // Milk recipes
  'letmaelk': [
    {
      id: 'pandekager',
      name: 'Luftige Pandekager',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
      time: '20 min',
      difficulty: 'Let',
      servings: 4,
      ingredients: ['Mælk', 'Mel', 'Æg', 'Sukker', 'Smør'],
    },
    {
      id: 'smoothie',
      name: 'Banan Smoothie',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
      time: '5 min',
      difficulty: 'Let',
      servings: 2,
      ingredients: ['Mælk', 'Banan', 'Honning', 'Vanilje'],
    },
  ],
  // Eggs recipes
  'aeg-fritgaaende': [
    {
      id: 'omelet',
      name: 'Fransk Omelet',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
      time: '10 min',
      difficulty: 'Medium',
      servings: 1,
      ingredients: ['Æg', 'Smør', 'Salt', 'Peber', 'Purløg'],
    },
    {
      id: 'aeggemad',
      name: 'Klassisk Æggemad',
      image: 'https://images.unsplash.com/photo-1482049016gy=format&fit=crop&w=400&h=300',
      time: '15 min',
      difficulty: 'Let',
      servings: 2,
      ingredients: ['Æg', 'Rugbrød', 'Mayonnaise', 'Purløg', 'Rejer'],
    },
  ],
  // Banana recipes
  'bananer': [
    {
      id: 'bananbroed',
      name: 'Bananbrød',
      image: 'https://images.unsplash.com/photo-1605090930287-1c6a0a4c2a0a?w=400&h=300&fit=crop',
      time: '60 min',
      difficulty: 'Let',
      servings: 8,
      ingredients: ['Bananer', 'Mel', 'Sukker', 'Æg', 'Smør'],
    },
    {
      id: 'banana-split',
      name: 'Banana Split',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      time: '10 min',
      difficulty: 'Let',
      servings: 2,
      ingredients: ['Bananer', 'Is', 'Chokoladesauce', 'Flødeskum', 'Nødder'],
    },
  ],
  // Apple recipes
  'aebler-royal-gala': [
    {
      id: 'aeblekage',
      name: 'Gammeldags Æblekage',
      image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a7?w=400&h=300&fit=crop',
      time: '45 min',
      difficulty: 'Let',
      servings: 6,
      ingredients: ['Æbler', 'Sukker', 'Rasp', 'Flødeskum', 'Kanel'],
    },
    {
      id: 'aebleskiver',
      name: 'Æbleskiver',
      image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400&h=300&fit=crop',
      time: '30 min',
      difficulty: 'Medium',
      servings: 4,
      ingredients: ['Æbler', 'Mel', 'Æg', 'Mælk', 'Kardemomme'],
    },
  ],
  // Butter recipes
  'smor-lurpak': [
    {
      id: 'croissant',
      name: 'Hjemmebagte Croissanter',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop',
      time: '180 min',
      difficulty: 'Svær',
      servings: 8,
      ingredients: ['Smør', 'Mel', 'Gær', 'Mælk', 'Sukker'],
    },
    {
      id: 'shortbread',
      name: 'Skotsk Shortbread',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
      time: '40 min',
      difficulty: 'Let',
      servings: 12,
      ingredients: ['Smør', 'Sukker', 'Mel', 'Salt'],
    },
  ],
  // Cherry tomatoes
  'tomat-cherry': [
    {
      id: 'bruschetta',
      name: 'Italiensk Bruschetta',
      image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop',
      time: '15 min',
      difficulty: 'Let',
      servings: 4,
      ingredients: ['Cherry tomater', 'Brød', 'Hvidløg', 'Basilikum', 'Olivenolie'],
    },
    {
      id: 'caprese',
      name: 'Caprese Salat',
      image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=300&fit=crop',
      time: '10 min',
      difficulty: 'Let',
      servings: 2,
      ingredients: ['Cherry tomater', 'Mozzarella', 'Basilikum', 'Olivenolie', 'Balsamico'],
    },
  ],
  // Avocado
  'avocado': [
    {
      id: 'guacamole',
      name: 'Hjemmelavet Guacamole',
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop',
      time: '10 min',
      difficulty: 'Let',
      servings: 4,
      ingredients: ['Avocado', 'Lime', 'Løg', 'Tomat', 'Koriander'],
    },
    {
      id: 'avocado-toast',
      name: 'Avocado Toast',
      image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
      time: '10 min',
      difficulty: 'Let',
      servings: 2,
      ingredients: ['Avocado', 'Surdejsbrød', 'Æg', 'Chiliflager', 'Salt'],
    },
  ],
};

// Generic recipes for products without specific recipes
export const genericRecipes: Recipe[] = [
  {
    id: 'inspiration-1',
    name: 'Få inspiration',
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop',
    time: '30 min',
    difficulty: 'Let',
    servings: 4,
    ingredients: [],
  },
];

export function getRecipesForProduct(productId: string): Recipe[] {
  return productRecipes[productId] || [];
}
