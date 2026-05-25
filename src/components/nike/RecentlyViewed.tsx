'use client';

import { motion } from 'framer-motion';
import { useRecentlyViewed } from '@/store/nike-store';
import ProductCard from './ProductCard';

export default function RecentlyViewed() {
  const recentlyViewed = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="px-6 md:px-12 py-8">
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-lg font-black uppercase tracking-tight mb-6"
      >
        Recently Viewed
      </motion.h2>
      <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar scroll-smooth pb-4 -mx-6 px-6 md:-mx-12 md:px-12 marquee-fade">
        {recentlyViewed.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex-none w-56 md:w-64"
          >
            <ProductCard product={product} index={i} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
