import React from 'react';
import { Property } from '../types';
import { Bed, MapPin, Heart, ShieldAlert, BadgeCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface FeaturedListingsProps {
  properties: Property[];
  savedProperties: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onViewDetails: (id: string) => void;
  onQuickView: (property: Property, e: React.MouseEvent) => void;
}

export default function FeaturedListings({
  properties,
  savedProperties,
  onToggleSave,
  onViewDetails,
  onQuickView
}: FeaturedListingsProps) {
  // Filter for featured listings
  const featuredListings = properties.filter((p) => p.featured).slice(0, 6);

  return (
    <section className="py-20 bg-dark" id="featured-section">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-accent mb-2">
              <Zap className="h-4 w-4 fill-accent" />
              <span className="font-mono text-xs uppercase tracking-widest font-semibold">Premium Catalog</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
              Featured Listings in Phagwara
            </h2>
            <p className="mt-2 text-gray-400 max-w-xl text-sm md:text-base">
              Hand-picked rental accommodations near LPU campus with validated rentals, direct host lines, and checked amenities.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <span className="font-mono text-xs text-slate-500 uppercase">
              Swipe or tap details for virtual tours
            </span>
          </div>
        </div>

        {/* Featured Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((property, idx) => {
            const isSaved = savedProperties.includes(property.id);
            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass rounded-2xl overflow-hidden glow-card-hover border border-white/5 flex flex-col justify-between"
                id={`featured-card-${property.id}`}
              >
                {/* Visual Image Section */}
                <div className="relative h-56 md:h-60 overflow-hidden shrink-0 group">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Outer Dark Gradient Layer for badges visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/40" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-1.5 z-10">
                    {/* Occupied / Available indicator pill */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wider uppercase font-mono shadow-md ${
                      property.isAvailable !== false
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full bg-white ${property.isAvailable !== false ? 'animate-pulse' : ''}`} />
                      {property.isAvailable !== false ? 'Available' : 'Occupied'}
                    </span>

                    {/* Featured Star badge */}
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold text-white bg-primary shadow-md tracking-wider uppercase font-mono">
                      FEATURED
                    </span>
                    {/* Gender Preference badge if applicable */}
                    {property.genderPreference && (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase font-mono shadow-md ${
                        property.genderPreference === 'Girls'
                          ? 'bg-rose-500/90 text-white'
                          : property.genderPreference === 'Boys'
                          ? 'bg-sky-500/90 text-white'
                          : 'bg-emerald-500/90 text-white'
                      }`}>
                        {property.genderPreference} ONLY
                      </span>
                    )}
                  </div>

                  {/* Saved Heart Toggle button */}
                  <button
                    onClick={(e) => onToggleSave(property.id, e)}
                    className="absolute top-4 right-4 h-9 w-9 rounded-full bg-slate-900/65 backdrop-blur-md flex items-center justify-center text-white hover:text-rose-500 transition-colors focus:outline-none"
                    aria-label="Save Property"
                  >
                    <Heart 
                      className={`h-5 w-5 transition-all ${
                        isSaved ? 'fill-rose-500 text-rose-500 scale-110' : 'text-gray-300'
                      }`} 
                    />
                  </button>

                  {/* Price Tag badge on bottom-left */}
                  <div className="absolute bottom-4 left-4">
                    <div className="glass px-3.5 py-1.5 rounded-lg border border-white/10 flex items-baseline space-x-1">
                      <span className="font-mono text-lg font-bold text-accent">₹{property.price.toLocaleString('en-IN')}</span>
                      <span className="font-sans text-[10px] text-gray-300">/mo</span>
                    </div>
                  </div>

                  {/* Distance badge on bottom-right */}
                  {property.nearLPU && (
                    <div className="absolute bottom-4 right-4 font-mono text-[9px] font-bold text-slate-900 bg-accent px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                      <BadgeCheck className="h-3 w-3 shrink-0" />
                      <span>NEAR LPU</span>
                    </div>
                  )}
                </div>

                {/* Listing Details Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category type label */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-accent font-semibold tracking-wider uppercase">
                        {property.type}
                      </span>
                      <span className="font-mono text-[10.5px] text-slate-500 uppercase">
                        {property.size}
                      </span>
                    </div>

                    {/* Property Title click trigger details page */}
                    <h3 
                      onClick={() => onViewDetails(property.id)}
                      className="font-display font-semibold text-lg text-white hover:text-accent cursor-pointer line-clamp-1 leading-snug transition-colors mb-2"
                      title={property.title}
                    >
                      {property.title}
                    </h3>

                    {/* Location display line */}
                    <div className="flex items-center text-gray-400 text-xs mb-3 space-x-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="line-clamp-1 text-slate-300">{property.location}</span>
                    </div>

                    {/* Brief snippet */}
                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
                      {property.description}
                    </p>

                    {/* Room Stats info parameters */}
                    <div className="flex items-center gap-4 py-3 border-y border-white/5 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1.5 shrink-0">
                        <Bed className="h-3.5 w-3.5 text-primary" />
                        <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                      </span>
                      <span className="text-slate-800">•</span>
                      <span className="shrink-0">
                        {property.furnishing}
                      </span>
                      <span className="text-slate-800">•</span>
                      <span className="shrink-0">
                        {property.ac ? 'AC Room' : 'Non-AC'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Triggers */}
                  <div className="flex items-center space-x-2 mt-5">
                    <button
                      onClick={() => onViewDetails(property.id)}
                      className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-md select-none text-center ${
                        property.isAvailable !== false
                          ? 'bg-primary text-white hover:bg-primary/80 shadow-primary/10'
                          : 'bg-slate-800 text-gray-400 hover:bg-slate-700/80 border border-white/5'
                      }`}
                      id={`ft-btn-view-${property.id}`}
                    >
                      {property.isAvailable !== false ? 'View Details' : 'Occupied (Details)'}
                    </button>
                    
                    <button
                      onClick={(e) => onQuickView(property, e)}
                      className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs"
                      aria-label="Quick preview property"
                    >
                      Quick View
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
