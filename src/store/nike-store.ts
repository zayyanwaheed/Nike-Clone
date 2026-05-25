'use client';

import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  type: string;
  category: 'men' | 'women' | 'kids';
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  originalPrice?: number;
  isSale?: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  images: string[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  img: string;
  quantity: number;
  lineHash: string;
}

export type ViewType = 'home' | 'men' | 'women' | 'kids' | 'checkout' | 'support' | 'sale' | 'product-detail';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  isLoggedIn: boolean;
}

interface NikeState {
  currentView: ViewType;
  cart: CartItem[];
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isQuickViewOpen: boolean;
  selectedProduct: Product | null;
  selectedSize: string | null;
  wishlist: string[];
  isAuthModalOpen: boolean;
  authModalTab: 'signin' | 'join';
  isSizeGuideOpen: boolean;
  isShareModalOpen: boolean;
  shareProduct: Product | null;
  recentlyViewed: Product[];
  userProfile: UserProfile | null;
  searchQuery: string;
  recentSearches: string[];
  isWishlistDrawerOpen: boolean;
  isStoreLocatorOpen: boolean;
  isCookiePrefsOpen: boolean;
  isLiveChatOpen: boolean;
  actions: {
    switchView: (view: ViewType) => void;
    addToCart: (item: Omit<CartItem, 'lineHash'>) => void;
    removeFromCart: (lineHash: string) => void;
    updateQuantity: (lineHash: string, quantity: number) => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleSearch: () => void;
    openQuickView: (product: Product) => void;
    closeQuickView: () => void;
    setSelectedSize: (size: string | null) => void;
    clearCart: () => void;
    toggleWishlist: (productId: string) => void;
    openAuthModal: (tab?: 'signin' | 'join') => void;
    closeAuthModal: () => void;
    openSizeGuide: () => void;
    closeSizeGuide: () => void;
    openShareModal: (product?: Product | null) => void;
    closeShareModal: () => void;
    addToRecentlyViewed: (product: Product) => void;
    login: (firstName: string, lastName: string, email: string) => void;
    logout: () => void;
    setSearchQuery: (query: string) => void;
    addRecentSearch: (query: string) => void;
    clearRecentSearches: () => void;
    openWishlistDrawer: () => void;
    closeWishlistDrawer: () => void;
    openStoreLocator: () => void;
    closeStoreLocator: () => void;
    openCookiePrefs: () => void;
    closeCookiePrefs: () => void;
    openLiveChat: () => void;
    closeLiveChat: () => void;
  };
}

function generateLineHash(id: string, size: string): string {
  return `${id}-${size}-${Date.now()}`;
}

