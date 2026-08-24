import { Redirect, Tabs } from "expo-router";
import { useAuth } from "../../lib/auth-context";
import { View, StyleSheet } from "react-native";
import { Colors } from "../../data/theme";
import {
  HomeIcon,
  SearchIcon,
  PlusIcon,
  BoltIcon,
  BellIcon,
  UserIcon,
} from "../../components/Icons";

function TabIcon({
  name,
  focused,
}: {
  name: string;
  focused: boolean;
}) {
  const active = Colors.text;
  const inactive = Colors.muted;

  if (name === "Create") {
    return (
      <View style={styles.createButton}>
        <PlusIcon size={22} color="#fff" />
      </View>
    );
  }

  const iconMap: Record<string, React.ReactNode> = {
    Home: <HomeIcon size={22} color={focused ? active : inactive} />,
    Explore: <SearchIcon size={22} color={focused ? active : inactive} />,
    Glitches: <BoltIcon size={22} color={focused ? active : inactive} />,
    Activity: <BellIcon size={22} color={focused ? active : inactive} />,
    Profile: <UserIcon size={22} color={focused ? active : inactive} />,
  };

  return <View style={styles.iconWrap}>{iconMap[name] || null}</View>;
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
        tabBarActiveTintColor: Colors.text,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Home" focused={focused} />
          ),
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
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    height: 26,
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.purple,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.purple + "80",
  },
});
