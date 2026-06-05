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
import { Colors, FontSize, Spacing, Shadow } from "../../../constants/theme";
import { Card } from "../../../src/components/ui/Card";
import { Badge } from "../../../src/components/ui/Badge";
import { ProgressBar } from "../../../src/components/ui/ProgressBar";
import { CardSkeleton } from "../../../src/components/ui/Skeleton";
import { clientApi } from "../../../src/lib/api";
import { EmiTracker, EmiInstallment } from "../../../src/types";

export default function EmiTrackerScreen() {
  const router = useRouter();
  const { data: emi, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["emi"],
    queryFn: () => clientApi.getEmiTracker().then((r) => r.data as EmiTracker),
  });

  const paidPct = emi ? Math.round((emi.amountPaid / emi.totalCost) * 100) : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>EMI Tracker</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {isLoading ? (
          <>{[1, 2].map((k) => <CardSkeleton key={k} />)}</>
        ) : emi ? (
          <>
            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Project Cost</Text>
              <Text style={styles.summaryTotal}>₹{emi.totalCost.toLocaleString("en-IN")}</Text>
              <ProgressBar progress={paidPct} height={10} showLabel color={Colors.success} />
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryItemLabel}>Paid</Text>
                  <Text style={[styles.summaryItemVal, { color: Colors.success }]}>
                    ₹{emi.amountPaid.toLocaleString("en-IN")}
                  </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryItemLabel}>Remaining</Text>
                  <Text style={[styles.summaryItemVal, { color: Colors.warning }]}>
                    ₹{emi.remainingAmount.toLocaleString("en-IN")}
                  </Text>
                </View>
              </View>
            </View>

            {/* Next EMI */}
            <Card style={styles.nextEmiCard}>
              <View style={styles.nextEmiRow}>
                <View>
                  <Text style={styles.nextLabel}>Next EMI Due</Text>
                  <Text style={styles.nextDate}>{emi.nextEmiDate}</Text>
                </View>
                <Text style={styles.nextAmount}>₹{emi.nextEmiAmount.toLocaleString("en-IN")}</Text>
              </View>
            </Card>

            {/* Payment History */}
            <Text style={styles.sectionTitle}>Payment History</Text>
            {emi.history?.map((inst: EmiInstallment) => (
              <Card key={inst.installmentNo} style={styles.instCard}>
                <View style={styles.instRow}>
                  <View style={styles.instNo}>
                    <Text style={styles.instNoText}>#{inst.installmentNo}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.instDue}>Due: {inst.dueDate}</Text>
                    <Text style={styles.instAmount}>₹{inst.amount.toLocaleString("en-IN")}</Text>
                  </View>
                  <Badge label={inst.status} status={inst.status} size="sm" />
                </View>
              </Card>
            ))}
          </>
        ) : null}
      </ScrollView>
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
  backText: { fontSize: FontSize.base, color: Colors.primary, fontWeight: "600" },
  heading: { fontSize: FontSize.lg, fontWeight: "700", color: Colors.ink },
  content: { padding: Spacing.xl, paddingBottom: 40 },

  summaryCard: {
    backgroundColor: Colors.navy,
    borderRadius: 24,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadow.lg,
  },
  summaryLabel: { fontSize: FontSize.sm, color: "rgba(255,255,255,0.6)", marginBottom: Spacing.sm },
  summaryTotal: {
    fontSize: FontSize["4xl"],
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: -1,
    marginBottom: Spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    marginTop: Spacing.lg,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: Spacing.md,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryItemLabel: { fontSize: FontSize.xs, color: "rgba(255,255,255,0.5)", marginBottom: 4 },
  summaryItemVal: { fontSize: FontSize.lg, fontWeight: "800" },
  summaryDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.15)" },

  nextEmiCard: { marginBottom: Spacing.xl },
  nextEmiRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nextLabel: { fontSize: FontSize.sm, color: Colors.muted, fontWeight: "600" },
  nextDate: { fontSize: FontSize.md, fontWeight: "700", color: Colors.ink, marginTop: 2 },
  nextAmount: { fontSize: FontSize["2xl"], fontWeight: "800", color: Colors.primary },

  sectionTitle: { fontSize: FontSize.md, fontWeight: "700", color: Colors.ink, marginBottom: Spacing.md },
  instCard: { marginBottom: Spacing.sm, padding: Spacing.md },
  instRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  instNo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  instNoText: { fontSize: FontSize.sm, fontWeight: "700", color: Colors.muted },
  instDue: { fontSize: FontSize.xs, color: Colors.muted },
  instAmount: { fontSize: FontSize.md, fontWeight: "700", color: Colors.ink, marginTop: 2 },
});
