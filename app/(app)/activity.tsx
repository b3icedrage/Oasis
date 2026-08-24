import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

const NOTIFICATIONS = [
  {
    id: "1",
    type: "like",
    user: "NeonVortex",
    text: "liked your post",
    time: "2m ago",
    avatar: "N",
  },
  {
    id: "2",
    type: "comment",
    user: "CosmicGlitcher",
    text: 'commented: "This goes hard 🔥"',
    time: "15m ago",
    avatar: "C",
  },
  {
    id: "3",
    type: "follow",
    user: "VoidPixel",
    text: "started following you",
    time: "1h ago",
    avatar: "V",
  },
  {
    id: "4",
    type: "like",
    user: "StaticDreamer",
    text: "liked your post",
    time: "2h ago",
    avatar: "S",
  },
  {
    id: "5",
    type: "mention",
    user: "DataMosh",
    text: "mentioned you in a comment",
    time: "3h ago",
    avatar: "D",
  },
  {
    id: "6",
    type: "like",
    user: "GlitchMaster",
    text: 'liked your post: "RGB vibes"',
    time: "5h ago",
    avatar: "G",
  },
  {
    id: "7",
    type: "follow",
    user: "PixelDrifter",
    text: "started following you",
    time: "8h ago",
    avatar: "P",
  },
];

function NotificationItem({ notif }: { notif: typeof NOTIFICATIONS[0] }) {
  const typeColor =
    notif.type === "like"
      ? "#ef4444"
      : notif.type === "comment"
        ? "#3b82f6"
        : notif.type === "follow"
          ? "#22c55e"
          : "#a855f7";

  return (
    <TouchableOpacity style={styles.notifItem} activeOpacity={0.7}>
      <View style={[styles.notifAvatar, { borderColor: typeColor }]}>
        <Text style={styles.notifAvatarText}>{notif.avatar}</Text>
      </View>
      <View style={styles.notifContent}>
        <Text style={styles.notifText}>
          <Text style={styles.notifUser}>@{notif.user} </Text>
          {notif.text}
        </Text>
        <Text style={styles.notifTime}>{notif.time}</Text>
      </View>
      <View style={[styles.notifDot, { backgroundColor: typeColor }]} />
    </TouchableOpacity>
  );
}

export default function ActivityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity</Text>
        </View>

        {/* Filter chips */}
        <View style={styles.filters}>
          {["All", "Likes", "Comments", "Follows"].map((f, i) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, i === 0 && styles.filterChipActive]}
            >
              <Text
                style={[
                  styles.filterText,
                  i === 0 && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications */}
        <View style={styles.notifList}>
          {NOTIFICATIONS.map((n) => (
            <NotificationItem key={n.id} notif={n} />
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
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#e0e0e0",
  },
  filters: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#141420",
    borderWidth: 1,
    borderColor: "#2a2a3a",
  },
  filterChipActive: {
    backgroundColor: "#7c3aed",
    borderColor: "#7c3aed",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
  },
  filterTextActive: {
    color: "#fff",
  },
  notifList: {
    paddingHorizontal: 16,
  },
  notifItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a2a",
  },
  notifAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#141420",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notifAvatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e0e0e0",
  },
  notifContent: {
    flex: 1,
  },
  notifText: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
  },
  notifUser: {
    fontWeight: "700",
    color: "#e0e0e0",
  },
  notifTime: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});
