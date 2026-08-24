import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../data/theme";
import { Avatar } from "../../components/Avatar";
import {
  SearchIcon,
  ChevronDown,
  BoltIcon,
  HeartIcon,
  VerifiedBadge,
} from "../../components/Icons";
import { lightImpact } from "../../hooks/useHaptics";
import { useAuth } from "../../lib/auth-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GAP = 3;
const PADDING = 0;

const TOP_TABS = ["FOR YOU", "FOLLOWING", "EXPLORE"];

const TRENDING_TAGS = [
  { tag: "#DATABLAST", color: Colors.magenta },
  { tag: "#NEON_CYBER", color: Colors.cyan },
  { tag: "#VHS_MEMORIES", color: Colors.purple },
  { tag: "#GLITCH_ART", color: Colors.green },
];

const BOTTOM_FILTERS = ["Top Results", "Media", "Tags", "Users"];

// Masonry grid items with different aspect ratios
const GRID_ITEMS = [
  { id: "g1", w: 2, h: 2, image: "https://picsum.photos/600/600?random=20" },
  { id: "g2", w: 1, h: 1, image: "https://picsum.photos/300/300?random=21" },
  { id: "g3", w: 1, h: 2, image: "https://picsum.photos/300/600?random=22" },
  { id: "g4", w: 1, h: 1, image: "https://picsum.photos/300/300?random=23" },
  { id: "g5", w: 1, h: 1, image: "https://picsum.photos/300/300?random=24" },
  { id: "g6", w: 1, h: 1, image: "https://picsum.photos/300/300?random=25" },
  { id: "g7", w: 2, h: 1, image: "https://picsum.photos/600/300?random=26" },
  { id: "g8", w: 1, h: 1, image: "https://picsum.photos/300/300?random=27" },
  { id: "g9", w: 1, h: 1, image: "https://picsum.photos/300/300?random=28" },
  { id: "g10", w: 1, h: 1, image: "https://picsum.photos/300/300?random=29" },
  { id: "g11", w: 1, h: 1, image: "https://picsum.photos/300/300?random=30" },
  { id: "g12", w: 1, h: 1, image: "https://picsum.photos/300/300?random=31" },
];

const COLS = 3;
const CELL_SIZE = (SCREEN_WIDTH - PADDING * 2 - GAP * (COLS - 1)) / COLS;

function buildRows(items: typeof GRID_ITEMS) {
  const rows: { id: string; cells: { id: string; w: number; h: number; image: string }[] }[] = [];
  let idx = 0;

  while (idx < items.length) {
    const first = items[idx];
    if (first.w >= 2) {
      // Large item takes entire row
      rows.push({ id: `row-${rows.length}`, cells: [first] });
      idx++;
    } else {
      // Try to fill a row of width 3
      const cells = [first];
      let usedW = first.w;
      idx++;
      while (usedW < COLS && idx < items.length) {
        const next = items[idx];
        if (usedW + next.w <= COLS) {
          cells.push(next);
          usedW += next.w;
          idx++;
        } else {
          break;
        }
      }
      rows.push({ id: `row-${rows.length}`, cells });
    }
  }
  return rows;
}

