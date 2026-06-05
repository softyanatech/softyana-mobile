import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Colors, FontSize, Spacing } from "../../../constants/theme";
import { Card } from "../../../src/components/ui/Card";
import { Badge } from "../../../src/components/ui/Badge";
import { EmptyState } from "../../../src/components/ui/EmptyState";
import { CardSkeleton } from "../../../src/components/ui/Skeleton";
import { Button } from "../../../src/components/ui/Button";
import { clientApi } from "../../../src/lib/api";
import { Invoice } from "../../../src/types";

export default function InvoicesScreen() {
  const router = useRouter();
  const { data: invoices, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => clientApi.getInvoices().then((r) => r.data as Invoice[]),
  });

  function handleDownload(inv: Invoice) {
    if (inv.pdfUrl) {
      Linking.openURL(inv.pdfUrl);
    } else {
      Alert.alert("PDF Not Available", "Invoice PDF will be available soon.");
    }
  }

  function handlePay(inv: Invoice) {
    Alert.alert("Pay Now", `Pay ₹${inv.amount.toLocaleString("en-IN")} for ${inv.projectName}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Proceed", onPress: () => Alert.alert("Success", "Redirecting to payment gateway...") },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Invoices</Text>
        <TouchableOpacity onPress={() => router.push("/(client)/invoices/emi")}>
          <Text style={styles.emiLink}>EMI Tracker →</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.content}>
          {[1, 2, 3].map((k) => <CardSkeleton key={k} />)}
        </View>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState icon="🧾" title="No invoices yet" description="Your invoices will appear here." />
          }
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.invId}>INV-{item.id.slice(-4).toUpperCase()}</Text>
                  <Text style={styles.projectName}>{item.projectName}</Text>
                </View>
                <View style={styles.right}>
                  <Text style={styles.amount}>₹{item.amount.toLocaleString("en-IN")}</Text>
                  <Badge label={item.status} status={item.status} size="sm" />
                </View>
              </View>

              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Date: </Text>
                <Text style={styles.dateVal}>{item.date}</Text>
                <Text style={[styles.dateLabel, { marginLeft: Spacing.lg }]}>Due: </Text>
                <Text style={[styles.dateVal, item.status === "Pending" && { color: Colors.warning }]}>
                  {item.dueDate}
                </Text>
              </View>

              <View style={styles.actions}>
                <Button
                  title="⬇ Download"
                  onPress={() => handleDownload(item)}
                  variant="outline"
                  size="sm"
                  style={{ flex: 1 }}
                />
                {item.status === "Pending" && (
                  <Button
                    title="Pay Now"
                    onPress={() => handlePay(item)}
                    size="sm"
                    style={{ flex: 1 }}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  title: { fontSize: FontSize["2xl"], fontWeight: "800", color: Colors.ink, letterSpacing: -0.5 },
  emiLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: "700" },
  content: { padding: Spacing.xl, paddingBottom: 40 },
  card: { marginBottom: Spacing.md },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  invId: { fontSize: FontSize.xs, color: Colors.muted, fontWeight: "600" },
  projectName: { fontSize: FontSize.md, fontWeight: "700", color: Colors.ink, marginTop: 2 },
  right: { alignItems: "flex-end", gap: 6 },
  amount: { fontSize: FontSize.xl, fontWeight: "800", color: Colors.ink },
  dateRow: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.md },
  dateLabel: { fontSize: FontSize.xs, color: Colors.muted, fontWeight: "600" },
  dateVal: { fontSize: FontSize.xs, color: Colors.inkLight },
  actions: { flexDirection: "row", gap: Spacing.md },
});
