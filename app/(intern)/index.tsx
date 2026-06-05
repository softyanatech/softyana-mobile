import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Colors, FontSize, Spacing, Shadow } from "../../constants/theme";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { Avatar } from "../../src/components/ui/Avatar";
import { ProgressBar } from "../../src/components/ui/ProgressBar";
import { CardSkeleton } from "../../src/components/ui/Skeleton";
import { useAuth } from "../../src/contexts/AuthContext";
import { internApi } from "../../src/lib/api";
import { InternTask } from "../../src/types";

function getDaysBetween(start: string, end: string) {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const t = Date.now();
  const total = Math.round((e - s) / 86400000);
  const done = Math.round((t - s) / 86400000);
  return { total, done: Math.min(done, total), pct: Math.min(100, Math.round((done / total) * 100)) };
}

export default function InternHome() {
  const { user } = useAuth();

  const { data: tasks, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["intern-tasks"],
    queryFn: () => internApi.getTasks().then((r) => r.data as InternTask[]),
  });

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = tasks?.filter((t) => t.dueDate === today && t.status !== "Completed") ?? [];
  const upcomingTasks = tasks?.filter((t) => t.dueDate > today && t.status !== "Completed") ?? [];

  const progress = user?.startDate && user?.endDate
    ? getDaysBetween(user.startDate, user.endDate)
    : null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(" ")[0]}! 👋</Text>
            <Text style={styles.role}>{user?.internRole ?? "Intern"} · {user?.batch ?? "2026"}</Text>
          </View>
          <Avatar name={user?.name ?? "Intern"} size={44} />
        </View>

        {/* Progress Card */}
        {progress && (
          <View style={styles.progressCard}>
            <Text style={styles.progressLabel}>Internship Progress</Text>
            <Text style={styles.progressDays}>
              {progress.done} / {progress.total} days completed
            </Text>
            <ProgressBar progress={progress.pct} showLabel height={10} color={Colors.accent} />
            <View style={styles.dateRow}>
              <Text style={styles.dateText}>Start: {user?.startDate}</Text>
              <Text style={styles.dateText}>End: {user?.endDate}</Text>
            </View>
          </View>
        )}

        {/* Today's Tasks */}
        <Text style={styles.sectionTitle}>Tasks Due Today</Text>
        {isLoading ? (
          <CardSkeleton />
        ) : todayTasks.length > 0 ? (
          todayTasks.map((task) => (
            <Card key={task.id} style={styles.taskCard}>
              <View style={styles.taskRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDesc} numberOfLines={2}>{task.description}</Text>
                </View>
                <Badge label={task.priority} status={task.priority} size="sm" />
              </View>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>🎉 No tasks due today!</Text>
          </Card>
        )}

        {/* Upcoming */}
        {upcomingTasks.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Upcoming Deadlines</Text>
            {upcomingTasks.slice(0, 3).map((task) => (
              <Card key={task.id} style={styles.upcomingCard}>
                <View style={styles.upcomingRow}>
                  <Text style={styles.upcomingTitle}>{task.title}</Text>
                  <Text style={styles.upcomingDate}>{task.dueDate}</Text>
                </View>
                <Badge label={task.priority} status={task.priority} size="sm" />
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.xl, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  greeting: { fontSize: FontSize["2xl"], fontWeight: "800", color: Colors.ink, letterSpacing: -0.5 },
  role: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: "600", marginTop: 2 },

  progressCard: {
    backgroundColor: Colors.navy,
    borderRadius: 24,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadow.lg,
  },
  progressLabel: { fontSize: FontSize.sm, color: "rgba(255,255,255,0.6)", marginBottom: 4 },
  progressDays: { fontSize: FontSize.xl, fontWeight: "800", color: Colors.white, marginBottom: Spacing.lg },
  dateRow: { flexDirection: "row", justifyContent: "space-between", marginTop: Spacing.md },
  dateText: { fontSize: FontSize.xs, color: "rgba(255,255,255,0.5)" },

  sectionTitle: { fontSize: FontSize.md, fontWeight: "700", color: Colors.ink, marginBottom: Spacing.md },

  taskCard: { marginBottom: Spacing.sm },
  taskRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.md },
  taskTitle: { fontSize: FontSize.base, fontWeight: "700", color: Colors.ink },
  taskDesc: { fontSize: FontSize.sm, color: Colors.muted, marginTop: 2, lineHeight: 18 },

  emptyCard: { alignItems: "center", padding: Spacing.xl },
  emptyText: { fontSize: FontSize.base, color: Colors.ink, fontWeight: "600" },

  upcomingCard: { marginBottom: Spacing.sm, padding: Spacing.md },
  upcomingRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: Spacing.sm },
  upcomingTitle: { fontSize: FontSize.sm, fontWeight: "700", color: Colors.ink, flex: 1 },
  upcomingDate: { fontSize: FontSize.xs, color: Colors.warning, fontWeight: "600" },
});
