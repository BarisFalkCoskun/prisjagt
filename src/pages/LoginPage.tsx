import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MagneticButton } from '../components';

type AuthMode = 'login' | 'signup';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate('/');
    } catch {
      setError('Der opstod en fejl. Prøv igen.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    'Gem dine favoritter',
    'Sync indkøbsliste på tværs af enheder',
    'Personlige prisalarmer',
    'Gemte opskrifter',
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-black flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600">
        {/* Animated mesh gradient */}
        <motion.div
          className="absolute top-20 left-20 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[80px]"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <span className="text-white text-2xl font-bold">P</span>
              </div>
              <span className="text-2xl font-semibold text-white">PrisJagt</span>
            </div>

            <h1 className="text-5xl font-semibold text-white leading-tight mb-6">
              Spar penge.
              <br />
              <span className="text-emerald-100">Hver eneste dag.</span>
            </h1>

            <p className="text-xl text-emerald-50/90 mb-12 max-w-md">
              Log ind for at få adgang til alle funktioner og personlige besparelser.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/25">
              <span className="text-white text-2xl font-bold">P</span>
            </div>
            <span className="text-2xl font-semibold text-[#1d1d1f] dark:text-white">PrisJagt</span>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-[#1d1d1f] rounded-3xl shadow-xl shadow-black/5 dark:shadow-none border border-[#e8e8ed] dark:border-[#38383a] p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/25"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-semibold text-[#1d1d1f] dark:text-white mb-2">
                {mode === 'login' ? 'Velkommen tilbage' : 'Opret konto'}
              </h2>
              <p className="text-[#86868b]">
                {mode === 'login'
                  ? 'Log ind for at fortsætte'
                  : 'Tilmeld dig for at komme i gang'}
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-xl p-1 mb-8">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-white dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white shadow-sm'
                    : 'text-[#86868b]'
                }`}
              >
                Log ind
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white shadow-sm'
                    : 'text-[#86868b]'
                }`}
              >
                Opret konto
              </button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field (Signup only) */}
              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`relative rounded-xl border-2 transition-all ${
                        focusedField === 'name'
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10'
                          : 'border-[#e8e8ed] dark:border-[#38383a] bg-[#f5f5f7] dark:bg-[#2c2c2e]'
                      }`}
                    >
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Dit navn"
                        required={mode === 'signup'}
                        className="w-full pl-12 pr-4 py-4 bg-transparent text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-none rounded-xl"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div
                className={`relative rounded-xl border-2 transition-all ${
                  focusedField === 'email'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10'
                    : 'border-[#e8e8ed] dark:border-[#38383a] bg-[#f5f5f7] dark:bg-[#2c2c2e]'
                }`}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-none rounded-xl"
                />
              </div>

              {/* Password Field */}
              <div
                className={`relative rounded-xl border-2 transition-all ${
                  focusedField === 'password'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10'
                    : 'border-[#e8e8ed] dark:border-[#38383a] bg-[#f5f5f7] dark:bg-[#2c2c2e]'
                }`}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Adgangskode"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-transparent text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-none rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Forgot Password (Login only) */}
              {mode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Glemt adgangskode?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <MagneticButton
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                strength={0.2}
              >
                <span>{isLoading ? 'Vent venligst...' : mode === 'login' ? 'Log ind' : 'Opret konto'}</span>
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </MagneticButton>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-[#e8e8ed] dark:bg-[#38383a]" />
              <span className="text-sm text-[#86868b]">eller</span>
              <div className="flex-1 h-px bg-[#e8e8ed] dark:bg-[#38383a]" />
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button className="w-full py-3.5 rounded-xl border-2 border-[#e8e8ed] dark:border-[#38383a] bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white font-medium hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] transition-colors flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Fortsæt med Google
              </button>

              <button className="w-full py-3.5 rounded-xl border-2 border-[#e8e8ed] dark:border-[#38383a] bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white font-medium hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c] transition-colors flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                Fortsæt med Facebook
              </button>
            </div>

            {/* Terms */}
            <p className="mt-8 text-center text-xs text-[#86868b]">
              Ved at fortsætte accepterer du vores{' '}
              <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                Vilkår og betingelser
              </a>{' '}
              og{' '}
              <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                Privatlivspolitik
              </a>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            >
              ← Tilbage til forsiden
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
