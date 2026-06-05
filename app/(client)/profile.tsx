import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Colors, FontSize, Spacing, Shadow } from "../../constants/theme";
import { Card } from "../../src/components/ui/Card";
import { Avatar } from "../../src/components/ui/Avatar";
import { useAuth } from "../../src/contexts/AuthContext";

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={rowStyles.value}>{value}</Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  label: { fontSize: FontSize.sm, color: Colors.muted, fontWeight: "600" },
  value: { fontSize: FontSize.sm, color: Colors.ink, fontWeight: "600", flex: 1, textAlign: "right" },
});

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  function handleLogout() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: logout,
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Hero */}
        <View style={styles.hero}>
          <Avatar name={user?.name ?? "User"} size={80} />
          <Text style={styles.name}>{user?.name}</Text>
          {user?.company && <Text style={styles.company}>{user.company}</Text>}
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.projectCount ?? 0}</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5.0★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Client</Text>
            <Text style={styles.statLabel}>Role</Text>
          </View>
        </View>

        {/* Details */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          <InfoRow label="Email" value={user?.email ?? ""} />
          <InfoRow label="Company" value={user?.company ?? "—"} />
          <InfoRow label="Member since" value={user?.memberSince ?? "2026"} />
          <InfoRow label="Support email" value="softyana.tech@gmail.com" />
        </Card>

        {/* App Info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <InfoRow label="Version" value={Constants.expoConfig?.version ?? "1.0.0"} />
          <InfoRow label="Company" value="Softyana Technologies" />
          <InfoRow label="Platform" value="Mobile Client Portal" />
        </Card>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.xl, paddingBottom: 40 },

  hero: { alignItems: "center", paddingVertical: Spacing["3xl"] },
  name: {
    fontSize: FontSize["2xl"],
    fontWeight: "800",
    color: Colors.ink,
    marginTop: Spacing.lg,
    letterSpacing: -0.3,
  },
  company: { fontSize: FontSize.base, color: Colors.primary, fontWeight: "600", marginTop: 4 },
  email: { fontSize: FontSize.sm, color: Colors.muted, marginTop: 4 },

  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.line,
    ...Shadow.sm,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: FontSize.xl, fontWeight: "800", color: Colors.ink },
  statLabel: { fontSize: FontSize.xs, color: Colors.muted, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.line },

  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.ink,
    marginBottom: Spacing.sm,
  },

  logoutBtn: {
    backgroundColor: Colors.dangerLight,
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    alignItems: "center",
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.danger + "40",
  },
  logoutText: { fontSize: FontSize.md, fontWeight: "700", color: Colors.danger },
});
