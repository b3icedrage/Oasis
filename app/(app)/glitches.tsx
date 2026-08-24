import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface GlitchReel {
  id: string;
  username: string;
  avatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  music: string;
  liked: boolean;
}

const GLITCH_REELS: GlitchReel[] = [
  {
    id: "1",
    username: "CosmicGlitcher",
    avatar: "C",
    image: "https://picsum.photos/600/900?random=101",
    caption: "RGB split vibes #glitchart",
    likes: 12400,
    comments: 342,
    shares: 89,
    music: "Lo-Fi Glitch Beats",
    liked: false,
  },
  {
    id: "2",
    username: "NeonVortex",
    avatar: "N",
    image: "https://picsum.photos/600/900?random=102",
    caption: "Data mosh experiment 🌆",
    likes: 8900,
    comments: 210,
    shares: 56,
    music: "Synthwave Dreams",
    liked: true,
  },
  {
    id: "3",
    username: "VoidPixel",
    avatar: "V",
    image: "https://picsum.photos/600/900?random=103",
    caption: "Digital decay is art ✨",
    likes: 23100,
    comments: 567,
    shares: 234,
    music: "Neon Nights",
    liked: false,
  },
  {
    id: "4",
    username: "StaticDreamer",
    avatar: "S",
    image: "https://picsum.photos/600/900?random=104",
    caption: "VHS aesthetic never dies",
    likes: 5600,
    comments: 123,
    shares: 34,
    music: "Retro Glitch",
    liked: false,
  },
  {
    id: "5",
    username: "DataMosh",
    avatar: "D",
    image: "https://picsum.photos/600/900?random=105",
    caption: "Pixel destruction 🔥",
    likes: 34200,
    comments: 890,
    shares: 456,
    music: "Bass Glitch",
    liked: true,
  },
];

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

function ReelCard({ reel }: { reel: GlitchReel }) {
  const [liked, setLiked] = useState(reel.liked);
  const [likeCount, setLikeCount] = useState(reel.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <View style={styles.reelCard}>
      {/* Background image */}
      <Image
        source={{ uri: reel.image }}
        style={styles.reelImage}
        resizeMode="cover"
      />

      {/* Gradient overlay */}
      <View style={styles.gradientTop} />
      <View style={styles.gradientBottom} />

      {/* Right side actions */}
      <View style={styles.rightActions}>
        <TouchableOpacity style={styles.actionItem} onPress={toggleLike}>
          <Text style={[styles.actionHeart, liked && styles.heartActive]}>
            {liked ? "♥" : "♡"}
          </Text>
          <Text style={styles.actionCount}>{formatCount(likeCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{formatCount(reel.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>↗</Text>
          <Text style={styles.actionCount}>{formatCount(reel.shares)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.musicDot} />
        </TouchableOpacity>
      </View>

      {/* Bottom info */}
      <View style={styles.bottomInfo}>
        <View style={styles.userRow}>
          <View style={styles.miniAvatar}>
            <Text style={styles.miniAvatarText}>{reel.avatar}</Text>
          </View>
          <Text style={styles.username}>@{reel.username}</Text>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.caption}>{reel.caption}</Text>

        <View style={styles.musicRow}>
          <Text style={styles.musicIcon}>🎵</Text>
          <Text style={styles.musicText}>{reel.music}</Text>
        </View>
      </View>
    </View>
  );
}

export default function GlitchesScreen() {
  const flatListRef = useRef<FlatList>(null);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={GLITCH_REELS}
        renderItem={({ item }) => <ReelCard reel={item} />}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07070d",
  },
  reelCard: {
    width: "100%",
    height: SCREEN_HEIGHT,
    position: "relative",
  },
  reelImage: {
    width: "100%",
    height: "100%",
  },
  gradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(7, 7, 13, 0.6)",
  },
  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 250,
    backgroundColor: "rgba(7, 7, 13, 0.7)",
  },

  // Right action buttons
  rightActions: {
    position: "absolute",
    right: 12,
    bottom: 160,
    alignItems: "center",
    gap: 20,
  },
  actionItem: {
    alignItems: "center",
  },
  actionHeart: {
    fontSize: 30,
    color: "#fff",
  },
  heartActive: {
    color: "#ef4444",
  },
  actionIcon: {
    fontSize: 26,
    color: "#fff",
  },
  actionCount: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    marginTop: 2,
  },
  musicDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#333",
    borderWidth: 2,
    borderColor: "#7c3aed",
  },

  // Bottom info
  bottomInfo: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 60,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7c3aed",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  miniAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  username: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  followText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  caption: {
    fontSize: 14,
    color: "#ddd",
    lineHeight: 20,
    marginBottom: 8,
  },
  musicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  musicIcon: {
    fontSize: 12,
  },
  musicText: {
    fontSize: 13,
    color: "#ccc",
    fontWeight: "500",
  },
});
