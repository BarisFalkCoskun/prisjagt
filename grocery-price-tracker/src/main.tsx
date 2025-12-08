import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, ShoppingListProvider } from './context'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ShoppingListProvider>
          <HeroUIProvider>
            <App />
          </HeroUIProvider>
        </ShoppingListProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
