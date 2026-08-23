import { motion } from 'framer-motion';

interface AvatarProps {
  gradient?: string;
  username?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  hasStory?: boolean;
  isMe?: boolean;
  onClick?: () => void;
}

const sizeMap = {
  xs: 'w-7 h-7 text-[10px]',
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

const ringSizeMap = {
  xs: 'w-8 h-8',
  sm: 'w-11 h-11',
  md: 'w-[52px] h-[52px]',
  lg: 'w-[64px] h-[64px]',
  xl: 'w-[88px] h-[88px]',
};

export function Avatar({
  gradient,
  username,
  size = 'md',
  hasStory = false,
  isMe = false,
  onClick,
}: AvatarProps) {
  const initial = username ? username.charAt(0).toUpperCase() : 'G';
  const gradientClass = gradient || 'from-glitch-cyan to-glitch-purple';

  return (
    <motion.button
      className="relative flex items-center justify-center"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {hasStory && (
        <div
          className={`absolute ${ringSizeMap[size]} rounded-full bg-gradient-to-br ${gradientClass} p-[2px]`}
        >
          <div className="w-full h-full rounded-full bg-glitch-bg p-[2px]">
            <div
              className={`w-full h-full rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
            >
              <span className="text-white font-bold">{initial}</span>
            </div>
          </div>
        </div>
      )}
      {!hasStory && (
        <div
          className={`${sizeMap[size]} rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center ${isMe ? 'ring-2 ring-glitch-border' : ''}`}
        >
          <span className="text-white font-bold">{isMe ? '+' : initial}</span>
        </div>
      )}
    </motion.button>
  );
}
