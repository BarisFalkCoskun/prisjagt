export interface RecipeIngredient {
  productId?: string; // Links to our product database
  name: string;
  amount: number;
  unit: string;
  optional?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: 'nem' | 'mellem' | 'svaer';
  category: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  tags: string[];
  calories?: number;
  protein?: number;
}

export const recipeCategories = [
  { id: 'morgenmad', name: 'Morgenmad', icon: '🍳' },
  { id: 'frokost', name: 'Frokost', icon: '🥪' },
  { id: 'aftensmad', name: 'Aftensmad', icon: '🍝' },
  { id: 'dessert', name: 'Dessert', icon: '🍰' },
  { id: 'snacks', name: 'Snacks', icon: '🥨' },
  { id: 'drinks', name: 'Drikkevarer', icon: '🥤' },
];

export const recipes: Recipe[] = [
  {
    id: 'r1',
    name: 'Klassisk Dansk Morgenmad',
    description: 'Start dagen med et sundt og mættende måltid med rugbrød, æg og frisk frugt.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
    prepTime: 10,
    cookTime: 5,
    servings: 2,
    difficulty: 'nem',
    category: 'morgenmad',
    ingredients: [
      { productId: '5', name: 'Rugbrød', amount: 4, unit: 'skiver' },
      { productId: '7', name: 'Æg', amount: 2, unit: 'stk' },
      { productId: '12', name: 'Smør', amount: 20, unit: 'g' },
      { productId: '1', name: 'Banan', amount: 1, unit: 'stk' },
    ],
    instructions: [
      'Kog æggene i 6-7 minutter til blødkogte.',
      'Rist rugbrødet let og smør med smør.',
      'Skræl og skær bananen i skiver.',
      'Server det hele sammen med en kop kaffe eller te.',
    ],
    tags: ['hurtig', 'sund', 'dansk'],
    calories: 450,
    protein: 18,
  },
  {
    id: 'r2',
    name: 'Avocado Toast Deluxe',
    description: 'Moderne klassiker med cremet avocado, cherrytomater og et perfekt pocheret æg.',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&auto=format&fit=crop&q=80',
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    difficulty: 'nem',
    category: 'morgenmad',
    ingredients: [
      { productId: '10', name: 'Avocado', amount: 1, unit: 'stk' },
      { productId: '11', name: 'Cherrytomater', amount: 100, unit: 'g' },
      { productId: '7', name: 'Æg', amount: 1, unit: 'stk' },
      { name: 'Brød', amount: 2, unit: 'skiver' },
      { name: 'Salt og peber', amount: 1, unit: 'knivspids' },
      { name: 'Citron', amount: 0.5, unit: 'stk', optional: true },
    ],
    instructions: [
      'Rist brødet til det er gyldent og sprødt.',
      'Mos avocadoen med en gaffel og tilsæt salt, peber og citronsaft.',
      'Pochér ægget i kogende vand med en smule eddike i 3-4 minutter.',
      'Fordel avocadomosen på brødet, top med halverede cherrytomater og det pocherede æg.',
      'Drys med salt og peber efter smag.',
    ],
    tags: ['trendy', 'vegetarisk', 'protein'],
    calories: 380,
    protein: 14,
  },
  {
    id: 'r3',
    name: 'Spaghetti Bolognese',
    description: 'Den ultimative comfort food - hjemmelavet bolognese med hakket oksekød.',
    image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=800&auto=format&fit=crop&q=80',
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    difficulty: 'nem',
    category: 'aftensmad',
    ingredients: [
      { productId: '4', name: 'Hakket oksekød', amount: 500, unit: 'g' },
      { productId: '11', name: 'Tomater', amount: 400, unit: 'g' },
      { name: 'Spaghetti', amount: 400, unit: 'g' },
      { name: 'Løg', amount: 1, unit: 'stk' },
      { name: 'Hvidløg', amount: 2, unit: 'fed' },
      { name: 'Olivenolie', amount: 2, unit: 'spsk' },
      { name: 'Oregano', amount: 1, unit: 'tsk' },
      { name: 'Salt og peber', amount: 1, unit: 'knivspids' },
    ],
    instructions: [
      'Hak løg og hvidløg fint. Svits i olivenolie i en stor gryde.',
      'Tilsæt hakket oksekød og brun det godt.',
      'Tilsæt tomaterne, oregano, salt og peber.',
      'Lad simre i 30-40 minutter under låg.',
      'Kog spaghetti efter anvisningen på pakken.',
      'Server kødsovsen over pastaen med revet parmesan.',
    ],
    tags: ['klassiker', 'familie', 'kød'],
    calories: 620,
    protein: 35,
  },
  {
    id: 'r4',
    name: 'Smørrebrød med Leverpostej',
    description: 'Ægte dansk frokost - rugbrød med hjemmelavet leverpostej og alle garniturer.',
    image: 'https://images.unsplash.com/photo-1607013407627-6ee814329547?w=800&auto=format&fit=crop&q=80',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    difficulty: 'nem',
    category: 'frokost',
    ingredients: [
      { productId: '5', name: 'Rugbrød', amount: 4, unit: 'skiver' },
      { productId: '8', name: 'Leverpostej', amount: 150, unit: 'g' },
      { name: 'Agurk', amount: 0.5, unit: 'stk' },
      { name: 'Rødbeder', amount: 2, unit: 'skiver' },
      { name: 'Sprød bacon', amount: 4, unit: 'skiver', optional: true },
      { name: 'Ristede løg', amount: 2, unit: 'spsk' },
    ],
    instructions: [
      'Smør et tykt lag leverpostej på rugbrødet.',
      'Skær agurken i tynde skiver og læg på toppen.',
      'Tilsæt rødbedeskiver og bacon hvis ønsket.',
      'Top med ristede løg og server straks.',
    ],
    tags: ['dansk', 'tradition', 'frokost'],
    calories: 480,
    protein: 22,
  },
  {
    id: 'r5',
    name: 'Banan Smoothie Bowl',
    description: 'Frisk og energigivende smoothie bowl med frosne bananer og toppings.',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=80',
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    difficulty: 'nem',
    category: 'morgenmad',
    ingredients: [
      { productId: '1', name: 'Bananer (frosne)', amount: 2, unit: 'stk' },
      { productId: '3', name: 'Mælk', amount: 100, unit: 'ml' },
      { name: 'Havregryn', amount: 30, unit: 'g' },
      { name: 'Honning', amount: 1, unit: 'spsk' },
      { name: 'Blåbær', amount: 50, unit: 'g', optional: true },
      { name: 'Chiafrø', amount: 1, unit: 'spsk', optional: true },
    ],
    instructions: [
      'Blend frosne bananer og mælk til en tyk, cremet konsistens.',
      'Hæld i en skål og top med havregryn, honning og blåbær.',
      'Drys med chiafrø og server straks.',
    ],
    tags: ['sund', 'vegansk-option', 'hurtig'],
    calories: 320,
    protein: 8,
  },
  {
    id: 'r6',
    name: 'Æggekage med Bacon',
    description: 'Klassisk dansk æggekage - blød, cremet og med sprødt bacon.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: 'nem',
    category: 'frokost',
    ingredients: [
      { productId: '7', name: 'Æg', amount: 6, unit: 'stk' },
      { productId: '3', name: 'Mælk', amount: 50, unit: 'ml' },
      { productId: '12', name: 'Smør', amount: 30, unit: 'g' },
      { name: 'Bacon', amount: 150, unit: 'g' },
      { name: 'Purløg', amount: 2, unit: 'spsk' },
      { name: 'Salt og peber', amount: 1, unit: 'knivspids' },
    ],
    instructions: [
      'Steg bacon sprødt i en pande og sæt til side.',
      'Pisk æg og mælk sammen med salt og peber.',
      'Smelt smør i panden og hæld æggemassen i.',
      'Rør forsigtigt med en spatel indtil æggene er cremede men stadig bløde.',
      'Top med sprødt bacon og hakket purløg.',
    ],
    tags: ['dansk', 'brunch', 'protein'],
    calories: 520,
    protein: 32,
  },
  {
    id: 'r7',
    name: 'Frisk Frugtsalat',
    description: 'Farverig og vitaminrig frugtsalat med sæsonens bedste frugter.',
    image: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=800&auto=format&fit=crop&q=80',
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: 'nem',
    category: 'dessert',
    ingredients: [
      { productId: '1', name: 'Bananer', amount: 2, unit: 'stk' },
      { productId: '2', name: 'Æbler', amount: 2, unit: 'stk' },
      { name: 'Appelsiner', amount: 2, unit: 'stk' },
      { name: 'Vindruer', amount: 200, unit: 'g' },
      { name: 'Kiwi', amount: 2, unit: 'stk' },
      { name: 'Honning', amount: 2, unit: 'spsk', optional: true },
      { name: 'Mynte', amount: 5, unit: 'blade', optional: true },
    ],
    instructions: [
      'Skræl og skær alle frugterne i mundrette stykker.',
      'Bland forsigtigt i en stor skål.',
      'Drys med honning og pynt med friske mynteblade.',
      'Kan serveres straks eller køles ned først.',
    ],
    tags: ['sund', 'vegansk', 'let'],
    calories: 180,
    protein: 2,
  },
  {
    id: 'r8',
    name: 'Hjemmelavet Pizza',
    description: 'Lav din egen lækre pizza med friske toppings og smeltet ost.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80',
    prepTime: 30,
    cookTime: 15,
    servings: 4,
    difficulty: 'mellem',
    category: 'aftensmad',
    ingredients: [
      { productId: '4', name: 'Hakket oksekød', amount: 200, unit: 'g' },
      { productId: '11', name: 'Cherrytomater', amount: 150, unit: 'g' },
      { name: 'Pizzadej', amount: 500, unit: 'g' },
      { name: 'Tomatsauce', amount: 200, unit: 'ml' },
      { name: 'Mozzarella', amount: 200, unit: 'g' },
      { name: 'Oregano', amount: 1, unit: 'tsk' },
      { name: 'Olivenolie', amount: 2, unit: 'spsk' },
    ],
    instructions: [
      'Forvarm ovnen til 250°C.',
      'Rul pizzadejen ud på et bagepapir.',
      'Fordel tomatsauce jævnt over dejen.',
      'Steg hakket kød og fordel på pizzaen.',
      'Top med revet mozzarella og halverede cherrytomater.',
      'Bag i 12-15 minutter til osten er gylden og bobler.',
      'Drys med oregano og et stænk olivenolie.',
    ],
    tags: ['familie', 'weekend', 'italiensk'],
    calories: 680,
    protein: 28,
  },
  {
    id: 'r9',
    name: 'Chips & Dip Platte',
    description: 'Perfekt til filmaften eller når gæsterne kommer - sprøde chips med hjemmelavet dip.',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&auto=format&fit=crop&q=80',
    prepTime: 10,
    cookTime: 0,
    servings: 4,
    difficulty: 'nem',
    category: 'snacks',
    ingredients: [
      { productId: '9', name: 'Chips', amount: 1, unit: 'pose' },
      { productId: '10', name: 'Avocado', amount: 2, unit: 'stk' },
      { productId: '11', name: 'Cherrytomater', amount: 100, unit: 'g' },
      { name: 'Creme fraiche', amount: 200, unit: 'ml' },
      { name: 'Hvidløg', amount: 1, unit: 'fed' },
      { name: 'Lime', amount: 1, unit: 'stk' },
    ],
    instructions: [
      'Lav guacamole: Mos avocado med limesaft, salt og hakket hvidløg.',
      'Lav hvidløgsdip: Bland creme fraiche med presset hvidløg og salt.',
      'Halver cherrytomaterne og arranger på en platte.',
      'Server chips med de forskellige dips.',
    ],
    tags: ['fest', 'snack', 'hurtig'],
    calories: 420,
    protein: 6,
  },
  {
    id: 'r10',
    name: 'Iskold Cola Float',
    description: 'Retro-klassiker med vaniljeis og iskold cola - perfekt på en varm dag.',
    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=800&auto=format&fit=crop&q=80',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: 'nem',
    category: 'drinks',
    ingredients: [
      { productId: '6', name: 'Coca-Cola', amount: 300, unit: 'ml' },
      { name: 'Vaniljeis', amount: 2, unit: 'kugler' },
      { name: 'Flødeskum', amount: 2, unit: 'spsk', optional: true },
      { name: 'Kirsebær', amount: 1, unit: 'stk', optional: true },
    ],
    instructions: [
      'Placer vaniljeiskugler i et højt glas.',
      'Hæld forsigtigt iskold cola over isen.',
      'Top med flødeskum og et kirsebær.',
      'Server straks med et sugerør og en ske.',
    ],
    tags: ['sommer', 'dessert', 'retro'],
    calories: 380,
    protein: 4,
  },
  {
    id: 'r11',
    name: 'Frikadeller med Kartofler',
    description: 'Ægte danske frikadeller serveret med kogte kartofler og brun sovs.',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop&q=80',
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: 'mellem',
    category: 'aftensmad',
    ingredients: [
      { productId: '4', name: 'Hakket oksekød', amount: 400, unit: 'g' },
      { productId: '7', name: 'Æg', amount: 1, unit: 'stk' },
      { productId: '3', name: 'Mælk', amount: 100, unit: 'ml' },
      { name: 'Løg', amount: 1, unit: 'stk' },
      { name: 'Rasp', amount: 50, unit: 'g' },
      { name: 'Kartofler', amount: 800, unit: 'g' },
      { productId: '12', name: 'Smør', amount: 50, unit: 'g' },
      { name: 'Salt og peber', amount: 1, unit: 'knivspids' },
    ],
    instructions: [
      'Bland hakket kød, revet løg, æg, mælk og rasp. Krydr med salt og peber.',
      'Lad farsen hvile i 15 minutter i køleskabet.',
      'Form frikadeller med våde hænder.',
      'Steg i smør på medium varme, 5-6 min på hver side.',
      'Kog kartofler i saltet vand til de er møre.',
      'Server frikadeller med kartofler og eventuelt brun sovs.',
    ],
    tags: ['dansk', 'klassiker', 'comfort'],
    calories: 580,
    protein: 32,
  },
  {
    id: 'r12',
    name: 'Pandekager med Sukker',
    description: 'Tynde, sprøde pandekager drysset med sukker og serveret med syltetøj.',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'nem',
    category: 'dessert',
    ingredients: [
      { productId: '7', name: 'Æg', amount: 3, unit: 'stk' },
      { productId: '3', name: 'Mælk', amount: 500, unit: 'ml' },
      { productId: '12', name: 'Smør', amount: 50, unit: 'g' },
      { name: 'Mel', amount: 250, unit: 'g' },
      { name: 'Sukker', amount: 2, unit: 'spsk' },
      { name: 'Syltetøj', amount: 4, unit: 'spsk' },
      { name: 'Vaniljesukker', amount: 1, unit: 'tsk' },
    ],
    instructions: [
      'Pisk æg, mælk og smeltet smør sammen.',
      'Tilsæt mel og sukker og pisk til en glat dej uden klumper.',
      'Lad dejen hvile i 15 minutter.',
      'Steg tynde pandekager i en varm pande med lidt smør.',
      'Rul pandekagerne med syltetøj og drys med sukker.',
    ],
    tags: ['dansk', 'dessert', 'børnevenlig'],
    calories: 340,
    protein: 10,
  },
];

