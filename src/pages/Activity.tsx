import { motion } from 'framer-motion';
import { notifications } from '../data/mockData';
import { Avatar } from '../components/Avatar';

export function Activity() {
  return (
    <div className="h-full flex flex-col bg-glitch-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-glitch-bg/95 backdrop-blur-xl border-b border-glitch-border px-4 py-2.5">
        <h1 className="text-white font-semibold text-base">Activity</h1>
      </header>

      {/* Notifications */}
      <div className="flex-1 overflow-y-auto">
        {/* Follow Suggestions */}
        <div className="px-4 py-3 border-b border-glitch-border">
          <h2 className="text-sm font-semibold text-white mb-3">Suggested for you</h2>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {notifications
              .filter((n) => n.type === 'follow')
              .map((notif) => (
                <motion.div
                  key={notif.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-glitch-surface border border-glitch-border min-w-[130px] flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Avatar gradient={notif.avatar} username={notif.user} size="lg" hasStory />
                  <span className="text-xs font-semibold text-white text-center">{notif.user}</span>
                  <button className="w-full py-1.5 rounded-lg bg-glitch-cyan/15 text-glitch-cyan text-xs font-semibold border border-glitch-cyan/30 hover:bg-glitch-cyan/25 transition-colors">
                    Follow
                  </button>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Today */}
        <div className="px-4 py-3">
          <h2 className="text-sm font-semibold text-white mb-3">Today</h2>
          <div className="space-y-1">
            {notifications.slice(0, 4).map((notif, i) => (
              <motion.div
                key={notif.id}
                className="flex items-center gap-3 py-2.5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Avatar gradient={notif.avatar} username={notif.user} size="sm" hasStory />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-glitch-text">
                    <span className="font-semibold text-white">{notif.user}</span>{' '}
                    {notif.text}
                  </p>
                  <span className="text-xs text-glitch-dim">{notif.timeAgo}</span>
                </div>
                {notif.postImage && (
                  <img
                    src={notif.postImage}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* This Week */}
        <div className="px-4 py-3">
          <h2 className="text-sm font-semibold text-white mb-3">This week</h2>
          <div className="space-y-1">
            {notifications.slice(4).map((notif, i) => (
              <motion.div
                key={notif.id}
                className="flex items-center gap-3 py-2.5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Avatar gradient={notif.avatar} username={notif.user} size="sm" hasStory />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-glitch-text">
                    <span className="font-semibold text-white">{notif.user}</span>{' '}
                    {notif.text}
                  </p>
                  <span className="text-xs text-glitch-dim">{notif.timeAgo}</span>
                </div>
                {notif.postImage && (
                  <img
                    src={notif.postImage}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
