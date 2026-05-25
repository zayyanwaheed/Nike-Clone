'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNikeStore, useNikeActions } from '@/store/nike-store';
import { Copy, Twitter, Facebook, Mail, Link2, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ShareModal() {
  const isShareModalOpen = useNikeStore((s) => s.isShareModalOpen);
  const shareProduct = useNikeStore((s) => s.shareProduct);
  const { closeShareModal } = useNikeActions();
  const [copied, setCopied] = useState(false);

  const shareUrl = shareProduct
    ? `https://nike.com/shoes/${shareProduct.id}`
    : 'https://nike.com';
  const shareText = shareProduct
    ? `Check out the ${shareProduct.name} on Nike.com!`
    : 'Check out Nike.com!';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link Copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    toast.success('Opening Twitter...');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    toast.success('Opening Facebook...');
  };

  const shareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`);
    toast.success('Opening Email...');
  };

  return (
    <Dialog open={isShareModalOpen} onOpenChange={(open) => !open && closeShareModal()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-lg">
        <DialogTitle className="sr-only">Share</DialogTitle>
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-black uppercase tracking-tight mb-1">Share</h2>
          {shareProduct && (
            <p className="text-sm text-[#757575] mb-4">{shareProduct.name}</p>
          )}

          {/* Link Input */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 bg-[#f5f5f5] rounded-lg px-4 py-3 text-sm text-[#757575] truncate border border-[#e5e5e5]">
              {shareUrl}
            </div>
            <button
              onClick={copyToClipboard}
              className={`flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center transition-colors ${
                copied ? 'bg-green-600 text-white' : 'bg-[#111] text-white hover:bg-[#333]'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={shareTwitter}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#f5f5f5] hover:bg-[#e5e5e5] transition-colors"
            >
              <Twitter className="w-5 h-5 text-[#111]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#757575]">Twitter</span>
            </button>
            <button
              onClick={shareFacebook}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#f5f5f5] hover:bg-[#e5e5e5] transition-colors"
            >
              <Facebook className="w-5 h-5 text-[#111]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#757575]">Facebook</span>
            </button>
            <button
              onClick={shareEmail}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#f5f5f5] hover:bg-[#e5e5e5] transition-colors"
            >
              <Mail className="w-5 h-5 text-[#111]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#757575]">Email</span>
            </button>
            <button
              onClick={copyToClipboard}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#f5f5f5] hover:bg-[#e5e5e5] transition-colors"
            >
              <Link2 className="w-5 h-5 text-[#111]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#757575]">Copy</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