export const useNikeStore = create<NikeState>((set, get) => ({
  currentView: 'home',
  cart: [],
  isCartOpen: false,
  isSearchOpen: false,
  isQuickViewOpen: false,
  selectedProduct: null,
  selectedSize: null,
  wishlist: [],
  isAuthModalOpen: false,
  authModalTab: 'signin',
  isSizeGuideOpen: false,
  isShareModalOpen: false,
  shareProduct: null,
  recentlyViewed: [],
  userProfile: null,
  searchQuery: '',
  recentSearches: [],
  isWishlistDrawerOpen: false,
  isStoreLocatorOpen: false,
  isCookiePrefsOpen: false,
  isLiveChatOpen: false,

  actions: {
    switchView: (view) => {
      set({ currentView: view });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    addToCart: (item) => {
      const { cart } = get();
      const lineHash = generateLineHash(item.id, item.size);
      const existing = cart.find((c) => c.id === item.id && c.size === item.size);
      if (existing) {
        set({
          cart: cart.map((c) =>
            c.id === item.id && c.size === item.size
              ? { ...c, quantity: c.quantity + item.quantity }
              : c
          ),
        });
      } else {
        set({ cart: [...cart, { ...item, lineHash }] });
      }
    },

    removeFromCart: (lineHash) => {
      set({ cart: get().cart.filter((c) => c.lineHash !== lineHash) });
    },

    updateQuantity: (lineHash, quantity) => {
      if (quantity <= 0) {
        set({ cart: get().cart.filter((c) => c.lineHash !== lineHash) });
      } else {
        set({
          cart: get().cart.map((c) =>
            c.lineHash === lineHash ? { ...c, quantity } : c
          ),
        });
      }
    },

    toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
    openCart: () => set({ isCartOpen: true }),
    closeCart: () => set({ isCartOpen: false }),

    toggleSearch: () => set({ isSearchOpen: !get().isSearchOpen }),

    openQuickView: (product) =>
      set({ isQuickViewOpen: true, selectedProduct: product, selectedSize: null }),

    closeQuickView: () =>
      set({ isQuickViewOpen: false, selectedProduct: null, selectedSize: null }),

    setSelectedSize: (size) => set({ selectedSize: size }),

    clearCart: () => set({ cart: [] }),

    toggleWishlist: (productId) => {
      const { wishlist } = get();
      if (wishlist.includes(productId)) {
        set({ wishlist: wishlist.filter((id) => id !== productId) });
      } else {
        set({ wishlist: [...wishlist, productId] });
      }
    },

    openAuthModal: (tab = 'signin') => set({ isAuthModalOpen: true, authModalTab: tab }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),

    openSizeGuide: () => set({ isSizeGuideOpen: true }),
    closeSizeGuide: () => set({ isSizeGuideOpen: false }),

    openShareModal: (product = null) => set({ isShareModalOpen: true, shareProduct: product }),
    closeShareModal: () => set({ isShareModalOpen: false, shareProduct: null }),

    addToRecentlyViewed: (product) => {
      const { recentlyViewed } = get();
      const filtered = recentlyViewed.filter((p) => p.id !== product.id);
      set({ recentlyViewed: [product, ...filtered].slice(0, 8) });
    },

    login: (firstName, lastName, email) => {
      set({
        userProfile: { firstName, lastName, email, isLoggedIn: true },
        isAuthModalOpen: false,
      });
    },

    logout: () => set({ userProfile: null }),

    setSearchQuery: (query) => set({ searchQuery: query }),

    addRecentSearch: (query) => {
      const { recentSearches } = get();
      const filtered = recentSearches.filter((s) => s !== query);
      set({ recentSearches: [query, ...filtered].slice(0, 5) });
    },

    clearRecentSearches: () => set({ recentSearches: [] }),

    openWishlistDrawer: () => set({ isWishlistDrawerOpen: true }),
    closeWishlistDrawer: () => set({ isWishlistDrawerOpen: false }),

    openStoreLocator: () => set({ isStoreLocatorOpen: true }),
    closeStoreLocator: () => set({ isStoreLocatorOpen: false }),

    openCookiePrefs: () => set({ isCookiePrefsOpen: true }),
    closeCookiePrefs: () => set({ isCookiePrefsOpen: false }),

    openLiveChat: () => set({ isLiveChatOpen: true }),
    closeLiveChat: () => set({ isLiveChatOpen: false }),
  },
}));

// Selector hooks for convenience
export const useCurrentView = () => useNikeStore((s) => s.currentView);
export const useCart = () => useNikeStore((s) => s.cart);
export const useCartCount = () =>
  useNikeStore((s) => s.cart.reduce((sum, item) => sum + item.quantity, 0));
export const useCartTotal = () =>
  useNikeStore((s) => s.cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
export const useNikeActions = () => useNikeStore((s) => s.actions);
export const useWishlist = () => useNikeStore((s) => s.wishlist);
export const useIsInWishlist = (productId: string) =>
  useNikeStore((s) => s.wishlist.includes(productId));
export const useUserProfile = () => useNikeStore((s) => s.userProfile);
export const useRecentlyViewed = () => useNikeStore((s) => s.recentlyViewed);
