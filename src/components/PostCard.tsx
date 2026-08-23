import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Avatar } from './Avatar';
import { hapticImpact, hapticNotification } from '../hooks/useHaptics';
import { ImpactStyle, NotificationType } from '@capacitor/haptics';
import type { Post } from '../data/mockData';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [saved, setSaved] = useState(post.isSaved);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showHeart, setShowHeart] = useState(false);

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount((c) => c + 1);
      hapticImpact(ImpactStyle.Heavy);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    hapticNotification(liked ? NotificationType.Warning : NotificationType.Success);
  };

  const handleSave = () => {
    setSaved(!saved);
    hapticImpact(ImpactStyle.Medium);
  };

  return (
    <motion.article
      className="border-b border-glitch-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <Avatar gradient={post.user.avatar} username={post.user.username} size="sm" hasStory />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              @{post.user.username}
            </span>
          </div>
        </div>
        <button className="text-glitch-muted hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Image */}
      <div
        className="relative w-full aspect-square bg-glitch-surface overflow-hidden glitch-image"
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={post.image}
          alt={post.caption}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Glitch scan line effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-glitch-cyan/[0.02] to-transparent" />
        </div>
        {/* Double tap heart */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={handleLike}
            whileTap={{ scale: 0.8 }}
            className="relative"
          >
            <Heart
              className={`w-6 h-6 transition-colors duration-200 ${
                liked ? 'text-glitch-magenta fill-glitch-magenta' : 'text-white'
              }`}
            />
          </motion.button>
          <motion.button whileTap={{ scale: 0.8 }}>
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.8 }}>
            <Send className="w-6 h-6 text-white" />
          </motion.button>
        </div>          <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.8 }}
        >
          <Bookmark
            className={`w-6 h-6 transition-colors duration-200 ${
              saved ? 'text-white fill-white' : 'text-white'
            }`}
          />
        </motion.button>
      </div>

      {/* Likes */}
      <div className="px-3 pb-1">
        <span className="text-sm font-semibold text-white">
          {likeCount.toLocaleString()} likes
        </span>
      </div>

      {/* Caption */}
      <div className="px-3 pb-1">
        <p className="text-sm text-glitch-text">
          <span className="font-semibold text-white mr-1.5">@{post.user.username}</span>
          {post.caption}
        </p>
      </div>

      {/* Comments */}
      {post.comments.length > 0 && (
        <div className="px-3 pb-1">
          <button className="text-sm text-glitch-muted">
            View all {post.comments.length} comments
          </button>
        </div>
      )}

      {/* Time */}
      <div className="px-3 pb-3">
        <span className="text-[11px] text-glitch-dim uppercase tracking-wide">
          {post.timeAgo} ago
        </span>
      </div>
    </motion.article>
  );
}
