import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../lib/auth-context";

interface Comment {
  user: string;
  text: string;
}

interface Post {
  id: string;
  username: string;
  userAvatar: string;
  image: string;
  likes: number;
  comments: Comment[];
  timeAgo: string;
  liked: boolean;
}

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    username: "CosmicGlitcher",
    userAvatar: "C",
    image: "https://picsum.photos/600/600?random=1",
    likes: 2345,
    comments: [
      { user: "UserOne", text: "Love this effect! #glitchart" },
      { user: "PixelDrifter", text: "The colors are insane 🔥" },
    ],
    timeAgo: "2h",
    liked: false,
  },
  {
    id: "2",
    username: "NeonVortex",
    userAvatar: "N",
    image: "https://picsum.photos/600/600?random=2",
    likes: 1892,
    comments: [{ user: "GlitchMaster", text: "This goes hard 💜" }],
    timeAgo: "4h",
    liked: true,
  },
  {
    id: "3",
    username: "VoidPixel",
    userAvatar: "V",
    image: "https://picsum.photos/600/600?random=3",
    likes: 5678,
    comments: [
      { user: "CosmicGlitcher", text: "Incredible work!" },
      { user: "DataMosh", text: "How did you do this?" },
    ],
    timeAgo: "6h",
    liked: false,
  },
  {
    id: "4",
    username: "StaticDreamer",
    userAvatar: "S",
    image: "https://picsum.photos/600/600?random=4",
    likes: 421,
    comments: [{ user: "NeonVortex", text: "Dope vibes ✨" }],
    timeAgo: "8h",
    liked: false,
  },
];

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <View style={styles.postCard}>
      {/* User header */}
      <View style={styles.postHeader}>
        <View style={styles.postAvatar}>
          <Text style={styles.postAvatarText}>{post.userAvatar}</Text>
        </View>
        <Text style={styles.postUsername}>@{post.username}</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreText}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* Post image */}
      <View style={styles.postImageContainer}>
        <Image
          source={{ uri: post.image }}
          style={styles.postImage}
          resizeMode="cover"
        />
        {/* Glitch overlay effect */}
        <View style={styles.glitchOverlay} />
      </View>

      {/* Action buttons */}
      <View style={styles.postActions}>
        <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
          <Text style={[styles.actionIcon, liked && styles.likedIcon]}>
            {liked ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>↗</Text>
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <Text style={styles.likeCount}>
        {likeCount.toLocaleString()} likes
      </Text>

      {/* Comments */}
      <View style={styles.commentsSection}>
        {post.comments.map((comment, i) => (
          <Text key={i} style={styles.commentText}>
            <Text style={styles.commentUser}>@{comment.user}: </Text>
            {comment.text}
          </Text>
        ))}
      </View>

      {/* Time */}
      <Text style={styles.timeAgo}>{post.timeAgo}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { profile } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Text style={styles.logoGlitch}>Glitch</Text>
            <Text style={styles.logoIt}>It</Text>
          </View>
        </View>

        {/* Stories bar */}
        <View style={styles.storiesBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.storyItem}>
              <View style={[styles.storyAvatar, styles.yourStory]}>
                <Text style={styles.storyAvatarText}>
                  {profile?.displayName?.charAt(0)?.toUpperCase() || "?"}
                </Text>
                <View style={styles.addStoryBadge}>
                  <Text style={styles.addStoryPlus}>+</Text>
                </View>
              </View>
              <Text style={styles.storyName}>You</Text>
            </View>
            {["C", "N", "V", "S", "D", "G"].map((letter, i) => (
              <View key={i} style={styles.storyItem}>
                <View style={[styles.storyAvatar, styles.randomStory]}>
                  <Text style={styles.storyAvatarText}>{letter}</Text>
                </View>
                <Text style={styles.storyName}>
                  {["Cosmic", "Neon", "Void", "Static", "Data", "Glitch"][i]}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Posts feed */}
        {MOCK_POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07070d",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a2a",
  },
  logoRow: {
    flexDirection: "row",
  },
  logoGlitch: {
    fontSize: 26,
    fontWeight: "800",
    color: "#e0e0e0",
    letterSpacing: -1,
  },
  logoIt: {
    fontSize: 26,
    fontWeight: "800",
    color: "#7c3aed",
    letterSpacing: -1,
  },

  // Stories
  storiesBar: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a2a",
  },
  storyItem: {
    alignItems: "center",
    marginRight: 16,
    marginLeft: 4,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  yourStory: {
    backgroundColor: "#1a1a2a",
    borderWidth: 2,
    borderColor: "#7c3aed",
  },
  randomStory: {
    backgroundColor: "#1a1a2a",
    borderWidth: 2,
    borderColor: "#333",
  },
  storyAvatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e0e0e0",
  },
  addStoryBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#7c3aed",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#07070d",
  },
  addStoryPlus: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginTop: -1,
  },
  storyName: {
    fontSize: 11,
    color: "#888",
    fontWeight: "500",
  },

  // Post card
  postCard: {
    marginTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a2a",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1a1a2a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  postAvatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#a855f7",
  },
  postUsername: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e0e0e0",
    flex: 1,
  },
  moreButton: {
    padding: 4,
  },
  moreText: {
    color: "#555",
    fontSize: 16,
    letterSpacing: 2,
  },

  // Post image
  postImageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#0f0f18",
    position: "relative",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  glitchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },

  // Actions
  postActions: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingTop: 12,
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  actionIcon: {
    fontSize: 24,
    color: "#e0e0e0",
  },
  likedIcon: {
    color: "#ef4444",
  },

  // Likes & comments
  likeCount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#e0e0e0",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  commentsSection: {
    paddingHorizontal: 16,
    marginTop: 6,
    gap: 4,
  },
  commentText: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
  },
  commentUser: {
    fontWeight: "700",
    color: "#e0e0e0",
  },
  timeAgo: {
    fontSize: 12,
    color: "#555",
    paddingHorizontal: 16,
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
