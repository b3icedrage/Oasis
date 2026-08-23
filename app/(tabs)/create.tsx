import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../data/theme';
import { mediumImpact, successNotification } from '../../hooks/useHaptics';

const filters = ['None', 'Glitch', 'Neon', 'Cyber', 'Retro', 'Void'];
const filterStyles: Record<string, string> = {
  None: '',
  Glitch: 'hue-rotate(180deg) saturate(1.5)',
  Neon: 'brightness(1.25) saturate(2) hue-rotate(60deg)',
  Cyber: 'sepia(0.3) hue-rotate(180deg) saturate(1.5)',
  Retro: 'sepia(0.5) brightness(0.9)',
  Void: 'brightness(0.75) contrast(1.5) saturate(0.5)',
};

export default function CreateScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [filter, setFilter] = useState('None');

  const pickImage = async (fromCamera: boolean) => {
    mediumImpact();
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.9, allowsEditing: true })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.9, allowsEditing: true });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
      successNotification();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        {image ? (
          <TouchableOpacity onPress={() => { setImage(null); setCaption(''); setFilter('None'); }}>
            <Ionicons name="close" size={26} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <Text style={styles.headerTitle}>New Post</Text>
        )}
        {image && (
          <TouchableOpacity onPress={() => { successNotification(); setImage(null); setCaption(''); }}>
            <Text style={styles.shareBtn}>Share</Text>
          </TouchableOpacity>
        )}
      </View>

      {!image ? (
        <View style={styles.empty}>
          <View style={styles.iconWrap}>
            <Ionicons name="camera" size={44} color={Colors.cyan} />
          </View>
          <Text style={styles.emptyTitle}>Create a new post</Text>
          <Text style={styles.emptySub}>Share your glitch art with the world</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => pickImage(true)}>
              <Ionicons name="camera" size={16} color={Colors.white} />
              <Text style={styles.primaryBtnText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => pickImage(false)}>
              <Ionicons name="images" size={16} color={Colors.white} />
              <Text style={styles.secondaryBtnText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView>
          <Image source={{ uri: image }} style={styles.preview} resizeMode="cover" />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
            {filters.map((f) => (
              <TouchableOpacity key={f} onPress={() => { setFilter(f); mediumImpact(); }} style={styles.filterItem}>
                <Image source={{ uri: image }} style={[styles.filterThumb, filter === f && styles.filterActive]} resizeMode="cover" />
                <Text style={[styles.filterLabel, filter === f && styles.filterLabelActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.captionRow}>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarText}>G</Text>
            </View>
            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption..."
              placeholderTextColor={Colors.dim}
              value={caption}
              onChangeText={setCaption}
              multiline
            />
          </View>

          {['Tag people', 'Add location', 'Add music'].map((opt) => (
            <TouchableOpacity key={opt} style={styles.optionRow} onPress={() => mediumImpact()}>
              <Text style={styles.optionText}>{opt}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.dim} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { color: Colors.white, fontSize: 17, fontWeight: '600' },
  shareBtn: { color: Colors.cyan, fontSize: 16, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  iconWrap: { width: 100, height: 100, borderRadius: 28, backgroundColor: Colors.cyan + '20', borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: Colors.white, fontSize: 18, fontWeight: '600' },
  emptySub: { color: Colors.muted, fontSize: 14 },
  btnRow: { flexDirection: 'row', gap: 12 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.cyan, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  primaryBtnText: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  secondaryBtnText: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  preview: { width: '100%', aspectRatio: 1, backgroundColor: Colors.surface },
  filterScroll: { maxHeight: 90 },
  filterContent: { padding: 12, gap: 12 },
  filterItem: { alignItems: 'center', gap: 4 },
  filterThumb: { width: 60, height: 60, borderRadius: 8, borderWidth: 2, borderColor: 'transparent' },
  filterActive: { borderColor: Colors.cyan },
  filterLabel: { color: Colors.muted, fontSize: 10 },
  filterLabelActive: { color: Colors.cyan },
  captionRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  avatarSmall: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.cyan, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  captionInput: { flex: 1, color: Colors.white, fontSize: 14, minHeight: 60 },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  optionText: { color: Colors.white, fontSize: 14 },
});
