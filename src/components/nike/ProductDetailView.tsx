'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Truck, RotateCcw, Star, ChevronLeft, ChevronRight, Shield, Minus, Plus } from 'lucide-react';
import { NikeBag, NikeHeart } from './NikeIcons';
import { useNikeStore, useNikeActions, useIsInWishlist } from '@/store/nike-store';
import { products } from '@/data/products';
import ProductCard from './ProductCard';
import { toast } from 'sonner';

const reviews = [
  { name: 'Alex M.', rating: 5, date: '2 weeks ago', title: 'Best shoes I ever owned!', body: 'Incredibly comfortable right out of the box. The cushioning is next level and the design turns heads everywhere I go. Worth every penny.' },
  { name: 'Sarah K.', rating: 4, date: '1 month ago', title: 'Great quality, runs slightly narrow', body: 'The build quality is excellent and they look amazing. I would recommend going half a size up if you have wider feet. Still love them though!' },
  { name: 'James R.', rating: 5, date: '1 month ago', title: 'Perfect for daily wear', body: 'I wear these every single day and they still look brand new. The support is fantastic for all-day walking and the style is timeless.' },
  { name: 'Priya L.', rating: 4, date: '2 months ago', title: 'Stylish and comfortable', body: 'Got so many compliments on these. The colorway is stunning in person. Only giving 4 stars because the laces are a bit long.' },
  { name: 'Mike T.', rating: 5, date: '3 months ago', title: 'Exceeded expectations', body: 'Was hesitant at first but these blew me away. The technology in the sole makes you feel like you are walking on clouds. Nike knocked it out of the park.' },
];

