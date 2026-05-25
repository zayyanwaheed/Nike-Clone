'use client';

import { motion } from 'framer-motion';
import { useNikeActions, useCurrentView } from '@/store/nike-store';
import { heroImages } from '@/data/products';
import { ArrowRight, Sparkles } from 'lucide-react';
import { NikeSwoosh } from './NikeIcons';

const nikeEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const heroContent: Record<string, { badge: string; title: string; subtitle: string; description: string; cta: string; ctaLink: string; image: string }> = {
  home: {
    badge: 'Just In',
    title: 'AIR MAX DN',
    subtitle: 'KINETIC MATRIX',
    description: 'Engineered with localized four-chamber capsule technology. Designed to continuously distribute foot strike force along fluid mechanical vectors.',
    cta: 'Shop Air Max',
    ctaLink: 'men',
    image: heroImages.main,
  },
  men: {
    badge: "Men's Collection",
    title: 'UNLEASH',
    subtitle: 'YOUR POTENTIAL',
    description: "Performance meets style. Explore the latest men's footwear designed for those who push beyond limits.",
    cta: 'Shop Men',
    ctaLink: 'men',
    image: heroImages.men,
  },
  women: {
    badge: "Women's Collection",
    title: 'STRONG IS',
    subtitle: 'BEAUTIFUL',
    description: "From the track to the street. Discover women's styles built to perform and designed to inspire.",
    cta: 'Shop Women',
    ctaLink: 'women',
    image: heroImages.women,
  },
  kids: {
    badge: "Kids' Collection",
    title: 'PLAY WITHOUT',
    subtitle: 'LIMITS',
    description: "Gear up the next generation with styles that keep up with their boundless energy and imagination.",
    cta: 'Shop Kids',
    ctaLink: 'kids',
    image: heroImages.kids,
  },
};

const letterVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.035 + 0.3,
      duration: 0.5,
      ease: nikeEase,
    },
  }),
};

function AnimatedTitle({ text, className }: { text: string; className: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          custom={i}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  const currentView = useCurrentView();
  const { switchView } = useNikeActions();
  const content = heroContent[currentView] || heroContent.home;

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden group grain-overlay">
      {/* Background Image with Ken Burns effect */}
      <motion.div
        key={content.image}
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: nikeEase }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out group-hover:scale-[1.05]"
          style={{ backgroundImage: `url(${content.image})` }}
        />
      </motion.div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* Decorative Floating Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 border border-white/5 rounded-full animate-float-slow hidden lg:block" />
      <div className="absolute top-40 right-40 w-16 h-16 border border-white/10 rounded-full animate-float hidden lg:block" />
      <div className="absolute bottom-40 right-32 w-24 h-24 border border-white/5 rounded-full animate-float-slow hidden lg:block" style={{ animationDelay: '2s' }} />

      {/* Large decorative swoosh in background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.03, scale: 1.2 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute right-[-5%] top-[20%] pointer-events-none hidden lg:block"
      >
        <NikeSwoosh size={500} className="text-white" />
      </motion.div>

      {/* Content - Bottom Left aligned like nike.com */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 pb-12 md:pb-16">
        <motion.div
          key={currentView}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: nikeEase }}
          className="max-w-2xl"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/90 mb-5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
          >
            <Sparkles className="w-3 h-3" />
            {content.badge}
          </motion.span>

          {/* Title with letter-by-letter animation */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white leading-[0.9] mb-1 overflow-hidden">
            <AnimatedTitle text={content.title} className="" />
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-[0.9] mb-5 overflow-hidden">
            <AnimatedTitle text={content.subtitle} className="" />
          </h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-sm md:text-base text-white/80 max-w-md mb-8 leading-relaxed font-medium"
          >
            {content.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={() => switchView(content.ctaLink as 'home' | 'men' | 'women' | 'kids')}
              className="group/btn inline-flex items-center justify-center gap-2 bg-white text-[#111] rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#f5f5f5] transition-all duration-300 shadow-lg hover:shadow-xl magnetic-btn btn-shine"
            >
              {content.cta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
            <button
              onClick={() => switchView('sale')}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all duration-300 border border-white/20 magnetic-btn"
            >
              Shop Sale
            </button>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
