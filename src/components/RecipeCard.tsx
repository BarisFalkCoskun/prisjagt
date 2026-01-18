import { motion } from 'framer-motion';
import { Clock, Users, ChefHat, Bookmark, BookmarkCheck } from 'lucide-react';
import type { Recipe } from '../data/recipes';
import { useAuth } from '../context/AuthContext';
import { TiltCard } from './TiltCard';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  matchInfo?: {
    matchCount: number;
    totalRequired: number;
  };
}

export function RecipeCard({ recipe, onClick, matchInfo }: RecipeCardProps) {
  const { isAuthenticated, isRecipeSaved, toggleSavedRecipe } = useAuth();

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

  const totalTime = recipe.prepTime + recipe.cookTime;
  const saved = isRecipeSaved(recipe.id);
  const matchPercent = matchInfo ? Math.round((matchInfo.matchCount / matchInfo.totalRequired) * 100) : null;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthenticated) {
      toggleSavedRecipe(recipe.id);
    }
  };

  return (
    <TiltCard
      onClick={onClick}
      glowColor="#10b98160"
      intensity={6}
      className="group cursor-pointer"
    >
      <article className="bg-white dark:bg-[#1d1d1f] rounded-3xl border border-[#e8e8ed] dark:border-[#38383a] overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Match percentage badge */}
          {matchPercent !== null && (
            <div className="absolute top-3 left-3">
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  matchPercent >= 75
                    ? 'bg-emerald-500 text-white'
                    : matchPercent >= 50
                    ? 'bg-amber-500 text-white'
                    : 'bg-white/90 text-[#1d1d1f]'
                }`}
              >
                {matchPercent}% match
              </div>
            </div>
          )}

          {/* Save button */}
          {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSaveClick}
              className={`absolute top-3 right-3 p-2.5 rounded-full transition-all ${
                saved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/90 dark:bg-[#2c2c2e]/90 backdrop-blur-sm text-[#86868b] opacity-0 group-hover:opacity-100 hover:text-emerald-500'
              }`}
            >
              {saved ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </motion.button>
          )}

          {/* Difficulty badge */}
          <div className="absolute bottom-3 left-3">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${difficultyColors[recipe.difficulty]}`}
            >
              {difficultyLabels[recipe.difficulty]}
            </span>
          </div>

          {/* Time */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 dark:bg-[#2c2c2e]/90 backdrop-blur-sm">
            <Clock className="w-3.5 h-3.5 text-[#86868b]" />
            <span className="text-xs font-medium text-[#1d1d1f] dark:text-white">
              {totalTime} min
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Category */}
          <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5">
            {recipe.category}
          </p>

          {/* Title */}
          <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {recipe.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-[#86868b] line-clamp-2 mb-4 flex-1">
            {recipe.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 pt-4 border-t border-[#e8e8ed] dark:border-[#38383a]">
            <div className="flex items-center gap-1.5 text-[#86868b]">
              <Users className="w-4 h-4" />
              <span className="text-xs">{recipe.servings} pers.</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#86868b]">
              <ChefHat className="w-4 h-4" />
              <span className="text-xs">{recipe.ingredients.length} ingredienser</span>
            </div>
            {recipe.calories && (
              <div className="ml-auto text-xs text-[#86868b]">
                {recipe.calories} kcal
              </div>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
