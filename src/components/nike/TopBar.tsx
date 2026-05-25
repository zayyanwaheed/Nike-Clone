'use client';

import { useNikeActions, useNikeStore } from '@/store/nike-store';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Phone, Clock } from 'lucide-react';
import { JordanJumpman, ConverseStar, NikeLocationPin } from './NikeIcons';

const storeLocations = [
  { name: 'Nike NYC - House of Innovation', address: '650 5th Ave, New York, NY 10019', phone: '(212) 765-1200', hours: 'Mon-Sat 10am-8pm, Sun 11am-7pm' },
  { name: 'Nike Chicago - Michigan Avenue', address: '669 N Michigan Ave, Chicago, IL 60611', phone: '(312) 642-6363', hours: 'Mon-Sat 10am-8pm, Sun 11am-6pm' },
  { name: 'Nike Los Angeles - The Grove', address: '189 The Grove Dr, Los Angeles, CA 90036', phone: '(323) 297-4738', hours: 'Mon-Sat 10am-9pm, Sun 11am-8pm' },
  { name: 'Nike Portland - Pioneer Place', address: '340 SW Morrison St, Portland, OR 97204', phone: '(503) 227-3020', hours: 'Mon-Sat 10am-7pm, Sun 11am-6pm' },
];

export default function TopBar() {
  const { switchView } = useNikeActions();
  const isStoreLocatorOpen = useNikeStore((s) => s.isStoreLocatorOpen);
  const { openStoreLocator, closeStoreLocator, openAuthModal } = useNikeActions();

  return (
    <>
      <div className="bg-[#f5f5f5] w-full h-[36px] flex items-center justify-between px-6 md:px-12 text-[11px] font-bold uppercase tracking-wider z-50 border-b border-[#e5e5e5]">
        <div className="flex items-center gap-4">
          <button className="hover:opacity-60 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center" onClick={() => window.open('https://www.nike.com/jordan', '_blank')} aria-label="Jordan Brand">
            <JordanJumpman size={20} className="text-[#111]" />
          </button>
          <span className="text-[#e5e5e5] hidden sm:inline">|</span>
          <button className="hover:opacity-60 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center hidden sm:inline-flex" onClick={() => window.open('https://www.nike.com/converse', '_blank')} aria-label="Converse">
            <ConverseStar size={20} className="text-[#111]" />
          </button>
        </div>
        <div className="flex items-center gap-3 text-[#111]">
          <button
            className="hover:text-[#757575] transition-colors hidden md:block"
            onClick={openStoreLocator}
          >
            Find a Store
          </button>
          <span className="text-[#e5e5e5] hidden md:inline">|</span>
          <button
            className="hover:text-[#757575] transition-colors hidden md:block"
            onClick={() => switchView('support')}
          >
            Help
          </button>
          <span className="text-[#e5e5e5] hidden md:inline">|</span>
          <button
            className="hover:text-[#757575] transition-colors"
            onClick={() => openAuthModal('join')}
          >
            Join Us
          </button>
          <span className="text-[#e5e5e5]">|</span>
          <button
            className="hover:text-[#757575] transition-colors"
            onClick={() => openAuthModal('signin')}
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Store Locator Dialog */}
      <Dialog open={isStoreLocatorOpen} onOpenChange={(open) => !open && closeStoreLocator()}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden rounded-lg">
          <DialogTitle className="sr-only">Find a Store</DialogTitle>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <NikeLocationPin size={20} className="text-[#111]" />
              <h2 className="text-xl font-black uppercase tracking-tight">Find a Store</h2>
            </div>

            {/* Map Image */}
            <div className="w-full h-48 bg-[#f5f5f5] rounded-lg mb-6 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                alt="Store map"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Store List */}
            <div className="space-y-4">
              {storeLocations.map((store) => (
                <div key={store.name} className="p-4 bg-[#f5f5f5] rounded-lg">
                  <h3 className="font-bold text-sm text-[#111] mb-1">{store.name}</h3>
                  <p className="text-xs text-[#757575] mb-1">{store.address}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-xs text-[#757575]">
                      <Phone className="w-3 h-3" />
                      {store.phone}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#757575]">
                      <Clock className="w-3 h-3" />
                      {store.hours}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
