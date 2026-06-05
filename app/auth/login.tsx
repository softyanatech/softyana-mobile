import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, Spacing } from "../../constants/theme";
import { Button } from "../../src/components/ui/Button";
import { Input } from "../../src/components/ui/Input";
import { useAuth } from "../../src/contexts/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      Alert.alert(
        "Login Failed",
        err?.response?.data?.message ?? "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>S</Text>
          </View>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your Softyana account</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@company.com"
            keyboardType="email-address"
            error={errors.email}
            autoComplete="email"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secure
            error={errors.password}
          />

          <TouchableOpacity
            onPress={() => router.push("/auth/forgot-password")}
            style={styles.forgotBtn}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            size="lg"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text style={styles.footerLink}>Create one</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  container: { flex: 1, padding: Spacing.xl },
  header: { alignItems: "center", paddingVertical: Spacing["3xl"] },
  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  logoLetter: { fontSize: 28, fontWeight: "900", color: Colors.white },
  title: {
    fontSize: FontSize["3xl"],
    fontWeight: "800",
    color: Colors.ink,
    letterSpacing: -0.5,
    marginBottom: Spacing.sm,
  },
  subtitle: { fontSize: FontSize.base, color: Colors.muted },
  form: { flex: 1 },
  forgotBtn: { alignSelf: "flex-end", marginBottom: Spacing.xl, marginTop: -4 },
  forgotText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: Spacing.xl,
  },
  footerText: { fontSize: FontSize.base, color: Colors.muted },
  footerLink: { fontSize: FontSize.base, color: Colors.primary, fontWeight: "700" },
});
