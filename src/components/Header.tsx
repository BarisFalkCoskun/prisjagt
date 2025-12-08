import { Input } from '@heroui/react';
import { Search, TrendingDown } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/25">
              <TrendingDown className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900 leading-tight">PrisJagt</span>
              <span className="text-[10px] text-gray-500 -mt-0.5">Find de bedste priser</span>
            </div>
          </a>

          {/* Center Search */}
          <div className="flex-1 max-w-lg mx-8">
            <Input
              classNames={{
                base: "h-10",
                mainWrapper: "h-10",
                input: "text-sm placeholder:text-gray-400",
                inputWrapper: "h-10 bg-gray-100/80 hover:bg-gray-100 border-0 shadow-none rounded-xl group-data-[focus=true]:bg-white group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-green-500/30",
              }}
              placeholder="Sog efter produkter..."
              size="sm"
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Right nav */}
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              Kategorier
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              Tilbud
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
