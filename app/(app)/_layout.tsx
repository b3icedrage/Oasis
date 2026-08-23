import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../lib/auth-context";

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#07070d" },
      }}
    />
  );
}
