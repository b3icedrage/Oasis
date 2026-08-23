import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../data/theme';

interface AvatarProps {
  color: string;
  username: string;
  size?: number;
  hasStory?: boolean;
  isMe?: boolean;
}

export function Avatar({ color, username, size = 40, hasStory, isMe }: AvatarProps) {
  const initial = username.charAt(0).toUpperCase();
  const outerSize = hasStory ? size + 8 : size;

  return (
    <View style={[styles.outer, { width: outerSize, height: outerSize }]}>
      {hasStory && (
        <View style={[styles.ring, { width: outerSize, height: outerSize, borderRadius: outerSize / 2, borderColor: color }]} />
      )}
      <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
        <Text style={[styles.initial, { fontSize: size * 0.38 }]}>
          {isMe ? '+' : initial}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', borderWidth: 2 },
  container: { alignItems: 'center', justifyContent: 'center' },
  initial: { color: Colors.white, fontWeight: '700' },
});
