import { PageId } from '../types';
import { Home, Search, Heart, Mail, MessageCircle } from 'lucide-react';

interface BottomNavBarProps {
  activePage: PageId;
  onNavigate: (page: PageId, propertyId?: string | null) => void;
  savedCount: number;
}

export default function BottomNavBar({ activePage, onNavigate, savedCount }: BottomNavBarProps) {
  const tabs = [
    { id: 'home' as PageId, label: 'Home', icon: Home },
    { id: 'properties' as PageId, label: 'Properties', icon: Search },
    { id: 'saved' as PageId, label: 'Saved', icon: Heart, badge: savedCount },
    { id: 'contact' as PageId, label: 'Contact', icon: Mail }
  ];

  return (
    <>
      {/* Floating Pulse WhatsApp Button (Mobile only) */}
      <div className="fixed bottom-20 right-4 z-40 md:hidden animate-bounce transition-all duration-300">
        <a
          href="https://wa.me/919876543210?text=Hello!%20I%20am%20looking%20for%20accommodation%20in%20Phagwara."
          target="_blank"
          rel="noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ring-4 ring-emerald-500/20"
          id="mobile-floating-whatsapp"
          title="WhatsApp Agent"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20" />
          <MessageCircle className="h-7 w-7 fill-slate-950 text-slate-950" />
        </a>
      </div>

      {/* Sticky Bottom Navigation Bar (Mobile only) */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-white/10"
        id="mobile-bottom-bar"
      >
        <div className="glass flex items-center justify-around py-2.5 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePage === tab.id;
            return (
              <button
                key={tab.id}
                id={`mobile-tab-${tab.id}`}
                onClick={() => onNavigate(tab.id)}
                className="relative flex flex-col items-center justify-center w-16 py-1 text-center transition-all focus:outline-none"
              >
                <div 
                  className={`flex items-center justify-center p-1.5 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-primary/20 text-accent scale-110' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  
                  {/* Heart / Saved Counts badge */}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute top-1 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-slate-950">
                      {tab.badge}
                    </span>
                  )}
                </div>
                
                <span 
                  className={`text-[10px] mt-0.5 tracking-tight transition-all uppercase font-semibold ${
                    isActive ? 'text-accent font-bold scale-105' : 'text-gray-500'
                  }`}
                >
                  {tab.label}
                </span>
                
                {isActive && (
                  <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-4 h-1 rounded bg-accent" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
