import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChefHat, ShoppingCart, Sparkles, Filter, X } from 'lucide-react';
import { Header, ScrollProgress, SegmentedControl, MobileNav } from '../components';
import { RecipeCard } from '../components/RecipeCard';
import { recipes, recipeCategories, searchRecipes, getRecipesWithIngredients } from '../data/recipes';
import { useShoppingList } from '../context';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

type ViewMode = 'all' | 'from-list';
type DifficultyFilter = 'all' | 'nem' | 'mellem' | 'svaer';

export function RecipesPage() {
  const navigate = useNavigate();
  const { items } = useShoppingList();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');

  // Get product IDs from shopping list
  const shoppingListProductIds = useMemo(() => {
    return items.map(item => item.product.id);
  }, [items]);

  // Get recipes that match shopping list ingredients
  const recipesFromList = useMemo(() => {
    if (shoppingListProductIds.length === 0) return [];
    return getRecipesWithIngredients(shoppingListProductIds);
  }, [shoppingListProductIds]);

  // Filter recipes based on current view and filters
  const filteredRecipes = useMemo(() => {
    let result = viewMode === 'from-list'
      ? recipesFromList.map(r => r.recipe)
      : recipes;

    // Search filter
    if (searchQuery) {
      const searchResults = searchRecipes(searchQuery);
      result = result.filter(r => searchResults.some(sr => sr.id === r.id));
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(r => r.category === selectedCategory);
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      result = result.filter(r => r.difficulty === difficultyFilter);
    }

    return result;
  }, [viewMode, recipesFromList, searchQuery, selectedCategory, difficultyFilter]);

  // Get match info for recipes from list view
  const getMatchInfo = (recipeId: string) => {
    if (viewMode !== 'from-list') return undefined;
    const match = recipesFromList.find(r => r.recipe.id === recipeId);
    return match ? { matchCount: match.matchCount, totalRequired: match.totalRequired } : undefined;
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-black">
      <ScrollProgress />
      <Header searchQuery="" onSearchChange={() => {}} />

      {/* Hero Section */}
      <section className="pt-14">
        <div className="bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600 relative overflow-hidden">
          {/* Mesh gradient */}
          <motion.div
            className="absolute top-10 left-10 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px]"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-yellow-400/20 rounded-full blur-[60px]"
            animate={{
              scale: [1.2, 1, 1.2],
              y: [0, 20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30"
                >
                  <ChefHat className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">{recipes.length} opskrifter</span>
                </motion.div>
              </div>

              <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-[1.1] mb-4">
                Opskrifter
              </h1>
              <p className="text-xl text-white/80 max-w-xl mb-8">
                Find lækre opskrifter baseret på de ingredienser du har - eller udforsk nye favoritter.
              </p>

              {/* Search */}
              <div className="max-w-xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Søg efter opskrifter..."
                    className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="sticky top-14 z-40 bg-white/95 dark:bg-[#1d1d1f]/95 backdrop-blur-xl border-b border-[#d2d2d7]/50 dark:border-[#38383a]/50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex-shrink-0">
              <SegmentedControl
                segments={[
                  { id: 'all', label: 'Alle', icon: <Sparkles className="w-3.5 h-3.5" /> },
                  { id: 'from-list', label: 'Fra indkøb', icon: <ShoppingCart className="w-3.5 h-3.5" /> },
                ]}
                value={viewMode}
                onChange={(value) => setViewMode(value as ViewMode)}
                size="sm"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(null)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === null
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]'
                }`}
              >
                Alle
              </motion.button>
              {recipeCategories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]'
                  }`}
                >
                  <span className="mr-1">{cat.icon}</span>
                  {cat.name}
                </motion.button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Filter className="w-4 h-4 text-[#86868b]" />
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as DifficultyFilter)}
                className="bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white text-sm px-3 py-1.5 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Alle niveauer</option>
                <option value="nem">Nem</option>
                <option value="mellem">Medium</option>
                <option value="svaer">Svær</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Shopping List Notice */}
      {viewMode === 'from-list' && items.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#1d1d1f] dark:text-white">
                  Baseret på din indkøbsliste
                </p>
                <p className="text-sm text-[#86868b]">
                  {items.length} produkter i din liste - vi fandt {recipesFromList.length} opskrifter du kan lave
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Empty List Notice */}
      {viewMode === 'from-list' && items.length === 0 && (
        <div className="max-w-5xl mx-auto px-6 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-center"
          >
            <ShoppingCart className="w-12 h-12 text-[#86868b] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-white mb-2">
              Din indkøbsliste er tom
            </h3>
            <p className="text-[#86868b] mb-4">
              Tilføj produkter til din indkøbsliste for at se opskrifter du kan lave.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium shadow-lg shadow-green-500/25"
            >
              Gå til produkter
            </button>
          </motion.div>
        </div>
      )}

      {/* Recipe Grid */}
      <main className="max-w-5xl mx-auto px-6 py-8 pb-24">
        {filteredRecipes.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-[#1d1d1f] dark:text-white">
                {searchQuery
                  ? `Resultater for "${searchQuery}"`
                  : selectedCategory
                  ? recipeCategories.find(c => c.id === selectedCategory)?.name
                  : viewMode === 'from-list'
                  ? 'Opskrifter du kan lave'
                  : 'Alle opskrifter'}
              </h2>
              <p className="text-[#86868b]">{filteredRecipes.length} opskrifter</p>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredRecipes.map((recipe) => (
                <motion.div key={recipe.id} variants={cardVariants}>
                  <RecipeCard
                    recipe={recipe}
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                    matchInfo={getMatchInfo(recipe.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <ChefHat className="w-16 h-16 text-[#86868b] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#1d1d1f] dark:text-white mb-2">
              Ingen opskrifter fundet
            </h3>
            <p className="text-[#86868b]">
              Prøv at ændre dine filtre eller søg efter noget andet.
            </p>
          </motion.div>
        )}
      </main>

      {/* Mobile Nav */}
      <MobileNav
        onOpenSearch={() => {}}
        onOpenList={() => {}}
        activeTab="recipes"
      />
    </div>
  );
}
