import { motion } from 'framer-motion';
import { GlitchLogo } from '../components/GlitchLogo';
import { StoryBar } from '../components/StoryBar';
import { PostCard } from '../components/PostCard';
import { feedPosts } from '../data/mockData';
import { MessageSquare } from 'lucide-react';

export function Home() {
  return (
    <div className="h-full flex flex-col bg-glitch-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-glitch-bg/95 backdrop-blur-xl border-b border-glitch-border px-4 py-2.5 flex items-center justify-between safe-area-top">
        <GlitchLogo size="sm" />
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <MessageSquare className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-glitch-magenta text-[9px] font-bold text-white flex items-center justify-center">
            3
          </span>
        </motion.button>
      </header>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto feed-scroll">
        <StoryBar />
        <div className="max-w-lg mx-auto">
          {feedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {/* End of feed */}
          <div className="py-16 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full border-2 border-glitch-border flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <p className="text-glitch-muted text-sm">You're all caught up</p>
            <p className="text-glitch-dim text-xs">You've seen all new posts from the past 3 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
