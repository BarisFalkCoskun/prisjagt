import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight, Clock, TrendingUp, ChefHat, ShoppingCart } from 'lucide-react';
import { products, searchProducts } from '../data/products';
import { recipes, searchRecipes } from '../data/recipes';

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchResult = {
  type: 'product' | 'recipe' | 'action';
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  icon?: React.ReactNode;
  action: () => void;
};

export function SpotlightSearch({ isOpen, onClose }: SpotlightSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Recent searches (stored in state for demo)
  const recentSearches = ['Mælk', 'Bananer', 'Tilbud'];

  // Quick actions
  const quickActions: SearchResult[] = [
    {
      type: 'action',
      id: 'recipes',
      title: 'Gå til opskrifter',
      subtitle: 'Udforsk alle opskrifter',
      icon: <ChefHat className="w-5 h-5" />,
      action: () => { navigate('/recipes'); onClose(); },
    },
    {
      type: 'action',
      id: 'deals',
      title: 'Se alle tilbud',
      subtitle: 'Produkter på tilbud lige nu',
      icon: <TrendingUp className="w-5 h-5" />,
      action: () => { navigate('/?filter=deals'); onClose(); },
    },
    {
      type: 'action',
      id: 'list',
      title: 'Min indkøbsliste',
      subtitle: 'Se og rediger din liste',
      icon: <ShoppingCart className="w-5 h-5" />,
      action: () => { navigate('/?openList=true'); onClose(); },
    },
  ];

  // Search results
  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) {
      // Show recent + quick actions when empty
      return [
        ...recentSearches.map((term, i) => ({
          type: 'action' as const,
          id: `recent-${i}`,
          title: term,
          subtitle: 'Seneste søgning',
          icon: <Clock className="w-5 h-5" />,
          action: () => setQuery(term),
        })),
        ...quickActions,
      ];
    }

    const productResults = searchProducts(query).slice(0, 5).map(p => ({
      type: 'product' as const,
      id: p.id,
      title: p.name,
      subtitle: `Fra ${Math.min(...p.storePrices.map(sp => sp.currentPrice)).toFixed(2)} kr`,
      image: p.image,
      action: () => { navigate(`/product/${p.id}`); onClose(); },
    }));

    const recipeResults = searchRecipes(query).slice(0, 3).map(r => ({
      type: 'recipe' as const,
      id: r.id,
      title: r.name,
      subtitle: `${r.prepTime + r.cookTime} min · ${r.ingredients.length} ingredienser`,
      image: r.image,
      action: () => { navigate(`/recipe/${r.id}`); onClose(); },
    }));

    return [...productResults, ...recipeResults];
  }, [query, navigate, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          results[selectedIndex]?.action();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          />

          {/* Spotlight Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-[15%] inset-x-0 z-[101] w-full max-w-2xl mx-auto px-4"
          >
            <div className="bg-white/95 dark:bg-[#1d1d1f]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#e8e8ed]/50 dark:border-[#38383a]/50 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e8e8ed] dark:border-[#38383a]">
                <Search className="w-5 h-5 text-[#86868b]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Søg efter produkter, opskrifter..."
                  className="flex-1 bg-transparent text-lg text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-none"
                />
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#f5f5f7] dark:bg-[#2c2c2e] text-xs text-[#86868b]">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {results.length > 0 ? (
                  <div className="p-2">
                    {/* Group by type */}
                    {query && results.some(r => r.type === 'product') && (
                      <div className="px-3 py-2 text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                        Produkter
                      </div>
                    )}
                    {results.filter(r => r.type === 'product').map((result, index) => {
                      const actualIndex = results.findIndex(r => r.id === result.id);
                      return (
                        <ResultItem
                          key={result.id}
                          result={result}
                          isSelected={selectedIndex === actualIndex}
                          onClick={result.action}
                        />
                      );
                    })}

                    {query && results.some(r => r.type === 'recipe') && (
                      <div className="px-3 py-2 text-xs font-semibold text-[#86868b] uppercase tracking-wider mt-2">
                        Opskrifter
                      </div>
                    )}
                    {results.filter(r => r.type === 'recipe').map((result) => {
                      const actualIndex = results.findIndex(r => r.id === result.id);
                      return (
                        <ResultItem
                          key={result.id}
                          result={result}
                          isSelected={selectedIndex === actualIndex}
                          onClick={result.action}
                        />
                      );
                    })}

                    {!query && (
                      <>
                        <div className="px-3 py-2 text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                          Seneste søgninger
                        </div>
                        {results.filter(r => r.id.startsWith('recent')).map((result) => {
                          const actualIndex = results.findIndex(r => r.id === result.id);
                          return (
                            <ResultItem
                              key={result.id}
                              result={result}
                              isSelected={selectedIndex === actualIndex}
                              onClick={result.action}
                            />
                          );
                        })}

                        <div className="px-3 py-2 text-xs font-semibold text-[#86868b] uppercase tracking-wider mt-2">
                          Genveje
                        </div>
                        {results.filter(r => !r.id.startsWith('recent') && r.type === 'action').map((result) => {
                          const actualIndex = results.findIndex(r => r.id === result.id);
                          return (
                            <ResultItem
                              key={result.id}
                              result={result}
                              isSelected={selectedIndex === actualIndex}
                              onClick={result.action}
                            />
                          );
                        })}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Search className="w-12 h-12 text-[#86868b] mx-auto mb-3 opacity-50" />
                    <p className="text-[#86868b]">Ingen resultater for "{query}"</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-[#e8e8ed] dark:border-[#38383a] flex items-center justify-between text-xs text-[#86868b]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-[#f5f5f7] dark:bg-[#2c2c2e] font-mono">↑↓</kbd>
                    Naviger
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-[#f5f5f7] dark:bg-[#2c2c2e] font-mono">↵</kbd>
                    Åbn
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-[#f5f5f7] dark:bg-[#2c2c2e] font-mono">esc</kbd>
                    Luk
                  </span>
                </div>
                <span>{products.length} produkter · {recipes.length} opskrifter</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ResultItem({
  result,
  isSelected,
  onClick,
}: {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
        isSelected
          ? 'bg-emerald-500 text-white'
          : 'hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]'
      }`}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image or Icon */}
      {result.image ? (
        <div className="w-10 h-10 rounded-lg bg-[#f5f5f7] dark:bg-[#2c2c2e] overflow-hidden flex-shrink-0">
          <img src={result.image} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isSelected ? 'bg-white/20' : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b]'
          }`}
        >
          {result.icon}
        </div>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium truncate ${isSelected ? 'text-white' : 'text-[#1d1d1f] dark:text-white'}`}>
          {result.title}
        </p>
        {result.subtitle && (
          <p className={`text-sm truncate ${isSelected ? 'text-white/70' : 'text-[#86868b]'}`}>
            {result.subtitle}
          </p>
        )}
      </div>

      {/* Arrow */}
      <ArrowRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white' : 'text-[#86868b]'}`} />
    </motion.button>
  );
}

// Hook to manage spotlight
export function useSpotlight() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  };
}
