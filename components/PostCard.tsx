import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../data/theme';
import { Avatar } from './Avatar';
import { heavyImpact, successNotification, warningNotification } from '../hooks/useHaptics';
import type { Post } from '../data/mockData';

export function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.isLiked);
  const [saved, setSaved] = useState(post.isSaved);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    if (!liked) {
      successNotification();
    } else {
      warningNotification();
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    heavyImpact();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar color={post.user.avatarColor} username={post.user.username} size={36} hasStory />
          <Text style={styles.username}>@{post.user.username}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={Colors.muted} />
        </TouchableOpacity>
      </View>

      {/* Image */}
      <Image source={{ uri: post.image }} style={styles.image} resizeMode="cover" />

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.actionsLeft}>
          <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={26}
              color={liked ? Colors.magenta : Colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="paper-plane-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <Text style={styles.likes}>{likeCount.toLocaleString()} likes</Text>

      {/* Caption */}
      <Text style={styles.caption}>
        <Text style={styles.captionUser}>@{post.user.username} </Text>
        {post.caption}
      </Text>

      {/* Comments */}
      {post.comments.length > 0 && (
        <TouchableOpacity>
          <Text style={styles.viewComments}>View all {post.comments.length} comments</Text>
        </TouchableOpacity>
      )}

      {/* Time */}
      <Text style={styles.time}>{post.timeAgo} ago</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  username: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  image: { width: '100%', aspectRatio: 1, backgroundColor: Colors.surface },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8 },
  actionsLeft: { flexDirection: 'row', gap: 16 },
  actionBtn: { padding: 2 },
  likes: { color: Colors.white, fontSize: 14, fontWeight: '600', paddingHorizontal: 12 },
  caption: { color: Colors.text, fontSize: 14, paddingHorizontal: 12, marginTop: 4 },
  captionUser: { fontWeight: '600', color: Colors.white },
  viewComments: { color: Colors.muted, fontSize: 13, paddingHorizontal: 12, marginTop: 4 },
  time: { color: Colors.dim, fontSize: 11, textTransform: 'uppercase', paddingHorizontal: 12, marginTop: 4, marginBottom: 10 },
});
