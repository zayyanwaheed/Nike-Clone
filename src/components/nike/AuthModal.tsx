'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNikeStore, useNikeActions } from '@/store/nike-store';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthModal() {
  const isAuthModalOpen = useNikeStore((s) => s.isAuthModalOpen);
  const authModalTab = useNikeStore((s) => s.authModalTab);
  const { closeAuthModal, login } = useNikeActions();

  const [activeTab, setActiveTab] = useState<'signin' | 'join'>(authModalTab);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In form
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [signinErrors, setSigninErrors] = useState<Record<string, string>>({});

  // Join form
  const [joinFirstName, setJoinFirstName] = useState('');
  const [joinLastName, setJoinLastName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [joinConfirmPassword, setJoinConfirmPassword] = useState('');
  const [joinAgree, setJoinAgree] = useState(false);
  const [joinErrors, setJoinErrors] = useState<Record<string, string>>({});

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeAuthModal();
      resetForms();
    }
  };

  const resetForms = () => {
    setSigninEmail('');
    setSigninPassword('');
    setSigninErrors({});
    setJoinFirstName('');
    setJoinLastName('');
    setJoinEmail('');
    setJoinPassword('');
    setJoinConfirmPassword('');
    setJoinAgree(false);
    setJoinErrors({});
    setShowPassword(false);
  };

  const handleTabChange = (tab: 'signin' | 'join') => {
    setActiveTab(tab);
    setSigninErrors({});
    setJoinErrors({});
  };

  const validateSignin = () => {
    const errors: Record<string, string> = {};
    if (!signinEmail) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signinEmail)) errors.email = 'Invalid email format';
    if (!signinPassword) errors.password = 'Password is required';
    else if (signinPassword.length < 6) errors.password = 'Password must be at least 6 characters';
    setSigninErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateJoin = () => {
    const errors: Record<string, string> = {};
    if (!joinFirstName.trim()) errors.firstName = 'First name is required';
    if (!joinLastName.trim()) errors.lastName = 'Last name is required';
    if (!joinEmail) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(joinEmail)) errors.email = 'Invalid email format';
    if (!joinPassword) errors.password = 'Password is required';
    else if (joinPassword.length < 8) errors.password = 'Password must be at least 8 characters';
    if (joinPassword !== joinConfirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!joinAgree) errors.agree = 'You must agree to the Terms';
    setJoinErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignin()) return;
    const name = signinEmail.split('@')[0];
    login(name, '', signinEmail);
    toast.success('Signed In Successfully');
    resetForms();
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateJoin()) return;
    login(joinFirstName, joinLastName, joinEmail);
    toast.success('Welcome to Nike! Account created successfully.');
    resetForms();
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-lg">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <div className="p-6 md:p-8">
          {/* Tabs */}
          <div className="flex border-b border-[#e5e5e5] mb-6">
            <button
              onClick={() => handleTabChange('signin')}
              className={`flex-1 pb-3 text-sm font-bold uppercase tracking-widest transition-colors ${
                activeTab === 'signin'
                  ? 'text-[#111] border-b-2 border-[#111]'
                  : 'text-[#757575] hover:text-[#111]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange('join')}
              className={`flex-1 pb-3 text-sm font-bold uppercase tracking-widest transition-colors ${
                activeTab === 'join'
                  ? 'text-[#111] border-b-2 border-[#111]'
                  : 'text-[#757575] hover:text-[#111]'
              }`}
            >
              Join Us
            </button>
          </div>

          {activeTab === 'signin' ? (
            <form onSubmit={handleSignin} className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Sign In</h2>
              <p className="text-sm text-[#757575] mb-4">Welcome back! Sign in to your Nike account.</p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#757575] mb-1.5">Email</label>
                <input
                  type="email"
                  value={signinEmail}
                  onChange={(e) => setSigninEmail(e.target.value)}
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors ${
                    signinErrors.email ? 'border-red-500 focus:border-red-500' : 'border-[#e5e5e5] focus:border-[#111]'
                  }`}
                  placeholder="you@example.com"
                />
                {signinErrors.email && <p className="text-red-500 text-xs mt-1">{signinErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#757575] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none transition-colors ${
                      signinErrors.password ? 'border-red-500 focus:border-red-500' : 'border-[#e5e5e5] focus:border-[#111]'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#111]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {signinErrors.password && <p className="text-red-500 text-xs mt-1">{signinErrors.password}</p>}
              </div>

              <button type="button" className="text-sm text-[#757575] underline underline-offset-2 hover:text-[#111] transition-colors">
                Forgot Password?
              </button>

              <button
                type="submit"
                className="w-full rounded-full bg-[#111] text-white py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-[#333] transition-colors"
              >
                Sign In
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e5e5e5]" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-4 text-xs text-[#757575]">or</span></div>
              </div>

              <button
                type="button"
                onClick={() => { closeAuthModal(); resetForms(); }}
                className="w-full rounded-full border border-[#111] text-[#111] py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-[#f5f5f5] transition-colors"
              >
                Guest Checkout
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Join Us</h2>
              <p className="text-sm text-[#757575] mb-4">Become a Nike Member for the best products, inspiration, and stories.</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#757575] mb-1.5">First Name</label>
                  <input
                    value={joinFirstName}
                    onChange={(e) => setJoinFirstName(e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors ${
                      joinErrors.firstName ? 'border-red-500 focus:border-red-500' : 'border-[#e5e5e5] focus:border-[#111]'
                    }`}
                  />
                  {joinErrors.firstName && <p className="text-red-500 text-xs mt-1">{joinErrors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#757575] mb-1.5">Last Name</label>
                  <input
                    value={joinLastName}
                    onChange={(e) => setJoinLastName(e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors ${
                      joinErrors.lastName ? 'border-red-500 focus:border-red-500' : 'border-[#e5e5e5] focus:border-[#111]'
                    }`}
                  />
                  {joinErrors.lastName && <p className="text-red-500 text-xs mt-1">{joinErrors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#757575] mb-1.5">Email</label>
                <input
                  type="email"
                  value={joinEmail}
                  onChange={(e) => setJoinEmail(e.target.value)}
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors ${
                    joinErrors.email ? 'border-red-500 focus:border-red-500' : 'border-[#e5e5e5] focus:border-[#111]'
                  }`}
                  placeholder="you@example.com"
                />
                {joinErrors.email && <p className="text-red-500 text-xs mt-1">{joinErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#757575] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none transition-colors ${
                      joinErrors.password ? 'border-red-500 focus:border-red-500' : 'border-[#e5e5e5] focus:border-[#111]'
                    }`}
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#111]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {joinErrors.password && <p className="text-red-500 text-xs mt-1">{joinErrors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#757575] mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={joinConfirmPassword}
                  onChange={(e) => setJoinConfirmPassword(e.target.value)}
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors ${
                    joinErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-[#e5e5e5] focus:border-[#111]'
                  }`}
                />
                {joinErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{joinErrors.confirmPassword}</p>}
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={joinAgree}
                  onChange={(e) => setJoinAgree(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[#e5e5e5] accent-[#111]"
                />
                <span className="text-xs text-[#757575] leading-relaxed">
                  I agree to Nike&apos;s <button type="button" className="underline">Privacy Policy</button> and <button type="button" className="underline">Terms of Use</button>.
                </span>
              </label>
              {joinErrors.agree && <p className="text-red-500 text-xs -mt-2">{joinErrors.agree}</p>}

              <button
                type="submit"
                className="w-full rounded-full bg-[#111] text-white py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-[#333] transition-colors"
              >
                Join Us
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
