import React, { useState, useEffect } from 'react';
import { PropertyType } from '../types';
import { Search, MapPin, Building2, ShieldCheck, Milestone, ArrowRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  onBrowseClick: () => void;
  onContactClick: () => void;
  onSearch: (type: PropertyType | 'All', location: string) => void;
}

const CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'
];

const LOCATIONS = [
  'Law Gate, Near LPU',
  'Maheru, Near LPU',
  'Urban Estate, Phagwara',
  'GT Road, Phagwara',
  'Miya Ji Chowk, Phagwara',
  'Plahi Road, Phagwara'
];

const PROPERTY_TYPES: PropertyType[] = [
  'PG',
  'Single Room',
  '1 BHK',
  '2 BHK',
  '3 BHK',
  '4 BHK',
  '5 BHK',
  'Independent House'
];

export default function Hero({ onBrowseClick, onContactClick, onSearch }: HeroProps) {
  const [currentBg, setCurrentBg] = useState(0);
  const [searchType, setSearchType] = useState<PropertyType | 'All'>('All');
  const [searchLocation, setSearchLocation] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchType, searchLocation);
  };

  return (
    <section className="relative min-h-[92vh] md:min-h-[85vh] flex items-center justify-center py-12 px-4 md:px-8 overflow-hidden bg-slate-950">
      
      {/* Background Image Carousel with absolute positioning */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.45, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 bg-cover bg-center bg-no-referrer"
            style={{ 
              backgroundImage: `url(${CAROUSEL_IMAGES[currentBg]})` 
            }}
          />
        </AnimatePresence>
        
        {/* Dark Vignette Overlay and Accent Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-dark/50" />
        <div className="absolute -top-[20%] left-[10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute -bottom-[10%] right-[5%] h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Verification Pill with Micro-pulse */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent mb-6"
          id="hero-verified-badge"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="font-mono text-[10px] md:text-xs font-semibold tracking-wider uppercase">
            #1 Student &amp; Family Favorite in Phagwara
          </span>
        </motion.div>

        {/* Catchy Premium Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl"
          id="hero-title"
        >
          Find Your Perfect <span className="bg-gradient-to-r from-blue-500 via-sky-400 to-accent bg-clip-text text-transparent">PG, Room or House</span> in Phagwara
        </motion.h1>

        {/* Elegant descriptive subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-gray-300 text-base md:text-xl font-normal max-w-2xl leading-relaxed"
          id="hero-subtitle"
        >
          Double-verified rental properties near <span className="text-white font-semibold underline decoration-accent/60 underline-offset-4">Lovely Professional University (LPU)</span> and across secure Phagwara neighborhoods.
        </motion.p>

        {/* Large search bar widget with Glassmorphic panels */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-4xl mt-10"
        >
          <form 
            onSubmit={handleSearchSubmit}
            className="glass p-4 rounded-2xl md:rounded-full border border-white/10 flex flex-col md:flex-row items-center gap-3 md:gap-2 shadow-2xl bg-slate-900/80 shadow-primary/5"
            id="hero-search-form"
          >
            {/* Search Part 1: Location selection */}
            <div className="relative w-full flex-1 flex items-center px-4 py-2.5 md:py-1 border-b border-white/5 md:border-b-0 md:border-r border-white/10">
              <MapPin className="text-accent h-5 w-5 mr-3 shrink-0" />
              <div className="flex-1 text-left">
                <label className="block text-[10px] font-mono tracking-wider text-gray-400 uppercase leading-none">
                  SEARCH NEIGHBORHOOD
                </label>
                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none focus:ring-0 cursor-pointer pt-1"
                  aria-label="Filter by Location"
                >
                  <option value="" className="bg-slate-900 text-gray-400">Anywhere in Phagwara</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-slate-900 text-white">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Part 2: Property Type drop filter */}
            <div className="relative w-full flex-1 flex items-center px-4 py-2.5 md:py-1">
              <Building2 className="text-blue-500 h-5 w-5 mr-3 shrink-0" />
              <div className="flex-1 text-left">
                <label className="block text-[10px] font-mono tracking-wider text-gray-400 uppercase leading-none">
                  PROPERTY CATEGORY
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as PropertyType | 'All')}
                  className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none focus:ring-0 cursor-pointer pt-1"
                  aria-label="Filter by Property Type"
                >
                  <option value="All" className="bg-slate-900 text-white">Any Property Type</option>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-slate-900 text-white">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit search trigger */}
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-4 md:py-3.5 rounded-xl md:rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/95 hover:glow-blue active:scale-98 transition-all duration-300 flex items-center justify-center space-x-2 shrink-0 shadow-lg shadow-primary/35"
              id="hero-submit-search"
            >
              <Search className="h-4 w-4" />
              <span>Search Property</span>
            </button>
          </form>
        </motion.div>

        {/* Buttons: Primary Call To Action Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full px-4"
        >
          <button
            onClick={onBrowseClick}
            className="w-full sm:w-auto px-8 py-3 rounded-xl border border-white/10 hover:border-accent text-white font-medium hover:bg-white/5 transition-all duration-300 flex items-center justify-center space-x-2 active:scale-95 group text-sm"
            id="hero-browse-direct"
          >
            <span>Browse All Listings</span>
            <ArrowRight className="h-4 w-4 text-accent group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={onContactClick}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-900/65 border border-primary/20 hover:border-primary text-gray-300 hover:text-white font-medium transition-all duration-300 flex items-center justify-center space-x-2 active:scale-95 text-sm"
            id="hero-contact-direct"
          >
            <span>Contact Verified Agent</span>
          </button>
        </motion.div>

        {/* Trust metrics labels underneath */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-slate-500 text-xs tracking-wide uppercase font-semibold"
        >
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-accent" /> 100% Genuine Landlords</span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="flex items-center gap-1.5"><Milestone className="h-4 w-4 text-primary" /> Affordable-Rent Options Near LPU Law Gate</span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-amber-400 fill-amber-400" /> Rated 4.8/5 by University Cohorts</span>
        </motion.div>

      </div>
    </section>
  );
}
