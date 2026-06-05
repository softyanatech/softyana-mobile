import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Colors, FontSize, Spacing, Shadow } from "../../constants/theme";
import { Card } from "../../src/components/ui/Card";
import { Avatar } from "../../src/components/ui/Avatar";
import { Badge } from "../../src/components/ui/Badge";
import { useAuth } from "../../src/contexts/AuthContext";

export default function InternProfile() {
  const { user, logout } = useAuth();

  function handleLogout() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  }

  function handleLinkedIn() {
    if (user?.linkedin) {
      Linking.openURL(user.linkedin);
    } else {
      Alert.alert("LinkedIn", "Share your profile on LinkedIn!", [
        {
          text: "Open LinkedIn",
          onPress: () => Linking.openURL("https://www.linkedin.com"),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Avatar name={user?.name ?? "Intern"} size={80} />
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.role}>{user?.internRole ?? "Software Development Intern"}</Text>
          <Badge label={user?.batch ?? "Batch 2026"} bg={Colors.accentLight} color={Colors.accent} />
        </View>

        {/* LinkedIn Share */}
        <TouchableOpacity style={styles.linkedinBtn} onPress={handleLinkedIn} activeOpacity={0.85}>
          <Text style={styles.linkedinIcon}>🔗</Text>
          <Text style={styles.linkedinText}>Share on LinkedIn</Text>
        </TouchableOpacity>

        {/* Internship Details */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Internship Details</Text>
          <Row label="Start Date" value={user?.startDate ?? "—"} />
          <Row label="End Date" value={user?.endDate ?? "—"} />
          <Row label="Batch" value={user?.batch ?? "—"} />
          <Row label="Email" value={user?.email ?? "—"} />
        </Card>

        {/* Skills */}
        {user?.skills && user.skills.length > 0 && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsRow}>
              {user.skills.map((skill) => (
                <View key={skill} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* App Info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <Row label="Version" value={Constants.expoConfig?.version ?? "1.0.0"} />
          <Row label="Company" value="Softyana Technologies" />
          <Row label="Support" value="softyana.tech@gmail.com" />
        </Card>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.xl, paddingBottom: 40 },

  hero: { alignItems: "center", paddingVertical: Spacing["3xl"], gap: Spacing.sm },
  name: { fontSize: FontSize["2xl"], fontWeight: "800", color: Colors.ink, letterSpacing: -0.3 },
  role: { fontSize: FontSize.base, color: Colors.muted, textAlign: "center" },

  linkedinBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: "#C7D7FD",
  },
  linkedinIcon: { fontSize: 18 },
  linkedinText: { fontSize: FontSize.base, fontWeight: "700", color: "#3730A3" },

  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.ink,
    marginBottom: Spacing.sm,
  },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm, paddingTop: Spacing.sm },
  skillBadge: {
    backgroundColor: Colors.accentLight,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  skillText: { fontSize: FontSize.xs, fontWeight: "700", color: Colors.accent },

  logoutBtn: {
    backgroundColor: Colors.dangerLight,
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.danger + "40",
  },
  logoutText: { fontSize: FontSize.md, fontWeight: "700", color: Colors.danger },
});
