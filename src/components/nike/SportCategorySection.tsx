'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNikeActions } from '@/store/nike-store';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const sports = [
  {
    name: 'Running',
    description: 'Hit the road with responsive cushioning',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=600',
    view: 'men' as const,
  },
  {
    name: 'Basketball',
    description: 'Elevate your game on and off the court',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600',
    view: 'men' as const,
  },
  {
    name: 'Training',
    description: 'Built for those who never stop moving',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
    view: 'women' as const,
  },
  {
    name: 'Football',
    description: 'Dominate the pitch from first whistle to last',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=600',
    view: 'men' as const,
  },
];

export default function SportCategorySection() {
  const { switchView } = useNikeActions();
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="px-6 md:px-12 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Shop by Sport</h2>
      </motion.div>
      <div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {sports.map((sport, i) => (
          <motion.button
            key={sport.name}
            onClick={() => switchView(sport.view)}
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative h-[360px] rounded-2xl overflow-hidden group cursor-pointer hover-lift"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.08]"
              style={{ backgroundImage: `url(${sport.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-all duration-500" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">{sport.name}</h3>
              <p className="text-xs text-white/70 font-medium mb-3">{sport.description}</p>
              <div className="flex items-center gap-1.5 text-white">
                <span className="text-xs font-bold uppercase tracking-widest">Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
