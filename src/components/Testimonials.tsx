import { useState } from 'react';
import { TESTIMONIALS_DATA } from '../data';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextSlide = () => {
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const prevSlide = () => {
    setActiveIdx((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  return (
    <section className="py-20 bg-slate-950" id="testimonials-section">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Header Heading */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-accent uppercase tracking-widest font-semibold bg-accent/5 px-3 py-1 rounded-full border border-accent/10">
            Tenant Voice
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight mt-3">
            What Our Tenants Say
          </h2>
          <p className="mt-3 text-gray-400 max-w-lg mx-auto text-sm md:text-base">
            Read stories of students, teachers, and working professionals who found sweet, safe properties through our service in Phagwara.
          </p>
        </div>

        {/* Carousel Slider Panel */}
        <div className="relative max-w-3xl mx-auto">
          {/* Quote Icon Background */}
          <div className="absolute -top-10 -left-10 text-primary/10 select-none hidden md:block">
            <Quote className="h-32 w-32 fill-primary/5" />
          </div>

          <div className="glass p-8 md:p-12 rounded-3xl border border-white/5 bg-slate-900/60 shadow-2xl relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center"
              >
                {/* Stars */}
                <div className="flex space-x-1 text-amber-400 mb-6" id="testimonial-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(TESTIMONIALS_DATA[activeIdx].rating) ? 'fill-amber-400' : 'text-slate-700'
                      }`} 
                    />
                  ))}
                </div>

                {/* Review Message Text */}
                <blockquote className="font-sans text-base md:text-xl font-medium text-gray-200 leading-relaxed mb-8 max-w-2xl italic">
                  "{TESTIMONIALS_DATA[activeIdx].text}"
                </blockquote>

                {/* User Info Avatar & Label */}
                <div className="flex items-center space-x-3.5">
                  <img
                    src={TESTIMONIALS_DATA[activeIdx].avatar}
                    alt={TESTIMONIALS_DATA[activeIdx].name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-accent"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left">
                    <div className="font-display font-bold text-white text-base">
                      {TESTIMONIALS_DATA[activeIdx].name}
                    </div>
                    <div className="font-mono text-slate-500 text-xs">
                      {TESTIMONIALS_DATA[activeIdx].role}
                    </div>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

          {/* Carousel Arrows Control */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={prevSlide}
              className="h-10 w-10 rounded-full border border-white/10 hover:border-accent text-gray-400 hover:text-white hover:bg-white/5 flex items-center justify-center transition-all duration-300"
              aria-label="Previous feedback"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Slider Dots indicators */}
            <div className="flex space-x-2">
              {TESTIMONIALS_DATA.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeIdx ? 'w-6 bg-accent' : 'w-2 bg-slate-700'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="h-10 w-10 rounded-full border border-white/10 hover:border-accent text-gray-400 hover:text-white hover:bg-white/5 flex items-center justify-center transition-all duration-300"
              aria-label="Next feedback"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
export type { Testimonials };
