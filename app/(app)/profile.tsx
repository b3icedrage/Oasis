import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/auth-context";

const USER_POSTS = Array.from({ length: 9 }, (_, i) => ({
  id: String(i),
  image: `https://picsum.photos/400/400?random=${i + 50}`,
}));

export default function ProfileScreen() {
  const { profile, isVerificationActive, signOut } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with settings */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            onPress={() => router.push("/(app)/settings")}
            style={styles.settingsButton}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Profile info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile?.displayName?.charAt(0)?.toUpperCase() || "?"}
              </Text>
            </View>
            {isVerificationActive && (
              <View style={styles.blueTick}>
                <Text style={styles.blueTickIcon}>✓</Text>
              </View>
            )}
          </View>

          <Text style={styles.displayName}>
            {profile?.displayName || "User"}
          </Text>
          <Text style={styles.username}>
            @{profile?.displayName?.toLowerCase().replace(/\s/g, "") || "user"}
          </Text>

          {/* Verification badge */}
          {isVerificationActive ? (
            <View style={styles.verifiedBadge}>
              <Text style={styles.badgeIcon}>✓</Text>
              <Text style={styles.badgeText}>GlitchIt Verified</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.getVerifiedButton}
              onPress={() => router.push("/(app)/settings")}
            >
              <Text style={styles.getVerifiedText}>Get Verified ✓</Text>
            </TouchableOpacity>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* Posts grid */}
        <View style={styles.gridHeader}>
          <Text style={styles.gridLabel}>Posts</Text>
        </View>
        <View style={styles.grid}>
          {USER_POSTS.map((post) => (
            <TouchableOpacity key={post.id} style={styles.gridItem} activeOpacity={0.8}>
              <Image
                source={{ uri: post.image }}
                style={styles.gridImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07070d",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#e0e0e0",
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 22,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a2a",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#7c3aed",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },
  blueTick: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#07070d",
  },
  blueTickIcon: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "800",
  },
  displayName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e0e0e0",
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
    marginBottom: 16,
  },
  badgeIcon: {
    fontSize: 14,
    color: "#3b82f6",
    marginRight: 6,
    fontWeight: "700",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3b82f6",
  },
  getVerifiedButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7c3aed",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
  },
  getVerifiedText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#e0e0e0",
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#2a2a3a",
  },
  gridHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  gridLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 4,
    gap: 4,
  },
  gridItem: {
    width: "33%",
    aspectRatio: 1,
    borderRadius: 4,
    overflow: "hidden",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
});
