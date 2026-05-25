'use client';

import { useState } from 'react';
import { useCart, useCartTotal, useNikeActions } from '@/store/nike-store';
import { CreditCard, Truck, ShieldCheck, Lock } from 'lucide-react';
import { NikeBag } from './NikeIcons';
import { toast } from 'sonner';
import { addDays, format } from 'date-fns';

interface FormErrors {
  [key: string]: string;
}

interface CheckoutForm {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface InputFieldProps {
  name: keyof CheckoutForm;
  label: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  colSpan?: string;
}

function InputField({
  name,
  label,
  value,
  error,
  onChange,
  type = 'text',
  placeholder = '',
  colSpan = '',
}: InputFieldProps) {
  return (
    <div className={colSpan}>
      <label className="block text-xs font-bold uppercase tracking-widest text-[#757575] mb-1.5">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors ${
          error ? 'border-red-500 focus:border-red-500' : 'border-[#e5e5e5] focus:border-[#111]'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function CheckoutView() {
  const cart = useCart();
  const cartTotal = useCartTotal();
  const { switchView, clearCart } = useNikeActions();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/').slice(0, 5);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    setForm({ ...form, [name]: formattedValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'Required';
    if (!form.lastName.trim()) newErrors.lastName = 'Required';
    if (!form.address.trim()) newErrors.address = 'Required';
    if (!form.city.trim()) newErrors.city = 'Required';
    if (!form.state.trim()) newErrors.state = 'Required';
    if (!form.zip.trim()) newErrors.zip = 'Required';
    if (!form.email.trim()) newErrors.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.cardNumber.trim()) newErrors.cardNumber = 'Required';
    else if (form.cardNumber.replace(/\s/g, '').length < 13) newErrors.cardNumber = 'Invalid card number';
    if (!form.expiry.trim()) newErrors.expiry = 'Required';
    else if (!/^\d{2}\/\d{2}$/.test(form.expiry)) newErrors.expiry = 'Format: MM/YY';
    if (!form.cvv.trim()) newErrors.cvv = 'Required';
    else if (form.cvv.length < 3) newErrors.cvv = 'Invalid CVV';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors below');
      return;
    }
    setOrderPlaced(true);
    toast.success('Order placed successfully!');
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
      toast.success('Promo applied!');
    }
  };

  const displayTotal = promoApplied ? Math.max(0, cartTotal - 20) : cartTotal;
  const orderNumber = `NK-${Date.now().toString(36).toUpperCase()}`;
  const estimatedDelivery = format(addDays(new Date(), 5), 'EEEE, MMMM d, yyyy');

