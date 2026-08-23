import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Play } from 'lucide-react';
import { exploreGrid } from '../data/mockData';

const categories = ['For You', 'Glitch Art', 'Cyberpunk', 'Neon', 'Digital', 'Retro'];

export function Explore() {

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('For You');

  return (
    <div className="h-full flex flex-col bg-glitch-bg">
      {/* Search */}
      <div className="sticky top-0 z-40 bg-glitch-bg/95 backdrop-blur-xl px-3 pt-3 pb-2 space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-glitch-muted" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}

            className="w-full h-9 pl-9 pr-9 rounded-xl bg-glitch-surface border border-glitch-border text-sm text-white placeholder:text-glitch-dim focus:outline-none focus:border-glitch-cyan/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-glitch-muted" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-glitch-cyan/15 text-glitch-cyan border border-glitch-cyan/30'
                  : 'bg-glitch-surface text-glitch-muted border border-glitch-border hover:border-glitch-dim'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-[2px]">
          {exploreGrid.map((item, i) => {
            // Make some items span 2 rows/cols for visual interest
            const isLarge = i % 10 === 0 || i % 10 === 5;

            return (
              <motion.div
                key={item.id}
                className={`relative bg-glitch-surface overflow-hidden cursor-pointer ${
                  isLarge ? 'col-span-2 row-span-2' : ''
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  style={{ minHeight: isLarge ? '250px' : '125px' }}
                />
                {item.isVideo && (
                  <div className="absolute top-2 right-2">
                    <Play className="w-5 h-5 text-white fill-white drop-shadow-lg" />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <span className="text-white text-sm font-semibold">
                    ❤️ {item.likes.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
