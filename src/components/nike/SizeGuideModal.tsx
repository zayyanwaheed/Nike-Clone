'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNikeStore, useNikeActions } from '@/store/nike-store';
import { useState } from 'react';
import { Ruler } from 'lucide-react';

const menSizes = [
  { us: '7', uk: '6', eu: '40', cm: '25' },
  { us: '7.5', uk: '6.5', eu: '40.5', cm: '25.5' },
  { us: '8', uk: '7', eu: '41', cm: '26' },
  { us: '8.5', uk: '7.5', eu: '42', cm: '26.5' },
  { us: '9', uk: '8', eu: '42.5', cm: '27' },
  { us: '9.5', uk: '8.5', eu: '43', cm: '27.5' },
  { us: '10', uk: '9', eu: '44', cm: '28' },
  { us: '10.5', uk: '9.5', eu: '44.5', cm: '28.5' },
  { us: '11', uk: '10', eu: '45', cm: '29' },
  { us: '11.5', uk: '10.5', eu: '45.5', cm: '29.5' },
  { us: '12', uk: '11', eu: '46', cm: '30' },
  { us: '13', uk: '12', eu: '47.5', cm: '31' },
];

const womenSizes = [
  { us: '5', uk: '2.5', eu: '35.5', cm: '22' },
  { us: '5.5', uk: '3', eu: '36', cm: '22.5' },
  { us: '6', uk: '3.5', eu: '36.5', cm: '23' },
  { us: '6.5', uk: '4', eu: '37.5', cm: '23.5' },
  { us: '7', uk: '4.5', eu: '38', cm: '24' },
  { us: '7.5', uk: '5', eu: '38.5', cm: '24.5' },
  { us: '8', uk: '5.5', eu: '39', cm: '25' },
  { us: '8.5', uk: '6', eu: '40', cm: '25.5' },
  { us: '9', uk: '6.5', eu: '40.5', cm: '26' },
  { us: '9.5', uk: '7', eu: '41', cm: '26.5' },
  { us: '10', uk: '7.5', eu: '42', cm: '27' },
];

const kidsSizes = [
  { us: '1Y', uk: '13.5', eu: '32', cm: '20' },
  { us: '1.5Y', uk: '1', eu: '33', cm: '20.5' },
  { us: '2Y', uk: '1.5', eu: '33.5', cm: '21' },
  { us: '2.5Y', uk: '2', eu: '34', cm: '21.5' },
  { us: '3Y', uk: '2.5', eu: '35', cm: '22' },
  { us: '3.5Y', uk: '3', eu: '35.5', cm: '22.5' },
  { us: '4Y', uk: '3.5', eu: '36', cm: '23' },
  { us: '5Y', uk: '4.5', eu: '37.5', cm: '24' },
  { us: '6Y', uk: '5.5', eu: '38.5', cm: '25' },
  { us: '7Y', uk: '6', eu: '40', cm: '25.5' },
];

export default function SizeGuideModal() {
  const isSizeGuideOpen = useNikeStore((s) => s.isSizeGuideOpen);
  const { closeSizeGuide } = useNikeActions();
  const [activeTab, setActiveTab] = useState<'men' | 'women' | 'kids'>('men');

  const currentSizes = activeTab === 'men' ? menSizes : activeTab === 'women' ? womenSizes : kidsSizes;

  return (
    <Dialog open={isSizeGuideOpen} onOpenChange={(open) => !open && closeSizeGuide()}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden rounded-lg">
        <DialogTitle className="sr-only">Size Guide</DialogTitle>
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Ruler className="w-5 h-5" />
            <h2 className="text-xl font-black uppercase tracking-tight">Size Guide</h2>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#e5e5e5] mb-6">
            {(['men', 'women', 'kids'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 pb-3 text-sm font-bold uppercase tracking-widest transition-colors ${
                  activeTab === tab
                    ? 'text-[#111] border-b-2 border-[#111]'
                    : 'text-[#757575] hover:text-[#111]'
                }`}
              >
                {tab === 'men' ? "Men's" : tab === 'women' ? "Women's" : "Kids'"}
              </button>
            ))}
          </div>

          {/* Size Table */}
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#111]">
                  <th className="text-left py-3 px-2 font-bold uppercase tracking-widest text-[11px]">US</th>
                  <th className="text-left py-3 px-2 font-bold uppercase tracking-widest text-[11px]">UK</th>
                  <th className="text-left py-3 px-2 font-bold uppercase tracking-widest text-[11px]">EU</th>
                  <th className="text-left py-3 px-2 font-bold uppercase tracking-widest text-[11px]">CM</th>
                </tr>
              </thead>
              <tbody>
                {currentSizes.map((size, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-[#f5f5f5]' : ''}>
                    <td className="py-2.5 px-2 font-medium">{size.us}</td>
                    <td className="py-2.5 px-2 text-[#757575]">{size.uk}</td>
                    <td className="py-2.5 px-2 text-[#757575]">{size.eu}</td>
                    <td className="py-2.5 px-2 text-[#757575]">{size.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to Measure */}
          <div className="mt-8 pt-6 border-t border-[#e5e5e5]">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3">How to Measure</h3>
            <div className="space-y-2 text-sm text-[#757575] leading-relaxed">
              <p>1. Place a piece of paper on a hard floor against a wall.</p>
              <p>2. Stand on the paper with your heel against the wall.</p>
              <p>3. Mark the tip of your longest toe on the paper.</p>
              <p>4. Measure the distance from the edge of the paper (wall) to the mark.</p>
              <p>5. Use the CM column to find your size based on your foot length measurement.</p>
            </div>
            <div className="mt-4 p-3 bg-[#f5f5f5] rounded-md">
              <p className="text-xs text-[#757575]">
                <span className="font-bold text-[#111]">Tip:</span> If you&apos;re between sizes, we recommend going up to the next half size for a more comfortable fit.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
