import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Colors, FontSize, Spacing } from "../../../constants/theme";
import { Card } from "../../../src/components/ui/Card";
import { CardSkeleton } from "../../../src/components/ui/Skeleton";
import { internApi } from "../../../src/lib/api";
import { InternDocument } from "../../../src/types";

const DOC_META: Record<string, { emoji: string; desc: string }> = {
  offer_letter: {
    emoji: "📄",
    desc: "Your official internship offer letter from Softyana Technologies.",
  },
  certificate: {
    emoji: "🏆",
    desc: "Completion certificate awarded after successful internship.",
  },
  lor: {
    emoji: "📝",
    desc: "Letter of Recommendation from your mentor.",
  },
};

export default function DocumentsScreen() {
  const { data: docs, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["intern-docs"],
    queryFn: () => internApi.getDocuments().then((r) => r.data as InternDocument[]),
  });

  function handleDownload(doc: InternDocument) {
    if (!doc.available) {
      Alert.alert(
        "Not Available Yet",
        `${doc.label} will be available after your internship completes.`
      );
      return;
    }
    if (doc.pdfUrl) {
      Linking.openURL(doc.pdfUrl);
    } else {
      Alert.alert("Coming Soon", "Document generation is in progress. Check back soon.");
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Documents</Text>
        <Text style={styles.subtitle}>Official internship documents</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {isLoading ? (
          <>{[1, 2, 3].map((k) => <CardSkeleton key={k} />)}</>
        ) : (
          (docs ?? []).map((doc: InternDocument) => {
            const meta = DOC_META[doc.type] ?? { emoji: "📎", desc: "" };
            return (
              <Card key={doc.type} style={[styles.docCard, !doc.available ? styles.docLocked : null]}>
                <View style={styles.docRow}>
                  <View style={[styles.emojiBox, !doc.available && styles.emojiBoxLocked]}>
                    <Text style={styles.emoji}>{doc.available ? meta.emoji : "🔒"}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.docLabel}>{doc.label}</Text>
                    <Text style={styles.docDesc}>{meta.desc}</Text>
                    {doc.verificationCode && (
                      <View style={styles.verifyRow}>
                        <Text style={styles.verifyLabel}>Verify: </Text>
                        <Text style={styles.verifyCode}>{doc.verificationCode}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.downloadBtn, !doc.available && styles.downloadBtnLocked]}
                  onPress={() => handleDownload(doc)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.downloadText, !doc.available && styles.downloadTextLocked]}>
                    {doc.available ? "⬇ Download PDF" : "🔒 Not available yet"}
                  </Text>
                </TouchableOpacity>
              </Card>
            );
          })
        )}

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>📧 Contact Us</Text>
          <Text style={styles.infoText}>
            For any document-related queries, reach us at:
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL("mailto:softyana.tech@gmail.com")}>
            <Text style={styles.emailLink}>softyana.tech@gmail.com</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
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

  docCard: { marginBottom: Spacing.md },
  docLocked: { opacity: 0.7 },
  docRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: Spacing.md, gap: Spacing.md },
  emojiBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiBoxLocked: { backgroundColor: Colors.soft },
  emoji: { fontSize: 26 },
  docLabel: { fontSize: FontSize.md, fontWeight: "700", color: Colors.ink },
  docDesc: { fontSize: FontSize.sm, color: Colors.muted, marginTop: 2, lineHeight: 18 },
  verifyRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  verifyLabel: { fontSize: FontSize.xs, color: Colors.muted, fontWeight: "600" },
  verifyCode: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: "700", letterSpacing: 1 },

  downloadBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  downloadBtnLocked: { backgroundColor: Colors.soft },
  downloadText: { fontSize: FontSize.sm, fontWeight: "700", color: Colors.white },
  downloadTextLocked: { color: Colors.muted },

  infoCard: { marginTop: Spacing.md },
  infoTitle: { fontSize: FontSize.md, fontWeight: "700", color: Colors.ink, marginBottom: Spacing.sm },
  infoText: { fontSize: FontSize.sm, color: Colors.muted, lineHeight: 20 },
  emailLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: "700", marginTop: Spacing.sm },
});
