import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../data/theme';

export function GlitchLogo({ size = 22 }: { size?: number }) {
  return (
    <Text style={[styles.logo, { fontSize: size }]}>
      GlitchIt
    </Text>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontWeight: '900',
    color: Colors.cyan,
    letterSpacing: -0.5,
  },
});
