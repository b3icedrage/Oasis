import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../data/theme';
import { Avatar } from '../../components/Avatar';
import { currentUser, feedPosts, users } from '../../data/mockData';
import { lightImpact } from '../../hooks/useHaptics';

const highlights = [
  { name: 'Travel', emoji: '✈️' },
  { name: 'Art', emoji: '🎨' },
  { name: 'Code', emoji: '💻' },
  { name: 'Music', emoji: '🎵' },
  { name: 'Glitch', emoji: '⚡' },
];

export default function ProfileScreen() {
  const [tab, setTab] = useState<'posts' | 'reels' | 'saved'>('posts');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{currentUser.username}</Text>
        <Ionicons name="settings-outline" size={22} color={Colors.white} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileRow}>
          <Avatar color={currentUser.avatarColor} username={currentUser.username} size={76} hasStory />
          <View style={styles.statsRow}>
            {[
              { label: 'Posts', value: currentUser.posts },
              { label: 'Followers', value: currentUser.followers },
              { label: 'Following', value: currentUser.following },
            ].map((s) => (
              <View key={s.label} style={styles.stat}>
                <Text style={styles.statValue}>{s.value.toLocaleString()}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bioSection}>
          <Text style={styles.displayName}>{currentUser.displayName}</Text>
          <Text style={styles.bio}>{currentUser.bio}</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionBtnText}>Edit profile</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionBtnText}>Share profile</Text></TouchableOpacity>
        </View>

        {/* Highlights */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlightRow}>
          {highlights.map((h) => (
            <View key={h.name} style={styles.highlightItem}>
              <View style={styles.highlightCircle}>
                <Text style={styles.highlightEmoji}>{h.emoji}</Text>
              </View>
              <Text style={styles.highlightName}>{h.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {(['posts', 'reels', 'saved'] as const).map((t) => (
            <TouchableOpacity key={t} onPress={() => { setTab(t); lightImpact(); }} style={[styles.tabBtn, tab === t && styles.tabActive]}>
              <Ionicons name={t === 'posts' ? 'grid' : t === 'reels' ? 'film' : 'bookmark'} size={22} color={tab === t ? Colors.white : Colors.dim} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {feedPosts.map((post) => (
            <TouchableOpacity key={post.id} style={styles.gridItem} onPress={() => lightImpact()}>
              <Image source={{ uri: post.image }} style={styles.gridImg} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Suggested */}
        <Text style={styles.sectionTitle}>Suggested for you</Text>
        {users.slice(3, 8).map((u) => (
          <View key={u.id} style={styles.suggestedRow}>
            <Avatar color={u.avatarColor} username={u.username} size={44} hasStory />
            <View style={styles.suggestedInfo}>
              <View style={styles.suggestedNameRow}>
                <Text style={styles.suggestedName}>{u.username}</Text>
                {u.isVerified && <Text style={styles.verified}>✓</Text>}
              </View>
              <Text style={styles.suggestedBio}>{u.bio}</Text>
            </View>
            <TouchableOpacity onPress={() => lightImpact()}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { color: Colors.white, fontSize: 17, fontWeight: '600' },
  profileRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, gap: 24 },
  statsRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statValue: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  statLabel: { color: Colors.muted, fontSize: 12 },
  bioSection: { paddingHorizontal: 16, paddingTop: 10 },
  displayName: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  bio: { color: Colors.text, fontSize: 14, marginTop: 2 },
  actionRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, paddingTop: 12 },
  actionBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  actionBtnText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  highlightRow: { paddingHorizontal: 16, paddingVertical: 14, gap: 16 },
  highlightItem: { alignItems: 'center', gap: 4, width: 68 },
  highlightCircle: { width: 62, height: 62, borderRadius: 31, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  highlightEmoji: { fontSize: 22 },
  highlightName: { color: Colors.muted, fontSize: 11 },
  tabRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.border, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.white },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  gridItem: { width: '32.8%', aspectRatio: 1, backgroundColor: Colors.surface },
  gridImg: { width: '100%', height: '100%' },
  sectionTitle: { color: Colors.white, fontSize: 14, fontWeight: '600', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  suggestedRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, gap: 10 },
  suggestedInfo: { flex: 1 },
  suggestedNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  suggestedName: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  verified: { color: Colors.cyan, fontSize: 12 },
  suggestedBio: { color: Colors.muted, fontSize: 12 },
  followText: { color: Colors.cyan, fontSize: 13, fontWeight: '600' },
});
