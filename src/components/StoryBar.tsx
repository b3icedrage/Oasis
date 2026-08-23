import { motion } from 'framer-motion';
import { Avatar } from './Avatar';
import { stories } from '../data/mockData';

export function StoryBar() {
  return (
    <div className="border-b border-glitch-border bg-glitch-bg/50">
      <div className="flex gap-3 px-3 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {stories.map((story, i) => (
          <motion.button
            key={story.id}
            className="flex flex-col items-center gap-1 flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.9 }}
          >
            <Avatar
              gradient={
                i === 0
                  ? 'from-glitch-dim to-glitch-border'
                  : story.hasUnseen
                    ? 'from-glitch-cyan to-glitch-magenta'
                    : 'from-glitch-dim to-glitch-muted'
              }
              username={i === 0 ? '+' : story.username}
              size="lg"
              hasStory={i > 0}
              isMe={i === 0}
            />
            <span className="text-[11px] text-glitch-muted w-14 text-center truncate">
              {i === 0 ? 'Your story' : story.username.split('_')[0]}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
