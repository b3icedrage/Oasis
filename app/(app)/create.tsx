import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";

export default function CreateScreen() {
  const [caption, setCaption] = useState("");

  const handlePost = () => {
    Alert.alert("Coming Soon", "Photo posting will be available soon!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create</Text>
      </View>

      {/* Camera / Upload area */}
      <View style={styles.uploadArea}>
        <TouchableOpacity style={styles.uploadButton} activeOpacity={0.8}>
          <Text style={styles.uploadIcon}>📷</Text>
          <Text style={styles.uploadText}>Tap to add a photo</Text>
          <Text style={styles.uploadSub}>or drag and drop</Text>
        </TouchableOpacity>
      </View>

      {/* Caption input */}
      <View style={styles.captionContainer}>
        <TextInput
          style={styles.captionInput}
          placeholder="Write a caption... #glitchart"
          placeholderTextColor="#555"
          value={caption}
          onChangeText={setCaption}
          multiline
          maxLength={500}
        />
        <Text style={styles.charCount}>{caption.length}/500</Text>
      </View>

      {/* Effects preview */}
      <View style={styles.effectsRow}>
        <Text style={styles.effectsLabel}>Effects</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["None", "RGB Split", "Pixelate", "Scan Lines", "VHS", "Data Mosh"].map(
            (effect, i) => (
              <TouchableOpacity
                key={effect}
                style={[styles.effectChip, i === 0 && styles.effectChipActive]}
              >
                <Text
                  style={[
                    styles.effectText,
                    i === 0 && styles.effectTextActive,
                  ]}
                >
                  {effect}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>
      </View>

      {/* Post button */}
      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.postButton} onPress={handlePost} activeOpacity={0.8}>
          <Text style={styles.postButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
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
  uploadArea: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2a2a3a",
    borderStyle: "dashed",
    backgroundColor: "#0d0d14",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 280,
  },
  uploadButton: {
    alignItems: "center",
    gap: 8,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e0e0e0",
  },
  uploadSub: {
    fontSize: 13,
    color: "#555",
  },
  captionContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  captionInput: {
    backgroundColor: "#141420",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a3a",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#e0e0e0",
    minHeight: 60,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#555",
    textAlign: "right",
    marginTop: 4,
  },
  effectsRow: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  effectsLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
    marginBottom: 8,
  },
  effectChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#141420",
    borderWidth: 1,
    borderColor: "#2a2a3a",
    marginRight: 8,
  },
  effectChipActive: {
    backgroundColor: "#7c3aed",
    borderColor: "#7c3aed",
  },
  effectText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
  },
  effectTextActive: {
    color: "#fff",
  },
  bottomArea: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  postButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
