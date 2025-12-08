import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HomePage, ProductDetailPage, LoginPage, RecipesPage, RecipeDetailPage } from './pages';
import { PageTransition } from './components';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PageTransition>
              <ProductDetailPage />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          }
        />
        <Route
          path="/recipes"
          element={
            <PageTransition>
              <RecipesPage />
            </PageTransition>
          }
        />
        <Route
          path="/recipe/:id"
          element={
            <PageTransition>
              <RecipeDetailPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
