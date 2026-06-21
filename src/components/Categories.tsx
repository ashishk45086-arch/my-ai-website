import { CATEGORIES_DATA } from '../data';
import { PropertyType } from '../types';
import { Home, BedDouble, Building, Layers, Warehouse, ArrowRight, Layers3 } from 'lucide-react';
import { motion } from 'motion/react';

interface CategoriesProps {
  onCategorySelect: (type: PropertyType) => void;
}

const CATEGORY_ICONS = [Home, BedDouble, Building, Layers3, Warehouse];

export default function Categories({ onCategorySelect }: CategoriesProps) {
  return (
    <section className="py-20 bg-slate-950 border-t border-white/5" id="categories-section">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Header Title */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-accent uppercase tracking-widest font-semibold bg-accent/5 px-3 py-1 rounded-full border border-accent/10">
            Tailored Choices
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight mt-3">
            Explore Property Categories
          </h2>
          <p className="mt-3 text-gray-400 max-w-lg mx-auto text-sm md:text-base">
            Whether you want standard budget rooms, personal studio spaces, or spacious villas, we have options ready to move.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {CATEGORIES_DATA.map((cat, i) => {
            const IconComponent = CATEGORY_ICONS[i] || Home;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => onCategorySelect(cat.slug)}
                className="relative h-72 rounded-2xl overflow-hidden cursor-pointer group shadow-xl border border-white/5"
                id={`cat-card-${cat.id}`}
              >
                {/* Background Image with Zoom Layer */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.image})` }}
                  referrerPolicy="no-referrer"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent transition-opacity duration-300 group-hover:opacity-85" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                  {/* Top Icon Badge */}
                  <div className="h-10 w-10 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-accent shadow-lg">
                    <IconComponent className="h-5 w-5" />
                  </div>

                  {/* Bottom Text and Counts */}
                  <div className="text-left">
                    <span className="font-mono text-[10px] text-accent font-semibold tracking-wider uppercase bg-accent/10 px-2 py-0.5 rounded">
                      {cat.count} listings
                    </span>
                    
                    <h3 className="font-display font-bold text-lg text-white mt-1.5 group-hover:text-accent transition-colors">
                      {cat.title}
                    </h3>
                    
                    <p className="text-gray-400 text-[11px] leading-relaxed mt-1 line-clamp-2">
                      {cat.description}
                    </p>

                    {/* Micro CTA */}
                    <div className="mt-3 flex items-center space-x-1 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span>Browse category</span>
                      <ArrowRight className="h-3.5 w-3.5 text-accent" />
                    </div>
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
