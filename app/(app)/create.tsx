import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { Colors } from "../../data/theme";
import { uploadVideo, uploadImage, UploadProgress } from "../../lib/r2";
import {
  HomeIcon,
  SearchIcon,
  BoltIcon,
  BellIcon,
  UserIcon,
  PlusIcon,
  ChevronDown,
  HeartIcon,
  SearchIcon as SearchSvg,
  BoltIcon as BoltSvg,
  BellIcon as BellSvg,
  UserIcon as UserSvg,
} from "../../components/Icons";
import Svg, { Path, Circle, Rect, Line } from "react-native-svg";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type CreateMode = "POST" | "STORY" | "LIVE";
type FlashMode = "off" | "on" | "auto";

// ─── Inline SVG Icons (replacing @expo/vector-icons) ─────────────
function CameraOutlineSvg({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

function CloseSvg({ size = 28, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function FlashOffSvg({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="2" y1="2" x2="22" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function FlashOnSvg({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MoonSvg({ size = 20, color = '#fff', filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
      <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function FlipCameraSvg({ size = 22, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 7l-4-4v3H8a4 4 0 000 8h1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 17l4 4v-3h8a4 4 0 000-8h-1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SparklesSvg({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TextSvg({ size = 22, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 7V4h16v3M9 20h6M12 4v16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BrushSvg({ size = 22, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function StickerSvg({ size = 22, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Path d="M8 14s1.5 2 4 2 4-2 4-2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="9" y1="9" x2="9.01" y2="9" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="15" y1="9" x2="15.01" y2="9" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function GallerySvg({ size = 20, color = '#6b6b8a' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" />
      <Circle cx="8.5" cy="8.5" r="1.5" fill={color} />
      <Path d="M21 15l-5-5L5 21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Recording Indicator ──────────────────────────────────────────
function RecordingIndicator({ seconds }: { seconds: number }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <View style={recStyles.container}>
      <View style={recStyles.dot} />
      <Text style={recStyles.text}>
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </Text>
    </View>
  );
}

const recStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(220,38,38,0.85)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  text: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});

// ─── Upload Progress Overlay ──────────────────────────────────────
function UploadOverlay({ progress }: { progress: UploadProgress }) {
  return (
    <View style={uploadStyles.container}>
      <View style={uploadStyles.card}>
        <ActivityIndicator size="large" color={Colors.cyan} />
        <Text style={uploadStyles.title}>Uploading...</Text>
        <View style={uploadStyles.barBg}>
          <View style={[uploadStyles.barFill, { width: `${progress.percent}%` }]} />
        </View>
        <Text style={uploadStyles.percent}>{progress.percent}%</Text>
      </View>
    </View>
  );
}

const uploadStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(7,7,13,0.85)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  card: {
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 32,
    width: 220,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  barBg: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.dim,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: Colors.cyan,
  },
  percent: {
    color: Colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
});

const GLITCH_FILTERS = [
  { id: "none", label: "None" },
  { id: "rgb-split", label: "RGB Split" },
  { id: "pixelate", label: "Pixelate" },
  { id: "scan-lines", label: "Scan Lines" },
  { id: "vhs", label: "VHS" },
  { id: "data-mosh", label: "Data Mosh" },
  { id: "glitch-art", label: "Glitch Art 2.0" },
  { id: "cyber", label: "Cyber Neon" },
];

// ─── Permission Screen ────────────────────────────────────────────
function PermissionScreen({ onGrant }: { onGrant: () => void }) {
  return (
    <View style={permStyles.container}>
      <View style={permStyles.card}>
        <View style={permStyles.iconCircle}>
          <CameraOutlineSvg size={56} color={Colors.cyan} />
        </View>
        <Text style={permStyles.title}>Camera Access Required</Text>
        <Text style={permStyles.subtitle}>
          GlitchIt needs access to your camera to capture glitch art and share it with the world.
        </Text>
        <TouchableOpacity style={permStyles.grantBtn} onPress={onGrant} activeOpacity={0.8}>
          <CameraOutlineSvg size={18} color={Colors.white} />
          <Text style={permStyles.grantBtnText}>Enable Camera</Text>
        </TouchableOpacity>
        <Text style={permStyles.hint}>
          You can change this anytime in Settings → Permissions
        </Text>
      </View>
    </View>
  );
}

// ─── Camera Tool Button ───────────────────────────────────────────
function CameraTool({
  iconSvg,
  label,
  active,
  onPress,
}: {
  iconSvg: React.ReactNode;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={toolStyles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[toolStyles.iconWrap, active && toolStyles.iconWrapActive]}>
        {iconSvg}
      </View>
      <Text style={[toolStyles.label, active && toolStyles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main Create Screen ───────────────────────────────────────────
export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<any>(null);

  // Permissions
  const [permission, requestPermission] = useCameraPermissions();

  // State
  const [mode, setMode] = useState<CreateMode>("POST");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [frontCamera, setFrontCamera] = useState(true);
  const [nightMode, setNightMode] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("glitch-art");
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [captureMode, setCaptureMode] = useState<"photo" | "video">("photo");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ loaded: 0, total: 0, percent: 0 });
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingRef = useRef<any>(null);

  const toggleFlash = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFlash((prev) => (prev === "off" ? "on" : prev === "on" ? "auto" : "off"));
  }, []);

  const toggleNight = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNightMode((prev) => !prev);
  }, []);

  const toggleCamera = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFrontCamera((prev) => !prev);
  }, []);

  const handleCapture = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (!cameraRef.current) return;

    // Video recording toggle
    if (captureMode === "video") {
      if (isRecording) {
        // Stop recording
        if (recordTimerRef.current) clearInterval(recordTimerRef.current);
        try {
          const video = await recordingRef.current?.stopAsync();
          if (video?.uri) {
            setCapturedUri(video.uri);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        } catch {}
        setIsRecording(false);
        setRecordSeconds(0);
        recordingRef.current = null;
        return;
      }
      // Start recording
      setIsRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
      try {
        recordingRef.current = cameraRef.current.recordAsync({ maxDuration: 60 });
      } catch {
        setIsRecording(false);
        if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      }
      return;
    }

    // Photo capture
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        skipProcessing: false,
      });
      if (photo?.uri) {
        setCapturedUri(photo.uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      // Camera capture failed — still usable for demo
    }
  }, [captureMode, isRecording]);

  const handlePermissionGrant = useCallback(async () => {
    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert(
        "Permission Denied",
        "Camera access is required to create posts. Please enable it in your device settings.",
      );
    }
  }, [requestPermission]);

  // Not yet determined
  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDot} />
      </View>
    );
  }

  // Denied
  if (!permission.granted) {
    return <PermissionScreen onGrant={handlePermissionGrant} />;
  }

  // ─── Camera Captured Preview ────────────────────────────────
  if (capturedUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedUri }} style={styles.capturedImage} resizeMode="cover" />

        {/* Top overlay with close and share */}
        <SafeAreaView style={styles.capturedTopBar} edges={["top"]}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              setCapturedUri(null);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <CloseSvg size={28} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.shareBtn, uploading && styles.shareBtnDisabled]}
            disabled={uploading}
            onPress={async () => {
              if (uploading) return;
              setUploading(true);
              setUploadProgress({ loaded: 0, total: 0, percent: 0 });
              try {
                const isVideo = capturedUri?.includes(".mp4") || capturedUri?.includes("video");
                const uploadFn = isVideo ? uploadVideo : uploadImage;
                const result = await uploadFn(capturedUri!, (p) => setUploadProgress(p));
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert("Shared!", "Your glitch art has been uploaded!", [
                  { text: "OK", onPress: () => setCapturedUri(null) },
                ]);
              } catch (err: any) {
                Alert.alert("Upload Failed", err?.message || "Something went wrong. Try again.");
              } finally {
                setUploading(false);
              }
            }}
          >
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* Filter strip at bottom of preview */}
        <View style={styles.capturedFiltersWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.capturedFiltersContent}
          >
            {GLITCH_FILTERS.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.capturedFilterChip, selectedFilter === f.id && styles.capturedFilterActive]}
                onPress={() => {
                  setSelectedFilter(f.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text
                  style={[
                    styles.capturedFilterText,
                    selectedFilter === f.id && styles.capturedFilterTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom tool strip */}
        <View style={styles.capturedBottomTools}>
          <TouchableOpacity style={styles.capturedToolBtn}>
            <TextSvg size={22} color={Colors.white} />
            <Text style={styles.capturedToolLabel}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.capturedToolBtn}>
            <BrushSvg size={22} color={Colors.white} />
            <Text style={styles.capturedToolLabel}>Draw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.capturedToolBtn}>
            <StickerSvg size={22} color={Colors.white} />
            <Text style={styles.capturedToolLabel}>Stickers</Text>
          </TouchableOpacity>
        </View>

        {/* Upload progress overlay */}
        {uploading && <UploadOverlay progress={uploadProgress} />}
      </View>
    );
  }

  // ─── Live Camera View ───────────────────────────────────────
  const flashMap: Record<FlashMode, string> = { off: "off", on: "on", auto: "auto" };

  return (
    <View style={styles.container}>
      {/* Full-screen camera */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={frontCamera ? "front" : "back"}
        flash={flashMap[flash] as any}
        enableTorch={nightMode}
      />

      {/* Gradient overlays for readability */}
      <View style={styles.topGradient} />
      <View style={styles.bottomGradient} />

      {/* ─── Header ─────────────────────────────────────────────── */}
      <SafeAreaView style={styles.headerSafe} edges={["top"]}>
        <View style={styles.headerRow}>
          {/* Left: Avatar + Username */}
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>G</Text>
            </View>
            <Text style={styles.headerUsername}>@CosmicGlitcher</Text>
            <ChevronDown size={14} color={Colors.white} />
          </View>

          {/* Right: Camera tools */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={toggleFlash}>
              {flash !== "off" ? (
                <FlashOnSvg size={20} color={Colors.cyan} />
              ) : (
                <FlashOffSvg size={20} color={Colors.white} />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn} onPress={toggleNight}>
              <MoonSvg size={20} color={nightMode ? Colors.cyan : Colors.white} filled={nightMode} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn} onPress={toggleCamera}>
              <FlipCameraSvg size={22} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerIconBtn, styles.effectsIconActive]}
              onPress={() => {
                setFilterDrawerOpen((prev) => !prev);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <SparklesSvg size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* ─── Mode Tabs ──────────────────────────────────────────── */}
      <View style={styles.modeTabsContainer}>
        <View style={styles.modeTabs}>
          {(["POST", "STORY", "LIVE"] as CreateMode[]).map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.modeTab, mode === m && styles.modeTabActive]}
              onPress={() => {
                setMode(m);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={[styles.modeTabText, mode === m && styles.modeTabTextActive]}>{m}</Text>
              {mode === m && <View style={styles.modeTabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ─── Filter Drawer (when effects button tapped) ─────────── */}
      {filterDrawerOpen && (
        <View style={styles.filterDrawer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterDrawerContent}
          >
            {GLITCH_FILTERS.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterDrawerChip, selectedFilter === f.id && styles.filterDrawerChipActive]}
                onPress={() => {
                  setSelectedFilter(f.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text
                  style={[
                    styles.filterDrawerText,
                    selectedFilter === f.id && styles.filterDrawerTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ─── Bottom Controls ────────────────────────────────────── */}
      <View style={[styles.bottomControls, { paddingBottom: insets.bottom + 12 }]}>
        {/* Camera tools row */}
        <View style={styles.toolsRow}>
          <CameraTool
            iconSvg={flash !== "off" ? <FlashOnSvg size={22} color={Colors.cyan} /> : <FlashOffSvg size={22} color={Colors.muted} />}
            label={`Flash (${flash === "off" ? "Off" : "On"})`}
            active={flash !== "off"}
            onPress={toggleFlash}
          />
          <CameraTool
            iconSvg={<MoonSvg size={22} color={nightMode ? Colors.white : Colors.muted} filled={nightMode} />}
            label="Night Mode"
            active={nightMode}
            onPress={toggleNight}
          />
          <CameraTool
            iconSvg={<FlipCameraSvg size={22} color={Colors.muted} />}
            label="Camera"
            onPress={toggleCamera}
          />
          <CameraTool
            iconSvg={<SparklesSvg size={22} color={filterDrawerOpen ? Colors.white : Colors.muted} />}
            label="Filters"
            active={filterDrawerOpen}
            onPress={() => {
              setFilterDrawerOpen((prev) => !prev);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
        </View>

        {/* Selected filter preview label */}
        <View style={styles.filterPreviewRow}>
          <Text style={styles.filterPreviewText}>
            {GLITCH_FILTERS.find((f) => f.id === selectedFilter)?.label || "Glitch Art 2.0"}
          </Text>
        </View>

        {/* Photo / Video mode toggle */}
        <View style={styles.captureModeRow}>
          <TouchableOpacity
            onPress={() => setCaptureMode("photo")}
            style={[styles.captureModeBtn, captureMode === "photo" && styles.captureModeBtnActive]}
          >
            <Text style={[styles.captureModeText, captureMode === "photo" && styles.captureModeTextActive]}>PHOTO</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCaptureMode("video")}
            style={[styles.captureModeBtn, captureMode === "video" && styles.captureModeBtnActive]}
          >
            <Text style={[styles.captureModeText, captureMode === "video" && styles.captureModeTextActive]}>VIDEO</Text>
          </TouchableOpacity>
        </View>

        {/* Shutter + bottom tools */}
        <View style={styles.shutterRow}>
          {/* Gallery thumbnail */}
          <TouchableOpacity style={styles.galleryThumb}>
            <View style={styles.galleryThumbInner}>
              <GallerySvg size={20} color={Colors.muted} />
            </View>
          </TouchableOpacity>

          {/* Center - Shutter / Record button */}
          <View style={styles.bottomToolsCenter}>
            {isRecording && <RecordingIndicator seconds={recordSeconds} />}
            <TouchableOpacity
              style={styles.shutterBtn}
              onPress={handleCapture}
              activeOpacity={0.7}
            >
              {captureMode === "video" ? (
                <View style={[styles.shutterOuter, isRecording && styles.shutterOuterRecording]}>
                  {isRecording ? (
                    <View style={styles.stopIcon} />
                  ) : (
                    <View style={styles.recordDot} />
                  )}
                </View>
              ) : (
                <View style={styles.shutterOuter}>
                  <View style={styles.shutterInner} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Right side - close */}
          <TouchableOpacity
            style={styles.closeCapture}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert("Discard", "Are you sure you want to discard?", [
                { text: "Cancel", style: "cancel" },
                { text: "Discard", style: "destructive" },
              ]);
            }}
          >
            <CloseSvg size={28} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Bottom tool strip */}
        <View style={styles.bottomToolStrip}>
          <View style={styles.bottomToolItem}>
            <View style={styles.bottomToolThumbSmall}>
              <GallerySvg size={14} color={Colors.muted} />
            </View>
          </View>
          <TouchableOpacity style={styles.bottomToolItem}>
            <Text style={styles.bottomToolText}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomToolItem}>
            <Text style={styles.bottomToolText}>Draw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomToolItem}>
            <Text style={styles.bottomToolText}>Stickers</Text>
          </TouchableOpacity>
          <View style={styles.bottomToolItem}>
            <View style={styles.bottomToolThumbSmall}>
              <SparklesSvg size={14} color={Colors.muted} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.cyan,
  },

  // ─── Captured preview ───────────────────────────────────────
  capturedImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  capturedTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    zIndex: 10,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  shareBtn: {
    backgroundColor: Colors.cyan,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  shareBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  capturedFiltersWrap: {
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
  },
  capturedFiltersContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  capturedFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  capturedFilterActive: {
    backgroundColor: Colors.cyan,
    borderColor: Colors.cyan,
  },
  capturedFilterText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  capturedFilterTextActive: {
    color: Colors.white,
  },
  capturedBottomTools: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    zIndex: 10,
  },
  capturedToolBtn: {
    alignItems: "center",
    gap: 4,
  },
  capturedToolLabel: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
  },

  // ─── Camera gradient overlays ───────────────────────────────
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 2,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 320,
    backgroundColor: "rgba(0,0,0,0.55)",
    zIndex: 2,
  },

  // ─── Header ─────────────────────────────────────────────────
  headerSafe: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 8,
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
    backgroundColor: Colors.purple,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  headerAvatarText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  headerUsername: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  effectsIconActive: {
    backgroundColor: Colors.purple,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },

  // ─── Mode Tabs ──────────────────────────────────────────────
  modeTabsContainer: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  modeTabs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
  },
  modeTab: {
    alignItems: "center",
    paddingVertical: 6,
  },
  modeTabActive: {},
  modeTabText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
  modeTabTextActive: {
    color: Colors.white,
  },
  modeTabIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.white,
    marginTop: 4,
  },

  // ─── Filter Drawer ──────────────────────────────────────────
  filterDrawer: {
    position: "absolute",
    bottom: 240,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  filterDrawerContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filterDrawerChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  filterDrawerChipActive: {
    backgroundColor: Colors.cyan,
    borderColor: Colors.cyan,
  },
  filterDrawerText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontWeight: "600",
  },
  filterDrawerTextActive: {
    color: Colors.white,
  },

  // ─── Bottom Controls ────────────────────────────────────────
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  toolsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  filterPreviewRow: {
    alignItems: "center",
    paddingVertical: 4,
    marginBottom: 8,
  },
  filterPreviewText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  shutterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  galleryThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    overflow: "hidden",
  },
  galleryThumbInner: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomToolsCenter: {
    alignItems: "center",
  },
  shutterBtn: {
    padding: 4,
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  closeCapture: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ─── Bottom Tool Strip ──────────────────────────────────────
  bottomToolStrip: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  bottomToolItem: {
    alignItems: "center",
  },
  bottomToolText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  bottomToolThumbSmall: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Capture mode toggle
  captureModeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 8,
  },
  captureModeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  captureModeBtnActive: {},
  captureModeText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  captureModeTextActive: {
    color: Colors.white,
  },

  // Video recording shutter
  shutterOuterRecording: {
    borderColor: "#ef4444",
  },
  recordDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ef4444",
  },
  stopIcon: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: "#ef4444",
  },

  // Disabled share button
  shareBtnDisabled: {
    opacity: 0.5,
  },
});

// ─── Camera Tool Styles ───────────────────────────────────────────
const toolStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 6,
    width: 72,
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  iconWrapActive: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.25)",
  },
  label: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
  },
  labelActive: {
    color: Colors.white,
  },
});

// ─── Permission Screen Styles ─────────────────────────────────────
const permStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  card: {
    alignItems: "center",
    gap: 20,
    maxWidth: 320,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.cyan + "15",
    borderWidth: 1,
    borderColor: Colors.cyan + "30",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: Colors.muted,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  grantBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.cyan,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  grantBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  hint: {
    color: Colors.dim,
    fontSize: 12,
    textAlign: "center",
  },
});
