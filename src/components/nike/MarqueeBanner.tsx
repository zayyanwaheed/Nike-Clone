'use client';

import { motion } from 'framer-motion';
import { NikeSwoosh } from './NikeIcons';

export default function MarqueeBanner() {
  const text = 'JUST DO IT  \u2022  NIKE  \u2022  PERFORMANCE  \u2022  INNOVATION  \u2022  MOVE TO ZERO  \u2022  JUST DO IT  \u2022  NIKE  \u2022  PERFORMANCE  \u2022  INNOVATION  \u2022  MOVE TO ZERO  \u2022  ';

  return (
    <div className="relative my-8">
      {/* Top swoosh accent */}
      <div className="flex justify-center mb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.15, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <NikeSwoosh size={80} className="text-[#111]" />
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="bg-[#111] w-full py-5 overflow-hidden select-none marquee-fade">
        <div className="animate-marquee whitespace-nowrap flex">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="text-white text-xl md:text-2xl font-black uppercase tracking-[0.15em] mx-2">{text}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
