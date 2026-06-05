import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Colors, FontSize, Spacing } from "../../../constants/theme";
import { Card } from "../../../src/components/ui/Card";
import { Badge } from "../../../src/components/ui/Badge";
import { ProgressBar } from "../../../src/components/ui/ProgressBar";
import { EmptyState } from "../../../src/components/ui/EmptyState";
import { CardSkeleton } from "../../../src/components/ui/Skeleton";
import { Avatar } from "../../../src/components/ui/Avatar";
import { clientApi } from "../../../src/lib/api";
import { Project } from "../../../src/types";

export default function ProjectsScreen() {
  const router = useRouter();
  const { data: projects, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["projects"],
    queryFn: () => clientApi.getProjects().then((r) => r.data as Project[]),
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Projects</Text>
        <Text style={styles.subtitle}>{projects?.length ?? 0} projects</Text>
      </View>

      {isLoading ? (
        <View style={styles.content}>
          {[1, 2, 3].map((k) => <CardSkeleton key={k} />)}
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState
              icon="📁"
              title="No projects yet"
              description="Your projects will appear here once your engagement begins."
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push(`/(client)/projects/${item.id}`)}
            >
              <Card style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.projectName}>{item.name}</Text>
                    <Text style={styles.dates}>
                      {item.startDate} → {item.endDate}
                    </Text>
                  </View>
                  <Badge label={item.status} status={item.status} />
                </View>

                <ProgressBar
                  progress={item.progress}
                  showLabel
                  label="Progress"
                  height={8}
                />

                <View style={styles.teamRow}>
                  <View style={styles.avatarGroup}>
                    {item.team?.slice(0, 3).map((name) => (
                      <Avatar key={name} name={name} size={28} />
                    ))}
                    {(item.team?.length ?? 0) > 3 && (
                      <View style={styles.moreAvatar}>
                        <Text style={styles.moreText}>+{item.team.length - 3}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.teamLabel}>
                    {item.team?.length} team member{item.team?.length !== 1 ? "s" : ""}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
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
  content: { padding: Spacing.xl, paddingBottom: 40 },
  card: { marginBottom: Spacing.md },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  projectName: { fontSize: FontSize.md, fontWeight: "700", color: Colors.ink },
  dates: { fontSize: FontSize.xs, color: Colors.muted, marginTop: 2 },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.md,
  },
  avatarGroup: { flexDirection: "row", gap: -8 },
  moreAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.soft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.line,
  },
  moreText: { fontSize: FontSize.xs, fontWeight: "700", color: Colors.muted },
  teamLabel: { fontSize: FontSize.xs, color: Colors.muted },
});
