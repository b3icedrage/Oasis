export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  posts: number;
  followers: number;
  following: number;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  user: User;
  image: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timeAgo: string;
  isLiked: boolean;
  isSaved: boolean;
}

export interface Comment {
  id: string;
  user: string;
  text: string;
}

export interface Story {
  id: string;
  username: string;
  avatar: string;
  hasUnseen: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: string;
  avatar: string;
  text: string;
  timeAgo: string;
  postImage?: string;
}

const glitchImages = [
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80',
  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
];

const avatarColors = [
  'from-glitch-cyan to-glitch-purple',
  'from-glitch-magenta to-glitch-cyan',
  'from-glitch-green to-glitch-cyan',
  'from-glitch-purple to-glitch-magenta',
  'from-glitch-cyan to-glitch-green',
];

export const currentUser: User = {
  id: 'me',
  username: 'glitch_master',
  displayName: 'Glitch Master',
  avatar: '',
  bio: '像素世界的探索者 ⚡\nDigital artist & glitch enthusiast\nCreating beauty in chaos',
  posts: 42,
  followers: 2847,
  following: 312,
};

export const users: User[] = [
  {
    id: '1',
    username: 'cosmic_glitcher',
    displayName: 'Cosmic Glitcher',
    avatar: avatarColors[0],
    bio: 'Digital reality bender',
    posts: 234,
    followers: 15420,
    following: 890,
    isVerified: true,
  },
  {
    id: '2',
    username: 'neon_dreamer',
    displayName: 'Neon Dreamer',
    avatar: avatarColors[1],
    bio: '夜の夢を描く',
    posts: 189,
    followers: 8930,
    following: 445,
  },
  {
    id: '3',
    username: 'cyber_punk_99',
    displayName: 'Cyber Punk',
    avatar: avatarColors[2],
    bio: 'Future is now',
    posts: 567,
    followers: 23100,
    following: 312,
    isVerified: true,
  },
  {
    id: '4',
    username: 'pixel_witch',
    displayName: 'Pixel Witch',
    avatar: avatarColors[3],
    bio: 'Casting digital spells ✨',
    posts: 145,
    followers: 6780,
    following: 567,
  },
  {
    id: '5',
    username: 'data_ghost',
    displayName: 'Data Ghost',
    avatar: avatarColors[4],
    bio: 'Lost in the code',
    posts: 312,
    followers: 11200,
    following: 234,
  },
  {
    id: '6',
    username: 'void_artist',
    displayName: 'Void Artist',
    avatar: avatarColors[0],
    bio: 'Art from the abyss',
    posts: 98,
    followers: 4560,
    following: 189,
  },
  {
    id: '7',
    username: 'synth_wave',
    displayName: 'Synth Wave',
    avatar: avatarColors[1],
    bio: '80s vibes, future sounds',
    posts: 276,
    followers: 18900,
    following: 423,
    isVerified: true,
  },
  {
    id: '8',
    username: 'neon_ronin',
    displayName: 'Neon Ronin',
    avatar: avatarColors[2],
    bio: 'Digital samurai',
    posts: 423,
    followers: 9870,
    following: 345,
  },
];

export const stories: Story[] = [
  { id: 'me', username: 'Your story', avatar: '', hasUnseen: false },
  ...users.slice(0, 7).map((u) => ({
    id: u.id,
    username: u.username,
    avatar: u.avatar,
    hasUnseen: Math.random() > 0.4,
  })),
];

export const feedPosts: Post[] = [
  {
    id: 'p1',
    user: users[0],
    image: glitchImages[0],
    caption: 'Lost in the neon labyrinth 🌃 The city never sleeps, and neither do its ghosts.',
    likes: 2345,
    comments: [
      { id: 'c1', user: 'neon_dreamer', text: 'This is absolutely stunning! 🔥' },
      { id: 'c2', user: 'cyber_punk_99', text: 'The colors are insane' },
    ],
    timeAgo: '2h',
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'p2',
    user: users[2],
    image: glitchImages[1],
    caption: 'When reality starts to decompose... #glitchart #cyberpunk',
    likes: 5678,
    comments: [
      { id: 'c3', user: 'pixel_witch', text: 'This effect is wild!' },
    ],
    timeAgo: '4h',
    isLiked: true,
    isSaved: true,
  },
  {
    id: 'p3',
    user: users[1],
    image: glitchImages[2],
    caption: 'Digital dreams in 4K 💜 涼しい夜',
    likes: 1234,
    comments: [
      { id: 'c4', user: 'data_ghost', text: 'So ethereal ✨' },
      { id: 'c5', user: 'void_artist', text: 'Need a tutorial on this!' },
    ],
    timeAgo: '6h',
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'p4',
    user: users[4],
    image: glitchImages[3],
    caption: 'Corrupted memories, beautiful errors ⚡',
    likes: 890,
    comments: [],
    timeAgo: '8h',
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'p5',
    user: users[6],
    image: glitchImages[4],
    caption: 'Synthesizing the future one pixel at a time 🎵',
    likes: 3456,
    comments: [
      { id: 'c6', user: 'synth_wave', text: 'The vibe is immaculate' },
    ],
    timeAgo: '12h',
    isLiked: true,
    isSaved: false,
  },
];

export const exploreGrid = glitchImages.map((img, i) => ({
  id: `e${i}`,
  image: img,
  likes: Math.floor(Math.random() * 10000) + 100,
  isVideo: i % 5 === 0,
}));

export const notifications: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    user: 'cosmic_glitcher',
    avatar: avatarColors[0],
    text: 'liked your photo',
    timeAgo: '2m',
    postImage: glitchImages[0],
  },
  {
    id: 'n2',
    type: 'comment',
    user: 'neon_dreamer',
    avatar: avatarColors[1],
    text: 'commented: "This is incredible! 🔥"',
    timeAgo: '15m',
    postImage: glitchImages[1],
  },
  {
    id: 'n3',
    type: 'follow',
    user: 'cyber_punk_99',
    avatar: avatarColors[2],
    text: 'started following you',
    timeAgo: '1h',
  },
  {
    id: 'n4',
    type: 'mention',
    user: 'pixel_witch',
    avatar: avatarColors[3],
    text: 'mentioned you in a comment',
    timeAgo: '2h',
    postImage: glitchImages[2],
  },
  {
    id: 'n5',
    type: 'like',
    user: 'data_ghost',
    avatar: avatarColors[4],
    text: 'liked your photo',
    timeAgo: '3h',
    postImage: glitchImages[3],
  },
  {
    id: 'n6',
    type: 'follow',
    user: 'void_artist',
    avatar: avatarColors[0],
    text: 'started following you',
    timeAgo: '5h',
  },
  {
    id: 'n7',
    type: 'like',
    user: 'synth_wave',
    avatar: avatarColors[1],
    text: 'and 23 others liked your photo',
    timeAgo: '8h',
    postImage: glitchImages[4],
  },
  {
    id: 'n8',
    type: 'comment',
    user: 'neon_ronin',
    avatar: avatarColors[2],
    text: 'commented: "Masterpiece ⚔️"',
    timeAgo: '12h',
    postImage: glitchImages[5],
  },
];

export const suggestedUsers = users.slice(3, 8);
