import { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, Bookmark, Film, Settings, Link2 } from 'lucide-react';
import { currentUser, feedPosts, suggestedUsers } from '../data/mockData';
import { Avatar } from '../components/Avatar';
import { hapticImpact } from '../hooks/useHaptics';
import { ImpactStyle } from '@capacitor/haptics';

export function Profile() {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'reels'>('posts');

  const tabs = [
    { id: 'posts' as const, icon: Grid3X3, label: 'Posts' },
    { id: 'reels' as const, icon: Film, label: 'Reels' },
    { id: 'saved' as const, icon: Bookmark, label: 'Saved' },
  ];

  return (
    <div className="h-full flex flex-col bg-glitch-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-glitch-bg/95 backdrop-blur-xl border-b border-glitch-border px-4 py-2.5 flex items-center justify-between safe-area-top">
        <div className="flex items-center gap-1">
          <span className="text-white font-semibold text-base">{currentUser.username}</span>
          <span className="text-glitch-dim">▼</span>
        </div>
        <button className="text-white">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Info */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start gap-6">
            <Avatar
              gradient="from-glitch-cyan to-glitch-purple"
              username={currentUser.username}
              size="xl"
              hasStory
            />
            <div className="flex-1 flex items-center justify-around pt-2">
              {[
                { label: 'Posts', value: currentUser.posts },
                { label: 'Followers', value: currentUser.followers },
                { label: 'Following', value: currentUser.following },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                  <span className="text-lg font-bold text-white">{stat.value.toLocaleString()}</span>
                  <span className="text-xs text-glitch-muted">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-3 space-y-1">
            <h2 className="text-sm font-semibold text-white">{currentUser.displayName}</h2>
            <p className="text-sm text-glitch-text whitespace-pre-line">{currentUser.bio}</p>
            <a href="#" className="flex items-center gap-1 text-xs text-glitch-cyan">
              <Link2 className="w-3 h-3" />
              glitchit.app/{currentUser.username}
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2 rounded-xl bg-glitch-surface border border-glitch-border text-sm font-semibold text-white"
            >
              Edit profile
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2 rounded-xl bg-glitch-surface border border-glitch-border text-sm font-semibold text-white"
            >
              Share profile
            </motion.button>
          </div>
        </div>

        {/* Story Highlights */}
        <div className="px-4 py-3 border-b border-glitch-border">
          <div className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {['Travel', 'Art', 'Code', 'Music', 'Glitch'].map((highlight, i) => (
              <div key={highlight} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className="w-16 h-16 rounded-full border border-glitch-border bg-glitch-surface flex items-center justify-center">
                  <span className="text-xl">
                    {['✈️', '🎨', '💻', '🎵', '⚡'][i]}
                  </span>
                </div>
                <span className="text-[11px] text-glitch-muted">{highlight}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className="w-16 h-16 rounded-full border border-glitch-border bg-glitch-surface flex items-center justify-center">
                <span className="text-2xl text-glitch-dim">+</span>
              </div>
              <span className="text-[11px] text-glitch-muted">New</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-glitch-border">            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  hapticImpact(ImpactStyle.Light);
                }}
              className={`flex-1 flex items-center justify-center py-2.5 relative ${
                activeTab === tab.id ? 'text-white' : 'text-glitch-dim'
              }`}
            >
              <tab.icon className="w-5 h-5" strokeWidth={activeTab === tab.id ? 2.5 : 1.5} />
              {activeTab === tab.id && (
                <motion.div
                  layoutId="profile-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-[2px]">
          {feedPosts.map((post, i) => (
            <motion.div
              key={post.id}
              className="relative aspect-square bg-glitch-surface overflow-hidden cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <img
                src={post.image}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
          {/* Fill remaining grid with explore images */}
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div
              key={`grid-${i}`}
              className="relative aspect-square bg-glitch-surface overflow-hidden cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (feedPosts.length + i) * 0.05 }}
            >
              <img
                src={`https://images.unsplash.com/photo-${1550745165 + i}?w=300&q=60`}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        {/* Suggested Users */}
        <div className="px-4 py-4">
          <h3 className="text-sm font-semibold text-white mb-3">Suggested for you</h3>
          <div className="space-y-3">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Avatar gradient={user.avatar} username={user.username} size="md" hasStory />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-white">{user.username}</span>
                    {user.isVerified && (
                      <span className="text-glitch-cyan text-xs">✓</span>
                    )}
                  </div>
                  <span className="text-xs text-glitch-muted">{user.bio}</span>
                </div>
                <button className="text-xs font-semibold text-glitch-cyan">Follow</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
