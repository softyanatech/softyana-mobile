import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Colors, FontSize, Spacing } from "../../../constants/theme";
import { Card } from "../../../src/components/ui/Card";
import { Badge } from "../../../src/components/ui/Badge";
import { ProgressBar } from "../../../src/components/ui/ProgressBar";
import { Avatar } from "../../../src/components/ui/Avatar";
import { CardSkeleton } from "../../../src/components/ui/Skeleton";
import { clientApi } from "../../../src/lib/api";
import { Milestone, Project } from "../../../src/types";

const MILESTONE_STATUS: Record<string, { icon: string; color: string }> = {
  completed: { icon: "✓", color: Colors.success },
  in_progress: { icon: "→", color: Colors.primary },
  pending: { icon: "○", color: Colors.muted },
};

export default function ProjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: project, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["project", id],
    queryFn: () => clientApi.getProject(id).then((r) => r.data as Project),
    enabled: !!id,
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        {project && <Badge label={project.status} status={project.status} />}
      </View>

      {isLoading ? (
        <View style={styles.content}>
          {[1, 2, 3].map((k) => <CardSkeleton key={k} />)}
        </View>
      ) : project ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        >
          <Text style={styles.title}>{project.name}</Text>
          <Text style={styles.dates}>{project.startDate} → {project.endDate}</Text>
          {project.description && (
            <Text style={styles.description}>{project.description}</Text>
          )}

          {/* Progress */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Overall Progress</Text>
            <ProgressBar progress={project.progress} showLabel height={10} />
          </Card>

          {/* Milestones */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Milestones</Text>
            {project.milestones?.map((m: Milestone, idx: number) => {
              const ms = MILESTONE_STATUS[m.status];
              return (
                <View key={m.id} style={[styles.milestone, idx > 0 && styles.milestoneTop]}>
                  <View style={[styles.milestoneIcon, { backgroundColor: ms.color + "20" }]}>
                    <Text style={[styles.milestoneIconText, { color: ms.color }]}>{ms.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.milestoneTitle,
                        m.status === "completed" && styles.milestoneDone,
                      ]}
                    >
                      {m.title}
                    </Text>
                    {m.date && <Text style={styles.milestoneDate}>{m.date}</Text>}
                  </View>
                </View>
              );
            })}
          </Card>

          {/* Team */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Team</Text>
            <View style={styles.teamGrid}>
              {project.team?.map((name: string) => (
                <View key={name} style={styles.teamMember}>
                  <Avatar name={name} size={40} />
                  <Text style={styles.teamName}>{name}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Updates */}
          {project.updates && project.updates.length > 0 && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Updates</Text>
              {project.updates.map((u: any) => (
                <View key={u.id} style={styles.update}>
                  <View style={styles.updateHeader}>
                    <Text style={styles.updateAuthor}>{u.author}</Text>
                    <Text style={styles.updateDate}>{u.createdAt}</Text>
                  </View>
                  <Text style={styles.updateMsg}>{u.message}</Text>
                </View>
              ))}
            </Card>
          )}

          {/* Files */}
          {project.files && project.files.length > 0 && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Files</Text>
              {project.files.map((f: any) => (
                <TouchableOpacity
                  key={f.id}
                  style={styles.fileRow}
                  onPress={() => Linking.openURL(f.url)}
                >
                  <Text style={styles.fileIcon}>📎</Text>
                  <Text style={styles.fileName}>{f.name}</Text>
                  <Text style={styles.fileDate}>{f.uploadedAt}</Text>
                </TouchableOpacity>
              ))}
            </Card>
          )}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  backBtn: {},
  backText: { fontSize: FontSize.base, color: Colors.primary, fontWeight: "600" },
  content: { padding: Spacing.xl, paddingBottom: 40 },
  title: { fontSize: FontSize["3xl"], fontWeight: "800", color: Colors.ink, letterSpacing: -0.5 },
  dates: { fontSize: FontSize.sm, color: Colors.muted, marginTop: 4, marginBottom: Spacing.lg },
  description: {
    fontSize: FontSize.base,
    color: Colors.inkLight,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.md, fontWeight: "700", color: Colors.ink, marginBottom: Spacing.md },

  milestone: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  milestoneTop: { marginTop: Spacing.md },
  milestoneIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  milestoneIconText: { fontSize: FontSize.md, fontWeight: "700" },
  milestoneTitle: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.ink },
  milestoneDone: { textDecorationLine: "line-through", color: Colors.muted },
  milestoneDate: { fontSize: FontSize.xs, color: Colors.muted, marginTop: 2 },

  teamGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.lg },
  teamMember: { alignItems: "center", gap: Spacing.sm },
  teamName: { fontSize: FontSize.xs, color: Colors.muted, fontWeight: "600" },

  update: { paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.line, marginTop: Spacing.md },
  updateHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: Spacing.sm },
  updateAuthor: { fontSize: FontSize.sm, fontWeight: "700", color: Colors.ink },
  updateDate: { fontSize: FontSize.xs, color: Colors.muted },
  updateMsg: { fontSize: FontSize.sm, color: Colors.inkLight, lineHeight: 20 },

  fileRow: { flexDirection: "row", alignItems: "center", paddingVertical: Spacing.sm, gap: Spacing.md },
  fileIcon: { fontSize: 18 },
  fileName: { flex: 1, fontSize: FontSize.sm, fontWeight: "600", color: Colors.primary },
  fileDate: { fontSize: FontSize.xs, color: Colors.muted },
});
