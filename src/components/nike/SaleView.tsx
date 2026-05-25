'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNikeActions } from '@/store/nike-store';
import { getSaleProducts, heroImages } from '@/data/products';
import ProductCard from './ProductCard';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Biggest Discount', value: 'discount' },
];

export default function SaleView() {
  const { openAuthModal } = useNikeActions();
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'men' | 'women' | 'kids'>('all');

  const allSaleProducts = getSaleProducts();

  const filteredProducts = useMemo(() => {
    let products = selectedCategory === 'all'
      ? [...allSaleProducts]
      : allSaleProducts.filter((p) => p.category === selectedCategory);

    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        products.sort((a, b) => {
          const discA = (a.originalPrice || a.price) - a.price;
          const discB = (b.originalPrice || b.price) - b.price;
          return discB - discA;
        });
        break;
      default:
        break;
    }

    return products;
  }, [allSaleProducts, selectedCategory, sortBy]);

  return (
    <div>
      {/* Sale Hero */}
      <section className="relative w-full h-[50vh] md:h-[55vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImages.sale})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f5334f]/80 via-[#f5334f]/30 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 pb-12 md:pb-16">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-white/80 mb-4 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 animate-pulse-sale">
              Limited Time
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.9] mb-4">
              Up to 30% Off
            </h1>
            <p className="text-sm md:text-base text-white/90 max-w-md mb-6 leading-relaxed font-medium">
              Shop the sale. Save big on your favorite styles. Members get an extra 10% off.
            </p>
            <p className="text-lg font-bold text-white">
              {allSaleProducts.length} styles on sale — save up to ${Math.max(...allSaleProducts.map(p => ((p.originalPrice || p.price) - p.price))).toFixed(0)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sale Products Grid */}
      <section className="px-6 md:px-12 py-8 md:py-12">
        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
          {(['all', 'men', 'women', 'kids'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#f5334f] text-white border-[#f5334f]'
                  : 'bg-white text-[#111] border-[#e5e5e5] hover:border-[#111]'
              }`}
            >
              {cat === 'all' ? 'All Sale' : `${cat.charAt(0).toUpperCase() + cat.slice(1)}'s`}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#757575]">{filteredProducts.length} products on sale</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm font-medium text-[#111] bg-transparent border border-[#e5e5e5] rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#111]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-[#757575]">No sale items in this category.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 text-sm font-bold uppercase tracking-widest underline hover:text-[#757575] transition-colors text-[#f5334f]"
            >
              View All Sale
            </button>
          </div>
        )}

        {/* Sale Banner */}
        <div className="mt-12 bg-[#f5334f] rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Extra 10% Off for Members</h3>
          <p className="text-sm text-white/90 mb-4 max-w-md mx-auto">
            Sign in or join Nike to get an extra 10% discount on all sale items. Free delivery on every order.
          </p>
          <button
            onClick={() => openAuthModal('join')}
            className="rounded-full bg-white text-[#f5334f] px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-colors"
          >
            Join Us — It&apos;s Free
          </button>
        </div>
      </section>
    </div>
  );
}
