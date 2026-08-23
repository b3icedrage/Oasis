export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarColor: string;
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
  comments: { id: string; user: string; text: string }[];
  timeAgo: string;
  isLiked: boolean;
  isSaved: boolean;
}

export interface Story {
  id: string;
  username: string;
  avatarColor: string;
  hasUnseen: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: string;
  avatarColor: string;
  text: string;
  timeAgo: string;
  postImage?: string;
}

const avatarColors = ['#00e5ff', '#ff00aa', '#00ff88', '#a855f7', '#00e5ff'];
const images = [
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
];

export const currentUser: User = {
  id: 'me',
  username: 'glitch_master',
  displayName: 'Glitch Master',
  avatarColor: '#00e5ff',
  bio: '像素世界的探索者 ⚡\nDigital artist & glitch enthusiast',
  posts: 42,
  followers: 2847,
  following: 312,
};

export const users: User[] = [
  { id: '1', username: 'cosmic_glitcher', displayName: 'Cosmic Glitcher', avatarColor: avatarColors[0], bio: 'Digital reality bender', posts: 234, followers: 15420, following: 890, isVerified: true },
  { id: '2', username: 'neon_dreamer', displayName: 'Neon Dreamer', avatarColor: avatarColors[1], bio: '夜の夢を描く', posts: 189, followers: 8930, following: 445 },
  { id: '3', username: 'cyber_punk_99', displayName: 'Cyber Punk', avatarColor: avatarColors[2], bio: 'Future is now', posts: 567, followers: 23100, following: 312, isVerified: true },
  { id: '4', username: 'pixel_witch', displayName: 'Pixel Witch', avatarColor: avatarColors[3], bio: 'Casting digital spells ✨', posts: 145, followers: 6780, following: 567 },
  { id: '5', username: 'data_ghost', displayName: 'Data Ghost', avatarColor: avatarColors[4], bio: 'Lost in the code', posts: 312, followers: 11200, following: 234 },
  { id: '6', username: 'void_artist', displayName: 'Void Artist', avatarColor: avatarColors[0], bio: 'Art from the abyss', posts: 98, followers: 4560, following: 189 },
  { id: '7', username: 'synth_wave', displayName: 'Synth Wave', avatarColor: avatarColors[1], bio: '80s vibes, future sounds', posts: 276, followers: 18900, following: 423, isVerified: true },
  { id: '8', username: 'neon_ronin', displayName: 'Neon Ronin', avatarColor: avatarColors[2], bio: 'Digital samurai', posts: 423, followers: 9870, following: 345 },
];

export const stories: Story[] = [
  { id: 'me', username: 'Your story', avatarColor: '#3a3a55', hasUnseen: false },
  ...users.slice(0, 7).map((u) => ({ id: u.id, username: u.username, avatarColor: u.avatarColor, hasUnseen: Math.random() > 0.4 })),
];

export const feedPosts: Post[] = [
  { id: 'p1', user: users[0], image: images[0], caption: 'Lost in the neon labyrinth 🌃 The city never sleeps, and neither do its ghosts.', likes: 2345, comments: [{ id: 'c1', user: 'neon_dreamer', text: 'This is absolutely stunning! 🔥' }], timeAgo: '2h', isLiked: false, isSaved: false },
  { id: 'p2', user: users[2], image: images[1], caption: 'When reality starts to decompose... #glitchart #cyberpunk', likes: 5678, comments: [{ id: 'c3', user: 'pixel_witch', text: 'This effect is wild!' }], timeAgo: '4h', isLiked: true, isSaved: true },
  { id: 'p3', user: users[1], image: images[2], caption: 'Digital dreams in 4K 💜 涼しい夜', likes: 1234, comments: [], timeAgo: '6h', isLiked: false, isSaved: false },
  { id: 'p4', user: users[4], image: images[3], caption: 'Corrupted memories, beautiful errors ⚡', likes: 890, comments: [], timeAgo: '8h', isLiked: false, isSaved: false },
  { id: 'p5', user: users[6], image: images[4], caption: 'Synthesizing the future one pixel at a time 🎵', likes: 3456, comments: [{ id: 'c6', user: 'synth_wave', text: 'The vibe is immaculate' }], timeAgo: '12h', isLiked: true, isSaved: false },
];

export const exploreGrid = images.concat(images).map((img, i) => ({
  id: `e${i}`,
  image: img,
  likes: Math.floor(Math.random() * 10000) + 100,
}));

export const notifications: Notification[] = [
  { id: 'n1', type: 'like', user: 'cosmic_glitcher', avatarColor: avatarColors[0], text: 'liked your photo', timeAgo: '2m', postImage: images[0] },
  { id: 'n2', type: 'comment', user: 'neon_dreamer', avatarColor: avatarColors[1], text: 'commented: "This is incredible! 🔥"', timeAgo: '15m', postImage: images[1] },
  { id: 'n3', type: 'follow', user: 'cyber_punk_99', avatarColor: avatarColors[2], text: 'started following you', timeAgo: '1h' },
  { id: 'n4', type: 'mention', user: 'pixel_witch', avatarColor: avatarColors[3], text: 'mentioned you in a comment', timeAgo: '2h', postImage: images[2] },
  { id: 'n5', type: 'like', user: 'data_ghost', avatarColor: avatarColors[4], text: 'liked your photo', timeAgo: '3h', postImage: images[3] },
  { id: 'n6', type: 'follow', user: 'void_artist', avatarColor: avatarColors[0], text: 'started following you', timeAgo: '5h' },
  { id: 'n7', type: 'like', user: 'synth_wave', avatarColor: avatarColors[1], text: 'and 23 others liked your photo', timeAgo: '8h', postImage: images[4] },
];
