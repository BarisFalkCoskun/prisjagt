import { Input, Button, Navbar, NavbarBrand, NavbarContent } from '@heroui/react';
import { Search, ShoppingCart, TrendingDown } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <Navbar
      maxWidth="full"
      className="glass border-b border-gray-200/50 py-2"
      height="4.5rem"
    >
      <NavbarBrand className="gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/25">
          <TrendingDown className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-semibold tracking-tight text-gray-900">
            PrisJagt
          </span>
          <span className="text-xs text-gray-500 -mt-0.5">
            Find de bedste priser
          </span>
        </div>
      </NavbarBrand>

      <NavbarContent className="flex-1 max-w-2xl mx-8" justify="center">
        <Input
          classNames={{
            base: "w-full",
            mainWrapper: "h-full",
            input: "text-base",
            inputWrapper: "h-12 bg-gray-100/80 hover:bg-gray-100 border-0 shadow-none group-data-[focus=true]:bg-white group-data-[focus=true]:shadow-lg group-data-[focus=true]:shadow-gray-200/50",
          }}
          placeholder="Sog efter produkter..."
          size="lg"
          startContent={<Search className="w-5 h-5 text-gray-400" />}
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </NavbarContent>

      <NavbarContent justify="end">
        <Button
          isIconOnly
          variant="light"
          className="text-gray-600 hover:text-gray-900"
        >
          <ShoppingCart className="w-5 h-5" />
        </Button>
      </NavbarContent>
    </Navbar>
  );
}
