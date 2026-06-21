import { PageId } from '../types';
import { Phone, MessageCircle, Instagram, MapPin, Mail, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId, propertyId?: string | null) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (page: PageId) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
  };

  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-28 md:pb-12 text-gray-400 font-sans" id="footer-section">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Upper Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand & Desc */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white font-display font-bold">
                P
              </div>
              <span className="font-display font-bold text-lg text-white leading-none">
                PG in Phagwara
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Phagwara’s most trustable rental catalog connecting LPU students and professionals to verified, premium, high-value landlord options. Zero mock lists, 100% verified rooms.
            </p>
            {/* Visual Social handles */}
            <div className="flex items-center space-x-3.5 pt-2">
              <a 
                href="https://wa.me/919876543210?text=Hi" 
                target="_blank" 
                rel="noreferrer"
                className="h-9 w-9 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-[#25D366] flex items-center justify-center transition-colors"
                title="Connect via WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com/pg_in_phagwara" 
                target="_blank" 
                rel="noreferrer"
                className="h-9 w-9 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors"
                title="Follow on Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="mailto:contact@pginphagwara.com"
                className="h-9 w-9 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex items-center justify-center transition-colors"
                title="Mail Us"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Navigation Links */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => handleLinkClick('home')}
                  className="hover:text-accent transition-colors flex items-center group cursor-pointer"
                >
                  <span>Home Landing Page</span>
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all text-accent" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('properties')}
                  className="hover:text-accent transition-colors flex items-center group cursor-pointer"
                >
                  <span>Browse Property List</span>
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all text-accent" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('saved')}
                  className="hover:text-accent transition-colors flex items-center group cursor-pointer"
                >
                  <span>Your Saved Favorites</span>
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all text-accent" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('contact')}
                  className="hover:text-accent transition-colors flex items-center group cursor-pointer"
                >
                  <span>Submit Contact Inquiry</span>
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all text-accent" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Prime Areas Nearby */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Prime Locations
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="hover:text-white transition-colors cursor-default">• Law Gate Area (Maheru)</li>
              <li className="hover:text-white transition-colors cursor-default">• Maheru GT Road Sector</li>
              <li className="hover:text-white transition-colors cursor-default">• Urban Estate Phase-1 &amp; Phase-2</li>
              <li className="hover:text-white transition-colors cursor-default">• Hargobind Nagar</li>
              <li className="hover:text-white transition-colors cursor-default">• Miya Ji Chowk Local</li>
              <li className="hover:text-white transition-colors cursor-default">• Plahi Bypass Road</li>
            </ul>
          </div>

          {/* Column 4: Contact & Office info Address */}
          <div className="flex flex-col space-y-4 text-xs">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Office Contacts
            </h4>
            
            <div className="flex items-start space-x-2.5">
              <MapPin className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              <span>
                3rd Floor, Centra Landmark Plaza, G.T Road Highway, Maheru Sector, Phagwara, Punjab 144411
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <a href="tel:+919876543210" className="hover:text-white transition-colors font-mono">
                +91 98765 43210
              </a>
            </div>

            <div className="flex items-center space-x-2.5">
              <MessageCircle className="h-4 w-4 text-emerald-500 shrink-0" />
              <a 
                href="https://wa.me/919876543210?text=Hi" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-white transition-colors font-mono"
              >
                +91 98765 43210
              </a>
            </div>
          </div>

        </div>

        {/* Lower copyright bar division */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-4">
          <div>
            &copy; {currentYear} PG in Phagwara. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-400 cursor-pointer">LPU Student Helpdesk</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
export type { Footer };
