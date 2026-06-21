import React, { useState, useEffect } from 'react';
import { PageId, FilterState, Property } from './types';
import { PROPERTIES_DATA } from './data';
import { useAuth } from './context/AuthContext';

// Import Modular Components
import NavBar from './components/NavBar';
import BottomNavBar from './components/BottomNavBar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import FeaturedListings from './components/FeaturedListings';
import Categories from './components/Categories';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import FilterBar from './components/FilterBar';
import PropertyGrid from './components/PropertyGrid';
import PropertyDetails from './components/PropertyDetails';
import ContactForm from './components/ContactForm';
import QuickViewModal from './components/QuickViewModal';
import AdminDashboard from './components/AdminDashboard';

// Icons
import { Heart, Sparkles, Building, ListFilter, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  propertyType: 'All',
  priceRange: 'All',
  furnishing: 'All',
  acStatus: 'All',
  nearLPUOnly: false,
  sortBy: 'newest'
};

export default function App() {
  const { user, dbSavedProperties, toggleFavorite, properties } = useAuth();
  const [activePage, setActivePage] = useState<PageId>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [quickViewProperty, setQuickViewProperty] = useState<Property | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Initialize saved properties from localStorage
  useEffect(() => {
    const cached = localStorage.getItem('pg_phagwara_favorites');
    if (cached) {
      try {
        setSavedProperties(JSON.parse(cached));
      } catch (err) {
        console.warn('Error reading favorites cache:', err);
      }
    }
  }, []);

  const activeSavedProperties = user ? dbSavedProperties : savedProperties;

  // Sync favorites with localStorage or Firestore
  const handleToggleSave = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card clicks
    if (user) {
      try {
        await toggleFavorite(id);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        if (errMsg.toLowerCase().includes("permission") || errMsg.toLowerCase().includes("insufficient")) {
          console.warn("[Firestore Notice] Lacking database permission to save the favorite document. Check your security rules config in Firebase Console.");
        } else {
          console.error("Error saving favorite to Firestore database:", err);
        }
      }
    } else {
      let updated: string[];
      if (savedProperties.includes(id)) {
        updated = savedProperties.filter((item) => item !== id);
      } else {
        updated = [...savedProperties, id];
      }
      setSavedProperties(updated);
      localStorage.setItem('pg_phagwara_favorites', JSON.stringify(updated));
    }
  };

  // Safe navigation wrapper with page loaders, scrolling to top smoothly
  const handleNavigate = (page: PageId, propertyId: string | null = null) => {
    setIsPageLoading(true);
    setQuickViewProperty(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Simulate loading skeleton for 400ms for luxurious app feel
    setTimeout(() => {
      setActivePage(page);
      if (propertyId) {
        setSelectedPropertyId(propertyId);
      } else if (page !== 'details') {
        setSelectedPropertyId(null);
      }
      setIsPageLoading(false);
    }, 450);
  };

  // Home Page Searching bar submission transition
  const handleHeroSearch = (type: typeof filters.propertyType, location: string) => {
    setIsPageLoading(true);
    setFilters({
      ...INITIAL_FILTERS,
      propertyType: type,
      searchQuery: location
    });
    
    setTimeout(() => {
      setActivePage('properties');
      setSelectedPropertyId(null);
      setIsPageLoading(false);
    }, 450);
  };

  // Categories Grid click transition
  const handleCategorySelect = (type: typeof filters.propertyType) => {
    setIsPageLoading(true);
    setFilters({
      ...INITIAL_FILTERS,
      propertyType: type
    });
    
    setTimeout(() => {
      setActivePage('properties');
      setSelectedPropertyId(null);
      setIsPageLoading(false);
    }, 450);
  };

  // Get current active property entity for detail views
  const activeProperty = properties.find((p) => p.id === selectedPropertyId);

  // Filter listings representing just saved favorites
  const savedListings = properties.filter((p) => activeSavedProperties.includes(p.id));

  return (
    <div className="min-h-screen bg-dark text-slate-100 font-sans selection:bg-accent selection:text-slate-950 overflow-x-hidden flex flex-col justify-between">
      
      {/* Top Sticky Navigation header */}
      <NavBar 
        activePage={activePage} 
        onNavigate={(page) => handleNavigate(page)} 
        savedCount={activeSavedProperties.length} 
      />

      {/* Main Core Content Container with Framer Motion transitions */}
      <main className="flex-1 pb-16 md:pb-6">
        
        <AnimatePresence mode="wait">
          {isPageLoading ? (
            /* skeleton structural loaders */
            <motion.div
              key="skeleton-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-7xl px-4 md:px-8 py-16 space-y-8"
            >
              {/* Fake Heading Skeleton */}
              <div className="max-w-md space-y-3">
                <div className="h-4 bg-slate-905 w-32 rounded animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />
                <div className="h-8 bg-slate-905 w-80 rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />
              </div>

              {/* Grid cards loading skeletons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="glass border border-white/5 rounded-2xl overflow-hidden p-4 space-y-4 shadow-xl"
                  >
                    {/* Image space skeleton */}
                    <div className="h-48 w-full rounded-xl bg-slate-900/60 animate-pulse relative" />
                    
                    {/* Header tags skeleton */}
                    <div className="flex justify-between">
                      <div className="h-3 bg-slate-900 w-16 rounded animate-pulse" />
                      <div className="h-3 bg-slate-900 w-12 rounded animate-pulse" />
                    </div>

                    {/* Title body skeleton */}
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-900 w-full rounded animate-pulse" />
                      <div className="h-4 bg-slate-900 w-2/3 rounded animate-pulse" />
                    </div>

                    {/* Bottom action row skeleton */}
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <div className="h-9 bg-slate-900 flex-1 rounded-lg animate-pulse" />
                      <div className="h-9 bg-slate-900 w-20 rounded-lg animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            
            /* Actual Section Route Views */
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {/* HOME ROUTE */}
              {activePage === 'home' && (
                <div id="home-view-wrapper">
                  <Hero 
                    onBrowseClick={() => handleNavigate('properties')} 
                    onContactClick={() => handleNavigate('contact')}
                    onSearch={handleHeroSearch}
                  />
                  <Stats />
                  <FeaturedListings 
                    properties={properties} 
                    savedProperties={activeSavedProperties}
                    onToggleSave={handleToggleSave}
                    onViewDetails={(id) => handleNavigate('details', id)}
                    onQuickView={(p) => setQuickViewProperty(p)}
                  />
                  <Categories onCategorySelect={handleCategorySelect} />
                  <WhyChooseUs />
                  <Testimonials />
                </div>
              )}

              {/* PROPERTIES DIRECTORY ROUTE */}
              {activePage === 'properties' && (
                <div className="mx-auto max-w-7xl px-4 md:px-8 py-12" id="directory-view-wrapper">
                  {/* Page header */}
                  <div className="mb-10 text-center md:text-left">
                    <span className="font-mono text-xs text-accent uppercase tracking-widest font-bold">
                      Verified Living Complexes
                    </span>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white mt-1">
                      Available Rentals in Phagwara
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base mt-2 max-w-xl">
                      Configure custom filters or explore direct landlord contacts across LPU Law Gate, Urban Estate, or Hargobind Nagar.
                    </p>
                  </div>

                  {/* Filter bar + Listings Grid */}
                  <div className="flex flex-col space-y-8">
                    <FilterBar filters={filters} onFilterChange={setFilters} />
                    <PropertyGrid 
                      properties={properties} 
                      filters={filters} 
                      savedProperties={activeSavedProperties}
                      onToggleSave={handleToggleSave}
                      onViewDetails={(id) => handleNavigate('details', id)}
                      onQuickView={(p) => setQuickViewProperty(p)}
                    />
                  </div>
                </div>
              )}

              {/* SAVED FAVORITES ROUTE */}
              {activePage === 'saved' && (
                <div className="mx-auto max-w-7xl px-4 md:px-8 py-12" id="saved-view-wrapper">
                  {/* Header Title */}
                  <div className="mb-10 text-center md:text-left">
                    <span className="font-mono text-xs text-accent uppercase tracking-widest font-bold">
                      Your Selected Accommodations
                    </span>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white mt-1 flex items-center justify-center md:justify-start gap-3">
                      Saved Properties <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base mt-2 max-w-xl">
                      Directly evaluate and compare details of your favorited student hostel rooms, PG plans, or family homes. Close direct owner negotiations.
                    </p>
                  </div>

                  {savedListings.length === 0 ? (
                    /* Saved Empty State */
                    <div className="glass p-16 rounded-3xl border border-dashed border-white/10 text-center max-w-xl mx-auto flex flex-col items-center py-20">
                      <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-5 border border-rose-500/20">
                        <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
                      </div>
                      <h3 className="font-display font-medium text-lg text-white mb-2">Your Saved List is Empty</h3>
                      <p className="text-gray-400 text-xs leading-relaxed mb-6">
                        No property favorited yet! Scroll through our featured and general catalogs and click the heart icon on cards to save rooms you like.
                      </p>
                      <button
                        onClick={() => handleNavigate('properties')}
                        className="px-6 py-3 rounded-lg bg-primary text-white font-bold text-xs select-none hover:bg-primary/95 transition-all text-center flex items-center gap-1.5"
                      >
                        <span>Browse Properties Catalogue</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    /* Display saved property lists */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedListings.map((property) => (
                        <div
                          key={property.id}
                          className="glass rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-between glow-card-hover"
                          id={`saved-item-${property.id}`}
                        >
                          <div className="relative h-48 overflow-hidden shrink-0">
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {/* Unsave action absolute bin banner */}
                            <button
                              onClick={(e) => handleToggleSave(property.id, e)}
                              className="absolute top-3.5 right-4 h-9 w-9 rounded-full bg-slate-950/75 backdrop-blur-md text-rose-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                              title="Remove from favorites"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>

                            <div className="absolute bottom-3 left-4">
                              <span className="font-mono text-[9px] font-bold text-white bg-primary px-2 py-0.5 rounded uppercase">
                                {property.type}
                              </span>
                            </div>

                            <div className="absolute bottom-3 right-4">
                              <span className="font-mono text-xs font-extrabold text-accent bg-slate-950/80 px-2 py-1 rounded">
                                ₹{property.price.toLocaleString('en-IN')}/mo
                              </span>
                            </div>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between text-left">
                            <div>
                              <h4 className="font-display font-semibold text-base text-white line-clamp-1 leading-snug mb-1">
                                {property.title}
                              </h4>
                              <p className="text-gray-400 text-xs mb-3">{property.location}</p>
                            </div>

                            <button
                              onClick={() => handleNavigate('details', property.id)}
                              className="w-full py-2 rounded-lg bg-primary text-white font-bold text-xs hover:bg-primary/80 transition-colors text-center"
                            >
                              Open Details Page
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* CONTACT ROUTE */}
              {activePage === 'contact' && (
                <div className="mx-auto max-w-7xl px-4 md:px-8 py-12" id="contact-view-wrapper">
                  {/* Header */}
                  <div className="mb-10 text-center md:text-left">
                    <span className="font-mono text-xs text-accent uppercase tracking-widest font-bold">
                      Connect with local agents
                    </span>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white mt-1">
                      Contact PG in Phagwara
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base mt-2 max-w-xl">
                      Have questions regarding LPU student guidelines? Our city representative and support desk is waiting to guide you.
                    </p>
                  </div>

                  <ContactForm />
                </div>
              )}

              {/* PROPERTY DETAILS ROUTE */}
              {activePage === 'details' && activeProperty && (
                <div className="mx-auto max-w-7xl px-4 md:px-8 py-12" id="details-view-wrapper">
                  <PropertyDetails
                    property={activeProperty}
                    onBack={() => handleNavigate('properties')}
                    savedProperties={activeSavedProperties}
                    onToggleSave={handleToggleSave}
                    onViewDetails={(id) => handleNavigate('details', id)}
                    onQuickView={(p) => setQuickViewProperty(p)}
                  />
                </div>
              )}

              {/* ADMIN REGISTERED PORTAL ROUTE */}
              {activePage === 'admin' && (
                <div id="admin-dashboard-view-wrapper" className="animate-fadeIn">
                  <AdminDashboard />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Persistent global Footer */}
      <Footer onNavigate={(page) => handleNavigate(page)} />

      {/* Sticky Bottom Navigation for Mobile Phones */}
      <BottomNavBar 
        activePage={activePage} 
        onNavigate={(page) => handleNavigate(page)} 
        savedCount={activeSavedProperties.length} 
      />

      {/* Portal QuickView Dialog overlay */}
      <AnimatePresence>
        {quickViewProperty && (
          <QuickViewModal
            property={quickViewProperty}
            onClose={() => setQuickViewProperty(null)}
            onViewFullDetails={(id) => handleNavigate('details', id)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
