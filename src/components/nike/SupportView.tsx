'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { MessageCircle, Phone, Mail, Send, Package } from 'lucide-react';
import { NikeLocationPin, NikeClose } from './NikeIcons';
import { useNikeActions, useNikeStore } from '@/store/nike-store';
import { toast } from 'sonner';

const faqs = [
  {
    question: 'How can I track my order?',
    answer:
      'Once your order ships, you\'ll receive a confirmation email with a tracking number. You can also check order status by logging into your Nike Member account and visiting the Orders section.',
  },
  {
    question: 'What is Nike\'s return policy?',
    answer:
      'Nike offers free returns within 60 days of delivery. Items must be unworn and in original packaging. Simply initiate a return through your Nike account or contact us for a return label.',
  },
  {
    question: 'How do I find the right shoe size?',
    answer:
      'We recommend using our Size Guide available on each product page. You can also visit any Nike Store for a professional fitting. If you\'re between sizes, we generally recommend going up a half size.',
  },
  {
    question: 'Does Nike offer student discounts?',
    answer:
      'Yes! Nike offers a 10% student discount for verified college and university students. Sign up with a valid .edu email address or verify through SheerID to receive your discount code.',
  },
  {
    question: 'How do I become a Nike Member?',
    answer:
      'Signing up is free and easy. Click "Join Us" at the top of the page, fill in your details, and you\'ll instantly get access to exclusive products, member-only content, birthday rewards, and free delivery on every order.',
  },
  {
    question: 'What payment methods does Nike accept?',
    answer:
      'We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, and Nike Gift Cards. All transactions are secured with industry-standard encryption.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Standard delivery typically takes 3-5 business days. Express delivery is available for 1-2 business day delivery. Nike Members receive free standard delivery on all orders.',
  },
  {
    question: 'Can I customize my Nike shoes?',
    answer:
      'Yes! Nike offers customization through select retail locations and online for certain models. Check nike.com for availability of custom colorways and personal messages on eligible shoes. Custom orders typically ship within 3-5 weeks.',
  },
];

const mockChatResponses = [
  "Thanks for reaching out! A Nike specialist will be with you shortly.",
  "I'd be happy to help you with that! Could you provide more details?",
  "Great question! Let me look into that for you.",
  "I understand your concern. Let me check our policies on that.",
  "Is there anything else I can help you with today?",
];

export default function SupportView() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { openStoreLocator, openLiveChat, closeLiveChat } = useNikeActions();
  const isLiveChatOpen = useNikeStore((s) => s.isLiveChatOpen);

  // Live chat state
  const [chatMessages, setChatMessages] = useState<{ text: string; sender: 'user' | 'agent' }[]>([
    { text: 'Hi! Welcome to Nike Support. How can I help you today?', sender: 'agent' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Track order state
  const [orderNumber, setOrderNumber] = useState('');
  const [orderTracked, setOrderTracked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Message sent!');
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', message: '' });
  };

  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { text: chatInput, sender: 'user' }]);
    const userInput = chatInput;
    setChatInput('');
    setTimeout(() => {
      const response = mockChatResponses[Math.floor(Math.random() * mockChatResponses.length)];
      setChatMessages((prev) => [...prev, { text: response, sender: 'agent' }]);
    }, 1000);
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setOrderTracked(true);
      toast.success('Order found!');
    }
  };

  return (
    <>
      <section className="px-6 md:px-12 py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">Get Help</h1>
        <p className="text-[#757575] mb-12">We&apos;re here to help. Find answers or reach out to us.</p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <button
            onClick={openLiveChat}
            className="bg-[#f5f5f5] rounded-xl p-6 text-center hover:bg-[#e5e5e5] transition-colors"
          >
            <MessageCircle className="w-8 h-8 mx-auto mb-3" />
            <h3 className="font-bold text-sm uppercase tracking-widest mb-1">Chat</h3>
            <p className="text-xs text-[#757575]">Talk to us live</p>
          </button>
          <button
            onClick={() => toast.success('Call 1-800-344-6453')}
            className="bg-[#f5f5f5] rounded-xl p-6 text-center hover:bg-[#e5e5e5] transition-colors"
          >
            <Phone className="w-8 h-8 mx-auto mb-3" />
            <h3 className="font-bold text-sm uppercase tracking-widest mb-1">Call</h3>
            <p className="text-xs text-[#757575]">1-800-344-6453</p>
          </button>
          <button
            onClick={() => toast.success('Opening email client...')}
            className="bg-[#f5f5f5] rounded-xl p-6 text-center hover:bg-[#e5e5e5] transition-colors"
          >
            <Mail className="w-8 h-8 mx-auto mb-3" />
            <h3 className="font-bold text-sm uppercase tracking-widest mb-1">Email</h3>
            <p className="text-xs text-[#757575]">support@nike.com</p>
          </button>
        </div>

        {/* Track My Order */}
        <div className="mb-12 bg-[#f5f5f5] rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5" />
            <h2 className="text-lg font-black uppercase tracking-tight">Track My Order</h2>
          </div>
          <form onSubmit={handleTrackOrder} className="flex gap-3">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter order number (e.g., NK-ABC123)"
              className="flex-1 border border-[#e5e5e5] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#111] transition-colors"
            />
            <button
              type="submit"
              className="rounded-full bg-[#111] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#333] transition-colors"
            >
              Track
            </button>
          </form>
          {orderTracked && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-[#e5e5e5]">
              <p className="text-sm font-bold text-[#111] mb-1">Order {orderNumber}</p>
              <div className="flex items-center gap-4 text-xs text-[#757575]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Shipped
                </span>
                <span>Est. delivery: 3-5 business days</span>
              </div>
              <div className="mt-3 w-full bg-[#e5e5e5] rounded-full h-2">
                <div className="bg-[#111] h-2 rounded-full" style={{ width: '60%' }} />
              </div>
              <p className="text-[11px] text-[#757575] mt-1">In transit — last update: Today, 8:00 AM</p>
            </div>
          )}
        </div>

        {/* Store Locator Section */}
        <div className="mb-12 bg-[#f5f5f5] rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <NikeLocationPin size={20} />
            <h2 className="text-lg font-black uppercase tracking-tight">Find a Store</h2>
          </div>
          <p className="text-sm text-[#757575] mb-4">Visit a Nike store near you for expert fitting and the latest products.</p>
          <button
            onClick={openStoreLocator}
            className="rounded-full bg-[#111] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
            View Store Locations
          </button>
        </div>

        {/* FAQ Accordion */}
        <div className="mb-12">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-[#e5e5e5]">
                <AccordionTrigger className="text-left text-base font-bold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[#757575] leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#757575] mb-1.5">
                Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#111] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#757575] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#111] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#757575] mb-1.5">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-[#111] text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#333] transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitted ? 'Message Sent!' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Live Chat Dialog */}
      <Dialog open={isLiveChatOpen} onOpenChange={(open) => !open && closeLiveChat()}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-lg">
          <DialogTitle className="sr-only">Live Chat</DialogTitle>
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h2 className="text-lg font-black uppercase tracking-tight">Live Chat</h2>
              <span className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
          </div>
          <div className="h-72 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#111] text-white'
                      : 'bg-[#f5f5f5] text-[#111]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSend} className="border-t border-[#e5e5e5] p-4 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-[#e5e5e5] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors"
            />
            <button
              type="submit"
              className="rounded-full bg-[#111] text-white px-4 py-2.5 hover:bg-[#333] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
