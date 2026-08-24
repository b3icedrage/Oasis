import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/auth-context";

const PAYMENT_URL = "https://store.pesapal.com/monthlyverifications";
const BRIDGE_URL = "https://glitchit-749c0.web.app/verify";

export default function SettingsScreen() {
  const { profile, signOut, isVerificationActive } = useAuth();
  const router = useRouter();

  const handleGetVerified = () => {
    const url = `${PAYMENT_URL}?callback=${encodeURIComponent(BRIDGE_URL)}`;
    Alert.alert(
      "Get Verified",
      "You'll be redirected to Pesapal to complete payment. After payment, your blue tick badge will activate for 1 month.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed",
          onPress: () => Linking.openURL(url),
        },
      ],
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const formatExpiry = () => {
    if (!profile?.verifiedUntil) return null;
    const date = new Date(profile.verifiedUntil);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Account Section */}
      <Text style={styles.sectionLabel}>Account</Text>
      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>{profile?.displayName}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{profile?.email}</Text>
        </View>
      </View>

      {/* Verification Section */}
      <Text style={styles.sectionLabel}>Verification</Text>
      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          {isVerificationActive ? (
            <View style={styles.statusActive}>
              <Text style={styles.statusActiveText}>✓ Verified</Text>
            </View>
          ) : (
            <View style={styles.statusInactive}>
              <Text style={styles.statusInactiveText}>Not Verified</Text>
            </View>
          )}
        </View>

        {isVerificationActive && profile?.verifiedUntil && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Expires</Text>
              <Text style={styles.infoValue}>{formatExpiry()}</Text>
            </View>
          </>
        )}
      </View>

      {/* Verification Action */}
      {!isVerificationActive ? (
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleGetVerified}
          activeOpacity={0.8}
        >
          <Text style={styles.verifyButtonText}>Get Verified — $4.99/mo</Text>
          <Text style={styles.verifyButtonSub}>
            Get a blue tick badge on your profile
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.renewButton}
          onPress={handleGetVerified}
          activeOpacity={0.8}
        >
          <Text style={styles.renewButtonText}>Renew Verification</Text>
          <Text style={styles.renewButtonSub}>
            Extend your verified badge for another 30 days
          </Text>
        </TouchableOpacity>
      )}

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07070d",
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  backButton: {
    color: "#7c3aed",
    fontSize: 28,
    fontWeight: "300",
    marginRight: 12,
  },
  headerTitle: {
    color: "#e0e0e0",
    fontSize: 24,
    fontWeight: "700",
  },
  sectionLabel: {
    color: "#555",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 24,
  },
  section: {
    backgroundColor: "#141420",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a3a",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoLabel: {
    color: "#888",
    fontSize: 15,
  },
  infoValue: {
    color: "#e0e0e0",
    fontSize: 15,
    fontWeight: "500",
    maxWidth: "60%",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#2a2a3a",
    marginHorizontal: 16,
  },
  statusActive: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusActiveText: {
    color: "#22c55e",
    fontSize: 13,
    fontWeight: "600",
  },
  statusInactive: {
    backgroundColor: "rgba(136, 136, 136, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusInactiveText: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
  },
  verifyButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 32,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  verifyButtonSub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    marginTop: 4,
  },
  renewButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 32,
    borderWidth: 1,
    borderColor: "#7c3aed",
  },
  renewButtonText: {
    color: "#7c3aed",
    fontSize: 17,
    fontWeight: "700",
  },
  renewButtonSub: {
    color: "rgba(124, 58, 237, 0.6)",
    fontSize: 13,
    marginTop: 4,
  },
  signOutButton: {
    marginTop: 48,
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
