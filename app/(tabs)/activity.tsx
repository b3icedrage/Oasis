import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../data/theme';
import { Avatar } from '../../components/Avatar';
import { notifications } from '../../data/mockData';

export default function ActivityScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Follow Suggestions */}
        <Text style={styles.sectionTitle}>Suggested for you</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestRow}>
          {notifications.filter((n) => n.type === 'follow').map((n) => (
            <View key={n.id} style={styles.suggestCard}>
              <Avatar color={n.avatarColor} username={n.user} size={50} hasStory />
              <Text style={styles.suggestName}>{n.user}</Text>
              <View style={styles.followBtn}>
                <Text style={styles.followBtnText}>Follow</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Today */}
        <Text style={styles.sectionTitle}>Today</Text>
        {notifications.slice(0, 4).map((n) => (
          <View key={n.id} style={styles.notifRow}>
            <Avatar color={n.avatarColor} username={n.user} size={36} hasStory />
            <View style={styles.notifText}>
              <Text style={styles.notifBody}>
                <Text style={styles.notifUser}>{n.user} </Text>{n.text}
              </Text>
              <Text style={styles.notifTime}>{n.timeAgo}</Text>
            </View>
            {n.postImage && <Image source={{ uri: n.postImage }} style={styles.notifThumb} />}
          </View>
        ))}

        {/* This Week */}
        <Text style={styles.sectionTitle}>This week</Text>
        {notifications.slice(4).map((n) => (
          <View key={n.id} style={styles.notifRow}>
            <Avatar color={n.avatarColor} username={n.user} size={36} hasStory />
            <View style={styles.notifText}>
              <Text style={styles.notifBody}>
                <Text style={styles.notifUser}>{n.user} </Text>{n.text}
              </Text>
              <Text style={styles.notifTime}>{n.timeAgo}</Text>
            </View>
            {n.postImage && <Image source={{ uri: n.postImage }} style={styles.notifThumb} />}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { color: Colors.white, fontSize: 17, fontWeight: '600' },
  sectionTitle: { color: Colors.white, fontSize: 14, fontWeight: '600', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  suggestRow: { paddingHorizontal: 16, gap: 12, paddingBottom: 8 },
  suggestCard: { alignItems: 'center', gap: 6, padding: 12, borderRadius: 12, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, minWidth: 110 },
  suggestName: { color: Colors.white, fontSize: 12, fontWeight: '600' },
  followBtn: { backgroundColor: Colors.cyan + '20', borderWidth: 1, borderColor: Colors.cyan + '40', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  followBtnText: { color: Colors.cyan, fontSize: 12, fontWeight: '600' },
  notifRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  notifText: { flex: 1 },
  notifBody: { color: Colors.text, fontSize: 13 },
  notifUser: { fontWeight: '600', color: Colors.white },
  notifTime: { color: Colors.dim, fontSize: 11, marginTop: 2 },
  notifThumb: { width: 40, height: 40, borderRadius: 6 },
});
