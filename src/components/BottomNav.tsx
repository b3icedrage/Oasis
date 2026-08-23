import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Search,
  PlusSquare,
  Heart,
  User,
} from 'lucide-react';

const navItems = [
  { path: '/', icon: Home },
  { path: '/explore', icon: Search },
  { path: '/create', icon: PlusSquare },
  { path: '/activity', icon: Heart },
  { path: '/profile', icon: User },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-glitch-bg/95 backdrop-blur-xl border-t border-glitch-border safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-14">
        {navItems.map(({ path, icon: Icon }) => {
          const isActive = location.pathname === path;
          const isCreate = path === '/create';

          return (
            <motion.button
              key={path}
              onClick={() => navigate(path)}
              className="relative flex flex-col items-center justify-center w-14 h-full"
              whileTap={{ scale: 0.85 }}
            >
              {isCreate ? (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-glitch-cyan via-glitch-purple to-glitch-magenta flex items-center justify-center shadow-lg shadow-glitch-purple/20">
                  <PlusSquare className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              ) : (
                <>
                  <Icon
                    className={`w-6 h-6 transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-glitch-muted'
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    fill={isActive ? 'currentColor' : 'none'}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-0 w-1 h-1 rounded-full bg-glitch-cyan"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </>
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
