import { Property } from '../types';
import { X, Bed, MapPin, DollarSign, Snowflake, Sparkles, Phone, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface QuickViewModalProps {
  property: Property | null;
  onClose: () => void;
  onViewFullDetails: (id: string) => void;
}

export default function QuickViewModal({ property, onClose, onViewFullDetails }: QuickViewModalProps) {
  if (!property) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      id="quick-view-overlay-wrapper"
    >
      {/* Absolute Backdrop Glass layer */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-md cursor-zoom-out" 
      />

      {/* Floating Animated Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-2xl bg-slate-950/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        id="quick-view-card-modal"
      >
        
        {/* Close absolute button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors z-20 focus:outline-none"
          aria-label="Dismiss quick view"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Side: Thumbnail list & Hero image */}
        <div className="md:w-1/2 relative h-56 md:h-auto overflow-hidden shrink-0">
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/25 pointer-events-none" />
          
          <div className="absolute bottom-4 left-4 flex flex-col space-y-1.5 items-start">
            <span className="font-mono text-[10px] font-bold text-white bg-primary px-2.5 py-0.5 rounded uppercase tracking-wider">
              {property.type}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase font-mono shadow-md ${
              property.isAvailable !== false
                ? 'bg-emerald-500 text-white'
                : 'bg-rose-500 text-white'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full bg-white ${property.isAvailable !== false ? 'animate-pulse' : ''}`} />
              {property.isAvailable !== false ? 'Available' : 'Occupied'}
            </span>
          </div>
        </div>

        {/* Right Side: Specifications details */}
        <div className="md:w-1/2 p-5 md:p-6 flex flex-col justify-between text-left">
          
          <div>
            <span className="font-mono text-[10px] text-accent uppercase tracking-widest block font-bold mb-1.5">
              Quick Accommodation Review
            </span>

            <h3 className="font-display font-semibold text-lg text-white mb-2 leading-tight">
              {property.title}
            </h3>

            {/* Price block */}
            <div className="flex items-baseline space-x-1 mb-4 select-none">
              <span className="font-mono text-xl font-extrabold text-accent">₹{property.price.toLocaleString('en-IN')}</span>
              <span className="text-xs text-gray-400">/ month</span>
            </div>

            {/* Address pin */}
            <div className="flex items-center text-slate-400 text-xs mb-4 space-x-1 font-sans">
              <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="line-clamp-2 leading-relaxed">{property.address}</span>
            </div>

            {/* Characteristics specs rows */}
            <div className="grid grid-cols-2 gap-2.5 py-4 border-y border-white/5 font-mono text-[11px] text-gray-300">
              <div>
                <span className="text-gray-500 block text-[9.5px]">BEDROOMS</span>
                <span className="font-bold text-white">{property.bedrooms} Bed Units</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9.5px]">FURNITURE</span>
                <span className="font-bold text-white">{property.furnishing}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9.5px]">AC COOLING</span>
                <span className="font-bold text-white">{property.ac ? 'AC Equipped' : 'Non-AC Fan'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9.5px]">WALK TO LPU</span>
                <span className="font-bold text-white">{property.distanceToLPU || 'Phagwara City'}</span>
              </div>
            </div>

            {/* Short review summary */}
            <p className="text-gray-400 text-xs mt-4 leading-relaxed line-clamp-3">
              {property.description}
            </p>
          </div>

          {/* Action buttons footer */}
          <div className="flex flex-col space-y-2 mt-6">
            <button
              onClick={() => {
                onViewFullDetails(property.id);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/95 text-center transition-all select-none shadow-md shadow-primary/25"
              id="quick-view-full-details-cta"
            >
              Open Complete Details Screen
            </button>
            
            <a
              href={`https://wa.me/${property.hostWhatsApp}?text=Hello,%20I%20am%20interested%20in%20"${property.title}"%20listed%20for%20₹${property.price}/mo.`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-500/90 font-extrabold text-xs text-center flex items-center justify-center space-x-1 select-none"
              id="quick-view-whatsapp-cta"
            >
              <MessageCircle className="h-4 w-4 fill-slate-950 text-slate-950" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
export type { QuickViewModal };
