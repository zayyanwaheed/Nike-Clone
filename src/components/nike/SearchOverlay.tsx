'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TrendingUp, Clock, Trash2 } from 'lucide-react';
import { NikeSearch, NikeClose } from './NikeIcons';
import { motion, AnimatePresence } from 'framer-motion';
import { useNikeStore, useNikeActions } from '@/store/nike-store';
import { searchProducts } from '@/data/products';
import ProductCard from './ProductCard';

const popularSearches = ['Air Max', 'Dunk Low', 'Pegasus', 'Air Force 1', 'Jordan', 'Sale'];

export default function SearchOverlay() {
  const isSearchOpen = useNikeStore((s) => s.isSearchOpen);
  const recentSearches = useNikeStore((s) => s.recentSearches);
  const { toggleSearch, setSearchQuery, addRecentSearch, clearRecentSearches } = useNikeActions();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const prevOpenRef = useRef(false);

  const handleClose = useCallback(() => {
    setQuery('');
    toggleSearch();
  }, [toggleSearch]);

  useEffect(() => {
    if (isSearchOpen && !prevOpenRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
    prevOpenRef.current = isSearchOpen;
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isSearchOpen, handleClose]);

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm);
      addRecentSearch(searchTerm);
    }
  };

  const results = query.trim() ? searchProducts(query) : [];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-white"
        >
          <div className="flex flex-col h-full">
            {/* Search Header */}
            <div className="border-b border-[#e5e5e5] px-6 md:px-12">
              <div className="flex items-center gap-4 py-5 max-w-[1440px] mx-auto w-full">
                <NikeSearch size={20} className="text-[#757575] flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search for shoes, clothing, accessories..."
                  className="flex-1 text-xl md:text-2xl font-medium text-[#111] placeholder:text-[#e5e5e5] outline-none bg-transparent"
                />
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full hover:bg-[#f5f5f5] flex items-center justify-center transition-colors"
                >
                  <NikeClose size={20} className="text-[#111]" />
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8">
              <div className="max-w-[1440px] mx-auto">
                {query.trim() === '' ? (
                  <div>
                    {/* Popular Searches */}
                    <div className="mb-10">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-[#757575]" />
                        <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#757575]">Popular Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleSearch(term)}
                            className="px-4 py-2 text-sm font-medium bg-[#f5f5f5] rounded-full hover:bg-[#e5e5e5] transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#757575]" />
                            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#757575]">Recent Searches</span>
                          </div>
                          <button
                            onClick={clearRecentSearches}
                            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#757575] hover:text-[#111] transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Clear
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => handleSearch(term)}
                              className="px-4 py-2 text-sm font-medium border border-[#e5e5e5] rounded-full hover:border-[#111] transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-[#757575] text-sm">Start typing to search our collection...</p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="text-center py-16">
                    <NikeSearch size={48} className="text-[#e5e5e5] mx-auto mb-4" />
                    <p className="text-lg font-bold text-[#111] mb-1">No results found</p>
                    <p className="text-sm text-[#757575]">Try searching for &ldquo;Air Max&rdquo; or &ldquo;Dunk&rdquo;</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-[#757575] mb-6">
                      {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {results.map((product, i) => (
                        <ProductCard key={product.id} product={product} index={i} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
