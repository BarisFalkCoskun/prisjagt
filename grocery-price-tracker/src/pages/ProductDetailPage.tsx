import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Check
} from 'lucide-react';
import { PriceChart } from '../components';
import { getProductById, products } from '../data/products';

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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <p className="text-2xl font-semibold text-[#1d1d1f] mb-2">
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

  // Get related products (same category, different product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // If not enough from same category, fill with other products
  if (relatedProducts.length < 4) {
    const otherProducts = products
      .filter(p => p.id !== product.id && !relatedProducts.includes(p))
      .slice(0, 4 - relatedProducts.length);
    relatedProducts.push(...otherProducts);
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#d2d2d7]/30"
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
                    ? 'bg-rose-100 text-rose-500'
                    : 'bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-full bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] transition-colors"
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
        <section className="bg-white border-b border-[#d2d2d7]/30">
          <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="aspect-square bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] rounded-3xl p-12 relative overflow-hidden group"
              >
                {/* Animated decorative circles */}
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

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    alt={product.name}
                    src={product.image}
                    className="object-contain w-full h-full relative z-10"
                    fallbackSrc="https://via.placeholder.com/500x500?text=No+Image"
                  />
                </motion.div>
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.p
                  variants={fadeInUp}
                  className="text-sm font-semibold text-[#86868b] uppercase tracking-wider mb-2"
                >
                  {product.category}
                </motion.p>
                <motion.h1
                  variants={fadeInUp}
                  className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight leading-tight mb-4"
                >
                  {product.name}
                </motion.h1>
                <motion.p
                  variants={fadeInUp}
                  className="text-lg text-[#86868b] mb-8 leading-relaxed"
                >
                  {product.description}
                </motion.p>

                {/* Price Highlight */}
                <motion.div
                  variants={scaleIn}
                  className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 mb-6 border border-emerald-100"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-emerald-700">Bedste pris</p>
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-5xl font-bold text-emerald-600 tracking-tight">
                      {lowestPrice.currentPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-2xl text-emerald-500">kr</span>
                  </div>
                  <p className="text-sm text-emerald-600">
                    hos <span className="font-semibold">{lowestPrice.store.name}</span>
                    {savings > 1 && (
                      <span className="ml-2 px-2 py-0.5 bg-emerald-100 rounded-full text-xs font-semibold">
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
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-white text-base font-semibold rounded-2xl transition-all shadow-lg"
                    style={{
                      backgroundColor: lowestPrice.store.color,
                      boxShadow: `0 10px 40px -10px ${lowestPrice.store.color}50`
                    }}
                  >
                    <span>Gå til {lowestPrice.store.name}</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`px-5 py-4 rounded-2xl transition-all shadow-lg ${
                      isFavorite
                        ? 'bg-rose-500 text-white shadow-rose-500/25'
                        : 'bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed]'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Store Locations & Prices - Apple Maps Style */}
        <section className="border-b border-[#d2d2d7]/30">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="flex items-center gap-4 mb-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                  Butikker & Priser
                </h2>
                <p className="text-[#86868b]">
                  Find produktet i en butik nær dig.
                </p>
              </div>
            </motion.div>

            {/* Store Selector Pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex gap-2 mb-8 overflow-x-auto pb-2"
            >
              <button
                onClick={() => setSelectedStore(null)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedStore === null
                    ? 'bg-[#1d1d1f] text-white'
                    : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                }`}
              >
                Alle butikker
              </button>
              {sortedStorePrices.map((sp) => (
                <button
                  key={sp.store.id}
                  onClick={() => setSelectedStore(sp.store.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedStore === sp.store.id
                      ? 'text-white'
                      : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                  }`}
                  style={{
                    backgroundColor: selectedStore === sp.store.id ? sp.store.color : undefined
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: selectedStore === sp.store.id ? 'white' : sp.store.color }}
                  />
                  {sp.store.name}
                  <span className={`text-xs ${selectedStore === sp.store.id ? 'text-white/80' : 'text-[#86868b]'}`}>
                    {sp.currentPrice.toFixed(0)} kr
                  </span>
                </button>
              ))}
            </motion.div>

            {/* Map-style Location Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sortedStorePrices
                .filter(sp => selectedStore === null || sp.store.id === selectedStore)
                .map((sp, storeIndex) => {
                  const locations = storeLocations[sp.store.id as keyof typeof storeLocations] || [];
                  const isLowest = storeIndex === 0 && selectedStore === null;

                  return (
                    <motion.div
                      key={sp.store.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={scaleIn}
                      className={`rounded-2xl overflow-hidden border ${
                        isLowest ? 'ring-2 ring-emerald-300 border-emerald-200' : 'border-[#e8e8ed]'
                      }`}
                    >
                      {/* Store Header */}
                      <div
                        className="p-4 text-white relative overflow-hidden"
                        style={{ backgroundColor: sp.store.color }}
                      >
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
                            {isLowest && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full mt-1">
                                <Check className="w-3 h-3" /> Billigst
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Location List */}
                      <div className="bg-white divide-y divide-[#e8e8ed]">
                        {locations.map((location, index) => (
                          <motion.div
                            key={location.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-4 hover:bg-[#f5f5f7] transition-colors cursor-pointer group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-[#1d1d1f]">{location.address}</p>
                                  {location.isOpen && (
                                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                      Åben nu
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-[#86868b]">{location.city}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="flex items-center gap-1 text-xs text-[#86868b]">
                                    <MapPin className="w-3 h-3" />
                                    {location.distance}
                                  </span>
                                  <span className="flex items-center gap-1 text-xs text-[#86868b]">
                                    <Clock className="w-3 h-3" />
                                    {location.hours}
                                  </span>
                                </div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-full bg-[#f5f5f7] text-[#86868b] group-hover:bg-blue-500 group-hover:text-white transition-all"
                              >
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

        {/* Price History */}
        <section className="border-b border-[#d2d2d7]/30 bg-gradient-to-b from-white to-[#fbfbfd]">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="flex items-center gap-4 mb-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                  Prishistorik
                </h2>
                <p className="text-[#86868b]">
                  Se prisudvikling over tid.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-6 border border-[#e8e8ed] shadow-sm"
            >
              <PriceChart priceHistory={product.priceHistory} />
            </motion.div>
          </div>
        </section>

        {/* Price Stats */}
        <section className="border-b border-[#d2d2d7]/30">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="flex items-center gap-4 mb-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                  Statistik
                </h2>
                <p className="text-[#86868b]">
                  Indsigt fra de seneste 90 dage.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <motion.div
                variants={scaleIn}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-100"
              >
                <p className="text-sm font-medium text-emerald-700 mb-1">Laveste pris</p>
                <p className="text-3xl font-bold text-emerald-600 tracking-tight">
                  {product.lowestPrice.toFixed(2).replace('.', ',')} kr
                </p>
              </motion.div>
              <motion.div
                variants={scaleIn}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-5 border border-rose-100"
              >
                <p className="text-sm font-medium text-rose-700 mb-1">Højeste pris</p>
                <p className="text-3xl font-bold text-rose-600 tracking-tight">
                  {product.highestPrice.toFixed(2).replace('.', ',')} kr
                </p>
              </motion.div>
              <motion.div
                variants={scaleIn}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-5 border border-slate-200"
              >
                <p className="text-sm font-medium text-slate-600 mb-1">Gennemsnit</p>
                <p className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
                  {product.averagePrice.toFixed(2).replace('.', ',')} kr
                </p>
              </motion.div>
              <motion.div
                variants={scaleIn}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100"
              >
                <p className="text-sm font-medium text-blue-700 mb-1">Mulig besparelse</p>
                <p className="text-3xl font-bold text-blue-600 tracking-tight">
                  {savings.toFixed(2).replace('.', ',')} kr
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-b border-[#d2d2d7]/30">
            <div className="max-w-5xl mx-auto px-6 py-16">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={fadeInUp}
                className="flex items-center justify-between mb-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                      Lignende produkter
                    </h2>
                    <p className="text-[#86868b]">
                      Andre produkter du måske kan lide.
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/')}
                  className="hidden sm:flex items-center gap-1 text-emerald-600 font-medium"
                >
                  Se alle <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {relatedProducts.map((relatedProduct) => {
                  const relatedLowest = [...relatedProduct.storePrices].sort(
                    (a, b) => a.currentPrice - b.currentPrice
                  )[0];

                  return (
                    <motion.div
                      key={relatedProduct.id}
                      variants={scaleIn}
                      whileHover={{ scale: 1.03, y: -5 }}
                      onClick={() => navigate(`/product/${relatedProduct.id}`)}
                      className="bg-white rounded-2xl border border-[#e8e8ed] overflow-hidden cursor-pointer hover:shadow-xl hover:border-transparent transition-all"
                    >
                      <div className="aspect-square bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] p-6 relative">
                        <Image
                          alt={relatedProduct.name}
                          src={relatedProduct.image}
                          className="object-contain w-full h-full"
                          fallbackSrc="https://via.placeholder.com/200x200?text=No+Image"
                        />
                        <div
                          className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-semibold text-white"
                          style={{ backgroundColor: relatedLowest.store.color }}
                        >
                          {relatedLowest.store.name}
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                          {relatedProduct.category}
                        </p>
                        <h3 className="text-sm font-semibold text-[#1d1d1f] line-clamp-2 mb-2 min-h-[40px]">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-lg font-bold text-[#1d1d1f]">
                          {relatedLowest.currentPrice.toFixed(2).replace('.', ',')} kr
                        </p>
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
      <footer className="bg-[#1d1d1f]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <span className="text-white font-semibold">P</span>
              </div>
              <span className="text-lg font-semibold text-white">PrisJagt</span>
            </div>
            <p className="text-sm text-[#86868b]">
              Priserne opdateres dagligt. Alle priser er vejledende.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
