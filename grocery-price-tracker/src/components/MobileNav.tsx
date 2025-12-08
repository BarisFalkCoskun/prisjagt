import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Search, ChefHat, ShoppingCart, User } from 'lucide-react';
import { useShoppingList } from '../context/ShoppingListContext';
import { useAuth } from '../context/AuthContext';

interface MobileNavProps {
  onOpenSearch: () => void;
  onOpenList: () => void;
  activeTab?: 'home' | 'search' | 'recipes' | 'cart' | 'profile';
}

export function MobileNav({ onOpenSearch, onOpenList, activeTab = 'home' }: MobileNavProps) {
  const navigate = useNavigate();
  const { itemCount } = useShoppingList();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { id: 'home', icon: Home, label: 'Hjem', action: () => navigate('/') },
    { id: 'search', icon: Search, label: 'Søg', action: onOpenSearch },
    { id: 'recipes', icon: ChefHat, label: 'Opskrifter', action: () => navigate('/recipes') },
    { id: 'cart', icon: ShoppingCart, label: 'Liste', action: onOpenList, badge: itemCount },
    { id: 'profile', icon: User, label: isAuthenticated ? 'Profil' : 'Log ind', action: () => navigate('/login') },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Blur background */}
      <div className="absolute inset-0 bg-white/80 dark:bg-[#1d1d1f]/80 backdrop-blur-xl border-t border-[#e8e8ed] dark:border-[#38383a]" />

      {/* Nav items */}
      <div className="relative flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={item.action}
              className="relative flex flex-col items-center gap-0.5 py-2 px-4 rounded-2xl transition-colors"
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl"
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                />
              )}

              {/* Icon */}
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-[#86868b]'
                  }`}
                />

                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center px-1"
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </motion.span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-[#86868b]'
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
