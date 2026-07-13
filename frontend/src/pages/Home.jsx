import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2,
  LockKeyhole
} from 'lucide-react';

export default function Home({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || '';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError('Please provide all required fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        // Sign In Request
        const loginData = {
          email: formData.email,
          password: formData.password
        };
        const response = await axios.post(
          `${apiUrl}/api/auth/login`, 
          loginData, 
          { withCredentials: true }
        );
        
        setSuccessMsg('Authenticating session...');
        setTimeout(() => {
          onAuthSuccess(response.data);
        }, 600);
      } else {
        // Sign Up Request
        const signUpData = {
          name: formData.name,
          email: formData.email,
          password: formData.password
        };
        const response = await axios.post(
          `${apiUrl}/api/auth/signup`, 
          signUpData, 
          { withCredentials: true }
        );
        
        setSuccessMsg('Account compiled successfully!');
        setTimeout(() => {
          onAuthSuccess(response.data);
        }, 600);
      }
    } catch (err) {
      console.error('Auth handler error:', err);
      setError(err.response?.data?.error || 'Authorization rejected. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="home_view" className="min-h-screen w-full flex flex-col justify-between relative overflow-hidden text-zinc-800 dark:text-zinc-100 p-4 sm:p-6 lg:p-8">
      
      {/* Immersive Floating Elements with infinite slow bouncy movements */}
      <motion.div 
        id="bg_ambient_orb_1"
        animate={{ 
          y: [-15, 15, -15], 
          x: [0, 10, 0], 
          scale: [1, 1.05, 1] 
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-10 right-10 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-3xl pointer-events-none"
      />
      
      <motion.div 
        id="bg_ambient_orb_2"
        animate={{ 
          y: [20, -20, 20], 
          x: [0, -15, 0], 
          scale: [1.02, 0.95, 1.02] 
        }}
        transition={{ 
          duration: 14, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute -bottom-16 -left-16 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/12 blur-3xl pointer-events-none"
      />

      <motion.div 
        id="bg_ambient_orb_3"
        animate={{ 
          y: [-10, 20, -10], 
          scale: [0.9, 1.1, 0.9] 
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-pink-500/5 dark:bg-pink-500/8 blur-3xl pointer-events-none"
      />

      {/* Floating interactive micro-particles */}
      <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-blue-400/30 dark:bg-blue-400/50 animate-float-slow pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-3.5 h-3.5 rounded-full bg-indigo-400/20 dark:bg-indigo-400/40 animate-float-slow-reverse pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-pink-400/25 dark:bg-pink-400/45 animate-float-slow pointer-events-none"></div>

      {/* Top Header */}
      <header id="brand_header" className="w-full max-w-6xl mx-auto flex justify-between items-center z-10 py-3">
        <div id="brand_info" className="flex items-center gap-3">
          <div id="brand_avatar" className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5.5 h-5.5 text-white animate-pulse" />
          </div>
          <div>
            <h1 id="brand_title" className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
              Vivid<span className="text-blue-500">Do</span>
            </h1>
            <span id="brand_badge" className="block text-[9px] text-zinc-500 font-bold tracking-wider uppercase">Frosted Glass Platform</span>
          </div>
        </div>
      </header>

      {/* Central Login/Register Section */}
      <main id="auth_main" className="flex-1 w-full max-w-6xl mx-auto flex items-center justify-center z-10 py-8">
        <motion.div 
          id="glass_auth_panel"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle gradient bar at the top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>

          {/* Form Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] font-bold tracking-wide uppercase mb-3.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
              Synchronized Node
            </div>
            
            <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-zinc-900 dark:text-white">
              {isLogin ? 'Log In to System' : 'Create Credentials'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
              {isLogin ? 'Access your synchronized dashboard instantly' : 'Set up your credentials to begin managing tasks'}
            </p>
          </div>

          {/* Tabs - Slide transition style */}
          <div className="grid grid-cols-2 p-1 bg-zinc-200/60 dark:bg-white/[0.03] border border-zinc-300/30 dark:border-white/5 rounded-2xl mb-6 relative">
            <button
              id="tab_login"
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2.5 text-xs font-extrabold rounded-xl transition-all duration-300 relative z-10 cursor-pointer ${
                isLogin ? 'text-zinc-900 dark:text-white font-black' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
              }`}
            >
              Sign In
              {isLogin && (
                <motion.div 
                  layoutId="active_tab_glare"
                  className="absolute inset-0 bg-white/80 dark:bg-white/[0.08] border border-white/50 dark:border-white/10 rounded-xl -z-10 shadow-sm"
                />
              )}
            </button>
            <button
              id="tab_register"
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2.5 text-xs font-extrabold rounded-xl transition-all duration-300 relative z-10 cursor-pointer ${
                !isLogin ? 'text-zinc-900 dark:text-white font-black' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
              }`}
            >
              Register
              {!isLogin && (
                <motion.div 
                  layoutId="active_tab_glare"
                  className="absolute inset-0 bg-white/80 dark:bg-white/[0.08] border border-white/50 dark:border-white/10 rounded-xl -z-10 shadow-sm"
                />
              )}
            </button>
          </div>

          {/* User Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs font-semibold flex items-center gap-2"
              >
                <LockKeyhole className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name Input (Register Mode Only) */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Priyanshu Rahate"
                    className="w-full bg-zinc-100/50 dark:bg-black/25 border border-zinc-200 dark:border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition-colors duration-250"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. name@example.com"
                  className="w-full bg-zinc-100/50 dark:bg-black/25 border border-zinc-200 dark:border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition-colors duration-250"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Password</label>
                {isLogin && (
                  <span className="text-[10px] text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer font-semibold">Forgot Key?</span>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-100/50 dark:bg-black/25 border border-zinc-200 dark:border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-xl py-2.5 pl-10 pr-10 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition-colors duration-250"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Actions */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-zinc-500 disabled:to-zinc-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 mt-4 cursor-pointer text-xs sm:text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Authorize & Open Workspace' : 'Initialize Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer stats inside Panel */}
          <div className="mt-6 pt-5 border-t border-zinc-200/50 dark:border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
            <span className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              Client Security Active
            </span>
            <span>REST API Session</span>
          </div>
        </motion.div>
      </main>

      {/* Ambient slow bouncy ring decoration in the screen */}
      <motion.div 
        animate={{ 
          y: [-12, 12, -12], 
          rotate: [0, 360] 
        }}
        transition={{ 
          duration: 16, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute bottom-12 right-12 w-16 h-16 rounded-full border border-dashed border-zinc-300 dark:border-white/10 pointer-events-none hidden md:block"
      />

      {/* Screen bottom footer */}
      <footer id="general_footer" className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center z-10 py-4 border-t border-zinc-200 dark:border-white/5 text-[11px] text-zinc-400 gap-2">
        <span>© 2026 VividDo. Responsive frosted deck matrix.</span>
        <div className="flex gap-4 font-semibold">
          <span className="hover:text-blue-500 transition-colors">SPA Endpoint Mode</span>
          <span className="hover:text-blue-500 transition-colors">Dark Theme Optimized</span>
        </div>
      </footer>
    </div>
  );
}
