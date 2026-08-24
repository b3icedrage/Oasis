import React, { useState, useEffect, useCallback } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../lib/auth-context";
import UpdateModal from "../components/UpdateModal";
import * as Updates from "expo-updates";

export default function RootLayout() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Check for updates on app launch
  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = useCallback(async () => {
    try {
      // Only check in production (not during development)
      if (__DEV__) return;

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdateAvailable(true);
      }
    } catch (error) {
      // Silently fail — update check is non-critical
      console.log("Update check failed:", error);
    }
  }, []);

  const handleUpdate = useCallback(async () => {
    try {
      setDownloading(true);
      setDownloadProgress(0);

      // Download the update
      const result = await Updates.fetchUpdateAsync();

      if (result.isNew) {
        setDownloadProgress(100);
        // Reload the app to apply the update
        await Updates.reloadAsync();
      } else {
        setDownloading(false);
        setUpdateAvailable(false);
      }
    } catch (error) {
      console.log("Update failed:", error);
      setDownloading(false);
      setUpdateAvailable(false);
    }
  }, []);

  const handleSkipUpdate = useCallback(() => {
    setUpdateAvailable(false);
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#07070d" },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen
          name="verify"
          options={{ presentation: "modal" }}
        />
      </Stack>

      {/* Update Modal */}
      <UpdateModal
        visible={updateAvailable}
        onUpdate={handleUpdate}
        downloading={downloading}
        downloadProgress={downloadProgress}
      />
    </AuthProvider>
  );
}
