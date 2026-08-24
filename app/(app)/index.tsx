import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  Modal,
  TextInput,
  Dimensions,
  Animated,
} from "react-native";
import { useAuth } from "../../lib/auth-context";
import VideoPlayer from "../../components/VideoPlayer";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

interface Comment {
  user: string;
  text: string;
}

interface Post {
  id: string;
  username: string;
  userAvatar: string;
  image: string;
  videoUri?: string;
  likes: number;
  comments: Comment[];
  timeAgo: string;
  liked: boolean;
}

interface Story {
  id: string;
  username: string;
  avatar: string;
  image: string;
  timeAgo: string;
  seen: boolean;
}

const MOCK_STORIES: Story[] = [
  {
    id: "s1",
    username: "CosmicGlitcher",
    avatar: "C",
    image: "https://picsum.photos/600/900?random=201",
    timeAgo: "2h",
    seen: false,
  },
  {
    id: "s2",
    username: "NeonVortex",
    avatar: "N",
    image: "https://picsum.photos/600/900?random=202",
    timeAgo: "4h",
    seen: false,
  },
  {
    id: "s3",
    username: "VoidPixel",
    avatar: "V",
    image: "https://picsum.photos/600/900?random=203",
    timeAgo: "5h",
    seen: true,
  },
  {
    id: "s4",
    username: "StaticDreamer",
    avatar: "S",
    image: "https://picsum.photos/600/900?random=204",
    timeAgo: "6h",
    seen: false,
  },
  {
    id: "s5",
    username: "DataMosh",
    avatar: "D",
    image: "https://picsum.photos/600/900?random=205",
    timeAgo: "8h",
    seen: false,
  },
  {
    id: "s6",
    username: "GlitchMaster",
    avatar: "G",
    image: "https://picsum.photos/600/900?random=206",
    timeAgo: "10h",
    seen: true,
  },
];

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    username: "CosmicGlitcher",
    userAvatar: "C",
    image: "https://picsum.photos/600/600?random=1",
    videoUri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
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
    videoUri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
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