export default function ProductDetailView() {
  const selectedProduct = useNikeStore((s) => s.selectedProduct);
  const selectedSize = useNikeStore((s) => s.selectedSize);
  const wishlist = useNikeStore((s) => s.wishlist);
  const { switchView, addToCart, openCart, toggleWishlist, openSizeGuide, openShareModal, addToRecentlyViewed, setSelectedSize } = useNikeActions();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'details' | 'shipping'>('reviews');
  const [imageDirection, setImageDirection] = useState(0);

  useEffect(() => {
    if (selectedProduct) {
      addToRecentlyViewed(selectedProduct);
    }
  }, [selectedProduct, addToRecentlyViewed]);

  if (!selectedProduct) {
    return (
      <section className="px-6 md:px-12 py-24 text-center">
        <h1 className="text-2xl font-black uppercase tracking-tight mb-4">Product not found</h1>
        <button onClick={() => switchView('home')} className="rounded-full bg-[#111] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#333]">
          Go Home
        </button>
      </section>
    );
  }

  const isInWishlist = wishlist.includes(selectedProduct.id);
  const images = selectedProduct.images?.length > 0 ? selectedProduct.images : [selectedProduct.image];
  const relatedProducts = products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        size: selectedSize,
        img: selectedProduct.image,
        quantity: 1,
      });
    }
    toast.success('Added to Bag');
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 800);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(selectedProduct.id);
    toast.success(isInWishlist ? 'Removed from Favorites' : 'Added to Favorites');
  };

  const nextImage = () => {
    setImageDirection(1);
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setImageDirection(-1);
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const discount = selectedProduct.originalPrice ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100) : 0;

  return (
    <section className="px-6 md:px-12 py-6 md:py-10">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-xs text-[#757575] mb-6"
      >
        <button onClick={() => switchView('home')} className="hover:text-[#111] transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => switchView(selectedProduct.category)} className="hover:text-[#111] transition-colors capitalize">{selectedProduct.category}&apos;s</button>
        <span>/</span>
        <span className="text-[#111] font-medium">{selectedProduct.name}</span>
      </motion.nav>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-[55%]"
        >
          {/* Main Image */}
          <div className="relative aspect-square bg-[#f5f5f5] rounded-2xl overflow-hidden mb-4 group">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={activeImage}
                src={images[activeImage] || selectedProduct.image}
                alt={`${selectedProduct.name} - View ${activeImage + 1}`}
                initial={{ opacity: 0, x: imageDirection * 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -imageDirection * 100 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Favorite & Share */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleWishlistToggle}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <NikeHeart size={20} className={`transition-colors ${isInWishlist ? 'text-[#111]' : ''}`} fill={isInWishlist ? '#111' : 'none'} />
              </button>
              <button
                onClick={() => openShareModal(selectedProduct)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Tags */}
            <div className="absolute top-4 left-4 flex gap-2">
              {selectedProduct.isSale && (
                <span className="bg-[#f5334f] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm animate-pulse-sale">
                  {discount}% Off
                </span>
              )}
              {selectedProduct.isNew && (
                <span className="bg-[#111] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm">
                  Just In
                </span>
              )}
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
              {activeImage + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => { setImageDirection(i > activeImage ? 1 : -1); setActiveImage(i); }}
                className={`flex-none w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  activeImage === i ? 'border-[#111] ring-2 ring-[#111]/10' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${selectedProduct.name} thumb ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right: Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:w-[45%] lg:sticky lg:top-24 lg:self-start"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#757575] block mb-1">
            {selectedProduct.type}
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#111] mb-2">
            {selectedProduct.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(selectedProduct.rating) ? 'text-[#111] fill-[#111]' : 'text-[#e5e5e5]'}`}
                />
              ))}
            </div>
            <span className="text-sm text-[#757575]">{selectedProduct.rating} ({selectedProduct.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            {selectedProduct.isSale && selectedProduct.originalPrice && (
              <span className="text-xl text-[#757575] line-through">${selectedProduct.originalPrice}</span>
            )}
            <p className={`text-2xl font-black ${selectedProduct.isSale ? 'text-[#f5334f]' : 'text-[#111]'}`}>
              ${selectedProduct.price}
            </p>
            {selectedProduct.isSale && (
              <span className="text-xs font-bold uppercase tracking-wider bg-[#f5334f] text-white px-2 py-1 rounded-sm">
                Save ${((selectedProduct.originalPrice || selectedProduct.price) - selectedProduct.price).toFixed(0)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-[#757575] leading-relaxed mb-6">
            {selectedProduct.description}
          </p>

          {/* Colors */}
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#757575] mb-3 block">
              Color
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.colors.map((color) => (
                <span
                  key={color}
                  className="text-xs font-medium text-[#111] px-4 py-2 border border-[#e5e5e5] rounded-full hover:border-[#111] transition-colors cursor-pointer"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#757575]">
                Select Size
              </span>
              <button
                onClick={openSizeGuide}
                className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#757575] underline underline-offset-2 hover:text-[#111] transition-colors"
              >
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {selectedProduct.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-xs font-medium rounded-lg border transition-all duration-200 magnetic-btn ${
                    selectedSize === size
                      ? 'border-[#111] bg-[#111] text-white'
                      : 'border-[#e5e5e5] text-[#111] hover:border-[#111]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#757575] mb-3 block">
              Quantity
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border border-[#e5e5e5] flex items-center justify-center hover:border-[#111] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-bold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-10 h-10 rounded-full border border-[#e5e5e5] flex items-center justify-center hover:border-[#111] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Bag */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`w-full rounded-full py-4 text-sm font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 magnetic-btn ${
              added
                ? 'bg-green-600 text-white'
                : selectedSize
                ? 'bg-[#111] text-white hover:bg-[#333] active:scale-[0.98]'
                : 'bg-[#e5e5e5] text-[#757575] cursor-not-allowed'
            }`}
          >
            {added ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <motion.path
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
                Added to Bag!
              </motion.span>
            ) : (
              <>
                <NikeBag size={16} className="text-white" />
                {selectedSize ? `Add to Bag — $${(selectedProduct.price * quantity).toFixed(2)}` : 'Select a Size'}
              </>
            )}
          </button>

          {/* Favorite Button */}
          <button
            onClick={handleWishlistToggle}
            className={`mt-3 w-full rounded-full border border-[#111] py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#f5f5f5] transition-all flex items-center justify-center gap-2 ${
              isInWishlist ? 'animate-heart-pop' : ''
            }`}
          >
            <NikeHeart size={16} className={isInWishlist ? 'text-[#111]' : ''} fill={isInWishlist ? '#111' : 'none'} />
            {isInWishlist ? 'Favorited' : 'Favorite'}
          </button>

          {/* Benefits */}
          <div className="mt-8 pt-6 border-t border-[#e5e5e5] space-y-4">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-[#111] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#111]">Free Delivery</p>
                <p className="text-xs text-[#757575]">On orders over $150. Standard delivery 3-5 business days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-[#111] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#111]">Free Returns</p>
                <p className="text-xs text-[#757575]">Free 60-day returns. No questions asked.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#111] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#111]">Secure Checkout</p>
                <p className="text-xs text-[#757575]">Your data is protected with enterprise-grade encryption.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16 md:mt-24"
      >
        {/* Tab Headers */}
        <div className="flex gap-0 border-b border-[#e5e5e5] mb-8">
          {[
            { key: 'reviews' as const, label: `Reviews (${selectedProduct.reviewCount})` },
            { key: 'details' as const, label: 'Product Details' },
            { key: 'shipping' as const, label: 'Shipping & Returns' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${
                activeTab === tab.key ? 'text-[#111]' : 'text-[#757575] hover:text-[#111]'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Rating Summary */}
              <div className="flex items-center gap-6 mb-8 p-6 bg-[#f5f5f5] rounded-xl">
                <div className="text-center">
                  <p className="text-5xl font-black text-[#111]">{selectedProduct.rating}</p>
                  <div className="flex items-center gap-0.5 justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= Math.round(selectedProduct.rating) ? 'text-[#111] fill-[#111]' : 'text-[#e5e5e5]'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-[#757575] mt-1">{selectedProduct.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const percent = star === 5 ? 65 : star === 4 ? 22 : star === 3 ? 8 : star === 2 ? 3 : 2;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs font-medium w-3">{star}</span>
                        <Star className="w-3 h-3 text-[#111] fill-[#111]" />
                        <div className="flex-1 bg-[#e5e5e5] rounded-full h-1.5">
                          <div className="bg-[#111] h-1.5 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-[10px] text-[#757575] w-8">{percent}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Cards */}
              <div className="space-y-6">
                {reviews.map((review, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="pb-6 border-b border-[#e5e5e5] last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#111] text-white flex items-center justify-center text-xs font-bold">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#111]">{review.name}</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-[#111] fill-[#111]' : 'text-[#e5e5e5]'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-[#757575]">{review.date}</span>
                    </div>
                    <p className="text-sm font-bold text-[#111] mb-1">{review.title}</p>
                    <p className="text-sm text-[#757575] leading-relaxed">{review.body}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="prose max-w-none"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-3">Product Description</h3>
                  <p className="text-sm text-[#757575] leading-relaxed">{selectedProduct.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-3">Specifications</h3>
                  <div className="space-y-3">
                    {[
                      ['Category', selectedProduct.type],
                      ['Available Colors', selectedProduct.colors.join(', ')],
                      ['Size Range', `${selectedProduct.sizes[0]} - ${selectedProduct.sizes[selectedProduct.sizes.length - 1]}`],
                      ['Price', `$${selectedProduct.price}`],
                      ['Rating', `${selectedProduct.rating} / 5`],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-sm border-b border-[#f5f5f5] pb-2">
                        <span className="text-[#757575]">{label}</span>
                        <span className="font-medium text-[#111]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'shipping' && (
            <motion.div
              key="shipping"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl space-y-8"
            >
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-3">Delivery</h3>
                <div className="space-y-2 text-sm text-[#757575]">
                  <p><span className="font-bold text-[#111]">Standard Delivery:</span> 3-5 business days — Free on orders over $150, otherwise $8</p>
                  <p><span className="font-bold text-[#111]">Express Delivery:</span> 1-2 business days — $15</p>
                  <p><span className="font-bold text-[#111]">Next Day Delivery:</span> Order by 2pm — $25</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-3">Returns</h3>
                <div className="space-y-2 text-sm text-[#757575]">
                  <p>Free returns within <span className="font-bold text-[#111]">60 days</span> of delivery.</p>
                  <p>Items must be unworn and in original packaging.</p>
                  <p>Return shipping is free — use the prepaid label included in your package.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 md:mt-24"
        >
          <h2 className="text-2xl font-black uppercase tracking-tight mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
