import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Colors, FontSize, Spacing } from "../../../constants/theme";
import { Card } from "../../../src/components/ui/Card";
import { Input } from "../../../src/components/ui/Input";
import { Button } from "../../../src/components/ui/Button";
import { EmptyState } from "../../../src/components/ui/EmptyState";
import { internApi } from "../../../src/lib/api";
import { Standup } from "../../../src/types";

const TODAY = new Date().toISOString().split("T")[0];

export default function StandupScreen() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"submit" | "history">("submit");
  const [form, setForm] = useState({ yesterday: "", today: "", blockers: "" });

  const { data: standups } = useQuery({
    queryKey: ["standups"],
    queryFn: () => internApi.getStandups().then((r) => r.data as Standup[]),
  });

  const alreadySubmitted = standups?.some((s) => s.date === TODAY);

  const { mutate: submit, isPending } = useMutation({
    mutationFn: () => internApi.submitStandup(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["standups"] });
      setForm({ yesterday: "", today: "", blockers: "" });
      Alert.alert("Standup Submitted! 🎉", "Great work. Keep it up!");
    },
    onError: () => Alert.alert("Error", "Failed to submit standup. Please try again."),
  });

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit() {
    if (!form.yesterday.trim() || !form.today.trim()) {
      Alert.alert("Incomplete", "Please fill in what you did yesterday and today's plan.");
      return;
    }
    submit();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Standup</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === "submit" && styles.tabActive]}
          onPress={() => setTab("submit")}
        >
          <Text style={[styles.tabText, tab === "submit" && styles.tabTextActive]}>
            Today's Update
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "history" && styles.tabActive]}
          onPress={() => setTab("history")}
        >
          <Text style={[styles.tabText, tab === "history" && styles.tabTextActive]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {tab === "submit" ? (
            alreadySubmitted ? (
              <View style={styles.doneContainer}>
                <Text style={styles.doneEmoji}>✅</Text>
                <Text style={styles.doneTitle}>Standup submitted!</Text>
                <Text style={styles.doneDesc}>You've already submitted today's standup. See you tomorrow!</Text>
                <Button
                  title="View History"
                  onPress={() => setTab("history")}
                  variant="outline"
                  style={{ marginTop: Spacing.xl }}
                />
              </View>
            ) : (
              <>
                <Card style={styles.formCard}>
                  <Text style={styles.question}>📅 What did you do yesterday?</Text>
                  <Input
                    value={form.yesterday}
                    onChangeText={(v) => set("yesterday", v)}
                    placeholder="Completed the login screen UI, fixed 2 bugs..."
                    multiline
                    numberOfLines={3}
                    style={{ minHeight: 80, textAlignVertical: "top" }}
                  />
                </Card>

                <Card style={styles.formCard}>
                  <Text style={styles.question}>🎯 What will you do today?</Text>
                  <Input
                    value={form.today}
                    onChangeText={(v) => set("today", v)}
                    placeholder="Work on the dashboard component, review PR..."
                    multiline
                    numberOfLines={3}
                    style={{ minHeight: 80, textAlignVertical: "top" }}
                  />
                </Card>

                <Card style={styles.formCard}>
                  <Text style={styles.question}>🚧 Any blockers?</Text>
                  <Input
                    value={form.blockers}
                    onChangeText={(v) => set("blockers", v)}
                    placeholder="No blockers / Waiting for design review / Need API access..."
                    multiline
                    numberOfLines={2}
                    style={{ minHeight: 60, textAlignVertical: "top" }}
                  />
                </Card>

                <Button
                  title="Submit Standup"
                  onPress={handleSubmit}
                  loading={isPending}
                  fullWidth
                  size="lg"
                />
              </>
            )
          ) : (
            standups && standups.length > 0 ? (
              standups.map((s: Standup) => (
                <Card key={s.id} style={styles.historyCard}>
                  <Text style={styles.historyDate}>{s.date}</Text>
                  <View style={styles.historyItem}>
                    <Text style={styles.historyLabel}>Yesterday</Text>
                    <Text style={styles.historyValue}>{s.yesterday}</Text>
                  </View>
                  <View style={styles.historyItem}>
                    <Text style={styles.historyLabel}>Today</Text>
                    <Text style={styles.historyValue}>{s.today}</Text>
                  </View>
                  {s.blockers && (
                    <View style={styles.historyItem}>
                      <Text style={styles.historyLabel}>Blockers</Text>
                      <Text style={styles.historyValue}>{s.blockers}</Text>
                    </View>
                  )}
                </Card>
              ))
            ) : (
              <EmptyState icon="📋" title="No standups yet" description="Your submitted standups will appear here." />
            )
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  title: { fontSize: FontSize["2xl"], fontWeight: "800", color: Colors.ink, letterSpacing: -0.5 },
  date: { fontSize: FontSize.sm, color: Colors.muted, marginTop: 2 },

  tabs: {
    flexDirection: "row",
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    backgroundColor: Colors.soft,
    borderRadius: 14,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center" },
  tabActive: { backgroundColor: Colors.white },
  tabText: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.muted },
  tabTextActive: { color: Colors.ink },

  content: { padding: Spacing.xl, paddingBottom: 40 },

  formCard: { marginBottom: Spacing.md },
  question: { fontSize: FontSize.base, fontWeight: "700", color: Colors.ink, marginBottom: Spacing.md },

  doneContainer: { alignItems: "center", paddingVertical: Spacing["4xl"] },
  doneEmoji: { fontSize: 64, marginBottom: Spacing.lg },
  doneTitle: { fontSize: FontSize["2xl"], fontWeight: "800", color: Colors.ink },
  doneDesc: { fontSize: FontSize.base, color: Colors.muted, textAlign: "center", marginTop: Spacing.sm, lineHeight: 22 },

  historyCard: { marginBottom: Spacing.md },
  historyDate: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  historyItem: { marginBottom: Spacing.sm },
  historyLabel: { fontSize: FontSize.xs, fontWeight: "700", color: Colors.muted, marginBottom: 2 },
  historyValue: { fontSize: FontSize.sm, color: Colors.ink, lineHeight: 20 },
});
