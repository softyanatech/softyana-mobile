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
import { Button } from "../../../src/components/ui/Button";
import { EmptyState } from "../../../src/components/ui/EmptyState";
import { CardSkeleton } from "../../../src/components/ui/Skeleton";
import { clientApi } from "../../../src/lib/api";
import { SupportTicket } from "../../../src/types";

const PRIORITY_EMOJI: Record<string, string> = { High: "🔴", Medium: "🟡", Low: "🟢" };

export default function SupportScreen() {
  const router = useRouter();
  const { data: tickets, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => clientApi.getTickets().then((r) => r.data as SupportTicket[]),
  });

  const open = tickets?.filter((t) => t.status !== "Resolved").length ?? 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Support</Text>
          <Text style={styles.subtitle}>{open} open ticket{open !== 1 ? "s" : ""}</Text>
        </View>
        <Button
          title="+ New Ticket"
          onPress={() => router.push("/(client)/support/new")}
          size="sm"
        />
      </View>

      {isLoading ? (
        <View style={styles.content}>
          {[1, 2].map((k) => <CardSkeleton key={k} />)}
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState
              icon="🎧"
              title="No tickets yet"
              description="Raise a support ticket if you need help."
              actionLabel="Raise Ticket"
              onAction={() => router.push("/(client)/support/new")}
            />
          }
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.priority}>{PRIORITY_EMOJI[item.priority]}</Text>
                <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                  <Text style={styles.subject}>{item.subject}</Text>
                  <Text style={styles.date}>{item.createdAt}</Text>
                </View>
                <Badge label={item.status} status={item.status} size="sm" />
              </View>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
              {item.replies && item.replies.length > 0 && (
                <View style={styles.replyBadge}>
                  <Text style={styles.replyText}>
                    {item.replies.length} repl{item.replies.length !== 1 ? "ies" : "y"}
                  </Text>
                </View>
              )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  title: { fontSize: FontSize["2xl"], fontWeight: "800", color: Colors.ink, letterSpacing: -0.5 },
  subtitle: { fontSize: FontSize.sm, color: Colors.muted, marginTop: 2 },
  content: { padding: Spacing.xl, paddingBottom: 40 },
  card: { marginBottom: Spacing.md },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: Spacing.sm },
  priority: { fontSize: 18 },
  subject: { fontSize: FontSize.md, fontWeight: "700", color: Colors.ink },
  date: { fontSize: FontSize.xs, color: Colors.muted, marginTop: 2 },
  description: { fontSize: FontSize.sm, color: Colors.muted, lineHeight: 20 },
  replyBadge: {
    marginTop: Spacing.sm,
    alignSelf: "flex-start",
    backgroundColor: Colors.primaryLight,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  replyText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: "700" },
});
