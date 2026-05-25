'use client';

import { useCurrentView, useNikeActions } from '@/store/nike-store';
import TopBar from '@/components/nike/TopBar';
import Header from '@/components/nike/Header';
import AnnouncementBar from '@/components/nike/AnnouncementBar';
import HeroSection from '@/components/nike/HeroSection';
import CategoryGrid from '@/components/nike/CategoryGrid';
import MarqueeBanner from '@/components/nike/MarqueeBanner';
import TrendingSection from '@/components/nike/TrendingSection';
import SportCategorySection from '@/components/nike/SportCategorySection';
import MembershipBanner from '@/components/nike/MembershipBanner';
import ProductGrid from '@/components/nike/ProductGrid';
import ProductDetailView from '@/components/nike/ProductDetailView';
import CheckoutView from '@/components/nike/CheckoutView';
import SupportView from '@/components/nike/SupportView';
import SaleView from '@/components/nike/SaleView';
import Footer from '@/components/nike/Footer';
import CartDrawer from '@/components/nike/CartDrawer';
import SearchOverlay from '@/components/nike/SearchOverlay';
import QuickViewModal from '@/components/nike/QuickViewModal';
import AuthModal from '@/components/nike/AuthModal';
import SizeGuideModal from '@/components/nike/SizeGuideModal';
import ShareModal from '@/components/nike/ShareModal';
import RecentlyViewed from '@/components/nike/RecentlyViewed';
import { Toaster } from '@/components/ui/sonner';
import { motion, AnimatePresence, type Transition } from 'framer-motion';

function HomeView() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <TrendingSection />
      <MarqueeBanner />
      <SportCategorySection />
      <RecentlyViewed />
      <MembershipBanner />
    </>
  );
}

function CategoryView() {
  return (
    <>
      <HeroSection />
      <ProductGrid />
      <RecentlyViewed />
    </>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const nikeEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const pageTransition: Transition = {
  duration: 0.35,
  ease: nikeEase,
};

export default function NikePage() {
  const currentView = useCurrentView();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'men':
      case 'women':
      case 'kids':
        return <CategoryView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'checkout':
        return <CheckoutView />;
      case 'support':
        return <SupportView />;
      case 'sale':
        return <SaleView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <TopBar />
      <Header />
      <AnnouncementBar />

      {/* Main Content with page transitions */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentView}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          className="flex-1"
        >
          {renderView()}
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      <Footer />

      {/* Overlays */}
      <CartDrawer />
      <SearchOverlay />
      <QuickViewModal />
      <AuthModal />
      <SizeGuideModal />
      <ShareModal />

      {/* Toast Notifications */}
      <Toaster position="bottom-center" richColors />
    </div>
  );
}
