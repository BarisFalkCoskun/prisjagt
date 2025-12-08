import { Input } from '@heroui/react';
import { Search } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#d2d2d7]/30">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-semibold text-[#1d1d1f]">PrisJagt</span>
          </a>

          {/* Center Search */}
          <div className="flex-1 max-w-md mx-8">
            <Input
              classNames={{
                base: "h-9",
                mainWrapper: "h-9",
                input: "text-sm text-[#1d1d1f] placeholder:text-[#86868b]",
                inputWrapper: "h-9 bg-[#f5f5f7] hover:bg-[#e8e8ed] border-0 shadow-none rounded-full group-data-[focus=true]:bg-white group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-emerald-500/30",
              }}
              placeholder="Sog efter produkter..."
              size="sm"
              startContent={<Search className="w-4 h-4 text-[#86868b]" />}
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Right nav */}
          <nav className="flex items-center gap-1">
            <a href="#" className="px-4 py-2 text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-full transition-colors">
              Kategorier
            </a>
            <a href="#" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-red-500 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-red-500/20">
              Tilbud
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
