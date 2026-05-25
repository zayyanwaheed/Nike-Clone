'use client';

import { useState, useEffect } from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { NikeSwoosh, NikeSearch, NikeHeart, NikeBag, NikeClose, NikeLocationPin } from './NikeIcons';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { useNikeStore, useNikeActions, useCartCount, useCurrentView, useUserProfile, useWishlist } from '@/store/nike-store';
import { products } from '@/data/products';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'New & Featured', view: 'home' as const },
  { label: 'Men', view: 'men' as const },
  { label: 'Women', view: 'women' as const },
  { label: 'Kids', view: 'kids' as const },
  { label: 'Sale', view: 'sale' as const, highlight: true },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const currentView = useCurrentView();
  const cartCount = useCartCount();
  const userProfile = useUserProfile();
  const wishlist = useWishlist();
  const isWishlistDrawerOpen = useNikeStore((s) => s.isWishlistDrawerOpen);
  const { switchView, toggleSearch, openCart, openAuthModal, openWishlistDrawer, closeWishlistDrawer, toggleWishlist, openQuickView, openStoreLocator, logout, openShareModal } = useNikeActions();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-[0_1px_0_0_rgba(0,0,0,0.05)]' : 'bg-white'}`}>
        <div className="flex items-center justify-between h-[60px] px-6 md:px-12">
          {/* Logo */}
          <motion.button
            onClick={() => switchView('home')}
            className="flex-shrink-0 hover:opacity-60 transition-opacity mr-4"
            aria-label="Nike Home"
            whileTap={{ scale: 0.92 }}
          >
            <NikeSwoosh className="text-[#111]" size={59} />
          </motion.button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0 flex-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => switchView(link.view)}
                className={`nav-link-animated relative text-[15px] font-medium tracking-tight transition-colors px-3 py-5 hover:text-[#757575] ${
                  currentView === link.view ? 'text-[#111] active' : 'text-[#111]'
                } ${link.highlight ? 'text-[#f5334f]' : ''}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {/* Search Pill - Desktop */}
            <motion.button
              onClick={toggleSearch}
              className="hidden md:flex items-center gap-3 bg-[#f5f5f5] rounded-full pl-4 pr-6 py-2 hover:bg-[#e5e5e5] transition-all duration-200 w-[180px] group"
              whileTap={{ scale: 0.97 }}
            >
              <NikeSearch size={16} className="text-[#757575] group-hover:scale-110 transition-transform" />
              <span className="text-sm text-[#757575] font-medium">Search</span>
            </motion.button>

            {/* Mobile Search */}
            <motion.button
              onClick={toggleSearch}
              className="md:hidden p-2 hover:bg-[#f5f5f5] rounded-full transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <NikeSearch size={22} className="text-[#111]" />
            </motion.button>

            {/* Favorites */}
            <motion.button
              onClick={openWishlistDrawer}
              className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors relative"
              whileTap={{ scale: 0.9 }}
            >
              <NikeHeart size={22} className="text-[#111]" />
              <AnimatePresence>
                {wishlist.length > 0 && (
                  <motion.span
                    key="wishlist-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0.5 right-0.5 bg-[#111] text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center animate-badge-pop"
                  >
                    {wishlist.length > 9 ? '9+' : wishlist.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Cart */}
            <motion.button
              onClick={openCart}
              className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors relative"
              whileTap={{ scale: 0.9 }}
            >
              <NikeBag size={22} className="text-[#111]" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0.5 right-0.5 bg-[#111] text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center animate-badge-pop"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User Name when logged in */}
            {userProfile?.isLoggedIn && (
              <span className="hidden md:block text-xs font-medium text-[#111] ml-1">
                Hi, {userProfile.firstName || userProfile.email.split('@')[0]}
              </span>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <motion.button
                  className="lg:hidden p-2 hover:bg-[#f5f5f5] rounded-full transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <Menu className="w-[22px] h-[22px]" />
                </motion.button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-[#e5e5e5]">
                    <NikeSwoosh className="text-[#111]" size={48} />
                    <SheetClose asChild>
                      <button className="p-1 hover:bg-[#f5f5f5] rounded-full">
                        <NikeClose size={20} className="text-[#111]" />
                      </button>
                    </SheetClose>
                  </div>
                  <nav className="flex-1 py-2 overflow-y-auto">
                    {navLinks.map((link, i) => (
                      <motion.button
                        key={link.label}
                        onClick={() => {
                          switchView(link.view);
                          setMobileOpen(false);
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`block w-full text-left px-6 py-2 text-2xl font-bold hover:bg-[#f5f5f5] transition-colors ${
                          link.highlight ? 'text-[#f5334f]' : 'text-[#111]'
                        }`}
                      >
                        {link.label}
                      </motion.button>
                    ))}
                  </nav>
                  <div className="border-t border-[#e5e5e5] py-4 px-6 space-y-3">
                    {userProfile?.isLoggedIn ? (
                      <>
                        <div className="flex items-center gap-2 text-sm font-medium text-[#111]">
                          <User className="w-4 h-4" />
                          Hi, {userProfile.firstName || userProfile.email.split('@')[0]}
                        </div>
                        <button
                          onClick={() => { logout(); toast.success('Signed Out'); setMobileOpen(false); }}
                          className="flex items-center gap-2 text-sm font-medium text-[#757575] hover:text-[#111] transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { openAuthModal('join'); setMobileOpen(false); }}
                          className="flex items-center gap-2 text-sm font-medium text-[#757575] hover:text-[#111] transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Become a Member
                        </button>
                        <button
                          onClick={() => { openAuthModal('signin'); setMobileOpen(false); }}
                          className="block text-sm font-medium text-[#757575] hover:text-[#111] transition-colors"
                        >
                          Sign In / Join
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => { switchView('support'); setMobileOpen(false); }}
                      className="block text-sm font-medium text-[#757575] hover:text-[#111] transition-colors"
                    >
                      Help
                    </button>
                    <button
                      onClick={() => { openStoreLocator(); setMobileOpen(false); }}
                      className="flex items-center gap-2 text-sm font-medium text-[#757575] hover:text-[#111] transition-colors"
                    >
                      <NikeLocationPin size={16} className="text-[#757575]" />
                      Store Locator
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Wishlist Drawer */}
      <Sheet open={isWishlistDrawerOpen} onOpenChange={(open) => !open && closeWishlistDrawer()}>
        <SheetContent side="right" className="w-full sm:max-w-[480px] p-0 flex flex-col">
          <SheetTitle className="sr-only">Favorites</SheetTitle>
          <div className="flex items-center gap-3 px-6 py-5 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-black uppercase tracking-tight">Favorites</h2>
            <AnimatePresence>
              {wishlist.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="bg-[#111] text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center"
                >
                  {wishlist.length}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {wishlistProducts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <NikeHeart size={64} className="text-[#e5e5e5] mb-4" />
              <p className="text-lg font-bold text-[#111] mb-1">Your favorites list is empty</p>
              <p className="text-sm text-[#757575] text-center mb-6">Add items you love to your favorites.</p>
              <button
                onClick={() => { closeWishlistDrawer(); switchView('home'); }}
                className="rounded-full bg-[#111] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#333] transition-colors btn-shine"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-[#e5e5e5]">
                {wishlistProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-4 p-6"
                  >
                    <div
                      className="w-24 h-24 bg-[#f5f5f5] rounded-lg flex-shrink-0 overflow-hidden cursor-pointer"
                      onClick={() => { closeWishlistDrawer(); openQuickView(product); }}
                    >
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-[#111] truncate">{product.name}</h3>
                      <p className="text-xs text-[#757575] mt-0.5">{product.type}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {product.isSale && product.originalPrice && (
                          <span className="text-xs text-[#757575] line-through">${product.originalPrice}</span>
                        )}
                        <span className="text-sm font-bold text-[#111]">${product.price}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => { openQuickView(product); closeWishlistDrawer(); }}
                          className="text-[11px] font-bold uppercase tracking-widest text-[#111] underline underline-offset-2 hover:text-[#757575] transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => { toggleWishlist(product.id); toast.success('Removed from Favorites'); }}
                          className="text-[11px] font-bold uppercase tracking-widest text-[#757575] underline underline-offset-2 hover:text-[#111] transition-colors"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => { openShareModal(product); }}
                          className="text-[11px] font-bold uppercase tracking-widest text-[#757575] underline underline-offset-2 hover:text-[#111] transition-colors"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
