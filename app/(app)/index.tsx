import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/auth-context";

export default function HomeScreen() {
  const { profile, signOut, isVerificationActive } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>Glitch</Text>
          <Text style={styles.logoAccent}>It</Text>
        </View>
      </View>

      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {profile?.displayName?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
          {/* Blue tick badge on avatar */}
          {isVerificationActive && (
            <View style={styles.blueTick}>
              <Text style={styles.blueTickIcon}>✓</Text>
            </View>
          )}
        </View>

        <Text style={styles.displayName}>{profile?.displayName || "User"}</Text>
        <Text style={styles.email}>{profile?.email}</Text>

        {/* Verification Status */}
        {isVerificationActive ? (
          <View style={styles.verifiedBadge}>
            <Text style={styles.badgeIcon}>✓</Text>
            <Text style={styles.badgeText}>GlitchIt Verified</Text>
          </View>
        ) : (
          <View style={styles.unverifiedBadge}>
            <Text style={styles.badgeIconUnverified}>○</Text>
            <Text style={styles.badgeTextUnverified}>Not Verified</Text>
          </View>
        )}
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/(app)/settings")}
          activeOpacity={0.7}
        >
          <Text style={styles.menuItemText}>Settings</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07070d",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoRow: {
    flexDirection: "row",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#e0e0e0",
    letterSpacing: -1,
  },
  logoAccent: {
    fontSize: 28,
    fontWeight: "800",
    color: "#7c3aed",
    letterSpacing: -1,
  },
  card: {
    backgroundColor: "#141420",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2a2a3a",
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#7c3aed",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  blueTick: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#141420",
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
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  badgeIcon: {
    fontSize: 16,
    color: "#22c55e",
    marginRight: 8,
    fontWeight: "700",
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#22c55e",
  },
  unverifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(136, 136, 136, 0.1)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(136, 136, 136, 0.2)",
  },
  badgeIconUnverified: {
    fontSize: 16,
    color: "#888",
    marginRight: 8,
  },
  badgeTextUnverified: {
    fontSize: 14,
    color: "#888",
  },
  menu: {
    marginTop: 24,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#141420",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a3a",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemText: {
    color: "#e0e0e0",
    fontSize: 16,
    fontWeight: "600",
  },
  menuArrow: {
    color: "#555",
    fontSize: 22,
    fontWeight: "300",
  },
  signOutButton: {
    marginTop: "auto",
    marginBottom: 40,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a3a",
  },
  signOutText: {
    color: "#888",
    fontSize: 15,
    fontWeight: "600",
  },
});
