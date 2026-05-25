'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const messages = [
  { text: 'Free Delivery on orders over $150', link: '' },
  { text: 'New Styles Just Dropped', link: 'Shop Now' },
  { text: 'Become a Nike Member — Sign Up for Free', link: 'Join Us' },
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#f5f5f5] w-full py-2 text-center overflow-hidden border-b border-[#e5e5e5]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ y: 12, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -12, opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#111]"
        >
          <span>{messages[current].text}</span>
          {messages[current].link && (
            <button className="font-bold underline underline-offset-2 hover:text-[#757575] transition-colors">
              {messages[current].link}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
