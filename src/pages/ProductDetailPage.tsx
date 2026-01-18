import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Image } from '@heroui/react';
import {
  ArrowLeft,
  Bell,
  TrendingDown,
  BarChart3,
  Zap,
  Heart,
  Share2,
  ExternalLink,
  MapPin,
  Clock,
  Navigation,
  ChevronRight,
  Check,
  ChefHat,
  Users,
  Plus,
  ZoomIn,
  X
} from 'lucide-react';
import { PriceChart } from '../components';
import { Confetti } from '../components/Confetti';
import { getProductById, products } from '../data/products';
import { getRecipesForProduct } from '../data/recipes';
import { useShoppingList } from '../context';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

// Mock store locations data
const storeLocations = {
  netto: [
    { id: 1, address: 'Østerbrogade 62', city: 'København Ø', distance: '0.3 km', hours: '07:00 - 22:00', isOpen: true },
    { id: 2, address: 'Nordre Frihavnsgade 4', city: 'København Ø', distance: '0.8 km', hours: '07:00 - 22:00', isOpen: true },
    { id: 3, address: 'Classensgade 19', city: 'København Ø', distance: '1.2 km', hours: '07:00 - 22:00', isOpen: true },
  ],
  rema1000: [
    { id: 1, address: 'Blegdamsvej 28', city: 'København N', distance: '0.5 km', hours: '07:00 - 22:00', isOpen: true },
    { id: 2, address: 'Jagtvej 155', city: 'København N', distance: '1.1 km', hours: '07:00 - 22:00', isOpen: true },
  ],
  bilka: [
    { id: 1, address: 'Fields Shopping Center', city: 'København S', distance: '3.2 km', hours: '10:00 - 20:00', isOpen: true },
    { id: 2, address: 'Waves Shopping Center', city: 'Hundige', distance: '15.4 km', hours: '10:00 - 20:00', isOpen: false },
  ],
  foetex: [
    { id: 1, address: 'Falkoner Allé 21', city: 'Frederiksberg', distance: '2.1 km', hours: '08:00 - 21:00', isOpen: true },
    { id: 2, address: 'Frederikssundsvej 60', city: 'København NV', distance: '2.8 km', hours: '08:00 - 21:00', isOpen: true },
  ],
};

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(id || '');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [showZoom, setShowZoom] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [addedToList, setAddedToList] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const { addItem, isInList } = useShoppingList();

  // Scroll-based animations
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // Show sticky bar when scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.offsetTop + heroRef.current.offsetHeight;
        setShowStickyBar(window.scrollY > heroBottom - 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToList = () => {
    if (product) {
      addItem(product);
      setShowConfetti(true);
      setAddedToList(true);
      setTimeout(() => {
        setShowConfetti(false);
        setAddedToList(false);
      }, 2000);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd] dark:bg-[#000000]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <p className="text-2xl font-semibold text-[#1d1d1f] dark:text-white mb-2">
            Produkt ikke fundet
          </p>
          <p className="text-[#86868b] mb-6">
            Det produkt du leder efter findes ikke.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-green-500/25"
          >
            Tilbage til forsiden
          </button>
        </motion.div>
      </div>
    );
  }

  const sortedStorePrices = [...product.storePrices].sort(
    (a, b) => a.currentPrice - b.currentPrice
  );
  const lowestPrice = sortedStorePrices[0];
  const savings = sortedStorePrices[sortedStorePrices.length - 1].currentPrice - sortedStorePrices[0].currentPrice;
  const inList = isInList(product.id);

  // Get related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  if (relatedProducts.length < 4) {
    const otherProducts = products
      .filter(p => p.id !== product.id && !relatedProducts.includes(p))
      .slice(0, 4 - relatedProducts.length);
    relatedProducts.push(...otherProducts);
  }

  const recipes = getRecipesForProduct(product.id);

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#000000]">
      {/* Confetti */}
      <Confetti isActive={showConfetti} origin={{ x: 0.5, y: 0.3 }} />

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {showZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8"
            onClick={() => setShowZoom(false)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={() => setShowZoom(false)}
            >
              <X className="w-6 h-6" />
            </motion.button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Buy Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1d1d1f]/95 backdrop-blur-xl border-b border-[#d2d2d7]/30 dark:border-[#38383a]/50 shadow-lg"
          >
            <div className="max-w-5xl mx-auto px-6 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <motion.button
                    whileHover={{ x: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="flex-shrink-0 p-2 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </motion.button>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-[#1d1d1f] dark:text-white truncate">{product.name}</h2>
                    <p className="text-sm text-[#86868b]">
                      Fra <span className="font-semibold text-emerald-600">{lowestPrice.currentPrice.toFixed(2).replace('.', ',')} kr</span> hos {lowestPrice.store.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToList}
                    disabled={addedToList}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all ${
                      addedToList || inList
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                    }`}
                  >
                    {addedToList || inList ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">Tilføjet</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Tilføj til liste</span>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2.5 rounded-full font-medium text-white shadow-lg hidden sm:flex items-center gap-2"
                    style={{ backgroundColor: lowestPrice.store.color }}
                  >
                    <span>Gå til butik</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          showStickyBar ? 'opacity-0 pointer-events-none' : 'bg-white/80 dark:bg-[#1d1d1f]/80 backdrop-blur-xl border-b border-[#d2d2d7]/30 dark:border-[#38383a]/50'
        }`}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <motion.button
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Tilbage</span>
            </motion.button>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2.5 rounded-full transition-all ${
                  isFavorite
                    ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-500'
                    : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:opacity-90 transition-opacity text-sm font-medium shadow-lg shadow-amber-500/25"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Prisalarm</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="pt-14">
        {/* Hero Section */}
        <section ref={heroRef} className="bg-white dark:bg-[#1d1d1f] border-b border-[#d2d2d7]/30 dark:border-[#38383a]/50">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="max-w-5xl mx-auto px-6 py-12 md:py-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Product Image with Zoom */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="aspect-square bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] dark:from-[#2c2c2e] dark:to-[#1c1c1e] rounded-3xl p-12 relative overflow-hidden group cursor-zoom-in"
                onClick={() => setShowZoom(true)}
              >
                {/* Animated background blobs */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="absolute top-10 right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"
                />
                <motion.div
                  animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
                  transition={{ duration: 12, repeat: Infinity }}
                  className="absolute bottom-10 left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"
                />

                {/* Zoom indicator */}
                <div className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-5 h-5" />
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 h-full"
                >
                  <Image
                    alt={product.name}
                    src={product.image}
                    className="object-contain w-full h-full"
                    fallbackSrc="https://via.placeholder.com/500x500?text=No+Image"
                  />
                </motion.div>
              </motion.div>

              {/* Product Info */}
              <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                <motion.p variants={fadeInUp} className="text-sm font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                  {product.category}
                </motion.p>
                <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight leading-tight mb-4">
                  {product.name}
                </motion.h1>
                <motion.p variants={fadeInUp} className="text-lg text-[#86868b] mb-8 leading-relaxed">
                  {product.description}
                </motion.p>

                {/* Price Highlight */}
                <motion.div variants={scaleIn} className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 rounded-2xl p-6 mb-6 border border-emerald-100 dark:border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Bedste pris</p>
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                      {lowestPrice.currentPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-2xl text-emerald-500 dark:text-emerald-500">kr</span>
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    hos <span className="font-semibold">{lowestPrice.store.name}</span>
                    {savings > 1 && (
                      <span className="ml-2 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-full text-xs font-semibold">
                        Spar {savings.toFixed(0)} kr
                      </span>
                    )}
                  </p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div variants={fadeInUp} className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToList}
                    disabled={addedToList}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold rounded-2xl transition-all shadow-lg ${
                      addedToList || inList
                        ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                        : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-green-500/25'
                    }`}
                  >
                    {addedToList || inList ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Tilføjet til liste</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Tilføj til liste</span>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-6 py-4 text-white text-base font-semibold rounded-2xl transition-all shadow-lg"
                    style={{ backgroundColor: lowestPrice.store.color, boxShadow: `0 10px 40px -10px ${lowestPrice.store.color}50` }}
                  >
                    <span>Gå til {lowestPrice.store.name}</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Store Locations & Prices */}
        <section className="border-b border-[#d2d2d7]/30 dark:border-[#38383a]/50">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp} className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">Butikker & Priser</h2>
                <p className="text-[#86868b]">Find produktet i en butik nær dig.</p>
              </div>
            </motion.div>

            {/* Store Selector Pills */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex gap-2 mb-8 overflow-x-auto pb-2">
              <button onClick={() => setSelectedStore(null)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedStore === null ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-black' : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]'}`}>
                Alle butikker
              </button>
              {sortedStorePrices.map((sp) => (
                <button
                  key={sp.store.id}
                  onClick={() => setSelectedStore(sp.store.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedStore === sp.store.id ? 'text-white' : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]'}`}
                  style={{ backgroundColor: selectedStore === sp.store.id ? sp.store.color : undefined }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedStore === sp.store.id ? 'white' : sp.store.color }} />
                  {sp.store.name}
                  <span className={`text-xs ${selectedStore === sp.store.id ? 'text-white/80' : 'text-[#86868b]'}`}>{sp.currentPrice.toFixed(0)} kr</span>
                </button>
              ))}
            </motion.div>

            {/* Location Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sortedStorePrices.filter(sp => selectedStore === null || sp.store.id === selectedStore).map((sp, storeIndex) => {
                const locations = storeLocations[sp.store.id as keyof typeof storeLocations] || [];
                const isLowest = storeIndex === 0 && selectedStore === null;
                return (
                  <motion.div key={sp.store.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className={`rounded-2xl overflow-hidden border ${isLowest ? 'ring-2 ring-emerald-300 dark:ring-emerald-500/50 border-emerald-200 dark:border-emerald-500/30' : 'border-[#e8e8ed] dark:border-[#38383a]'}`}>
                    <div className="p-4 text-white relative overflow-hidden" style={{ backgroundColor: sp.store.color }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <span className="font-bold text-lg">{sp.store.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{sp.store.name}</h3>
                            <p className="text-white/80 text-sm">{locations.length} butikker i nærheden</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold">{sp.currentPrice.toFixed(2).replace('.', ',')} kr</p>
                          {isLowest && <span className="inline-flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full mt-1"><Check className="w-3 h-3" /> Billigst</span>}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-[#1d1d1f] divide-y divide-[#e8e8ed] dark:divide-[#38383a]">
                      {locations.map((location, index) => (
                        <motion.div key={location.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="p-4 hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors cursor-pointer group">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-[#1d1d1f] dark:text-white">{location.address}</p>
                                {location.isOpen && <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded">Åben nu</span>}
                              </div>
                              <p className="text-sm text-[#86868b]">{location.city}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1 text-xs text-[#86868b]"><MapPin className="w-3 h-3" />{location.distance}</span>
                                <span className="flex items-center gap-1 text-xs text-[#86868b]"><Clock className="w-3 h-3" />{location.hours}</span>
                              </div>
                            </div>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b] group-hover:bg-blue-500 group-hover:text-white transition-all">
                              <Navigation className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recipes Section */}
        {recipes.length > 0 && (
          <section className="border-b border-[#d2d2d7]/30 dark:border-[#38383a]/50 bg-gradient-to-b from-orange-50 to-amber-50 dark:from-orange-500/5 dark:to-amber-500/5">
            <div className="max-w-5xl mx-auto px-6 py-16">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp} className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">Opskrifter</h2>
                  <p className="text-[#86868b]">Lav noget lækkert med {product.name.toLowerCase()}.</p>
                </div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recipes.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    variants={scaleIn}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-[#1d1d1f] border border-[#e8e8ed] dark:border-[#38383a] hover:shadow-xl hover:border-transparent transition-all"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-semibold text-lg leading-tight">{recipe.name}</h3>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-1.5">
                        <span className="px-2 py-1 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur text-[10px] font-medium text-[#1d1d1f] dark:text-white">
                          {recipe.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between text-sm text-[#86868b]">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {recipe.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          {recipe.servings} pers.
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* Price History */}
        <section className="border-b border-[#d2d2d7]/30 dark:border-[#38383a]/50 bg-gradient-to-b from-white to-[#fbfbfd] dark:from-[#1d1d1f] dark:to-[#000000]">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp} className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">Prishistorik</h2>
                <p className="text-[#86868b]">Se prisudvikling over tid.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-white dark:bg-[#1d1d1f] rounded-2xl p-6 border border-[#e8e8ed] dark:border-[#38383a] shadow-sm">
              <PriceChart priceHistory={product.priceHistory} />
            </motion.div>
          </div>
        </section>

        {/* Price Stats */}
        <section className="border-b border-[#d2d2d7]/30 dark:border-[#38383a]/50">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp} className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">Statistik</h2>
                <p className="text-[#86868b]">Indsigt fra de seneste 90 dage.</p>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div variants={scaleIn} whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-500/20">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">Laveste pris</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">{product.lowestPrice.toFixed(2).replace('.', ',')} kr</p>
              </motion.div>
              <motion.div variants={scaleIn} whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-500/10 dark:to-red-500/10 rounded-2xl p-5 border border-rose-100 dark:border-rose-500/20">
                <p className="text-sm font-medium text-rose-700 dark:text-rose-400 mb-1">Højeste pris</p>
                <p className="text-3xl font-bold text-rose-600 dark:text-rose-400 tracking-tight">{product.highestPrice.toFixed(2).replace('.', ',')} kr</p>
              </motion.div>
              <motion.div variants={scaleIn} whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-500/10 dark:to-gray-500/10 rounded-2xl p-5 border border-slate-200 dark:border-slate-500/20">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Gennemsnit</p>
                <p className="text-3xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">{product.averagePrice.toFixed(2).replace('.', ',')} kr</p>
              </motion.div>
              <motion.div variants={scaleIn} whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-2xl p-5 border border-blue-100 dark:border-blue-500/20">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Mulig besparelse</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">{savings.toFixed(2).replace('.', ',')} kr</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-b border-[#d2d2d7]/30 dark:border-[#38383a]/50">
            <div className="max-w-5xl mx-auto px-6 py-16">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp} className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">Lignende produkter</h2>
                    <p className="text-[#86868b]">Andre produkter du måske kan lide.</p>
                  </div>
                </div>
                <motion.button whileHover={{ x: 5 }} onClick={() => navigate('/')} className="hidden sm:flex items-center gap-1 text-emerald-600 font-medium">
                  Se alle <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct) => {
                  const relatedLowest = [...relatedProduct.storePrices].sort((a, b) => a.currentPrice - b.currentPrice)[0];
                  return (
                    <motion.div key={relatedProduct.id} variants={scaleIn} whileHover={{ scale: 1.03, y: -5 }} onClick={() => navigate(`/product/${relatedProduct.id}`)} className="bg-white dark:bg-[#1d1d1f] rounded-2xl border border-[#e8e8ed] dark:border-[#38383a] overflow-hidden cursor-pointer hover:shadow-xl hover:border-transparent transition-all">
                      <div className="aspect-square bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] dark:from-[#2c2c2e] dark:to-[#1c1c1e] p-6 relative">
                        <Image alt={relatedProduct.name} src={relatedProduct.image} className="object-contain w-full h-full" fallbackSrc="https://via.placeholder.com/200x200?text=No+Image" />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-semibold text-white" style={{ backgroundColor: relatedLowest.store.color }}>{relatedLowest.store.name}</div>
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">{relatedProduct.category}</p>
                        <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-white line-clamp-2 mb-2 min-h-[40px]">{relatedProduct.name}</h3>
                        <p className="text-lg font-bold text-[#1d1d1f] dark:text-white">{relatedLowest.currentPrice.toFixed(2).replace('.', ',')} kr</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1d1d1f] dark:bg-black">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <span className="text-white font-semibold">P</span>
              </div>
              <span className="text-lg font-semibold text-white">PrisJagt</span>
            </div>
            <p className="text-sm text-[#86868b]">Priserne opdateres dagligt. Alle priser er vejledende.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
