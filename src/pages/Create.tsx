import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image, Zap, Type, X, ChevronDown } from 'lucide-react';

const filters = [
  { name: 'None', class: '' },
  { name: 'Glitch', class: 'hue-rotate-180 saturate-150' },
  { name: 'Neon', class: 'brightness-125 contrast-125 saturate-200 hue-rotate-60' },
  { name: 'Cyber', class: 'sepia-[0.3] hue-rotate-180 saturate-150' },
  { name: 'Retro', class: 'sepia-[0.5] brightness-90' },
  { name: 'Void', class: 'brightness-75 contrast-150 saturate-50' },
];

export function Create() {
  const [selectedFilter, setSelectedFilter] = useState('None');
  const [caption, setCaption] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="h-full flex flex-col bg-glitch-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-glitch-bg/95 backdrop-blur-xl border-b border-glitch-border px-4 py-2.5 flex items-center justify-between">
        <span className="text-white font-semibold">New Post</span>
        <button className="text-glitch-cyan text-sm font-semibold">Share</button>
      </header>

      {/* Upload Area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!showPreview ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[50vh] gap-6"
            >
              <motion.div
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-glitch-cyan/20 to-glitch-purple/20 border border-glitch-border flex items-center justify-center"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Camera className="w-10 h-10 text-glitch-cyan" />
              </motion.div>
              <div className="text-center space-y-2">
                <p className="text-white font-semibold text-lg">Create a new post</p>
                <p className="text-glitch-muted text-sm">Share your glitch art with the world</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-glitch-cyan to-glitch-purple text-white text-sm font-semibold"
                >
                  <Image className="w-4 h-4" />
                  Gallery
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-glitch-surface border border-glitch-border text-white text-sm font-semibold"
                >
                  <Zap className="w-4 h-4" />
                  AI Generate
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Image Preview */}
              <div className="relative aspect-square bg-glitch-surface">
                <img
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80"
                  alt="Preview"
                  className={`w-full h-full object-cover ${
                    filters.find((f) => f.name === selectedFilter)?.class || ''
                  }`}
                />
                <button
                  onClick={() => setShowPreview(false)}
                  className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Filters */}
              <div className="px-3 py-3 border-b border-glitch-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-glitch-muted">Filters</span>
                  <ChevronDown className="w-3 h-3 text-glitch-muted" />
                </div>
                <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                  {filters.map((filter) => (
                    <button
                      key={filter.name}
                      onClick={() => setSelectedFilter(filter.name)}
                      className="flex flex-col items-center gap-1.5 flex-shrink-0"
                    >
                      <div
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedFilter === filter.name
                            ? 'border-glitch-cyan'
                            : 'border-transparent'
                        }`}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=60"
                          alt={filter.name}
                          className={`w-full h-full object-cover ${filter.class}`}
                        />
                      </div>
                      <span
                        className={`text-[10px] ${
                          selectedFilter === filter.name ? 'text-glitch-cyan' : 'text-glitch-muted'
                        }`}
                      >
                        {filter.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption */}
              <div className="px-3 py-3 border-b border-glitch-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-glitch-cyan to-glitch-purple flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..."
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-glitch-dim resize-none h-20 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-glitch-border">
                  <button className="text-glitch-cyan text-sm flex items-center gap-1">
                    <Type className="w-4 h-4" />
                    Add text
                  </button>
                  <span className="text-xs text-glitch-dim">{caption.length}/2,200</span>
                </div>
              </div>

              {/* Options */}
              <div className="px-3 py-2">
                {['Tag people', 'Add location', 'Add music'].map((option) => (
                  <button
                    key={option}
                    className="w-full flex items-center justify-between py-3 border-b border-glitch-border last:border-0"
                  >
                    <span className="text-sm text-white">{option}</span>
                    <ChevronDown className="w-4 h-4 text-glitch-dim -rotate-90" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
