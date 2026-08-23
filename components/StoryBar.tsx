import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../data/theme';
import { Avatar } from './Avatar';
import { stories } from '../data/mockData';
import { lightImpact } from '../hooks/useHaptics';

export function StoryBar() {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {stories.map((story) => (
          <TouchableOpacity key={story.id} style={styles.item} onPress={() => lightImpact()}>
            <Avatar
              color={story.avatarColor}
              username={story.username}
              size={58}
              hasStory={story.id !== 'me'}
              isMe={story.id === 'me'}
            />
            <Text style={styles.label} numberOfLines={1}>
              {story.id === 'me' ? 'Your story' : story.username.split('_')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 12, paddingVertical: 10, gap: 14 },
  item: { alignItems: 'center', gap: 4, width: 72 },
  label: { color: Colors.muted, fontSize: 11, textAlign: 'center' },
});
