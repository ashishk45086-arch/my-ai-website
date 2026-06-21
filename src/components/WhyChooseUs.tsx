import { ADVANTAGES_DATA } from '../data';
import { ShieldCheck, CirclePercent, Milestone, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

const ADVANTAGE_ICONS = [ShieldCheck, CirclePercent, Milestone, UserCheck];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-dark/40 border-y border-white/5" id="why-choose-us-section">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Title */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="font-mono text-xs text-accent uppercase tracking-widest font-semibold">
            Zero Hassle Process
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight mt-3">
            Why Choose PG in Phagwara?
          </h2>
          <p className="mt-3 text-gray-400 text-sm md:text-base">
            We solve the biggest roadblocks students and working professionals encounter while seeking rooms in Phagwara.
          </p>
        </div>

        {/* Advantage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ADVANTAGES_DATA.map((advantage, i) => {
            const Icon = ADVANTAGE_ICONS[i] || ShieldCheck;
            return (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass p-6 rounded-2xl border border-white/5 hover:border-accent/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon */}
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 shadow-md shadow-accent/5">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg font-bold text-white mb-2 leading-tight">
                    {advantage.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
                
                {/* Decorative glowing back-dot */}
                <div className="h-1 w-8 bg-accent/30 rounded mt-6" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
export type { WhyChooseUs };
