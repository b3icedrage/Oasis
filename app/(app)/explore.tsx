import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
} from "react-native";

const CATEGORIES = ["All", "Glitch Art", "Photo", "Abstract", "Digital", "Vaporwave"];

const GRID_POSTS = Array.from({ length: 18 }, (_, i) => ({
  id: String(i),
  image: `https://picsum.photos/400/400?random=${i + 10}`,
  likes: Math.floor(Math.random() * 9000) + 100,
}));

export default function ExploreScreen() {
  const [activeCategory, setActiveCategory] = React.useState("All");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search glitch art..."
            placeholderTextColor="#555"
          />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                activeCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Grid */}
        <View style={styles.grid}>
          {GRID_POSTS.map((post, i) => {
            // Make some items larger for masonry feel
            const isLarge = i % 5 === 0;
            return (
              <TouchableOpacity
                key={post.id}
                style={[styles.gridItem, isLarge && styles.gridItemLarge]}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: post.image }}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
                <View style={styles.gridOverlay}>
                  <Text style={styles.gridLikes}>♥ {post.likes.toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "#141420",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a3a",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#e0e0e0",
  },
  categoriesContainer: {
    marginBottom: 12,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#141420",
    borderWidth: 1,
    borderColor: "#2a2a3a",
  },
  categoryChipActive: {
    backgroundColor: "#7c3aed",
    borderColor: "#7c3aed",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
  },
  categoryTextActive: {
    color: "#fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 4,
    gap: 4,
  },
  gridItem: {
    width: "33%",
    aspectRatio: 1,
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  gridItemLarge: {
    width: "66%",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    padding: 8,
    opacity: 0,
  },
  gridLikes: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});
