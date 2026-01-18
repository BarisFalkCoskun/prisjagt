import { Input } from '@heroui/react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, ChefHat, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme, useAuth } from '../context';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1d1d1f]/80 backdrop-blur-xl border-b border-[#d2d2d7]/30 dark:border-[#38383a]/50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-semibold text-[#1d1d1f] dark:text-white">PrisJagt</span>
          </Link>

          {/* Center Search */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <Input
              classNames={{
                base: "h-9",
                mainWrapper: "h-9",
                input: "text-sm text-[#1d1d1f] dark:text-white placeholder:text-[#86868b]",
                inputWrapper: "h-9 bg-[#f5f5f7] dark:bg-[#2c2c2e] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] border-0 shadow-none rounded-full group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-[#3a3a3c] group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-emerald-500/30",
              }}
              placeholder="Søg efter produkter..."
              size="sm"
              startContent={<Search className="w-4 h-4 text-[#86868b]" />}
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

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
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-400" />
              )}
            </motion.button>

            {/* Recipes Link */}
            <Link
              to="/recipes"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] rounded-full transition-colors"
            >
              <ChefHat className="w-4 h-4" />
              Opskrifter
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] rounded-full transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name}</span>
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
                Log ind
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
