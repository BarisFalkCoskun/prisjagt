import { Input } from '@heroui/react';
import { Search } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fbfbfd]/80 backdrop-blur-xl border-b border-[#d2d2d7]/30">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <span className="text-xl font-semibold text-[#1d1d1f]">PrisJagt</span>
          </a>

          {/* Center Search */}
          <div className="flex-1 max-w-md mx-8">
            <Input
              classNames={{
                base: "h-9",
                mainWrapper: "h-9",
                input: "text-sm text-[#1d1d1f] placeholder:text-[#86868b]",
                inputWrapper: "h-9 bg-[#f5f5f7] hover:bg-[#e8e8ed] border-0 shadow-none rounded-lg group-data-[focus=true]:bg-[#e8e8ed]",
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
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-[#1d1d1f] hover:text-[#86868b] transition-colors">
              Kategorier
            </a>
            <a href="#" className="text-sm font-medium text-[#1d1d1f] hover:text-[#86868b] transition-colors">
              Tilbud
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
