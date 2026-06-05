import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Colors, FontSize, Spacing } from "../../../constants/theme";
import { Card } from "../../../src/components/ui/Card";
import { Badge } from "../../../src/components/ui/Badge";
import { Button } from "../../../src/components/ui/Button";
import { EmptyState } from "../../../src/components/ui/EmptyState";
import { CardSkeleton } from "../../../src/components/ui/Skeleton";
import { internApi } from "../../../src/lib/api";
import { InternTask } from "../../../src/types";

const FILTERS = ["All", "Pending", "In Progress", "Completed"] as const;
type Filter = (typeof FILTERS)[number];

export default function TasksScreen() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>("All");

  const { data: tasks, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["intern-tasks"],
    queryFn: () => internApi.getTasks().then((r) => r.data as InternTask[]),
  });

  const { mutate: complete } = useMutation({
    mutationFn: (id: string) => internApi.completeTask(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["intern-tasks"] }),
    onError: () => Alert.alert("Error", "Failed to update task."),
  });

  const filtered = filter === "All" ? tasks : tasks?.filter((t) => t.status === filter);

  function handleComplete(task: InternTask) {
    if (task.status === "Completed") return;
    Alert.alert("Mark Complete", `Mark "${task.title}" as completed?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Complete", onPress: () => complete(task.id) },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <Text style={styles.subtitle}>{tasks?.length ?? 0} tasks assigned</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.content}>
          {[1, 2, 3].map((k) => <CardSkeleton key={k} />)}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState icon="✅" title="No tasks here" description="All tasks matching this filter will appear here." />
          }
          renderItem={({ item }) => (
            <Card style={[styles.card, item.status === "Completed" ? styles.cardDone : null]}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.taskTitle,
                      item.status === "Completed" && styles.taskDone,
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.taskDesc} numberOfLines={2}>{item.description}</Text>
                </View>
                <Badge label={item.priority} status={item.priority} size="sm" />
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.footerLeft}>
                  <Badge label={item.status} status={item.status} size="sm" />
                  <Text style={styles.dueDate}>Due: {item.dueDate}</Text>
                </View>
                {item.status !== "Completed" && (
                  <Button
                    title="✓ Done"
                    onPress={() => handleComplete(item)}
                    variant="ghost"
                    size="sm"
                  />
                )}
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  title: { fontSize: FontSize["2xl"], fontWeight: "800", color: Colors.ink, letterSpacing: -0.5 },
  subtitle: { fontSize: FontSize.sm, color: Colors.muted, marginTop: 2 },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 99,
    backgroundColor: Colors.soft,
  },
  filterTabActive: { backgroundColor: Colors.accentLight },
  filterText: { fontSize: FontSize.xs, fontWeight: "600", color: Colors.muted },
  filterTextActive: { color: Colors.accent },
  content: { padding: Spacing.xl, paddingBottom: 40 },
  card: { marginBottom: Spacing.md },
  cardDone: { opacity: 0.65 },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.md, marginBottom: Spacing.md },
  taskTitle: { fontSize: FontSize.md, fontWeight: "700", color: Colors.ink },
  taskDone: { textDecorationLine: "line-through", color: Colors.muted },
  taskDesc: { fontSize: FontSize.sm, color: Colors.muted, marginTop: 2, lineHeight: 18 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  dueDate: { fontSize: FontSize.xs, color: Colors.muted, marginLeft: Spacing.sm },
});
