import React, { useState, useMemo, useEffect } from 'react';
import { Property, FilterState } from '../types';
import { Bed, MapPin, Heart, ListFilter, AlertCircle, RefreshCw, BadgeCheck, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PropertyGridProps {
  properties: Property[];
  filters: FilterState;
  savedProperties: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onViewDetails: (id: string) => void;
  onQuickView: (property: Property, e: React.MouseEvent) => void;
}

const ITEMS_PER_PAGE = 6;

export default function PropertyGrid({
  properties,
  filters,
  savedProperties,
  onToggleSave,
  onViewDetails,
  onQuickView
}: PropertyGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Set page back to one when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Apply robust filtering logic on properties dataset
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // 1. Search Query on Location or Title or description
    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.location.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }

    // 2. Property Type
    if (filters.propertyType !== 'All') {
      result = result.filter((p) => p.type === filters.propertyType);
    }

    // 3. Price Filter (₹3000-₹5000, ₹5000-₹8000, ₹8000-₹12000, ₹12000+)
    if (filters.priceRange !== 'All') {
      if (filters.priceRange === '3000-5000') {
        result = result.filter((p) => p.price >= 3000 && p.price <= 5000);
      } else if (filters.priceRange === '5000-8000') {
        result = result.filter((p) => p.price >= 5000 && p.price <= 8000);
      } else if (filters.priceRange === '8000-12000') {
        result = result.filter((p) => p.price >= 8000 && p.price <= 12000);
      } else if (filters.priceRange === '12000+') {
        result = result.filter((p) => p.price >= 12000);
      }
    }

    // 4. Furnishing
    if (filters.furnishing !== 'All') {
      result = result.filter((p) => p.furnishing === filters.furnishing);
    }

    // 5. AC Status ('All' | 'AC' | 'Non AC')
    if (filters.acStatus !== 'All') {
      const isAC = filters.acStatus === 'AC';
      result = result.filter((p) => p.ac === isAC);
    }

    // 6. Near LPU
    if (filters.nearLPUOnly) {
      result = result.filter((p) => p.nearLPU);
    }

    // 7. Sorters
    if (filters.sortBy === 'low-to-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'high-to-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
    }

    return result;
  }, [properties, filters]);

  // Calculate Paginated items slice
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);

  const startRange = filteredProperties.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRange = Math.min(currentPage * ITEMS_PER_PAGE, filteredProperties.length);

  return (
    <div className="w-full flex flex-col space-y-6" id="properties-grid-container">
      
      {/* Search statistics label */}
      <div className="flex items-center justify-between py-1 px-1">
        <span className="font-mono text-xs text-gray-500 uppercase">
          Showing {startRange} - {endRange} of {filteredProperties.length} Properties Match
        </span>
        
        {filteredProperties.length > 0 && (
          <span className="text-xs text-accent font-semibold flex items-center gap-1">
            <BadgeCheck className="h-4 w-4" /> Fully Verified
          </span>
        )}
      </div>

      {isLoading ? (
        /* Loader block */
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 text-accent animate-spin" />
          <span className="font-mono text-xs text-slate-500 mt-4 uppercase">Recalculating listings...</span>
        </div>
      ) : filteredProperties.length === 0 ? (
        /* Empty Results Component */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-3xl border border-dashed border-white/10 text-center flex flex-col items-center justify-center py-16"
          id="empty-listings-state"
        >
          <div className="h-14 w-14 rounded-full bg-slate-900 flex items-center justify-center text-gray-500 mb-4 border border-white/5">
            <ListFilter className="h-6 w-6 text-accent" />
          </div>
          <h3 className="font-display font-medium text-lg text-white mb-1.5">No Matching Properties Found</h3>
          <p className="text-gray-400 text-xs max-w-sm mx-auto leading-relaxed mb-6">
            We couldn't locate any listings fitting your exact search combination in Phagwara. Let's try adjusting price, furnishing status, or clearing the query tags.
          </p>
        </motion.div>
      ) : (
        /* Property Cards Grid */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {paginatedProperties.map((property, idx) => {
                const isSaved = savedProperties.includes(property.id);
                return (
                  <motion.div
                    key={property.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="glass rounded-2xl overflow-hidden glow-card-hover border border-white/5 flex flex-col justify-between"
                    id={`active-grid-card-${property.id}`}
                  >
                    {/* Upper Image container block */}
                    <div className="relative h-52 overflow-hidden shrink-0 group">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Dark Vignette Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/35" />

                      {/* Top Badges */}
                      <div className="absolute top-3.5 left-4 flex flex-col space-y-1.5 z-10">
                        {/* Occupied / Available indicator pill */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider uppercase font-mono shadow-md ${
                          property.isAvailable !== false
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}>
                          <span className={`h-1 w-1 rounded-full bg-white ${property.isAvailable !== false ? 'animate-pulse' : ''}`} />
                          {property.isAvailable !== false ? 'Available' : 'Occupied'}
                        </span>

                        {property.genderPreference && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase font-mono shadow-md ${
                            property.genderPreference === 'Girls'
                              ? 'bg-rose-500/95 text-white'
                              : property.genderPreference === 'Boys'
                              ? 'bg-sky-500/95 text-white'
                              : 'bg-emerald-500/95 text-white'
                          }`}>
                            {property.genderPreference}
                          </span>
                        )}
                        {property.distanceToLPU && property.nearLPU && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold text-slate-950 bg-accent tracking-wider uppercase font-mono">
                            {property.distanceToLPU.split(' ')[0]} to LPU
                          </span>
                        )}
                      </div>

                      {/* Favorite Heart Toggler */}
                      <button
                        onClick={(e) => onToggleSave(property.id, e)}
                        className="absolute top-3.5 right-4 h-8.5 w-8.5 rounded-full bg-slate-950/70 backdrop-blur-md flex items-center justify-center text-white hover:text-rose-500 transition-colors focus:outline-none"
                        aria-label="Toggle favorite"
                      >
                        <Heart 
                          className={`h-4.5 w-4.5 transition-all ${
                            isSaved ? 'fill-rose-500 text-rose-500 scale-110' : 'text-gray-300'
                          }`} 
                        />
                      </button>

                      {/* Price Segment bottom left */}
                      <div className="absolute bottom-3 right-4">
                        <div className="glass px-2.5 py-1 rounded border border-white/10 flex items-baseline space-x-0.5">
                          <span className="font-mono text-base font-extrabold text-accent">₹{property.price.toLocaleString('en-IN')}</span>
                          <span className="font-sans text-[9px] text-gray-300">/mo</span>
                        </div>
                      </div>

                      {/* Rent details label count */}
                      <div className="absolute bottom-3.5 left-4 flex items-center space-x-1">
                        <span className="font-mono text-[9px] font-bold text-white bg-slate-900/85 px-1.5 py-0.5 rounded uppercase">
                          {property.size}
                        </span>
                      </div>
                    </div>

                    {/* Middle details description content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Tags and sizes info parameters */}
                        <div className="flex items-center justify-between mb-1.5 select-none">
                          <span className="font-mono text-[10px] text-accent font-semibold uppercase tracking-wider">
                            {property.type}
                          </span>
                          
                          {/* Rating score layout */}
                          <div className="flex items-center space-x-1 text-slate-400">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            <span className="font-mono text-[10px] font-bold text-slate-300">{property.rating}</span>
                          </div>
                        </div>

                        {/* Property title */}
                        <h4 
                          onClick={() => onViewDetails(property.id)}
                          className="font-display font-semibold text-base text-white hover:text-accent cursor-pointer line-clamp-1 leading-snug transition-colors mb-1.5"
                          title={property.title}
                        >
                          {property.title}
                        </h4>

                        {/* Location address */}
                        <div className="flex items-center text-slate-400 text-[11px] mb-3 space-x-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span className="line-clamp-1">{property.location}</span>
                        </div>

                        {/* Room characteristics parameters inline row */}
                        <div className="flex items-center gap-3.5 py-2.5 border-t border-white/5 text-[10.5px] font-mono text-slate-400 select-none">
                          <span className="flex items-center gap-1 shrink-0">
                            <Bed className="h-3.5 w-3.5 text-primary" />
                            <span>{property.bedrooms} Bed</span>
                          </span>
                          <span className="text-slate-800">•</span>
                          <span className="shrink-0">{property.furnishing}</span>
                          <span className="text-slate-800">•</span>
                          <span className="shrink-0">{property.ac ? 'AC' : 'Non-AC'}</span>
                        </div>
                      </div>

                      {/* Card Action footer links button */}
                      <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-white/5">
                        <button
                          onClick={() => onViewDetails(property.id)}
                          className={`flex-1 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm select-none text-center ${
                            property.isAvailable !== false
                              ? 'bg-primary text-white hover:bg-primary/80'
                              : 'bg-slate-800 text-gray-400 hover:bg-slate-700/80 border border-white/5'
                          }`}
                          id={`prop-btn-view-${property.id}`}
                        >
                          {property.isAvailable !== false ? 'Details Page' : 'Occupied (Details)'}
                        </button>
                        
                        <button
                          onClick={(e) => onQuickView(property, e)}
                          className="px-2.5 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-xs"
                          aria_label="Quick view property layout"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Simple Grid Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-white/5" id="listings-pagination">
              <button
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-white/5 hover:border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                id="pagination-prev"
              >
                Previous Page
              </button>
              
              {/* Pagination Dots indicating actual indices */}
              <div className="flex space-x-1 text-xs">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => {
                        setCurrentPage(pNum);
                        window.scrollTo({ top: 180, behavior: 'smooth' });
                      }}
                      className={`h-8 w-8 rounded-lg font-mono font-bold transition-all ${
                        currentPage === pNum
                          ? 'bg-primary text-white scale-110 shadow-md shadow-primary/25'
                          : 'text-gray-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-white/5 hover:border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                id="pagination-next"
              >
                Next Page
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
}
export type { PropertyGrid };
