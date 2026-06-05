import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Colors, FontSize, Spacing, Shadow } from "../../constants/theme";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { Avatar } from "../../src/components/ui/Avatar";
import { ProgressBar } from "../../src/components/ui/ProgressBar";
import { CardSkeleton } from "../../src/components/ui/Skeleton";
import { useAuth } from "../../src/contexts/AuthContext";
import { clientApi } from "../../src/lib/api";

export default function ClientHome() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: projects, isLoading: projectsLoading, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: () => clientApi.getProjects().then((r) => r.data),
  });

  const { data: invoices } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => clientApi.getInvoices().then((r) => r.data),
  });

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => clientApi.getNotifications().then((r) => r.data),
  });

  const activeProject = projects?.[0];
  const nextInvoice = invoices?.find((i: any) => i.status === "Pending");
  const latestNotif = notifications?.[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={projectsLoading} onRefresh={refetch} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(" ")[0]}! 👋</Text>
            <Text style={styles.subGreeting}>Here's your project overview</Text>
          </View>
          <Avatar name={user?.name ?? "User"} size={44} />
        </View>

        {/* Active Project Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Project</Text>
          <TouchableOpacity onPress={() => router.push("/(client)/projects/index")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {projectsLoading ? (
          <CardSkeleton />
        ) : activeProject ? (
          <TouchableOpacity
            onPress={() => router.push(`/(client)/projects/${activeProject.id}`)}
            activeOpacity={0.9}
          >
            <Card style={styles.projectCard}>
              <View style={styles.projectHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.projectName}>{activeProject.name}</Text>
                  <Text style={styles.projectDates}>
                    {activeProject.startDate} → {activeProject.endDate}
                  </Text>
                </View>
                <Badge label={activeProject.status} status={activeProject.status} />
              </View>
              <ProgressBar
                progress={activeProject.progress}
                showLabel
                label="Progress"
                height={8}
              />
              <View style={styles.teamRow}>
                <Text style={styles.teamLabel}>Team: </Text>
                <Text style={styles.teamNames}>{activeProject.team?.join(", ")}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No active projects</Text>
          </Card>
        )}

        {/* Next EMI */}
        {nextInvoice && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Next Payment Due</Text>
            <Card style={styles.emiCard}>
              <View style={styles.emiRow}>
                <View>
                  <Text style={styles.emiProject}>{nextInvoice.projectName}</Text>
                  <Text style={styles.emiDate}>Due: {nextInvoice.dueDate}</Text>
                </View>
                <View style={styles.emiRight}>
                  <Text style={styles.emiAmount}>₹{nextInvoice.amount?.toLocaleString("en-IN")}</Text>
                  <Badge label={nextInvoice.status} status={nextInvoice.status} size="sm" />
                </View>
              </View>
            </Card>
          </>
        )}

        {/* Latest Notification */}
        {latestNotif && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Latest Update</Text>
            <Card style={styles.notifCard}>
              <View style={styles.notifDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>{latestNotif.title}</Text>
                <Text style={styles.notifBody}>{latestNotif.body}</Text>
              </View>
            </Card>
          </>
        )}

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {[
            { label: "View Project", emoji: "📁", route: "/(client)/projects/index" },
            { label: "Raise Ticket", emoji: "🎧", route: "/(client)/support/new" },
            { label: "Download Invoice", emoji: "🧾", route: "/(client)/invoices/index" },
            { label: "Monthly Report", emoji: "📈", route: "/(client)/invoices/index" },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.actionEmoji}>{action.emoji}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: 40 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  greeting: { fontSize: FontSize["2xl"], fontWeight: "800", color: Colors.ink, letterSpacing: -0.5 },
  subGreeting: { fontSize: FontSize.sm, color: Colors.muted, marginTop: 2 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: FontSize.md, fontWeight: "700", color: Colors.ink, marginBottom: Spacing.md },
  seeAll: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: "600" },

  projectCard: { marginBottom: Spacing.md },
  projectHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: Spacing.md },
  projectName: { fontSize: FontSize.md, fontWeight: "700", color: Colors.ink },
  projectDates: { fontSize: FontSize.xs, color: Colors.muted, marginTop: 2 },
  teamRow: { flexDirection: "row", marginTop: Spacing.md },
  teamLabel: { fontSize: FontSize.xs, color: Colors.muted, fontWeight: "600" },
  teamNames: { fontSize: FontSize.xs, color: Colors.inkLight, flex: 1 },

  emptyCard: { alignItems: "center", padding: Spacing["2xl"] },
  emptyText: { fontSize: FontSize.base, color: Colors.muted },

  emiCard: { flexDirection: "row" },
  emiRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  emiProject: { fontSize: FontSize.base, fontWeight: "700", color: Colors.ink },
  emiDate: { fontSize: FontSize.xs, color: Colors.muted, marginTop: 2 },
  emiRight: { alignItems: "flex-end", gap: 6 },
  emiAmount: { fontSize: FontSize.xl, fontWeight: "800", color: Colors.primary },

  notifCard: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.md },
  notifDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 6 },
  notifTitle: { fontSize: FontSize.sm, fontWeight: "700", color: Colors.ink },
  notifBody: { fontSize: FontSize.sm, color: Colors.muted, marginTop: 2, lineHeight: 18 },

  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },
  actionCard: {
    width: "47%",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.line,
    ...Shadow.sm,
  },
  actionEmoji: { fontSize: 28, marginBottom: Spacing.sm },
  actionLabel: { fontSize: FontSize.sm, fontWeight: "700", color: Colors.ink, lineHeight: 18 },
});