// ─── Story Viewer Modal ───────────────────────────────────────────
function StoryViewer({
  visible,
  stories,
  startIndex,
  onClose,
}: {
  visible: boolean;
  stories: Story[];
  startIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!visible) return;
    setCurrentIndex(startIndex);
    setProgress(0);
    progressAnim.setValue(0);

    // Auto-advance after 5 seconds
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(() => {
      // Move to next story
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setProgress(0);
        progressAnim.setValue(0);
      } else {
        onClose();
      }
    });

    return () => {
      progressAnim.stopAnimation();
    };
  }, [currentIndex, visible]);

  const goToPrev = () => {
    progressAnim.stopAnimation();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    progressAnim.stopAnimation();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  if (!visible || !currentStory) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={svStyles.container}>
        {/* Background image */}
        <Image
          source={{ uri: currentStory.image }}
          style={svStyles.backgroundImage}
          resizeMode="cover"
        />

        {/* Dark overlays */}
        <View style={svStyles.topOverlay} />
        <View style={svStyles.bottomOverlay} />

        {/* Tap areas */}
        <TouchableOpacity
          style={svStyles.leftTap}
          onPress={goToPrev}
          activeOpacity={1}
        />
        <TouchableOpacity
          style={svStyles.rightTap}
          onPress={goToNext}
          activeOpacity={1}
        />

        {/* Progress bars */}
        <View style={svStyles.progressContainer}>
          {stories.map((_, i) => (
            <View key={i} style={svStyles.progressBarBg}>
              <Animated.View
                style={[
                  svStyles.progressBarFill,
                  {
                    width:
                      i < currentIndex
                        ? "100%"
                        : i === currentIndex
                          ? progressAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ["0%", "100%"],
                            })
                          : "0%",
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {/* Header */}
        <View style={svStyles.header}>
          <View style={svStyles.headerLeft}>
            <View style={svStyles.headerAvatar}>
              <Text style={svStyles.headerAvatarText}>
                {currentStory.avatar}
              </Text>
            </View>
            <Text style={svStyles.headerUsername}>
              @{currentStory.username}
            </Text>
            <Text style={svStyles.headerTime}>{currentStory.timeAgo}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={svStyles.closeButton}>
            <Text style={svStyles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom message input */}
        <View style={svStyles.bottomBar}>
          <TextInput
            style={svStyles.messageInput}
            placeholder="Send message..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={svStyles.bottomAction}>
            <Text style={svStyles.bottomActionIcon}>♡</Text>
          </TouchableOpacity>
          <TouchableOpacity style={svStyles.bottomAction}>
            <Text style={svStyles.bottomActionIcon}>↗</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Post Card ────────────────────────────────────────────────────
function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postAvatar}>
          <Text style={styles.postAvatarText}>{post.userAvatar}</Text>
        </View>
        <Text style={styles.postUsername}>@{post.username}</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreText}>•••</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.postImageContainer}>
        {post.videoUri ? (
          <VideoPlayer
            uri={post.videoUri}
            posterUri={post.image}
            width={SCREEN_WIDTH}
            height={SCREEN_WIDTH}
            autoPlay={false}
            loop={true}
            showControls={true}
          />
        ) : (
          <>
            <Image
              source={{ uri: post.image }}
              style={styles.postImage}
              resizeMode="cover"
            />
            <View style={styles.glitchOverlay} />
          </>
        )}
      </View>

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

      <Text style={styles.likeCount}>
        {likeCount.toLocaleString()} likes
      </Text>

      <View style={styles.commentsSection}>
        {post.comments.map((comment, i) => (
          <Text key={i} style={styles.commentText}>
            <Text style={styles.commentUser}>@{comment.user}: </Text>
            {comment.text}
          </Text>
        ))}
      </View>

      <Text style={styles.timeAgo}>{post.timeAgo}</Text>
    </View>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────
export default function HomeScreen() {
  const { profile } = useAuth();
  const [storyViewerVisible, setStoryViewerVisible] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const openStory = (index: number) => {
    setActiveStoryIndex(index + 1); // +1 to skip "You" story
    setStoryViewerVisible(true);
  };

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
            {/* Your story */}
            <TouchableOpacity style={styles.storyItem} activeOpacity={0.8}>
              <View style={[styles.storyAvatar, styles.yourStory]}>
                <Text style={styles.storyAvatarText}>
                  {profile?.displayName?.charAt(0)?.toUpperCase() || "?"}
                </Text>
                <View style={styles.addStoryBadge}>
                  <Text style={styles.addStoryPlus}>+</Text>
                </View>
              </View>
              <Text style={styles.storyName}>You</Text>
            </TouchableOpacity>

            {/* Other stories — tappable */}
            {MOCK_STORIES.map((story, i) => (
              <TouchableOpacity
                key={story.id}
                style={styles.storyItem}
                activeOpacity={0.8}
                onPress={() => openStory(i)}
              >
                <View
                  style={[
                    styles.storyAvatar,
                    story.seen ? styles.storySeen : styles.storyUnseen,
                  ]}
                >
                  <Text style={styles.storyAvatarText}>{story.avatar}</Text>
                </View>
                <Text style={styles.storyName}>{story.username.slice(0, 8)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Posts feed */}
        {MOCK_POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ScrollView>

      {/* Story Viewer */}
      <StoryViewer
        visible={storyViewerVisible}
        stories={[...MOCK_STORIES]}
        startIndex={activeStoryIndex}
        onClose={() => setStoryViewerVisible(false)}
      />
    </SafeAreaView>
  );
}

// ─── Story Viewer Styles ──────────────────────────────────────────
const svStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: "absolute",
  },
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  leftTap: {
    position: "absolute",
    left: 0,
    top: 100,
    width: "35%",
    height: "70%",
  },
  rightTap: {
    position: "absolute",
    right: 0,
    top: 100,
    width: "65%",
    height: "70%",
  },

  // Progress bars
  progressContainer: {
    position: "absolute",
    top: 50,
    left: 12,
    right: 12,
    flexDirection: "row",
    gap: 4,
    zIndex: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },

  // Header
  header: {
    position: "absolute",
    top: 62,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#7c3aed",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  headerAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  headerUsername: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  headerTime: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "600",
  },

  // Bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 40,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    zIndex: 10,
  },
  messageInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#fff",
  },
  bottomAction: {
    padding: 6,
  },
  bottomActionIcon: {
    fontSize: 26,
    color: "#fff",
  },
});

// ─── Home Feed Styles ─────────────────────────────────────────────
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
  storySeen: {
    backgroundColor: "#1a1a2a",
    borderWidth: 2,
    borderColor: "#333",
  },
  storyUnseen: {
    backgroundColor: "#1a1a2a",
    borderWidth: 2,
    borderColor: "#a855f7",
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
