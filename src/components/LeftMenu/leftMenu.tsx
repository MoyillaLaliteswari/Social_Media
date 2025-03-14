'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LeftMenu() {
  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-1/5 p-5 border-r border-gray-600 bg-gray-900 bg-opacity-40 backdrop-blur-lg hidden md:block rounded-r-3xl shadow-xl"
    >
      <h1 className="text-4xl font-extrabold tracking-wide text-blue-400">Lalli</h1>
      <ul className="mt-8 space-y-6 text-gray-300">
        {[
          ['/', '🏠 Home'],
          ['/search', '🔍 Search'],
          ['/reels', '🎥 Reels'],
          ['/messages', '📨 Messages'],
          ['/notifications', '🔔 Notifications'],
          ['/create', '➕ Create'],
          ['/profile', '👤 Profile'],
        ].map(([href, label]) => (
          <li key={href} className="hover:text-blue-400 transition duration-200 text-lg">
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
