import { useState, useRef, useEffect } from 'react';
import { PageId } from '../types';
import { 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  Heart, 
  Home, 
  Search, 
  Mail, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Calendar,
  Sparkles,
  Palette
} from 'lucide-react';

const THEMES = [
  { id: 'default' as const, label: 'Classic Blue', primary: 'bg-[#2563EB]', accent: 'bg-[#2DD4BF]', description: 'Cool technology slate' },
  { id: 'emerald' as const, label: 'Emerald Gold', primary: 'bg-[#059669]', accent: 'bg-[#F59E0B]', description: 'Eco-friendly premium green' },
  { id: 'sunset' as const, label: 'Sunset Rose', primary: 'bg-[#F43F5E]', accent: 'bg-[#38BDF8]', description: 'Warm energetic rose' },
  { id: 'purple' as const, label: 'Royal Purple', primary: 'bg-[#8B5CF6]', accent: 'bg-[#EC4899]', description: 'Majestic elegant violet' }
];
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface NavBarProps {
  activePage: PageId;
  onNavigate: (page: PageId, propertyId?: string | null) => void;
  savedCount: number;
}

export default function NavBar({ activePage, onNavigate, savedCount }: NavBarProps) {
  const { user, logOut, userFullName, isAdmin, adminRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  
  const [currentTheme, setCurrentTheme] = useState<'default' | 'emerald' | 'sunset' | 'purple'>(() => {
    try {
      const cached = localStorage.getItem('pg_theme');
      return (cached as any) || 'default';
    } catch (e) {
      return 'default';
    }
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  // Apply theme to html element
  useEffect(() => {
    if (currentTheme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', currentTheme);
    }
    try {
      localStorage.setItem('pg_theme', currentTheme);
    } catch (e) {}
  }, [currentTheme]);

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home' as PageId, label: 'Home', icon: Home },
    { id: 'properties' as PageId, label: 'Browse Properties', icon: Search },
    { id: 'saved' as PageId, label: 'Saved Favorites', icon: Heart, badge: savedCount },
    { id: 'contact' as PageId, label: 'Contact Us', icon: Mail }
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin' as PageId, label: 'Admin Panel', icon: Sparkles });
  }


  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Outer Glow Line decoration */}
      <div className="h-[2px] w-full bg-gradient-to-r from-primary via-accent to-primary" />
      
      {/* Container */}
      <div className="glass px-4 py-3 md:py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="flex cursor-pointer items-center space-x-2 select-none"
            id="nav-logo"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/20">
              <span className="font-display font-bold text-lg">P</span>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base md:text-lg tracking-tight text-white leading-none">
                PG in Phagwara
              </span>
              <span className="font-mono text-[9px] tracking-widest text-[var(--color-accent)] leading-none mt-1 uppercase">
                PREMIUM RENTALS
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`relative flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 select-none ${
                    isActive 
                      ? 'text-white font-semibold' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-slate-950 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded bg-accent"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Authentication & Contact CTAs wrapper */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Theme Toggle Palette Button */}
            <div className="relative" ref={themeRef}>
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all focus:outline-none select-none cursor-pointer"
                title="Change Color Theme"
                id="theme-dropdown-trigger"
              >
                <Palette className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {themeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2.5 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2.5 z-50 text-left"
                    id="theme-selector-panel"
                  >
                    <div className="px-2.5 py-2 border-b border-white/5 mb-1.5">
                      <span className="text-xs font-bold text-white block">Select Color Theme</span>
                      <span className="text-[10px] text-gray-500 block">Personalize your property portal</span>
                    </div>

                    <div className="space-y-1">
                      {THEMES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setCurrentTheme(t.id);
                            setThemeDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                            currentTheme === t.id 
                              ? 'bg-primary/15 border border-primary/20 text-white font-medium' 
                              : 'border border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold">{t.label}</span>
                            <span className="text-[9px] text-gray-500 leading-tight">{t.description}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 shrink-0 pl-3">
                            <span className={`h-3 w-3 rounded-full ${t.primary} ring-2 ring-white/10`} />
                            <span className={`h-3 w-3 rounded-full ${t.accent} ring-2 ring-white/10`} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* User Account Controls */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-white/5 transition-all focus:outline-none select-none border border-white/5"
                  id="user-profile-dropdown-trigger"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent text-slate-950 font-bold font-mono flex items-center justify-center text-xs shadow-inner">
                    {getInitials(userFullName || user.email)}
                  </div>
                  <span className="text-xs text-gray-300 font-semibold max-w-[100px] truncate">
                    {userFullName || 'Logged In'}
                  </span>
                </button>

                {/* Dropdown Menu Container */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2.5 w-60 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 text-left"
                      id="user-profile-dropdown-panel"
                    >
                      {/* Name / email view */}
                      <div className="px-3.5 py-3 border-b border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">
                            {userFullName || 'LPU Student'}
                          </span>
                        </div>
                        {isAdmin && (
                          <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">
                            🛡️ {adminRole}
                          </div>
                        )}
                        <div className="text-[10px] font-mono text-gray-500 truncate mt-1">
                          {user.email}
                        </div>
                      </div>

                      {/* Dropdown items */}
                      <div className="py-1 space-y-0.5">
                        <button
                          onClick={() => {
                            onNavigate('saved');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Heart className="h-4 w-4 text-rose-400" />
                          <span>Saved Bookmarks ({savedCount})</span>
                        </button>

                        <button
                          onClick={async () => {
                            setUserDropdownOpen(false);
                            await logOut();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Log Out Account</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center space-x-1.5 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold text-gray-200 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                id="header-login-btn"
              >
                <LogIn className="h-4 w-4 text-accent" />
                <span>Sign In / Sign Up</span>
              </button>
            )}

            {/* Direct CRM Message */}
            <a
              href="https://wa.me/919958016911?text=Hello!%20I%20am%20interested%20in%20room%20rentals%20in%20Phagwara."
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 rounded-lg bg-[#25D366]/10 px-3.5 py-2 text-xs font-semibold text-[#25D366] hover:bg-[#25D366]/20 transition-all duration-300"
              id="header-cta-whatsapp"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Hamburguer Toggle Button */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Quick Saved Link on top right of mobile nav */}
            <button 
              onClick={() => onNavigate('saved')}
              className="relative p-2 text-gray-400 hover:text-white"
            >
              <Heart className={`h-5 w-5 ${activePage === 'saved' ? 'fill-accent text-accent' : ''}`} />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-slate-950">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Mobile login prompt avatar */}
            {user ? (
              <div 
                className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent text-slate-950 font-bold font-mono flex items-center justify-center text-xs shadow-inner"
                onClick={() => { onNavigate('saved'); }}
              >
                {getInitials(userFullName || user.email)}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="p-1 rounded bg-white/5 border border-white/10 text-gray-300 hover:text-white"
                id="mobile-login-avatar-btn"
              >
                <LogIn className="h-5 w-5 text-accent" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Animated Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 right-0 z-40 bg-slate-950/95 border-b border-white/10 glass-accent p-6 md:hidden"
          >
            <div className="flex flex-col space-y-4">
              
              {user && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 text-left mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent text-slate-950 font-bold font-mono flex items-center justify-center text-sm shadow-md">
                      {getInitials(userFullName || user.email)}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs text-white truncate max-w-[140px]">
                        {userFullName || 'Account Session'}
                      </h4>
                      <p className="text-[10px] font-mono text-gray-500 truncate max-w-[140px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logOut();
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    title="Log Out Account"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Mobile Theme Swatcher */}
              <div className="flex flex-col space-y-2 text-left bg-white/5 border border-white/5 p-3 rounded-xl mb-1">
                <div className="flex items-center space-x-1.5 text-gray-300">
                  <Palette className="h-4 w-4 text-accent" />
                  <span className="text-xs font-bold font-display">Website Color Theme</span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {THEMES.map((t) => {
                    const isSelected = currentTheme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setCurrentTheme(t.id)}
                        className={`flex flex-col items-center p-2 rounded-lg border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-primary/20 border-primary text-white font-semibold' 
                            : 'bg-slate-950/40 border-white/5 text-gray-400 hover:text-white'
                        }`}
                        title={t.label}
                      >
                        <div className="flex items-center -space-x-1 mb-1.5">
                          <span className={`h-3 w-3 rounded-full ${t.primary} ring-1 ring-white/20`} />
                          <span className={`h-3 w-3 rounded-full ${t.accent} ring-1 ring-white/20`} />
                        </div>
                        <span className="text-[8px] truncate max-w-full leading-none font-medium">
                          {t.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <span className="font-mono text-xs tracking-wider text-gray-500 uppercase text-left">
                Navigation Menu
              </span>
              <div className="grid grid-cols-2 gap-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                        isActive 
                          ? 'bg-primary/20 border-primary text-white font-semibold' 
                          : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mb-2 ${isActive ? 'text-accent' : 'text-gray-400'}`} />
                      <span className="text-xs">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="mt-1 rounded-full bg-accent px-1.5 py-0.2 text-[9px] font-bold text-slate-950">
                          {item.badge} fav
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Communication CTAs */}
              <div className="pt-4 border-t border-white/5 flex flex-col space-y-3">
                
                {!user && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalOpen(true);
                    }}
                    className="flex items-center justify-center space-x-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In / Sign Up</span>
                  </button>
                )}

                <a
                  href="https://wa.me/919958016911?text=Hello!%20I%20am%20interested%20in%20rental%20properties%20in%20Phagwara."
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-slate-950 shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="h-4 w-4 text-slate-950" />
                  <span>WhatsApp Agent</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded auth Dialog */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </header>
  );
}
