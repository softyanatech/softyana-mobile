import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, Spacing } from "../../constants/theme";
import { Button } from "../../src/components/ui/Button";
import { Input } from "../../src/components/ui/Input";
import { authApi } from "../../src/lib/api";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {sent ? (
          <View style={styles.successContainer}>
            <Text style={styles.successEmoji}>📬</Text>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>
              We've sent a password reset link to{"\n"}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
            <Button
              title="Back to Sign In"
              onPress={() => router.replace("/auth/login")}
              fullWidth
              style={{ marginTop: Spacing["3xl"] }}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.emoji}>🔐</Text>
            <Text style={styles.title}>Forgot password?</Text>
            <Text style={styles.subtitle}>
              Enter your email and we'll send you a reset link.
            </Text>

            <Input
              label="Email address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@company.com"
              keyboardType="email-address"
            />

            <Button
              title="Send Reset Link"
              onPress={handleSubmit}
              loading={loading}
              fullWidth
              size="lg"
              style={{ marginTop: Spacing.md }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  container: { flex: 1, padding: Spacing.xl },
  backBtn: { marginBottom: Spacing["2xl"] },
  backText: { fontSize: FontSize.base, color: Colors.primary, fontWeight: "600" },
  emoji: { fontSize: 48, marginBottom: Spacing.lg },
  title: {
    fontSize: FontSize["3xl"],
    fontWeight: "800",
    color: Colors.ink,
    letterSpacing: -0.5,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.muted,
    lineHeight: 24,
    marginBottom: Spacing["2xl"],
  },
  successContainer: { flex: 1, alignItems: "center", paddingTop: Spacing["4xl"] },
  successEmoji: { fontSize: 64, marginBottom: Spacing.xl },
  emailHighlight: { color: Colors.primary, fontWeight: "700" },
});