export const getRecipeById = (id: string): Recipe | undefined => {
  return recipes.find(recipe => recipe.id === id);
};

export const searchRecipes = (query: string): Recipe[] => {
  const lowerQuery = query.toLowerCase();
  return recipes.filter(
    recipe =>
      recipe.name.toLowerCase().includes(lowerQuery) ||
      recipe.description.toLowerCase().includes(lowerQuery) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getRecipesByCategory = (category: string): Recipe[] => {
  return recipes.filter(recipe => recipe.category === category);
};

export const getRecipesByIngredient = (productId: string): Recipe[] => {
  return recipes.filter(recipe =>
    recipe.ingredients.some(ing => ing.productId === productId)
  );
};

// Get recipes that can be made with given product IDs
export const getRecipesWithIngredients = (productIds: string[]): { recipe: Recipe; matchCount: number; totalRequired: number; missingIngredients: RecipeIngredient[] }[] => {
  return recipes
    .map(recipe => {
      const requiredProducts = recipe.ingredients.filter(ing => ing.productId && !ing.optional);
      const matchedIngredients = requiredProducts.filter(ing => ing.productId && productIds.includes(ing.productId));
      const missingIngredients = recipe.ingredients.filter(ing => ing.productId && !ing.optional && !productIds.includes(ing.productId));

      return {
        recipe,
        matchCount: matchedIngredients.length,
        totalRequired: requiredProducts.length,
        missingIngredients,
      };
    })
    .filter(item => item.matchCount > 0)
    .sort((a, b) => {
      // Sort by percentage of ingredients matched
      const aPercent = a.totalRequired > 0 ? a.matchCount / a.totalRequired : 0;
      const bPercent = b.totalRequired > 0 ? b.matchCount / b.totalRequired : 0;
      return bPercent - aPercent;
    });
};

// Legacy compatibility - map product IDs to old format
export function getRecipesForProduct(productId: string): { id: string; name: string; image: string; time: string; difficulty: string; servings: number; ingredients: string[] }[] {
  const matchingRecipes = getRecipesByIngredient(productId);
  return matchingRecipes.map(recipe => ({
    id: recipe.id,
    name: recipe.name,
    image: recipe.image,
    time: `${recipe.prepTime + recipe.cookTime} min`,
    difficulty: recipe.difficulty === 'nem' ? 'Let' : recipe.difficulty === 'mellem' ? 'Medium' : 'Svær',
    servings: recipe.servings,
    ingredients: recipe.ingredients.map(ing => ing.name),
  }));
}
