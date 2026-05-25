'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, ChevronLeft, ChevronRight, RotateCcw, Share2, Star, Truck } from 'lucide-react';
import { NikeBag, NikeHeart } from './NikeIcons';
import { useNikeStore, useNikeActions } from '@/store/nike-store';
import { toast } from 'sonner';

export default function QuickViewModal() {
  const isQuickViewOpen = useNikeStore((s) => s.isQuickViewOpen);
  const selectedProduct = useNikeStore((s) => s.selectedProduct);
  const selectedSize = useNikeStore((s) => s.selectedSize);
  const wishlist = useNikeStore((s) => s.wishlist);
  const {
    closeQuickView,
    setSelectedSize,
    addToCart,
    openCart,
    toggleWishlist,
    openShareModal,
    addToRecentlyViewed,
    switchView,
  } = useNikeActions();
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const recentlyViewedTracked = useRef(false);

  const isInWishlist = selectedProduct ? wishlist.includes(selectedProduct.id) : false;

  useEffect(() => {
    if (isQuickViewOpen && selectedProduct && !recentlyViewedTracked.current) {
      addToRecentlyViewed(selectedProduct);
      recentlyViewedTracked.current = true;
    }
    if (!isQuickViewOpen) {
      recentlyViewedTracked.current = false;
    }
  }, [isQuickViewOpen, selectedProduct, addToRecentlyViewed]);

  if (!selectedProduct) return null;

  const images = selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images : [selectedProduct.image];
  const activeImageIndex = Math.min(activeImage, images.length - 1);
  const activeColor = selectedProduct.colors.includes(selectedColor) ? selectedColor : selectedProduct.colors[0] ?? '';
  const discount = selectedProduct.originalPrice
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
    : 0;

  const showPreviousImage = () => {
    setActiveImage((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const showNextImage = () => {
    setActiveImage((current) => (current + 1) % images.length);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      size: selectedSize,
      img: selectedProduct.image,
      quantity: 1,
    });
    toast.success('Added to Bag');
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      closeQuickView();
      openCart();
    }, 800);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(selectedProduct.id);
    toast.success(isInWishlist ? 'Removed from Favorites' : 'Added to Favorites');
  };

  return (
    <Dialog open={isQuickViewOpen} onOpenChange={(open) => !open && closeQuickView()}>
      <DialogContent className="h-[min(760px,calc(100dvh-1rem))] w-[calc(100vw-1rem)] gap-0 overflow-hidden rounded-lg border-0 bg-white p-0 shadow-2xl sm:max-w-6xl">
        <DialogTitle className="sr-only">{selectedProduct.name} - Quick View</DialogTitle>
        <div className="grid h-full grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <div className="relative min-h-[320px] overflow-hidden bg-[#f4f4f4] md:h-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent_34%),linear-gradient(135deg,#f8f8f8,#e9ecef)]" />
            <img
              src={images[activeImageIndex] || selectedProduct.image}
              alt={selectedProduct.name}
              className="relative z-10 h-full w-full object-contain p-8 transition-transform duration-500 hover:scale-[1.03] md:p-12"
            />

            <div className="absolute right-4 top-4 z-20 flex gap-2">
              <button
                onClick={handleWishlistToggle}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:scale-110"
                aria-label={isInWishlist ? 'Remove from favorites' : 'Add to favorites'}
              >
                <NikeHeart size={16} className={isInWishlist ? 'text-[#111]' : 'text-[#757575]'} fill={isInWishlist ? '#111' : 'none'} />
              </button>
              <button
                onClick={() => openShareModal(selectedProduct)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:scale-110"
                aria-label="Share product"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:scale-105"
                  aria-label="Previous product image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:scale-105"
                  aria-label="Next product image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur">
                {images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(i)}
                    className={`h-12 w-12 overflow-hidden rounded-full border-2 bg-white transition-all ${
                      activeImageIndex === i ? 'scale-105 border-[#111] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`Show product image ${i + 1}`}
                  >
                    <img src={img} alt={`${selectedProduct.name} view ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-y-auto p-5 pb-4 md:p-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#757575]">
                  {selectedProduct.type}
                </span>
                {selectedProduct.isNew && (
                  <span className="rounded-full bg-[#111] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                    New
                  </span>
                )}
                {selectedProduct.isSale && discount > 0 && (
                  <span className="rounded-full bg-[#f5334f] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                    {discount}% Off
                  </span>
                )}
              </div>

              <h2 className="mb-2 text-2xl font-black uppercase tracking-tight text-[#111] md:text-3xl">
                {selectedProduct.name}
              </h2>

              <div className="mb-3 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${star <= Math.round(selectedProduct.rating) ? 'fill-[#111] text-[#111]' : 'text-[#e5e5e5]'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#757575]">{selectedProduct.rating} ({selectedProduct.reviewCount} reviews)</span>
              </div>

              <div className="mb-6 flex items-center gap-2">
                {selectedProduct.isSale && selectedProduct.originalPrice && (
                  <span className="text-lg text-[#757575] line-through">${selectedProduct.originalPrice}</span>
                )}
                <p className={`text-2xl font-black ${selectedProduct.isSale ? 'text-[#f5334f]' : 'text-[#111]'}`}>
                  ${selectedProduct.price}
                </p>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-[#757575]">
                {selectedProduct.description}
              </p>

              <div className="mb-6">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#757575]">
                  Color: <span className="text-[#111]">{activeColor}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      activeColor === color
                          ? 'border-[#111] bg-[#111] text-white'
                          : 'border-[#e5e5e5] text-[#757575] hover:border-[#111] hover:text-[#111]'
                      }`}
                    >
                      {activeColor === color && <Check className="h-3 w-3" />}
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#757575]">
                  Select Size
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 text-xs font-medium rounded-md border transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-[#111] bg-[#111] text-white shadow-md'
                          : 'border-[#e5e5e5] text-[#111] hover:border-[#111] hover:-translate-y-0.5'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#e5e5e5] bg-white p-5 shadow-[0_-12px_30px_rgba(0,0,0,0.05)] md:p-6">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-bold uppercase tracking-widest transition-all duration-200 ${
                  added
                    ? 'bg-green-600 text-white'
                    : selectedSize
                      ? 'bg-[#111] text-white hover:bg-[#333] active:scale-[0.98]'
                      : 'cursor-not-allowed bg-[#e5e5e5] text-[#757575]'
                }`}
              >
                {added ? (
                  'Added to Bag!'
                ) : (
                  <>
                    <NikeBag size={16} className={selectedSize ? 'text-white' : 'text-[#757575]'} />
                    {selectedSize ? 'Add to Bag' : 'Select a Size'}
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  closeQuickView();
                  switchView('product-detail');
                }}
                className="mt-3 w-full rounded-full border border-[#111] py-3 text-sm font-bold uppercase tracking-widest transition-colors hover:bg-[#f5f5f5]"
              >
                Full Details
              </button>

              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[#e5e5e5] pt-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#111]" />
                  <div>
                    <p className="text-xs font-bold text-[#111]">Free Delivery</p>
                    <p className="text-xs text-[#757575]">On orders over $150.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#111]" />
                  <div>
                    <p className="text-xs font-bold text-[#111]">Free Returns</p>
                    <p className="text-xs text-[#757575]">Free 60-day returns.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
