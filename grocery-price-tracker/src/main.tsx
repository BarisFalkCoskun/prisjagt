import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, ShoppingListProvider, AuthProvider } from './context'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ShoppingListProvider>
            <HeroUIProvider>
              <App />
            </HeroUIProvider>
          </ShoppingListProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
