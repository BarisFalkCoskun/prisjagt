import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  Bookmark,
  BookmarkCheck,
  Share2,
  Plus,
  Check,
  ShoppingCart,
  Flame,
} from 'lucide-react';
import { getRecipeById } from '../data/recipes';
import { products } from '../data/products';
import { useShoppingList } from '../context';
import { useAuth } from '../context/AuthContext';
import { ScrollProgress, MagneticButton } from '../components';

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, isInList } = useShoppingList();
  const { isAuthenticated, isRecipeSaved, toggleSavedRecipe } = useAuth();
  const [servings, setServings] = useState<number | null>(null);
  const [addedIngredients, setAddedIngredients] = useState<Set<string>>(new Set());

  const recipe = id ? getRecipeById(id) : undefined;

  // Calculate adjusted servings
  const currentServings = servings ?? recipe?.servings ?? 4;
  const servingsMultiplier = recipe ? currentServings / recipe.servings : 1;

  // Get products that match ingredients
  const ingredientProducts = useMemo(() => {
    if (!recipe) return new Map();
    const map = new Map<string, typeof products[0]>();
    recipe.ingredients.forEach((ing) => {
      if (ing.productId) {
        const product = products.find((p) => p.id === ing.productId);
        if (product) {
          map.set(ing.productId, product);
        }
      }
    });
    return map;
  }, [recipe]);

  // Calculate total cost from available products
  const totalCost = useMemo(() => {
    let cost = 0;
    ingredientProducts.forEach((product) => {
      const lowestPrice = Math.min(...product.storePrices.map((sp) => sp.currentPrice));
      cost += lowestPrice;
    });
    return cost;
  }, [ingredientProducts]);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#fbfbfd] dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-[#86868b] mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-[#1d1d1f] dark:text-white mb-2">
            Opskrift ikke fundet
          </h1>
          <button
            onClick={() => navigate('/recipes')}
            className="text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Tilbage til opskrifter
          </button>
        </div>
      </div>
    );
  }

  const handleAddIngredient = (productId: string) => {
    const product = ingredientProducts.get(productId);
    if (product) {
      addItem(product);
      setAddedIngredients((prev) => new Set([...prev, productId]));
    }
  };

  const handleAddAllMissing = () => {
    recipe.ingredients.forEach((ing) => {
      if (ing.productId && !isInList(ing.productId)) {
        const product = ingredientProducts.get(ing.productId);
        if (product) {
          addItem(product);
          setAddedIngredients((prev) => new Set([...prev, ing.productId!]));
        }
      }
    });
  };

  const missingCount = recipe.ingredients.filter(
    (ing) => ing.productId && !isInList(ing.productId) && !addedIngredients.has(ing.productId)
  ).length;

  const saved = isRecipeSaved(recipe.id);
  const totalTime = recipe.prepTime + recipe.cookTime;

  const difficultyColors = {
    nem: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    mellem: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    svaer: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  };

  const difficultyLabels = {
    nem: 'Nem',
    mellem: 'Medium',
    svaer: 'Svær',
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-black">
      <ScrollProgress color="#f97316" />

      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>

            {isAuthenticated && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSavedRecipe(recipe.id)}
                className={`p-3 rounded-full backdrop-blur-md transition-colors ${
                  saved
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </motion.button>
            )}
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${difficultyColors[recipe.difficulty]}`}
              >
                {difficultyLabels[recipe.difficulty]}
              </span>
              {recipe.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold text-white mb-2">{recipe.name}</h1>
            <p className="text-lg text-white/80 max-w-2xl">{recipe.description}</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 pb-24">
        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-[#1d1d1f] rounded-3xl shadow-xl shadow-black/5 dark:shadow-none border border-[#e8e8ed] dark:border-[#38383a] p-6 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e]">
              <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-semibold text-[#1d1d1f] dark:text-white">{totalTime}</p>
              <p className="text-xs text-[#86868b]">minutter</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e]">
              <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setServings(Math.max(1, currentServings - 1))}
                  className="w-6 h-6 rounded-full bg-[#e8e8ed] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#d1d1d6] dark:hover:bg-[#4a4a4c] transition-colors text-sm"
                >
                  -
                </button>
                <span className="text-2xl font-semibold text-[#1d1d1f] dark:text-white w-8 text-center">
                  {currentServings}
                </span>
                <button
                  onClick={() => setServings(currentServings + 1)}
                  className="w-6 h-6 rounded-full bg-[#e8e8ed] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white hover:bg-[#d1d1d6] dark:hover:bg-[#4a4a4c] transition-colors text-sm"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-[#86868b]">personer</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e]">
              <ChefHat className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-semibold text-[#1d1d1f] dark:text-white">
                {recipe.ingredients.length}
              </p>
              <p className="text-xs text-[#86868b]">ingredienser</p>
            </div>
            {recipe.calories && (
              <div className="text-center p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e]">
                <Flame className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                <p className="text-2xl font-semibold text-[#1d1d1f] dark:text-white">
                  {Math.round(recipe.calories * servingsMultiplier)}
                </p>
                <p className="text-xs text-[#86868b]">kcal total</p>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Ingredients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-1"
          >
            <div className="bg-white dark:bg-[#1d1d1f] rounded-3xl border border-[#e8e8ed] dark:border-[#38383a] p-6 sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-white">
                  Ingredienser
                </h2>
                {totalCost > 0 && (
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    ~{totalCost.toFixed(0)} kr
                  </span>
                )}
              </div>

              {/* Add all missing button */}
              {missingCount > 0 && (
                <MagneticButton
                  onClick={handleAddAllMissing}
                  className="w-full mb-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
                  strength={0.2}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Tilføj {missingCount} manglende
                </MagneticButton>
              )}

              <ul className="space-y-3">
                {recipe.ingredients.map((ing, index) => {
                  const product = ing.productId ? ingredientProducts.get(ing.productId) : null;
                  const inList = ing.productId ? isInList(ing.productId) || addedIngredients.has(ing.productId) : false;
                  const adjustedAmount = ing.amount * servingsMultiplier;

                  return (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                        inList
                          ? 'bg-emerald-50 dark:bg-emerald-900/20'
                          : 'bg-[#f5f5f7] dark:bg-[#2c2c2e]'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            inList
                              ? 'bg-emerald-500 text-white'
                              : 'bg-[#e8e8ed] dark:bg-[#3a3a3c]'
                          }`}
                        >
                          {inList ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <span className="text-xs text-[#86868b]">{index + 1}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              inList
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-[#1d1d1f] dark:text-white'
                            }`}
                          >
                            {ing.name}
                          </p>
                          <p className="text-xs text-[#86868b]">
                            {Number.isInteger(adjustedAmount)
                              ? adjustedAmount
                              : adjustedAmount.toFixed(1)}{' '}
                            {ing.unit}
                            {ing.optional && ' (valgfri)'}
                          </p>
                        </div>
                      </div>

                      {product && !inList && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAddIngredient(ing.productId!)}
                          className="p-2 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2"
          >
            <div className="bg-white dark:bg-[#1d1d1f] rounded-3xl border border-[#e8e8ed] dark:border-[#38383a] p-6">
              <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-white mb-6">
                Fremgangsmåde
              </h2>

              <ol className="space-y-6">
                {recipe.instructions.map((step, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 text-white font-semibold flex items-center justify-center text-sm shadow-lg shadow-orange-500/25">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-[#1d1d1f] dark:text-white leading-relaxed">{step}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>

            {/* Tips */}
            {recipe.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 border border-orange-200 dark:border-orange-800"
              >
                <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
