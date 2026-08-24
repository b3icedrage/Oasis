import { Redirect, Tabs } from "expo-router";
import { useAuth } from "../../lib/auth-context";
import { Text, View, StyleSheet } from "react-native";

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: "🏠",
    Explore: "🔍",
    Create: "＋",
    Glitches: "⚡",
    Activity: "💜",
    Profile: "👤",
  };

  if (name === "Create") {
    return (
      <View style={styles.createButton}>
        <Text style={styles.createIcon}>＋</Text>
      </View>
    );
  }

  return (
    <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
      {icons[name] || "•"}
    </Text>
  );
}

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#e0e0e0",
        tabBarInactiveTintColor: "#555",
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Explore" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Create" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="glitches"
        options={{
          title: "Glitches",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Glitches" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Activity" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Profile" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#0d0d14",
    borderTopColor: "#1a1a2a",
    borderTopWidth: 1,
    height: 85,
    paddingTop: 8,
    paddingBottom: 28,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#7c3aed",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#a855f7",
  },
  createIcon: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "300",
    marginTop: -2,
  },
});
