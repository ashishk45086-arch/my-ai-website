import React, { useState } from 'react';
import { Property, AmenityType } from '../types';
import { PROPERTIES_DATA } from '../data';
import { useAuth } from '../context/AuthContext';
import { 
  Wifi, Bed, Snowflake, Car, Utensils, Disc, 
  Droplets, BookOpen, Server, ShieldCheck, 
  MapPin, Phone, MessageCircle, Calendar, 
  ArrowLeft, Heart, Check, HelpCircle, 
  DollarSign, Info, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PropertyDetailsProps {
  property: Property;
  onBack: () => void;
  savedProperties: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onViewDetails: (id: string) => void;
  onQuickView: (property: Property, e: React.MouseEvent) => void;
}

// Map key amenities to their standard visual icons
const AMENITY_ICONS: Record<AmenityType, any> = {
  'WiFi': Wifi,
  'Bed': Bed,
  'AC': Snowflake,
  'Parking': Car,
  'Kitchen': Utensils,
  'Washing Machine': Disc,
  'RO Water': Droplets,
  'Study Table': BookOpen,
  'Refrigerator': Server,
  'CCTV': ShieldCheck,
  'Geyser': Droplets,
  'Power Backup': Snowflake,
  'Meals Included': Utensils
};

export default function PropertyDetails({
  property,
  onBack,
  savedProperties,
  onToggleSave,
  onViewDetails,
  onQuickView
}: PropertyDetailsProps) {
  const { user, dbSavedProperties, bookVisit, properties } = useAuth();
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ transform: 'scale(1)' });
  const [selectedVisitDate, setSelectedVisitDate] = useState('');
  const [visitTimeSlot, setVisitTimeSlot] = useState('11:00 AM - 12:30 PM');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Toggle Save Favorite status
  const isSaved = user ? dbSavedProperties.includes(property.id) : savedProperties.includes(property.id);

  // Filter similar properties (matches the same neighborhood or same property type)
  const similarProperties = properties.filter(
    (p) => p.id !== property.id && (p.type === property.type || p.location === property.location)
  ).slice(0, 3);

  // Main Photo mouse movement zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.5)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: 'scale(1)' });
  };

  // Submit visit booking form
  const handleBookVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorPhone || !selectedVisitDate) return;
    setBookingError(null);
    
    try {
      if (user) {
        await bookVisit(property.id, visitorName, visitorPhone, selectedVisitDate, visitTimeSlot);
      }
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setVisitorName('');
        setVisitorPhone('');
        setSelectedVisitDate('');
      }, 5000);
    } catch (err: any) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.toLowerCase().includes("permission") || errMsg.toLowerCase().includes("insufficient")) {
        console.warn("[Firestore Notice] Registering visit booking was restricted by permission rules. Ensure books/visits can be created.");
      } else {
        console.error(err);
      }
      setBookingError("Failed to register booking in Firestore. Make sure you are signed in.");
    }
  };

  // Pre-formatted messages for WhatsApp and Dialer
  const formattedWhatsAppText = encodeURIComponent(
    `Hello! I saw your listing for "${property.title}" on the PG in Phagwara platform. Rent: ₹${property.price}/month. I would like to query more details or schedule a visit.`
  );

  return (
    <div className="w-full text-left" id="property-details-container">
      
      {/* Upper Back breadcrumb line */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-accent hover:text-white transition-colors mb-6 cursor-pointer"
        id="detail-back-button"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Directory</span>
      </button>

      {/* Main Grid: Left is Gallery + Info + Amenities + Google map; Right is Booking checkout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Section (8 span) */}
        <div className="lg:col-span-8 flex flex-col space-y-8">
          
          {/* Section 1: Dynamic Image Gallery */}
          <div className="flex flex-col space-y-3" id="details-image-gallery">
            {/* Full-width Main Gallery Box with Zoom scale */}
            <div 
              className="relative h-96 md:h-[450px] w-full rounded-2xl overflow-hidden glass border border-white/5 cursor-zoom-in group"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Image element with dynamic zoom styles */}
              <img
                src={property.images[activeImgIndex] || property.images[0]}
                alt={property.title}
                className="h-full w-full object-cover transition-transform duration-200 select-none"
                style={zoomStyle}
                referrerPolicy="no-referrer"
              />

              {/* Dark Overlay decoration */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />

              {/* Floating indicators */}
              <span className="absolute bottom-4 right-4 bg-slate-950/70 border border-white/10 px-3 py-1 rounded-md text-[10px] font-mono text-white select-none">
                Photo {activeImgIndex + 1} of {property.images.length}
              </span>

              {/* Save trigger inside image detail */}
              <button
                onClick={(e) => onToggleSave(property.id, e)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-slate-950/70 backdrop-blur-md flex items-center justify-center text-white hover:text-rose-500 transition-all select-none focus:outline-none shadow-lg border border-white/10"
                aria-label="Save to favorite"
              >
                <Heart className={`h-5 w-5 ${isSaved ? 'fill-rose-500 text-rose-500 scale-110' : 'text-gray-300'}`} />
              </button>
            </div>

            {/* Thumbnail Gallery Picker */}
            {property.images.length > 1 && (
              <div className="flex items-center space-x-2.5 overflow-x-auto py-1">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    className={`relative h-16 w-24 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImgIndex === i ? 'border-accent scale-105 shadow-md shadow-accent/20' : 'border-white/5 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i}`}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Financial Logs & Key Specifications */}
          <div className="glass p-6 rounded-2xl border border-white/5 bg-slate-900/10 flex flex-col space-y-5">
            {/* Category header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-accent uppercase tracking-wider font-bold">
                    Verified {property.type} Layout
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-extrabold tracking-wider uppercase font-mono shadow-md ${
                    property.isAvailable !== false
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${property.isAvailable !== false ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    {property.isAvailable !== false ? 'Available' : 'Occupied'}
                  </span>
                </div>
                <h1 className="font-display font-bold text-2xl md:text-3xl text-white mt-1" id="detail-title">
                  {property.title}
                </h1>
                
                {/* Location Display */}
                <div className="flex items-center text-gray-400 text-sm mt-3 space-x-1.5 focus:outline-none">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="text-gray-300 font-medium">{property.address}</span>
                </div>
              </div>

              {/* Rating score details page */}
              <div className="flex items-center space-x-2 self-start md:self-auto bg-slate-900/60 p-2.5 rounded-xl border border-white/10 font-sans">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                <div className="flex flex-col leading-none">
                  <span className="font-mono text-sm font-bold text-white leading-none mb-1">{property.rating} / 5</span>
                  <span className="text-[10px] text-gray-500 leading-none">({property.reviewsCount} student reviews)</span>
                </div>
              </div>
            </div>

            {/* Financial Ledger (Monthly, security, brokerage) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5 select-none text-left">
              {/* Monthly Rent */}
              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-gray-500 uppercase block tracking-wider">
                  Monthly Rent Amount
                </span>
                <span className="font-mono text-xl font-extrabold text-accent block mt-1.5 leading-none">
                  ₹{property.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-gray-400 mt-1.5 block">
                  Excluding electricity meter charges
                </span>
              </div>

              {/* Security deposit */}
              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-gray-500 uppercase block tracking-wider">
                  Refundable Deposit
                </span>
                <span className="font-mono text-xl font-extrabold text-white block mt-1.5 leading-none">
                  ₹{property.securityDeposit.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-500 mt-1.5 block">
                  100% Refundable at checking-out
                </span>
              </div>

              {/* Brokerage charges */}
              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-gray-500 uppercase block tracking-wider flex items-center justify-between">
                  <span>Platform Brokerage</span>
                  {/* Small info modal hover trigger to avoid iframe prompt limits */}
                  <div className="relative">
                    <button 
                      type="button"
                      onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                      className="text-gray-500 hover:text-white"
                      title="Brokerage details"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                    {isTooltipOpen && (
                      <div className="absolute right-0 bottom-6 z-50 w-48 bg-slate-950 p-2 text-[9.5px] text-gray-400 rounded-lg shadow-xl border border-white/10 font-sans leading-relaxed">
                        Direct connection with local landlord. Nominal one-time office charge applies only when room is fully locked.
                      </div>
                    )}
                  </div>
                </span>
                <span className="font-mono text-xl font-extrabold text-white block mt-1.5 leading-none">
                  {property.brokerage === 0 ? '₹ 0' : `₹${property.brokerage}`}
                </span>
                <span className="text-[10px] text-gray-400 mt-1.5 block">
                  {property.brokerage === 0 ? 'No Broker charges (Direct Host)' : 'One-time registration fee'}
                </span>
              </div>
            </div>

            {/* Quick specifications stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/10 border border-white/5 text-[11px] font-mono text-gray-300">
              <div className="text-left">
                <span className="text-gray-500 block mb-0.5">SIZE ASPECT</span>
                <span className="font-semibold text-white">{property.size}</span>
              </div>
              <div className="text-left">
                <span className="text-gray-500 block mb-0.5">ROOM LAYOUT</span>
                <span className="font-semibold text-white">{property.bedrooms} Bed &bull; {property.bathrooms} Washroom</span>
              </div>
              <div className="text-left">
                <span className="text-gray-500 block mb-0.5">FURNITURE LEVEL</span>
                <span className="font-semibold text-white">{property.furnishing}</span>
              </div>
              <div className="text-left">
                <span className="text-gray-500 block mb-0.5">AIR COOLING</span>
                <span className="font-semibold text-white">{property.ac ? 'AC Unit Installed' : 'Non-AC Ceiling Fan'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Room Description text */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-display font-semibold text-lg text-white">
              Accommodation Description
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line bg-slate-900/10 border border-white/5 rounded-2xl p-5">
              {property.description}
            </p>
          </div>

          {/* Section 4: Highlighted Amenities List */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-display font-semibold text-lg text-white">
              Amenities &amp; Safety Features
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((amenity) => {
                const IconComponent = AMENITY_ICONS[amenity] || ShieldCheck;
                return (
                  <div
                    key={amenity}
                    className="flex items-center space-x-3 p-3 rounded-xl border border-white/5 bg-slate-900/30 text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-accent shrink-0">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold tracking-wide">
                      {amenity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Customized satellite theme mock roadmap */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-lg text-white">
                Location Map &amp; Accessibility
              </h3>
              {property.nearLPU && (
                <span className="font-mono text-[10.5px] text-accent font-bold">
                  Distance: {property.distanceToLPU}
                </span>
              )}
            </div>

            {/* Custom styled Mock Google Map inside the dark UI */}
            <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/5 flex flex-col justify-between p-4" id="simulated-google-map">
              {/* Fake satellite/streetgrid design layer */}
              <div className="absolute inset-0 opacity-15 pointer-events-none text-left font-mono text-[9px] text-gray-600 select-none p-3 overflow-hidden leading-tight">
                {Array.from({ length: 12 }).map((_, inx) => (
                  <div key={inx} className="mb-2 uppercase">
                    GRID_LN_0x23F9004 // LONGITUDE_75.76_LATITUDE_31.25 // PHAGWARA_SEC_MAP_{inx}
                    <div className="w-full border-t border-slate-700/40 my-1 border-dashed" />
                  </div>
                ))}
              </div>

              {/* Fake Marker Glow in the center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative">
                  <div className="absolute h-8 w-8 -top-1.5 -left-1.5 rounded-full bg-accent/30 animate-ping" />
                  <div className="h-5 w-5 rounded-full bg-accent border-4 border-slate-950 shadow-lg flex items-center justify-center" />
                </div>
                <div className="mt-2.5 glass px-3 py-1 rounded bg-slate-950/85 border border-white/10 text-[9.5px] font-mono text-white text-center shadow-lg truncate max-w-[200px]">
                  {property.location}
                </div>
              </div>

              {/* Mock Map UI controls */}
              <div className="flex items-center justify-between w-full z-10 select-none">
                <span className="bg-slate-950/85 text-slate-500 font-mono text-[9px] px-2 py-0.5 rounded uppercase">
                  GPX GROUND TRUTH: ACTIVE
                </span>
                
                <span className="bg-slate-950/85 text-accent font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wide">
                  PHAGWARA INTRANET GPS
                </span>
              </div>

              {/* Bottom satellite coordinate row */}
              <div className="flex justify-between items-end w-full z-10 select-none pt-2 mt-auto">
                <div className="text-left bg-slate-950/90 p-2.5 rounded-xl border border-white/5 font-sans">
                  <span className="text-[9px] text-gray-500 block leading-none">NEIGHBOURING ROADWAY</span>
                  <span className="text-[11.5px] font-bold text-white block mt-0.5 leading-none">GT Road and LPU Maheru Highway</span>
                </div>

                <div className="bg-slate-950/90 px-3 py-2 rounded-xl border border-white/5 text-right font-mono text-[10.5px]">
                  <span className="text-accent font-bold">&bull; {property.nearLPU ? 'Walking Area' : 'Drive Link'}</span>
                  <span className="text-gray-400 block mt-0.5">{property.distanceToLPU || 'Phagwara City Center'}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column Checkout / Host Details Module (4 span) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* Hostel Landlord Card */}
          <div className="glass p-5 rounded-2xl border border-white/5 bg-slate-900/40 text-left">
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest block">
              Direct Verification Provider
            </span>
            
            {/* Landlord profile layout */}
            <div className="flex items-center space-x-3.5 mt-4 pb-4 border-b border-white/5">
              <img
                src={property.hostAvatar}
                alt={property.hostName}
                className="h-12 w-12 rounded-full object-cover border border-accent shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-base text-white">
                  {property.hostName}
                </span>
                <span className="text-[10px] text-emerald-500 font-mono font-medium mt-1 uppercase tracking-wide">
                  Verified Landlord
                </span>
              </div>
            </div>

            {/* Quick Contacts Link actions */}
            <div className="flex flex-col space-y-2.5 mt-4">
              {/* Phone Line dialer link */}
              <a
                href={`tel:${property.hostPhone}`}
                className="flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-950 border border-white/10 text-gray-200 hover:text-white hover:bg-white/5 transition-all font-semibold text-xs text-center"
                id="details-cta-call"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>Call +91 99580 16911</span>
              </a>

              {/* WhatsApp prefilled message link */}
              <a
                href={`https://wa.me/${property.hostWhatsApp}?text=${formattedWhatsAppText}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-2 py-3 rounded-xl bg-[#25D366] text-slate-950 hover:bg-[#25D366]/90 transition-all font-bold text-xs text-center"
                id="details-cta-whatsapp"
              >
                <MessageCircle className="h-4 w-4 fill-slate-950 text-slate-950" />
                <span>WhatsApp Landlord</span>
              </a>
            </div>
          </div>

          {/* Checkout Appointment Scheduler booking visit */}
          <div className="glass p-5 rounded-2xl border border-white/5 bg-slate-900/60 text-left relative overflow-hidden">
            <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-widest block mb-1 flex items-center justify-between">
              <span>Schedule Free Property Visit</span>
              <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                property.isAvailable !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {property.isAvailable !== false ? 'Available' : 'Occupied'}
              </span>
            </span>

            {property.isAvailable === false && (
              <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] p-2.5 rounded-lg mb-3 font-mono leading-relaxed">
                🔴 <strong>Occupied Unit Notice:</strong> This unit is currently fully occupied. You can still schedule an advance-visit appointment or send an inquiry to list for upcoming vacancy cycles!
              </div>
            )}

            {!user && (
              <span className="text-[10px] text-amber-400 font-mono block mb-3 leading-relaxed">
                ⚠️ Sign in to permanently save your scheduled visit inside our database.
              </span>
            )}

            {bookingError && (
              <div className="text-[10px] text-rose-400 font-mono block mb-3 leading-relaxed bg-rose-500/10 p-2 rounded border border-rose-500/20">
                {bookingError}
              </div>
            )}

            {bookingSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center flex flex-col items-center justify-center"
              >
                <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="font-display font-bold text-base text-white">Visit Scheduled Successfully!</h4>
                <p className="text-gray-400 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Your details are sent directly to the owner {property.hostName}. They will ring you within 2 hours to coordinate the final visit.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleBookVisitSubmit} className="flex flex-col space-y-4">
                {/* 1. Name */}
                <div className="flex flex-col">
                  <label className="text-[9.5px] font-mono uppercase text-gray-500 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name e.g. Ashish Mahto"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent"
                  />
                </div>

                {/* 2. Phone */}
                <div className="flex flex-col">
                  <label className="text-[9.5px] font-mono uppercase text-gray-500 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter 10 digit number e.g. 9876543210"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent"
                  />
                </div>

                {/* 3. Choose Date */}
                <div className="flex flex-col">
                  <label className="text-[9.5px] font-mono uppercase text-gray-500 mb-1">
                    Target Visit Date
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedVisitDate}
                    onChange={(e) => setSelectedVisitDate(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent font-mono cursor-pointer"
                  />
                </div>

                {/* 4. Choose Time Slot */}
                <div className="flex flex-col">
                  <label className="text-[9.5px] font-mono uppercase text-gray-500 mb-1">
                    Convenient Visit Slot
                  </label>
                  <select
                    value={visitTimeSlot}
                    onChange={(e) => setVisitTimeSlot(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-accent cursor-pointer"
                    aria-label="Time slots picker"
                  >
                    <option value="10:00 AM - 12:00 PM">Morning (10 AM - 12 PM)</option>
                    <option value="12:00 PM - 3:00 PM">Early Afternoon (12 PM - 3 PM)</option>
                    <option value="3:00 PM - 5:30 PM">Late Afternoon (3 PM - 5:30 PM)</option>
                    <option value="5:30 PM - 7:30 PM">Evening (5:30 PM - 7:30 PM)</option>
                  </select>
                </div>

                {/* Submit visit schedule */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-colors shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 active:scale-98 mt-2"
                  id="details-btn-book-visit"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Visit Appointment</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

      {/* Similar Properties Section underneath */}
      {similarProperties.length > 0 && (
        <div className="mt-16 pt-16 border-t border-white/5" id="similar-properties-panel">
          <h3 className="font-display font-semibold text-xl text-white mb-6">
            Similar Rental Properties Nearby
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.map((property) => {
              const isSavedSim = savedProperties.includes(property.id);
              return (
                <div
                  key={property.id}
                  className="glass rounded-xl overflow-hidden border border-white/5 flex flex-col hover:border-accent/15 transition-all group"
                  id={`similar-card-${property.id}`}
                >
                  {/* Photo spacer */}
                  <div className="relative h-40 overflow-hidden shrink-0">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark Shadow cover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/25 pointer-events-none" />

                    <div className="absolute bottom-2.5 right-3">
                      <span className="font-mono text-xs font-bold text-accent bg-slate-950/80 px-2 py-0.5 rounded border border-white/5">
                        ₹{property.price.toLocaleString('en-IN')}/mo
                      </span>
                    </div>

                    <div className="absolute top-2.5 left-3">
                      <span className="font-mono text-[9px] font-semibold text-white bg-primary px-1.5 py-0.5 rounded uppercase">
                        {property.type}
                      </span>
                    </div>
                  </div>

                  {/* Body text details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 
                        onClick={() => onViewDetails(property.id)}
                        className="font-display font-semibold text-sm text-white hover:text-accent cursor-pointer line-clamp-1 transition-colors leading-snug mb-1"
                        title={property.title}
                      >
                        {property.title}
                      </h4>
                      
                      <div className="flex items-center text-slate-500 text-[10.5px] mb-2 space-x-1 font-sans">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="line-clamp-1 text-slate-400">{property.location}</span>
                      </div>
                    </div>

                    {/* View trigger link button */}
                    <button
                      onClick={() => onViewDetails(property.id)}
                      className="w-full mt-3 py-2 text-[11px] font-bold rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white hover:bg-white/10 text-center transition-all"
                    >
                      Inspect Property
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
export type { PropertyDetails };
