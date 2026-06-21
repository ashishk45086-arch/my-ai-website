import { STATISTICS_DATA } from '../data';
import { Building2, Users2, MapPin, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const STATS_ICONS = [Building2, Users2, MapPin, CheckCircle2];

export default function Stats() {
  return (
    <section className="relative py-12 bg-dark/60 border-y border-white/5" id="stats-section">
      <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATISTICS_DATA.map((stat, i) => {
            const Icon = STATS_ICONS[i] || CheckCircle2;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass p-5 md:p-6 rounded-2xl flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-4 border border-white/5 bg-slate-900/60 shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                {/* Glowing Icon Wrapper */}
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-accent shrink-0 shadow-inner">
                  <Icon className="h-5 w-5" />
                </div>
                
                {/* Metrics */}
                <div className="text-center md:text-left flex flex-col">
                  <span className="font-mono text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-none">
                    {stat.value}
                  </span>
                  <span className="text-xs md:text-sm text-gray-400 font-medium mt-1 leading-normal">
                    {stat.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
export type { Stats };
