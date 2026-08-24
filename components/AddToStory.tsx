import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Svg, { Path, Circle, Rect, Line } from "react-native-svg";

// Safe native module imports
let MediaLibrary: any = null;
let SortBy: any = null;
let Haptics: any = null;

try {
  MediaLibrary = require("expo-media-library/legacy");
  SortBy = MediaLibrary.SortBy;
} catch (e) {
  console.warn("expo-media-library/legacy not available:", e);
  // Try the main export as fallback
  try {
    MediaLibrary = require("expo-media-library");
    SortBy = MediaLibrary.SortBy;
  } catch (e2) {
    console.warn("expo-media-library not available:", e2);
  }
}

try {
  Haptics = require("expo-haptics");
} catch (e) {
  console.warn("expo-haptics not available:", e);
}

function safeHaptic(style?: any) {
  try {
    if (Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {}
}

function safeHapticMedium() {
  try {
    if (Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {}
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const GRID_COLUMNS = 3;
const GRID_GAP = 2;
const CELL_SIZE = (SCREEN_WIDTH - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

// ─── SVG Icons ────────────────────────────────────────────────────
function CloseIcon({ size = 24, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function SettingsIcon({ size = 24, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
      <Path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CameraIcon({ size = 36, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

function GridIcon({ size = 18, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
      <Rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
      <Rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
      <Rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

function MusicNoteIcon({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18V5l12-2v13"
        stroke="#ff6b6b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="6" cy="18" r="3" stroke="#ff6b6b" strokeWidth="2" />
      <Circle cx="18" cy="16" r="3" stroke="#ff6b6b" strokeWidth="2" />
    </Svg>
  );
}

function CollageIcon({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="2" width="9" height="9" rx="2" stroke="#a855f7" strokeWidth="2" />
      <Rect x="13" y="2" width="9" height="9" rx="2" stroke="#00e5ff" strokeWidth="2" />
      <Rect x="2" y="13" width="9" height="9" rx="2" stroke="#00ff88" strokeWidth="2" />
      <Rect x="13" y="13" width="9" height="9" rx="2" stroke="#ff00aa" strokeWidth="2" />
    </Svg>
  );
}

function ChevronDownIcon({ size = 14, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Quick Action Card ────────────────────────────────────────────
function QuickActionCard({
  icon,
  label,
  gradient,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  gradient: string[];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={quickStyles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[quickStyles.iconWrap, { backgroundColor: gradient[0] + "20" }]}>
        {icon}
      </View>
      <Text style={quickStyles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const quickStyles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1a1a2a",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#2a2a3a",
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#e0e0f0",
  },
});

// ─── Main AddToStory Component ────────────────────────────────────
interface AddToStoryProps {
  visible: boolean;
  onClose: () => void;
}

interface SimpleAsset {
  uri: string;
  id: string;
  mediaType?: string;
}

export default function AddToStory({ visible, onClose }: AddToStoryProps) {
  const [mediaAssets, setMediaAssets] = useState<SimpleAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Request gallery permission and load recent photos
  const loadGallery = useCallback(async () => {
    if (!MediaLibrary) {
      // No media library available — just show empty state
      setHasPermission(false);
      return;
    }

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");

      if (status !== "granted") return;

      setLoading(true);
      try {
        const result = await MediaLibrary.getAssetsAsync({
          first: 60,
          mediaType: ["photo", "video"],
          sortBy: SortBy ? [SortBy.creationTime] : undefined,
        });
        setMediaAssets(
          (result.assets || []).map((a: any) => ({
            uri: a.uri,
            id: a.id,
            mediaType: a.mediaType,
          }))
        );
      } catch {
        // Permission denied or error
      } finally {
        setLoading(false);
      }
    } catch {
      setHasPermission(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      loadGallery();
    }
  }, [visible, loadGallery]);

  const handleAssetPress = (asset: SimpleAsset) => {
    safeHaptic();
    // TODO: navigate to story editor with selected asset
    onClose();
  };

  const handleCameraPress = () => {
    safeHapticMedium();
    // TODO: open camera for story capture
    onClose();
  };

  const handleTemplatePress = () => {
    safeHaptic();
    // TODO: open templates picker
  };

  const handleMusicPress = () => {
    safeHaptic();
    // TODO: open music picker
  };

  const handleCollagePress = () => {
    safeHaptic();
    // TODO: open collage maker
  };

  const renderAsset = ({ item, index }: { item: SimpleAsset; index: number }) => {
    // First cell is the camera button
    if (index === 0) {
      return (
        <TouchableOpacity style={styles.cameraCell} onPress={handleCameraPress} activeOpacity={0.8}>
          <View style={styles.cameraIconWrap}>
            <CameraIcon size={36} color="#fff" />
          </View>
          <Text style={styles.cameraLabel}>Camera</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.assetCell}
        onPress={() => handleAssetPress(item)}
        activeOpacity={0.85}
      >
        <Image source={{ uri: item.uri }} style={styles.assetImage} resizeMode="cover" />
        {item.mediaType === "video" && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>▶</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {/* ─── Header ──────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={onClose}>
            <CloseIcon size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add to story</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <SettingsIcon size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ─── Quick Actions ───────────────────────────────────── */}
        <View style={styles.quickActions}>
          <QuickActionCard
            icon={
              <View style={{ flexDirection: "row", gap: -4 }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "#ff00aa", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 14, fontWeight: "800", color: "#fff" }}>S</Text>
                </View>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "#7c3aed", alignItems: "center", justifyContent: "center", marginLeft: -8 }}>
                  <Text style={{ fontSize: 14, fontWeight: "800", color: "#fff" }}>✦</Text>
                </View>
              </View>
            }
            label="Templates"
            gradient={["#ff00aa", "#7c3aed"]}
            onPress={handleTemplatePress}
          />
          <QuickActionCard
            icon={<MusicNoteIcon size={32} />}
            label="Music"
            gradient={["#ff6b6b", "#ff8e53"]}
            onPress={handleMusicPress}
          />
          <QuickActionCard
            icon={<CollageIcon size={32} />}
            label="Collage"
            gradient={["#a855f7", "#00e5ff"]}
            onPress={handleCollagePress}
          />
        </View>

        {/* ─── Recents Header ──────────────────────────────────── */}
        <View style={styles.recentsHeader}>
          <TouchableOpacity style={styles.recentsLeft}>
            <Text style={styles.recentsTitle}>Recents</Text>
            <ChevronDownIcon size={16} color="#e0e0f0" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectBtn}>
            <GridIcon size={16} color="#e0e0f0" />
            <Text style={styles.selectText}>Select</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Gallery Grid ────────────────────────────────────── */}
        {!MediaLibrary ? (
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>
              Gallery access is needed to add photos to your story.
            </Text>
            <Text style={[styles.permissionText, { marginTop: 8, fontSize: 13 }]}>
              Please install expo-media-library to enable this feature.
            </Text>
          </View>
        ) : loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#a855f7" />
            <Text style={styles.loadingText}>Loading gallery...</Text>
          </View>
        ) : hasPermission === false ? (
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>
              Gallery access is needed to add photos to your story.
            </Text>
            <TouchableOpacity style={styles.permissionBtn} onPress={loadGallery}>
              <Text style={styles.permissionBtnText}>Grant Access</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={[{ uri: "camera", id: "camera" } as SimpleAsset, ...mediaAssets]}
            renderItem={renderAsset}
            keyExtractor={(item, index) => (item.id || item.uri) + "_" + index}
            numColumns={GRID_COLUMNS}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.gridRow}
          />
        )}
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07070d",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 52,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a2a",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#e0e0f0",
  },

  // Quick Actions
  quickActions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 8,
  },

  // Recents Header
  recentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recentsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  recentsTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#e0e0f0",
  },
  selectBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1a1a2a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2a2a3a",
  },
  selectText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e0e0f0",
  },

  // Grid
  gridContent: {
    paddingBottom: 40,
  },
  gridRow: {
    gap: GRID_GAP,
  },
  assetCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    position: "relative",
  },
  assetImage: {
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  durationBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    fontVariant: ["tabular-nums"],
  },

  // Camera Cell
  cameraCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: "#1a1a2a",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#2a2a3a",
  },
  cameraIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(168,85,247,0.15)",
    borderWidth: 1.5,
    borderColor: "rgba(168,85,247,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#888",
  },

  // Loading / Permission
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#888",
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  permissionText: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },
  permissionBtn: {
    backgroundColor: "#a855f7",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
