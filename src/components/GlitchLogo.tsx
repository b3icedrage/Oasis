import { motion } from 'framer-motion';

export function GlitchLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <motion.div
      className="relative inline-block"
      whileHover={{ scale: 1.02 }}
    >
      <span
        className={`font-black tracking-tight ${sizes[size]} glitch-text`}
        style={{
          background: 'linear-gradient(135deg, #00e5ff 0%, #a855f7 50%, #ff00aa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        GlitchIt
      </span>
    </motion.div>
  );
}
