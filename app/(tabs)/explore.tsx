import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../data/theme';
import { exploreGrid } from '../../data/mockData';
import { lightImpact } from '../../hooks/useHaptics';

const categories = ['For You', 'Glitch Art', 'Cyberpunk', 'Neon', 'Digital', 'Retro'];

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('For You');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color={Colors.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={Colors.dim}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContent}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => { setActive(cat); lightImpact(); }}
            style={[styles.catBtn, active === cat && styles.catBtnActive]}
          >
            <Text style={[styles.catText, active === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {exploreGrid.map((item, i) => (
          <TouchableOpacity key={item.id} style={[styles.gridItem, i % 5 === 0 && styles.gridLarge]} onPress={() => lightImpact()}>
            <Image source={{ uri: item.image }} style={styles.gridImg} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, marginHorizontal: 12, marginTop: 8, borderWidth: 1, borderColor: Colors.border },
  searchIcon: { marginLeft: 10 },
  searchInput: { flex: 1, height: 36, paddingHorizontal: 8, color: Colors.white, fontSize: 14 },
  catScroll: { maxHeight: 44 },
  catContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  catBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  catBtnActive: { backgroundColor: Colors.cyan + '15', borderColor: Colors.cyan + '40' },
  catText: { color: Colors.muted, fontSize: 12, fontWeight: '500' },
  catTextActive: { color: Colors.cyan },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, padding: 2 },
  gridItem: { width: '32.6%', aspectRatio: 1, backgroundColor: Colors.surface },
  gridLarge: { width: '65.8%', aspectRatio: 2 },
  gridImg: { width: '100%', height: '100%' },
});
