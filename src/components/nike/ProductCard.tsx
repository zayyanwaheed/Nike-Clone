'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NikeBag, NikeHeart } from './NikeIcons';
import { Product, useNikeActions, useIsInWishlist } from '@/store/nike-store';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-[#111]' : 'text-[#e5e5e5]'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, openCart, openQuickView, toggleWishlist } = useNikeActions();
  const isInWishlist = useIsInWishlist(product.id);
  const [previewImage, setPreviewImage] = useState(product.image);
  const previewImages = product.images?.length ? product.images.slice(0, 3) : [product.image];
  const quickSizes = product.sizes.slice(0, 4);
  const nikeEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    if (isInWishlist) {
      toast.success('Removed from Favorites');
    } else {
      toast.success('Added to Favorites');
    }
  };

  const handleQuickSizeAdd = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size,
      img: product.image,
      quantity: 1,
    });
    toast.success(`Added size ${size} to Bag`);
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: nikeEase }}
      className="group cursor-pointer"
      onClick={() => openQuickView(product)}
      onMouseLeave={() => setPreviewImage(product.image)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-[#f5f5f5] rounded-lg overflow-hidden mb-3 hover-lift">
        <img
          src={previewImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-x-3 bottom-3 grid translate-y-[calc(100%+1rem)] grid-cols-4 gap-1.5 rounded-lg bg-white/90 p-2 shadow-xl backdrop-blur transition-transform duration-300 ease-out group-hover:translate-y-0">
          {quickSizes.map((size) => (
            <button
              key={size}
              onClick={(e) => handleQuickSizeAdd(e, size)}
              className="h-9 rounded-md border border-[#e5e5e5] bg-white text-xs font-bold text-[#111] transition hover:border-[#111] hover:bg-[#111] hover:text-white"
            >
              {size}
            </button>
          ))}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="col-span-4 flex h-9 items-center justify-center gap-2 rounded-full bg-[#111] text-[11px] font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-[#333]"
          >
            <NikeBag size={14} className="text-white" />
            More Sizes
          </button>
        </div>

        {/* Wishlist Heart */}
        <motion.button
          onClick={handleWishlistToggle}
          whileTap={{ scale: 0.85 }}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
        >
          <NikeHeart
            size={16}
            className={`transition-all duration-200 ${
              isInWishlist ? 'text-[#111]' : 'text-[#757575]'
            }`}
            fill={isInWishlist ? '#111' : 'none'}
          />
        </motion.button>

        {/* Tag */}
        <div className="absolute top-3 left-3">
          {product.isSale ? (
            <span className="bg-[#f5334f] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm animate-pulse-sale">
              Sale
            </span>
          ) : product.isNew ? (
            <span className="bg-[#111] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
              New
            </span>
          ) : null}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-0.5 px-0.5">
        <div className="mb-2 flex items-center gap-1.5">
          {previewImages.map((image, imageIndex) => (
            <button
              key={image}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setPreviewImage(image)}
              className={`h-7 w-7 overflow-hidden rounded-full border bg-[#f5f5f5] transition ${
                previewImage === image ? 'border-[#111]' : 'border-transparent hover:border-[#cfcfcf]'
              }`}
              aria-label={`Preview ${product.name} image ${imageIndex + 1}`}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
          <div className="ml-auto flex gap-1">
            {product.colors.slice(0, 3).map((color) => (
              <span
                key={color}
                className="h-3 w-3 rounded-full border border-[#d4d4d4]"
                title={color}
                style={{ backgroundColor: color.toLowerCase().includes('black') ? '#111' : color.toLowerCase().includes('red') ? '#c8102e' : color.toLowerCase().includes('blue') || color.toLowerCase().includes('cobalt') || color.toLowerCase().includes('royal') ? '#2563eb' : color.toLowerCase().includes('green') || color.toLowerCase().includes('volt') ? '#a3e635' : color.toLowerCase().includes('grey') || color.toLowerCase().includes('gray') || color.toLowerCase().includes('silver') ? '#a3a3a3' : color.toLowerCase().includes('white') ? '#fff' : '#d8c7aa' }}
              />
            ))}
          </div>
        </div>
        <h3 className="font-bold text-[#111] text-base leading-tight transition-colors group-hover:text-[#555]">{product.name}</h3>
        <p className="text-sm text-[#757575]">{product.type}</p>
        <div className="flex items-center gap-1">
          <StarRating rating={product.rating} />
          <span className="text-[10px] text-[#757575]">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2">
          {product.isSale && product.originalPrice && (
            <span className="text-sm text-[#757575] line-through">${product.originalPrice}</span>
          )}
          <p className={`font-bold ${product.isSale ? 'text-[#f5334f]' : 'text-[#111]'}`}>
            ${product.price}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