const rows = buildRows(GRID_ITEMS);

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState("EXPLORE");
  const [activeFilter, setActiveFilter] = useState("Top Results");
  const [searchText, setSearchText] = useState("");
  const { profile } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header: Avatar + Username */}
      <View style={styles.header}>
        <Avatar
          color={Colors.purple}
          username={profile?.displayName || "CosmicGlitcher"}
          size={36}
          isMe
        />
        <Text style={styles.username}>
          @{profile?.displayName?.replace(/\s+/g, "") || "CosmicGlitcher"}
        </Text>
        <ChevronDown size={14} color={Colors.muted} />
      </View>

      {/* Top Tabs: FOR YOU / FOLLOWING / EXPLORE */}
      <View style={styles.topTabs}>
        {TOP_TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                setActiveTab(tab);
                lightImpact();
              }}
              style={styles.topTabBtn}
              activeOpacity={0.7}
            >
              <Text style={[styles.topTabText, isActive && styles.topTabTextActive]}>
                {tab}
              </Text>
              {isActive && <View style={styles.topTabUnderline} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Search Bar — Glitch style */}
      <View style={styles.searchOuter}>
        <View style={styles.searchBar}>
          <SearchIcon size={18} color={Colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="SEARCH THE VOID"
            placeholderTextColor={Colors.dim}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Trending Tags */}
        <View style={styles.tagsSection}>
          <Text style={styles.trendingLabel}>TRENDING TAGS</Text>
          <View style={styles.tagsRow}>
            {TRENDING_TAGS.map((t) => (
              <TouchableOpacity
                key={t.tag}
                onPress={() => lightImpact()}
                activeOpacity={0.7}
              >
                <Text style={[styles.tagText, { color: t.color }]}>{t.tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Masonry Image Grid */}
        <View style={styles.gridContainer}>
          {rows.map((row) => {
            // Determine row height — tallest cell defines it
            const maxH = Math.max(...row.cells.map((c) => c.h));
            const rowHeight = maxH * CELL_SIZE + (maxH - 1) * GAP;

            return (
              <View key={row.id} style={[styles.gridRow, { height: rowHeight }]}>
                {row.cells.map((cell) => {
                  const cellW = cell.w * CELL_SIZE + (cell.w - 1) * GAP;
                  const cellH = cell.h * CELL_SIZE + (cell.h - 1) * GAP;

                  return (
                    <TouchableOpacity
                      key={cell.id}
                      style={[styles.gridCell, { width: cellW, height: cellH }]}
                      activeOpacity={0.85}
                      onPress={() => lightImpact()}
                    >
                      <Image
                        source={{ uri: cell.image }}
                        style={styles.gridImage}
                        resizeMode="cover"
                      />
                      <View style={styles.cellOverlay}>
                        <View style={styles.cellLikes}>
                          <HeartIcon size={12} color="#fff" filled />
                          <Text style={styles.likesCount}>
                            {Math.floor(Math.random() * 9000 + 100).toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Filter Tabs */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomFilters}>
          {BOTTOM_FILTERS.map((f) => {
            const isActive = f === activeFilter;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => {
                  setActiveFilter(f);
                  lightImpact();
                }}
                activeOpacity={0.7}
                style={styles.bottomFilterBtn}
              >
                <Text
                  style={[
                    styles.bottomFilterText,
                    isActive && styles.bottomFilterTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Avatar
          color={Colors.cyan}
          username={profile?.displayName || "G"}
          size={30}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  username: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.3,
  },

  // Top Tabs
  topTabs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 28,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  topTabBtn: {
    alignItems: "center",
    paddingVertical: 4,
  },
  topTabText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.muted,
    letterSpacing: 1.2,
  },
  topTabTextActive: {
    color: Colors.white,
  },
  topTabUnderline: {
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.white,
    marginTop: 4,
  },

  // Search Bar
  searchOuter: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.magenta + "50",
    paddingHorizontal: 14,
    height: 44,
    // Glitch neon glow
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    letterSpacing: 1.5,
  },

  scrollContent: {
    paddingBottom: 10,
  },

  // Trending Tags
  tagsSection: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  trendingLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.muted,
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tagText: {
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.3,
  },

  // Grid
  gridContainer: {
    paddingHorizontal: PADDING,
  },
  gridRow: {
    flexDirection: "row",
    gap: GAP,
    marginBottom: GAP,
  },
  gridCell: {
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  cellOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
    padding: 6,
    opacity: 0,
  },
  cellLikes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  likesCount: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  bottomFilters: {
    flexDirection: "row",
    gap: 16,
  },
  bottomFilterBtn: {
    paddingVertical: 2,
  },
  bottomFilterText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.muted,
  },
  bottomFilterTextActive: {
    color: Colors.white,
    fontWeight: "700",
  },
});
