import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../data/theme';
import { GlitchLogo } from '../../components/GlitchLogo';
import { StoryBar } from '../../components/StoryBar';
import { PostCard } from '../../components/PostCard';
import { feedPosts } from '../../data/mockData';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <GlitchLogo size={24} />
      </View>
      <FlatList
        data={feedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={<StoryBar />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  list: { paddingBottom: 20 },
});
