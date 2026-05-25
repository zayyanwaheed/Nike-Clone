'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNikeActions } from '@/store/nike-store';
import { heroImages } from '@/data/products';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const categories = [
  { name: "Men's", view: 'men' as const, image: heroImages.men, tag: "Men's Running", count: 18 },
  { name: "Women's", view: 'women' as const, image: heroImages.women, tag: "Women's Training", count: 18 },
  { name: "Kids'", view: 'kids' as const, image: heroImages.kids, tag: "Kids' Play", count: 12 },
];

export default function CategoryGrid() {
  const { switchView } = useNikeActions();
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="px-6 md:px-12 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Shop by Category</h2>
      </div>
      <div
        ref={ref}
        className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 reveal-stagger ${isVisible ? 'is-visible' : ''}`}
      >
        {categories.map((cat, i) => (
          <motion.button
            key={cat.name}
            onClick={() => switchView(cat.view)}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative h-[480px] rounded-2xl overflow-hidden group cursor-pointer hover-lift"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.08]"
              style={{ backgroundImage: `url(${cat.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[#111]/0 group-hover:bg-[#111]/10 transition-colors duration-500" />

            {/* Animated border on hover */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-all duration-500" />

            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 block mb-1">{cat.tag}</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl font-black uppercase tracking-tight">{cat.name}</span>
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                <span className="text-xs font-bold text-white/60 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  {cat.count} styles
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
