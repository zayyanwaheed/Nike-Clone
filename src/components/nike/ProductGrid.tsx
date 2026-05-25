'use client';

import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { NikeClose } from './NikeIcons';
import { useNikeActions, useCurrentView } from '@/store/nike-store';
import { getProductsByCategory } from '@/data/products';
import ProductCard from './ProductCard';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
];

const priceRanges = [
  { label: 'Under $100', min: 0, max: 100 },
  { label: '$100 - $150', min: 100, max: 150 },
  { label: '$150 - $200', min: 150, max: 200 },
  { label: 'Over $200', min: 200, max: Infinity },
];

export default function ProductGrid() {
  const currentView = useCurrentView();
  const { switchView } = useNikeActions();
  const [sortBy, setSortBy] = useState('featured');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeType, setActiveType] = useState('All Shoes');
  const [saleFilter, setSaleFilter] = useState(false);

  const category = currentView as 'men' | 'women' | 'kids';
  const allProducts = getProductsByCategory(category);
  const shoeTypes = useMemo(() => {
    const types = Array.from(new Set(allProducts.map((product) => product.type)));
    return ['All Shoes', ...types];
  }, [allProducts]);

  const effectiveActiveType = shoeTypes.includes(activeType) ? activeType : 'All Shoes';

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    if (effectiveActiveType !== 'All Shoes') {
      products = products.filter((p) => p.type === effectiveActiveType);
    }

    // Price filter
    if (selectedPriceRanges.length > 0) {
      products = products.filter((p) =>
        selectedPriceRanges.some((idx) => {
          const range = priceRanges[idx];
          return p.price >= range.min && p.price < range.max;
        })
      );
    }

    // Sale filter
    if (saleFilter) {
      products = products.filter((p) => p.isSale);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products.reverse();
        break;
      default:
        break;
    }

    return products;
  }, [allProducts, effectiveActiveType, selectedPriceRanges, sortBy, saleFilter]);

  const togglePriceRange = (idx: number) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const clearAllFilters = () => {
    setSelectedPriceRanges([]);
    setSaleFilter(false);
    setActiveType('All Shoes');
  };

  const hasActiveFilters = selectedPriceRanges.length > 0 || saleFilter || effectiveActiveType !== 'All Shoes';

  return (
    <section className="px-6 md:px-12 py-8 md:py-12">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#111]">
          {category.charAt(0).toUpperCase() + category.slice(1)}&apos;s Shoes
        </h1>
        <p className="text-sm text-[#757575] mt-2">{filteredProducts.length} products</p>
      </div>

      {/* Shoe Type Pills */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
        {shoeTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-colors ${
              effectiveActiveType === type
                ? 'bg-[#111] text-white border-[#111]'
                : 'bg-white text-[#111] border-[#e5e5e5] hover:border-[#111]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {selectedPriceRanges.map((idx) => (
            <button
              key={`price-${idx}`}
              onClick={() => togglePriceRange(idx)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#f5f5f5] rounded-full hover:bg-[#e5e5e5] transition-colors"
            >
              {priceRanges[idx].label}
              <NikeClose size={12} />
            </button>
          ))}
          {saleFilter && (
            <button
              onClick={() => setSaleFilter(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#f5334f] text-white rounded-full hover:bg-[#d42d47] transition-colors"
            >
              Sale
              <NikeClose size={12} className="text-white" />
            </button>
          )}
          {effectiveActiveType !== 'All Shoes' && (
            <button
              onClick={() => setActiveType('All Shoes')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#111] text-white rounded-full hover:bg-[#333] transition-colors"
            >
              {effectiveActiveType}
              <NikeClose size={12} className="text-white" />
            </button>
          )}
          <button
            onClick={clearAllFilters}
            className="text-[11px] font-bold uppercase tracking-widest text-[#757575] hover:text-[#111] transition-colors underline underline-offset-2"
          >
            Clear All
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-52 flex-shrink-0`}>
          <div className="sticky top-24 space-y-6">
            {/* Category Links */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3">Category</h3>
              <div className="space-y-2">
                {['men', 'women', 'kids'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => switchView(cat as 'men' | 'women' | 'kids')}
                    className={`block text-sm font-medium transition-colors ${
                      category === cat ? 'text-[#111] font-bold' : 'text-[#757575] hover:text-[#111]'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}&apos;s
                    <span className="text-[#757575] ml-1">
                      ({getProductsByCategory(cat as 'men' | 'women' | 'kids').length})
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => switchView('sale')}
                  className="block text-sm font-medium text-[#f5334f] hover:text-[#d42d47] transition-colors"
                >
                  Sale
                  <span className="ml-1">
                    ({getProductsByCategory(category).filter(p => p.isSale).length})
                  </span>
                </button>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3">Price</h3>
              <div className="space-y-2.5">
                {priceRanges.map((range, idx) => (
                  <label key={idx} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.includes(idx)}
                      onChange={() => togglePriceRange(idx)}
                      className="w-4 h-4 rounded border-[#e5e5e5] accent-[#111]"
                    />
                    <span className="text-sm text-[#757575] group-hover:text-[#111] transition-colors">
                      {range.label}
                      <span className="ml-1 text-[11px]">
                        ({allProducts.filter(p => p.price >= range.min && p.price < range.max).length})
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sale Filter */}
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={saleFilter}
                  onChange={(e) => setSaleFilter(e.target.checked)}
                  className="w-4 h-4 rounded border-[#e5e5e5] accent-[#f5334f]"
                />
                <span className="text-sm font-bold text-[#f5334f] group-hover:text-[#d42d47] transition-colors">
                  On Sale
                  <span className="ml-1 text-[11px] font-normal text-[#757575]">
                    ({allProducts.filter(p => p.isSale).length})
                  </span>
                </span>
              </label>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold uppercase tracking-widest text-[#757575] hover:text-[#111] transition-colors underline underline-offset-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-1.5 text-sm font-medium text-[#111] hover:text-[#757575] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-[#757575]">No products match your filters.</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 text-sm font-bold uppercase tracking-widest underline hover:text-[#757575] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
