'use client';

import { motion } from 'framer-motion';
import { useNikeActions } from '@/store/nike-store';
import { Crown, Gift, Truck, Star } from 'lucide-react';
import { NikeSwoosh } from './NikeIcons';

const benefits = [
  { icon: Crown, label: 'Exclusive Access' },
  { icon: Gift, label: 'Birthday Rewards' },
  { icon: Truck, label: 'Free Delivery' },
  { icon: Star, label: 'Member Prices' },
];

export default function MembershipBanner() {
  const { openAuthModal } = useNikeActions();

  return (
    <section className="px-6 md:px-12 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="relative bg-[#111] rounded-2xl overflow-hidden"
      >
        {/* Grain overlay for premium feel */}
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        {/* Decorative swoosh */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 0.03, scale: 1.5 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute -right-16 top-1/2 -translate-y-1/2"
        >
          <NikeSwoosh size={300} className="text-white" />
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center">
          <div className="relative z-10 flex-1 p-8 md:p-12 lg:p-16">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 mb-4"
            >
              <Crown className="w-3.5 h-3.5" />
              Nike Membership
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[1.05] mb-4"
            >
              Become a Member<br />for the best of Nike
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-sm md:text-base text-white/60 max-w-md mb-8 leading-relaxed"
            >
              Sign up for free. Join the community to get the latest shoes, apparel, and exclusive content delivered to your inbox. Members get free delivery on every order.
            </motion.p>

            {/* Benefits row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <benefit.icon className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">{benefit.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={() => openAuthModal('join')}
                className="group inline-flex items-center justify-center gap-2 bg-white text-[#111] rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-all duration-300 magnetic-btn btn-shine"
              >
                Join Us — It&apos;s Free
                <motion.span
                  className="inline-block"
                  whileHover={{ x: 3 }}
                >
                  &rarr;
                </motion.span>
              </button>
              <button
                onClick={() => openAuthModal('signin')}
                className="inline-flex items-center justify-center bg-transparent text-white rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300 border border-white/20"
              >
                Sign In
              </button>
            </motion.div>
          </div>
          <div className="w-full lg:w-1/2 h-64 lg:h-auto min-h-[350px] relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800)` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/30 to-transparent" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
