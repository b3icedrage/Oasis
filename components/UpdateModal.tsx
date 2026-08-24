import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../data/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── SVG Icons ────────────────────────────────────────────────────
function UpdateIcon({ size = 64 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
        stroke={Colors.cyan}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 10l5 5 5-5"
        stroke={Colors.cyan}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15V3"
        stroke={Colors.cyan}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Update Modal Component ───────────────────────────────────────
interface UpdateModalProps {
  visible: boolean;
  onUpdate: () => void;
  downloading?: boolean;
  downloadProgress?: number;
}

export default function UpdateModal({
  visible,
  onUpdate,
  downloading = false,
  downloadProgress = 0,
}: UpdateModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Icon */}
          <View style={styles.iconCircle}>
            <UpdateIcon size={48} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Update Available</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Your version of GlitchIt is outdated.{"\n"}Update to get the latest features and fixes.
          </Text>

          {/* Version badge */}
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>New version available</Text>
          </View>

          {/* Update button */}
          <TouchableOpacity
            style={[styles.updateBtn, downloading && styles.updateBtnDisabled]}
            onPress={onUpdate}
            disabled={downloading}
            activeOpacity={0.8}
          >
            {downloading ? (
              <View style={styles.downloadingRow}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.updateBtnText}>
                  {downloadProgress > 0 ? `${downloadProgress}%` : "Updating..."}
                </Text>
              </View>
            ) : (
              <Text style={styles.updateBtnText}>Update Now</Text>
            )}
          </TouchableOpacity>

          {/* Skip link */}
          {!downloading && (
            <TouchableOpacity style={styles.skipBtn}>
              <Text style={styles.skipText}>Maybe later</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(7,7,13,0.92)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  card: {
    width: SCREEN_WIDTH - 56,
    backgroundColor: Colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 24,
    // Subtle glow
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.cyan + "12",
    borderWidth: 2,
    borderColor: Colors.cyan + "30",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 18,
  },
  versionBadge: {
    backgroundColor: Colors.cyan + "15",
    borderWidth: 1,
    borderColor: Colors.cyan + "30",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.cyan,
    letterSpacing: 0.5,
  },
  updateBtn: {
    width: "100%",
    backgroundColor: Colors.cyan,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  updateBtnDisabled: {
    backgroundColor: Colors.cyan + "80",
  },
  updateBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.black,
    letterSpacing: 0.5,
  },
  downloadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  skipBtn: {
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dim,
  },
});
