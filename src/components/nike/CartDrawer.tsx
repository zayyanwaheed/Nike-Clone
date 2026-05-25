'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import { Minus, Plus, Trash2, Truck, Tag } from 'lucide-react';
import { NikeBag, NikeHeart } from './NikeIcons';
import { useNikeStore, useCart, useCartCount, useCartTotal, useNikeActions } from '@/store/nike-store';
import { toast } from 'sonner';
import { addDays, format } from 'date-fns';

export default function CartDrawer() {
  const isCartOpen = useNikeStore((s) => s.isCartOpen);
  const cart = useCart();
  const cartCount = useCartCount();
  const cartTotal = useCartTotal();
  const { closeCart, updateQuantity, removeFromCart, switchView, toggleWishlist } = useNikeActions();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const estimatedDelivery = format(addDays(new Date(), 5), 'EEEE, MMMM d');

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
      toast.success('Promo applied!');
      setPromoCode('');
    }
  };

  const handleMoveToFavorites = (item: { id: string; name: string; lineHash: string }) => {
    toggleWishlist(item.id);
    removeFromCart(item.lineHash);
    toast.success('Moved to Favorites');
  };

  const displayTotal = promoApplied ? Math.max(0, cartTotal - 20) : cartTotal;

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:max-w-[480px] p-0 flex flex-col">
        <SheetTitle className="sr-only">Shopping Bag</SheetTitle>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5]">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black uppercase tracking-tight">Bag</h2>
            {cartCount > 0 && (
              <span className="bg-[#111] text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>

        {/* Cart Items */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <NikeBag size={64} className="text-[#e5e5e5] mb-4" />
            <p className="text-lg font-bold text-[#111] mb-1">Your bag is empty</p>
            <p className="text-sm text-[#757575] text-center mb-6">
              Looks like you haven&apos;t added anything yet.
            </p>
            <button
              onClick={() => {
                closeCart();
                switchView('home');
              }}
              className="rounded-full bg-[#111] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#333] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Free delivery note */}
            {cartTotal < 150 && (
              <div className="px-6 py-3 bg-[#f5f5f5] text-center">
                <p className="text-xs font-medium text-[#111]">
                  Spend <span className="font-bold">${(150 - cartTotal).toFixed(2)}</span> more for free delivery
                </p>
                <div className="mt-1.5 w-full bg-[#e5e5e5] rounded-full h-1.5">
                  <div
                    className="bg-[#111] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((cartTotal / 150) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            {cartTotal >= 150 && (
              <div className="px-6 py-3 bg-[#f0fff0] text-center flex items-center justify-center gap-2">
                <Truck className="w-4 h-4 text-green-600" />
                <p className="text-xs font-bold text-green-700">You qualify for free delivery!</p>
              </div>
            )}

            {/* Estimated delivery */}
            <div className="px-6 py-2 bg-[#f5f5f5] border-b border-[#e5e5e5]">
              <p className="text-[11px] text-[#757575]">
                Estimated delivery: <span className="font-bold text-[#111]">{estimatedDelivery}</span>
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-[#e5e5e5]">
                {cart.map((item) => (
                  <div key={item.lineHash} className="flex gap-4 p-6">
                    <div className="w-24 h-24 bg-[#f5f5f5] rounded-lg flex-shrink-0 overflow-hidden">
                      {item.img ? (
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <NikeBag size={32} className="text-[#ccc]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-sm text-[#111] truncate pr-2">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.lineHash)}
                          className="text-[#757575] hover:text-[#111] transition-colors p-0.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.size && (
                        <p className="text-xs text-[#757575] mt-0.5">Size {item.size}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.lineHash, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-[#e5e5e5] flex items-center justify-center hover:border-[#111] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.lineHash, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-[#e5e5e5] flex items-center justify-center hover:border-[#111] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-bold text-sm text-[#111]">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      {/* Move to Favorites */}
                      <button
                        onClick={() => handleMoveToFavorites(item)}
                        className="flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-widest text-[#757575] hover:text-[#111] transition-colors"
                      >
                        <NikeHeart size={12} className="text-[#757575]" />
                        Move to Favorites
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div className="px-6 py-3 border-t border-[#e5e5e5]">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo Code"
                    className="w-full border border-[#e5e5e5] rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode.trim()}
                  className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
                    promoApplied
                      ? 'bg-green-100 text-green-700'
                      : 'bg-[#111] text-white hover:bg-[#333]'
                  }`}
                >
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#e5e5e5] p-6 space-y-4 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#757575]">Subtotal</span>
                <span className="text-lg font-black">${displayTotal.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">Promo Discount</span>
                  <span className="text-green-600 font-medium">-$20.00</span>
                </div>
              )}
              <p className="text-[11px] text-[#757575]">Delivery and taxes calculated at checkout.</p>
              <button
                onClick={() => {
                  closeCart();
                  switchView('checkout');
                }}
                className="w-full rounded-full bg-[#111] text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#333] transition-colors"
              >
                Checkout
              </button>
              <button
                onClick={closeCart}
                className="w-full rounded-full border border-[#111] text-[#111] py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#f5f5f5] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
