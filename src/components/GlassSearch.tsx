import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Sparkles } from 'lucide-react';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'suggestion';
}

interface GlassSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
}

export function GlassSearch({
  value,
  onChange,
  onSearch,
  placeholder = 'Søg efter produkter...',
  suggestions = [],
}: GlassSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && value.trim()) {
      onSearch(value);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    if (onSearch) {
      onSearch(suggestion.text);
    }
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const iconMap = {
    recent: Clock,
    trending: TrendingUp,
    suggestion: Sparkles,
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <motion.form
        onSubmit={handleSubmit}
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative"
      >
        {/* Glass background */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: isFocused
              ? '0 8px 32px rgba(16, 185, 129, 0.15), 0 0 0 2px rgba(16, 185, 129, 0.3)'
              : '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
          transition={{ duration: 0.2 }}
          style={{
            background: isFocused
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        />

        {/* Dark mode background */}
        <div className="hidden dark:block absolute inset-0 rounded-2xl bg-[#1c1c1e]/80 backdrop-blur-xl border border-[#38383a]/50" />

        <div className="relative flex items-center gap-3 px-5 py-4">
          {/* Search icon with pulse animation when focused */}
          <motion.div
            animate={{
              scale: isFocused ? [1, 1.2, 1] : 1,
              color: isFocused ? '#10b981' : '#86868b',
            }}
            transition={{ duration: 0.3 }}
          >
            <Search className="w-5 h-5" />
          </motion.div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-[17px] text-[#1d1d1f] dark:text-white placeholder-[#86868b] outline-none"
            style={{ letterSpacing: '-0.022em' }}
          />

          {/* Clear button */}
          <AnimatePresence>
            {value && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onChange('')}
                className="p-1.5 rounded-full bg-[#e8e8ed] dark:bg-[#38383a] text-[#86868b] hover:bg-[#d2d2d7] dark:hover:bg-[#48484a] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Search button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
          >
            Søg
          </motion.button>
        </div>
      </motion.form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <div
              className="rounded-2xl overflow-hidden border border-[#e8e8ed] dark:border-[#38383a] shadow-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              <div className="dark:bg-[#1c1c1e]/95 p-2">
                {suggestions.map((suggestion, index) => {
                  const Icon = iconMap[suggestion.type];
                  return (
                    <motion.button
                      key={suggestion.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors group"
                    >
                      <div className="p-1.5 rounded-lg bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b] group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 group-hover:text-emerald-600 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="flex-1 text-[15px] text-[#1d1d1f] dark:text-white">
                        {suggestion.text}
                      </span>
                      <span className="text-[11px] text-[#86868b] uppercase tracking-wider">
                        {suggestion.type === 'recent' ? 'Seneste' : suggestion.type === 'trending' ? 'Populær' : ''}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
