import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, Instagram, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function ContactForm() {
  const { addInquiry } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) return;
    
    try {
      await addInquiry(
        formData.name,
        formData.phone,
        formData.email,
        formData.message,
        'contact'
      );
      setIsSubmitSuccessful(true);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.toLowerCase().includes("permission") || errMsg.toLowerCase().includes("insufficient")) {
        console.warn("[Firestore Notice] Inquiry submission was restricted by permission rules. Ensure inquiries collection writes are allowed.");
      } else {
        console.error("Error submitting contact form inquiry:", err);
      }
    }
  };

  return (
    <section className="py-8" id="contact-form-widget">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Section (7 span) */}
        <div className="lg:col-span-7">
          <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 bg-slate-900/45 text-left">
            
            <h2 className="font-display font-bold text-2xl text-white mb-2">
              Send Us a Message
            </h2>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6">
              Have specific room requirements? Looking for rentals near a particular block of LPU? Pop your details below and our Phagwara team will send you curated options.
            </p>

            {isSubmitSuccessful ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center flex flex-col items-center justify-center"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-500/15 text-accent border border-emerald-500/20 flex items-center justify-center mb-5">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="font-display font-bold text-xl text-white">Inquiry Received Successfully!</h4>
                <p className="text-gray-400 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
                  Excellent, {formData.name}! Our local Phagwara matching agent has locked your specifications. They will contact you over WhatsApp or Call at {formData.phone} shortly.
                </p>
                
                <button
                  onClick={() => setIsSubmitSuccessful(false)}
                  className="mt-6 text-xs text-accent font-mono uppercase tracking-wider underline hover:text-white transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* 1. Name */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter full name e.g. Ashish Mahto"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent w-full"
                  />
                </div>

                {/* Grid name & email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 2. Phone */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent w-full"
                    />
                  </div>

                  {/* 3. Email */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. name@student.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent w-full"
                    />
                  </div>
                </div>

                {/* 4. Message */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                    Detailed Message &amp; Required Areas *
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Describe your desired property e.g. Non-AC PG for boys within 400m from Law Gate, with meal plans, budget ₹4000/month..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent w-full resize-none leading-relaxed"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs transition-all shadow-md shadow-primary/20 flex items-center justify-center space-x-2 active:scale-98 select-none cursor-pointer"
                  id="contact-btn-submit"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Rent Inquiry</span>
                </button>

              </form>
            )}

          </div>
        </div>

        {/* Right Column: Information Section (5 span) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* Main Contacts list card */}
          <div className="glass p-6 rounded-3xl border border-white/5 bg-slate-900/30 text-left">
            <span className="font-mono text-[10px] text-accent uppercase tracking-wider font-semibold block mb-4">
              Direct Office Lines
            </span>

            {/* Icons indicators lines */}
            <div className="flex flex-col space-y-5">
              {/* Address */}
              <div className="flex items-start space-x-3 text-xs leading-relaxed text-gray-300">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-accent shrink-0 text-left">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Head Office Address</span>
                  <span className="text-[11.5px] text-gray-400 mt-0.5 block font-medium">
                    3rd Floor, Centra Landmark Plaza, G.T Road Highway, Maheru Sector, Phagwara, Punjab 144411
                  </span>
                </div>
              </div>

              {/* Phone call line */}
              <div className="flex items-start space-x-3 text-xs text-gray-300">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-accent shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Direct Call Helpdesk</span>
                  <a href="tel:+919876543210" className="text-gray-400 font-mono mt-0.5 block hover:text-accent transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* WhatsApp API connection */}
              <div className="flex items-start space-x-3 text-xs text-gray-300">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-accent shrink-0">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Official WhatsApp Chat</span>
                  <a 
                    href="https://wa.me/919876543210?text=Hello" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-gray-400 font-mono mt-0.5 block hover:text-accent transition-colors"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Instagram link */}
              <div className="flex items-start space-x-3 text-xs text-gray-300">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-accent shrink-0">
                  <Instagram className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Instagram Handle</span>
                  <a 
                    href="https://instagram.com/pg_in_phagwara" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-gray-400 mt-0.5 block hover:text-accent transition-colors font-mono"
                  >
                    @pg_in_phagwara
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Embedded simulated dark-theme Google Map */}
          <div className="flex flex-col space-y-3">
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block text-left">
              Office Geographic Coordinates
            </span>

            <div className="relative h-64 w-full rounded-3xl overflow-hidden bg-slate-900 border border-white/5 flex flex-col justify-between p-4" id="office-location-map">
              {/* Mock Street coordinates grid */}
              <div className="absolute inset-0 opacity-10 pointer-events-none text-left font-mono text-[9px] text-gray-700 select-none p-3 overflow-hidden leading-tight">
                {Array.from({ length: 8 }).map((_, inx) => (
                  <div key={inx} className="mb-2">
                    LOCKED_CENTRA_OFFICE_0xDE4490 &bull; LAT_31.22_LON_75.75
                    <div className="w-full border-t border-slate-700/30 my-1 font-mono" />
                  </div>
                ))}
              </div>

              {/* Fake Marker Glow in the center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative">
                  <div className="absolute h-8 w-8 -top-1.5 -left-1.5 rounded-full bg-accent/30 animate-pulse" />
                  <div className="h-5 w-5 rounded-full bg-accent border-4 border-slate-950 shadow-lg flex items-center justify-center" />
                </div>
                <div className="mt-2.5 glass px-3 py-1 rounded bg-slate-950/85 border border-white/10 text-[9px] font-mono text-white text-center shadow-lg truncate font-bold">
                  CENTRA OFFICE HEADQUARTERS
                </div>
              </div>

              {/* Top controls map info */}
              <div className="flex justify-between items-center w-full z-10 select-none text-[9px] font-mono text-slate-500 uppercase">
                <span>Centra Landmark Plaza</span>
                <span className="text-accent font-semibold">Active Gated Complex</span>
              </div>

              {/* Bottom controls map info */}
              <div className="w-full z-10 bg-slate-950/90 p-3 rounded-2xl border border-white/5 text-left font-sans mt-auto">
                <span className="text-[9px] text-slate-500 uppercase block leading-none">Travel Landmark suggestion</span>
                <span className="text-xs font-bold text-white block mt-1 leading-normal">
                  Exit G.T Road Flyover Maheru junction, turn left towards Landmark Plaza complex. Gated secure basement parking available.
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
export type { ContactForm };