  if (orderPlaced) {
    return (
      <section className="px-6 md:px-12 py-24 text-center max-w-2xl mx-auto">
        <div>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Order Confirmed</h1>
          <p className="text-[#757575] mb-2">Order Number: <span className="font-bold text-[#111]">{orderNumber}</span></p>
          <p className="text-sm text-[#757575] mb-4">Estimated delivery: <span className="font-bold text-[#111]">{estimatedDelivery}</span></p>
          <p className="text-[#757575] mb-8">Thank you for your purchase! Your order is on its way.</p>

          {/* Items ordered */}
          <div className="bg-[#f5f5f5] rounded-xl p-6 mb-8 text-left">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Items Ordered</h3>
            <div className="divide-y divide-[#e5e5e5]">
              {cart.map((item) => (
                <div key={item.lineHash} className="flex justify-between py-3">
                  <span className="text-sm">{item.name} (Size {item.size}) × {item.quantity}</span>
                  <span className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-3 font-bold">
                <span>Total</span>
                <span>${displayTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => { clearCart(); switchView('home'); }}
            className="rounded-full bg-[#111] text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
            Return to Shopping
          </button>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="px-6 md:px-12 py-24 text-center">
        <NikeBag size={64} className="text-[#e5e5e5] mx-auto mb-4" />
        <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Your bag is empty</h1>
        <p className="text-[#757575] mb-6">Add some items before checking out.</p>
        <button
          onClick={() => switchView('home')}
          className="rounded-full bg-[#111] text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#333] transition-colors"
        >
          Shop Now
        </button>
      </section>
    );
  }

  return (
    <section className="px-6 md:px-12 py-12">
      <div className="flex items-center gap-2 mb-8">
        <Lock className="w-4 h-4 text-[#111]" />
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Secure Checkout</h1>
      </div>

      {/* Payment method icons */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#757575]">We Accept</span>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-[#f5f5f5] rounded text-[10px] font-bold text-[#1a1f71]">VISA</div>
          <div className="px-3 py-1.5 bg-[#f5f5f5] rounded text-[10px] font-bold text-[#eb001b]">MC</div>
          <div className="px-3 py-1.5 bg-[#f5f5f5] rounded text-[10px] font-bold text-[#006fcf]">AMEX</div>
          <div className="px-3 py-1.5 bg-[#f5f5f5] rounded text-[10px] font-bold text-[#003087]">PayPal</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        {/* Left: Form */}
        <div className="flex-1 space-y-8">
          {/* Shipping */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5" />
              <h2 className="text-lg font-black uppercase tracking-tight">Shipping</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="firstName" label="First Name" value={form.firstName} error={errors.firstName} onChange={handleChange} />
              <InputField name="lastName" label="Last Name" value={form.lastName} error={errors.lastName} onChange={handleChange} />
              <InputField name="address" label="Address" value={form.address} error={errors.address} onChange={handleChange} colSpan="md:col-span-2" />
              <InputField name="city" label="City" value={form.city} error={errors.city} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-4">
                <InputField name="state" label="State" value={form.state} error={errors.state} onChange={handleChange} />
                <InputField name="zip" label="ZIP" value={form.zip} error={errors.zip} onChange={handleChange} />
              </div>
              <InputField name="email" label="Email" value={form.email} error={errors.email} onChange={handleChange} type="email" placeholder="you@example.com" colSpan="md:col-span-2" />
            </div>
          </div>

          {/* Payment */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5" />
              <h2 className="text-lg font-black uppercase tracking-tight">Payment</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="cardNumber" label="Card Number" value={form.cardNumber} error={errors.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" colSpan="md:col-span-2" />
              <InputField name="expiry" label="Expiry" value={form.expiry} error={errors.expiry} onChange={handleChange} placeholder="MM/YY" />
              <InputField name="cvv" label="CVV" value={form.cvv} error={errors.cvv} onChange={handleChange} placeholder="123" />
            </div>
          </div>

          {/* Submit on mobile */}
          <button
            type="submit"
            className="lg:hidden w-full rounded-full bg-[#111] text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
            Place Order — ${displayTotal.toFixed(2)}
          </button>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:w-96">
          <div className="bg-[#f5f5f5] rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-black uppercase tracking-tight mb-4">Order Summary</h2>
            <div className="divide-y divide-[#e5e5e5] mb-4 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.lineHash} className="flex gap-3 py-3">
                  <div className="w-14 h-14 bg-white rounded-lg flex-shrink-0 overflow-hidden">
                    {item.img ? (
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <NikeBag size={20} className="text-[#ccc]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#111] truncate">{item.name}</p>
                    <p className="text-xs text-[#757575]">Size {item.size} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[#111]">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Promo code in summary */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo Code"
                disabled={promoApplied}
                className="flex-1 border border-[#e5e5e5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#111] transition-colors"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={promoApplied || !promoCode.trim()}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
                  promoApplied ? 'bg-green-100 text-green-700' : 'bg-[#111] text-white hover:bg-[#333]'
                }`}
              >
                {promoApplied ? '✓' : 'Apply'}
              </button>
            </div>

            <div className="space-y-2 pt-4 border-t border-[#e5e5e5]">
              <div className="flex justify-between text-sm">
                <span className="text-[#757575]">Subtotal</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Promo Discount</span>
                  <span className="font-medium text-green-600">-$20.00</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[#757575]">Delivery</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-[#e5e5e5]">
                <span className="font-bold">Total</span>
                <span className="font-black">${displayTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Secure checkout badge */}
            <div className="flex items-center justify-center gap-2 mt-4 py-3 bg-white rounded-lg">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#757575]">Secure Checkout</span>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full rounded-full bg-[#111] text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#333] transition-colors mt-4"
            >
              Place Order
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
