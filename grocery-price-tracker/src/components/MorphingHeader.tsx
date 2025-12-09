import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Search, Sun, Moon, ChefHat, User, LogOut, Command } from 'lucide-react';
import { useTheme, useAuth } from '../context';

interface MorphingHeaderProps {
  onOpenSpotlight?: () => void;
}

export function MorphingHeader({ onOpenSpotlight }: MorphingHeaderProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const { scrollY } = useScroll();

  // Transform values for morphing effect
  const headerHeight = useTransform(scrollY, [0, 100], [56, 48]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9]);
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.8)']
  );
  const headerBgDark = useTransform(
    scrollY,
    [0, 50],
    ['rgba(29, 29, 31, 0)', 'rgba(29, 29, 31, 0.8)']
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      const compact = window.scrollY > 300;
      setIsScrolled(scrolled);
      setIsCompact(compact);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header
      style={{
        height: headerHeight,
        backgroundColor: theme === 'dark' ? headerBgDark : headerBg,
      }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-300 ${
        isScrolled
          ? 'border-b border-[#d2d2d7]/30 dark:border-[#38383a]/50 shadow-sm'
          : ''
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo - morphs on scroll */}
          <motion.div style={{ scale: logoScale }}>
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <motion.div
                className="rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20"
                animate={{
                  width: isCompact ? 28 : 32,
                  height: isCompact ? 28 : 32,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <span className={`text-white font-bold ${isCompact ? 'text-xs' : 'text-sm'}`}>P</span>
              </motion.div>
              <AnimatePresence mode="wait">
                {!isCompact && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg font-semibold text-[#1d1d1f] dark:text-white"
                  >
                    PrisJagt
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>

          {/* Center - Spotlight Search Trigger */}
          <motion.button
            onClick={onOpenSpotlight}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:flex items-center gap-3 px-4 py-2 bg-[#f5f5f7] dark:bg-[#2c2c2e] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] rounded-full transition-colors min-w-[280px]"
          >
            <Search className="w-4 h-4 text-[#86868b]" />
            <span className="text-sm text-[#86868b] flex-1 text-left">Søg efter produkter...</span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/80 dark:bg-[#1d1d1f]/80 text-[10px] text-[#86868b] font-medium">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </motion.button>

          {/* Right nav */}
          <nav className="flex items-center gap-1">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Recipes Link - hides when compact */}
            <AnimatePresence>
              {!isCompact && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to="/recipes"
                    className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] rounded-full transition-colors"
                  >
                    <ChefHat className="w-4 h-4" />
                    <span>Opskrifter</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] rounded-full transition-colors"
                >
                  <motion.div
                    animate={{
                      width: isCompact ? 24 : 28,
                      height: isCompact ? 24 : 28,
                    }}
                    className="rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </motion.div>
                  <AnimatePresence>
                    {!isCompact && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="max-w-[100px] truncate overflow-hidden"
                      >
                        {user?.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-green-500/20"
              >
                <User className="w-4 h-4" />
                <AnimatePresence>
                  {!isCompact && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                    >
                      Log ind
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Progress bar on scroll */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-600"
        style={{
          width: useTransform(scrollY, [0, document.body.scrollHeight - window.innerHeight], ['0%', '100%']),
          opacity: useTransform(scrollY, [0, 100], [0, 1]),
        }}
      />
    </motion.header>
  );
}
