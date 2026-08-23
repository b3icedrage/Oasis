import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../lib/auth-context";

export default function VerifyScreen() {
  const { activateVerification, user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Activating your verification...");

  useEffect(() => {
    async function activate() {
      try {
        const success = await activateVerification();
        if (success) {
          setStatus("success");
          setMessage("Account Fully Verified for 1 Month!");
        } else {
          setStatus("error");
          setMessage("Could not activate verification. Please try again.");
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }

      // Navigate back to home after 2.5 seconds
      setTimeout(() => {
        if (user) {
          router.replace("/(app)");
        } else {
          router.replace("/(auth)/login");
        }
      }, 2500);
    }

    activate();
  }, []);

  return (
    <View style={styles.container}>
      {status === "loading" && (
        <>
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text style={styles.text}>{message}</Text>
        </>
      )}
      {status === "success" && (
        <>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successText}>{message}</Text>
          <Text style={styles.successSub}>
            Your blue tick badge is now active.
          </Text>
          <Text style={styles.successSub}>
            Expires in 30 days. Pay again to renew.
          </Text>
        </>
      )}
      {status === "error" && (
        <>
          <Text style={styles.errorIcon}>✕</Text>
          <Text style={styles.errorText}>{message}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07070d",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  text: {
    color: "#888",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  successIcon: {
    fontSize: 64,
    color: "#22c55e",
    marginBottom: 16,
  },
  successText: {
    color: "#22c55e",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  successSub: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  errorIcon: {
    fontSize: 64,
    color: "#ef4444",
    marginBottom: 16,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
