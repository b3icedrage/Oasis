import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import * as Haptics from "expo-haptics";
import { Colors } from "../data/theme";
import Svg, { Path } from "react-native-svg";


const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Play/Pause SVG Icons ──────────────────────────────────────────
function PlayIcon({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 5v14l11-7z"
        fill={Colors.white}
        stroke={Colors.white}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PauseIcon({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 4h4v16H6zM14 4h4v16h-4z" fill={Colors.white} />
    </Svg>
  );
}

function MuteIcon({ size = 20, muted }: { size?: number; muted: boolean }) {
  if (muted) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M11 5L6 9H2v6h4l5 4V5z"
          stroke={Colors.white}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M23 9l-6 6M17 9l6 6"
          stroke={Colors.white}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 5L6 9H2v6h4l5 4V5z"
        stroke={Colors.white}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"
        stroke={Colors.white}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Video Player Component ────────────────────────────────────────
interface VideoPlayerProps {
  uri: string;
  posterUri?: string;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  style?: object;
}

export default function VideoPlayer({
  uri,
  posterUri,
  width = SCREEN_WIDTH,
  height = SCREEN_WIDTH,
  autoPlay = false,
  loop = true,
  showControls = true,
  style,
}: VideoPlayerProps) {
  const videoRef = useRef<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [showPlayOverlay, setShowPlayOverlay] = useState(!autoPlay);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
      setShowPlayOverlay(true);
    } else {
      await videoRef.current.playAsync();
      setIsPlaying(true);
      setShowPlayOverlay(false);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(async () => {
    if (!videoRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await videoRef.current.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  }, [isMuted]);

  const onPlaybackStatusUpdate = useCallback((playbackStatus: any) => {
    setStatus(playbackStatus);
    if (playbackStatus.isLoaded) {
      setIsLoading(false);
      setIsPlaying(playbackStatus.isPlaying);
    }
    if (playbackStatus.didJustFinish) {
      setShowPlayOverlay(true);
      setIsPlaying(false);
    }
  }, []);

  return (
    <View style={[{ width, height }, style]}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={[styles.video, { width, height }]}
        resizeMode={ResizeMode.COVER}
        isLooping={loop}
        isMuted={isMuted}
        shouldPlay={autoPlay}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        usePoster={!!posterUri}
        posterSource={posterUri ? { uri: posterUri } : undefined}
      />

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.overlayCenter}>
          <ActivityIndicator size="large" color={Colors.cyan} />
        </View>
      )}

      {/* Error state */}
      {hasError && (
        <View style={styles.overlayCenter}>
          <Text style={styles.errorText}>Failed to load video</Text>
        </View>
      )}

      {/* Play/Pause overlay */}
      {showControls && showPlayOverlay && !isLoading && !hasError && (
        <TouchableOpacity
          style={styles.playOverlay}
          onPress={togglePlay}
          activeOpacity={0.8}
        >
          <View style={styles.playCircle}>
            <PlayIcon size={40} />
          </View>
        </TouchableOpacity>
      )}

      {/* Tap to toggle play (when video is playing) */}
      {isPlaying && !isLoading && (
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={togglePlay}
          activeOpacity={1}
        />
      )}

      {/* Mute button — top right */}
      {showControls && !isLoading && !hasError && (
        <TouchableOpacity
          style={styles.muteBtn}
          onPress={toggleMute}
          activeOpacity={0.7}
        >
          <MuteIcon size={18} muted={isMuted} />
        </TouchableOpacity>
      )}

      {/* Video duration / progress */}
      {status?.isLoaded && status?.durationMillis && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${
                    (status.positionMillis / status.durationMillis) * 100
                  }%`,
                },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  video: {
    backgroundColor: "#000",
  },
  overlayCenter: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  playOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  playCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  muteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: Colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  progressContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  progressBarBg: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.cyan,
  },
});
