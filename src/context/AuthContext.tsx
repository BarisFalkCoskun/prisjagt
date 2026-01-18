import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  favorites: string[]; // Product IDs
  savedRecipes: string[]; // Recipe IDs
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleSavedRecipe: (recipeId: string) => void;
  isRecipeSaved: (recipeId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('prisjagt_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('prisjagt_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('prisjagt_user');
    }
  }, [user]);

  const login = async (email: string, _password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo, accept any credentials
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
      favorites: [],
      savedRecipes: [],
    };
    setUser(newUser);
  };

  const signup = async (email: string, _password: string, name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      favorites: [],
      savedRecipes: [],
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleFavorite = (productId: string) => {
    if (!user) return;

    setUser(prev => {
      if (!prev) return prev;
      const favorites = prev.favorites.includes(productId)
        ? prev.favorites.filter(id => id !== productId)
        : [...prev.favorites, productId];
      return { ...prev, favorites };
    });
  };

  const isFavorite = (productId: string) => {
    return user?.favorites.includes(productId) ?? false;
  };

  const toggleSavedRecipe = (recipeId: string) => {
    if (!user) return;

    setUser(prev => {
      if (!prev) return prev;
      const savedRecipes = prev.savedRecipes.includes(recipeId)
        ? prev.savedRecipes.filter(id => id !== recipeId)
        : [...prev.savedRecipes, recipeId];
      return { ...prev, savedRecipes };
    });
  };

  const isRecipeSaved = (recipeId: string) => {
    return user?.savedRecipes.includes(recipeId) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        toggleFavorite,
        isFavorite,
        toggleSavedRecipe,
        isRecipeSaved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
