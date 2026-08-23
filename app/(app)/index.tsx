import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../lib/auth-context";

const PAYMENT_URL = "https://store.pesapal.com/monthlyverifications";
const BRIDGE_URL = "https://glitchit-749c0.web.app/verify";

export default function HomeScreen() {
  const { profile, signOut, generateVerificationKey } = useAuth();
  const [generating, setGenerating] = useState(false);

  const handleGetVerified = async () => {
    if (!profile || generating) return;
    setGenerating(true);
    try {
      const key = await generateVerificationKey();
      const callbackUrl = `${BRIDGE_URL}?key=${key}`;
      const url = `${PAYMENT_URL}?callback=${encodeURIComponent(callbackUrl)}`;
      Alert.alert(
        "Get Verified",
        "You'll be redirected to Pesapal to complete payment. After payment, your badge will activate automatically.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Proceed",
            onPress: () => Linking.openURL(url),
          },
        ],
      );
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to generate verification key.");
    } finally {
      setGenerating(false);
    }
  };

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
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarLetter}>
            {profile?.displayName?.charAt(0)?.toUpperCase() || "?"}
          </Text>
        </View>

        <Text style={styles.displayName}>{profile?.displayName || "User"}</Text>
        <Text style={styles.email}>{profile?.email}</Text>

        {/* Verification Badge */}
        <View style={styles.badgeRow}>
          {profile?.isVerified ? (
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

        {/* Get Verified Button */}
        {!profile?.isVerified && (
          <TouchableOpacity
            style={[styles.verifyButton, generating && { opacity: 0.6 }]}
            onPress={handleGetVerified}
            activeOpacity={0.8}
            disabled={generating}
          >
            {generating ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.verifyButtonText}>Get Verified — KES 499/mo</Text>
            )}
          </TouchableOpacity>
        )}
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
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#7c3aed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarLetter: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
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
  badgeRow: {
    marginBottom: 24,
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
  verifyButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
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
