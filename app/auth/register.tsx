import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, Spacing } from "../../constants/theme";
import { Button } from "../../src/components/ui/Button";
import { Input } from "../../src/components/ui/Input";
import { authApi } from "../../src/lib/api";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", company: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    try {
      await authApi.register(form);
      Alert.alert("Account Created!", "You can now sign in with your credentials.", [
        { text: "Sign In", onPress: () => router.replace("/auth/login") },
      ]);
    } catch (err: any) {
      Alert.alert("Registration Failed", err?.response?.data?.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join Softyana as a client</Text>
          </View>

          <Input
            label="Full name"
            value={form.name}
            onChangeText={(v) => set("name", v)}
            placeholder="Rahul Sharma"
            error={errors.name}
          />
          <Input
            label="Email address"
            value={form.email}
            onChangeText={(v) => set("email", v)}
            placeholder="rahul@company.com"
            keyboardType="email-address"
            error={errors.email}
          />
          <Input
            label="Company (optional)"
            value={form.company}
            onChangeText={(v) => set("company", v)}
            placeholder="Your company name"
          />
          <Input
            label="Password"
            value={form.password}
            onChangeText={(v) => set("password", v)}
            placeholder="Min. 6 characters"
            secure
            error={errors.password}
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            fullWidth
            size="lg"
            style={{ marginTop: Spacing.sm }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/auth/login")}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  container: { padding: Spacing.xl, paddingBottom: Spacing["4xl"] },
  backBtn: { marginBottom: Spacing.xl },
  backText: { fontSize: FontSize.base, color: Colors.primary, fontWeight: "600" },
  header: { marginBottom: Spacing["2xl"] },
  title: { fontSize: FontSize["3xl"], fontWeight: "800", color: Colors.ink, letterSpacing: -0.5 },
  subtitle: { fontSize: FontSize.base, color: Colors.muted, marginTop: Spacing.sm },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: Spacing["2xl"] },
  footerText: { fontSize: FontSize.base, color: Colors.muted },
  footerLink: { fontSize: FontSize.base, color: Colors.primary, fontWeight: "700" },
});
