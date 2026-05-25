'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from './ProductCard';

export default function TrendingSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trending = [...products.filter(p => p.isNew), ...products.filter(p => !p.isNew)].slice(0, 12);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="px-6 md:px-12 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -10 }}
            whileInView={{ rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <TrendingUp className="w-6 h-6 text-[#111]" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Trending Now</h2>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => scroll('left')}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-[#f5f5f5] hover:bg-[#e5e5e5] flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => scroll('right')}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-[#f5f5f5] hover:bg-[#e5e5e5] flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar scroll-smooth pb-4 -mx-6 px-6 md:-mx-12 md:px-12 marquee-fade"
      >
        {trending.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-none w-56 md:w-64"
          >
            <ProductCard product={product} index={i} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
