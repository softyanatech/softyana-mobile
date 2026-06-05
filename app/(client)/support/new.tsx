import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Colors, FontSize, Spacing } from "../../../constants/theme";
import { Input } from "../../../src/components/ui/Input";
import { Button } from "../../../src/components/ui/Button";
import { clientApi } from "../../../src/lib/api";

const PRIORITIES = ["Low", "Medium", "High"] as const;
type Priority = (typeof PRIORITIES)[number];

export default function NewTicket() {
  const router = useRouter();
  const qc = useQueryClient();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate, isPending } = useMutation({
    mutationFn: () => clientApi.createTicket({ subject, description, priority }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
      Alert.alert("Ticket Raised!", "Our team will respond within 24 hours.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
    onError: () => Alert.alert("Error", "Failed to raise ticket. Please try again."),
  });

  function validate() {
    const e: Record<string, string> = {};
    if (!subject.trim()) e.subject = "Subject is required";
    if (!description.trim()) e.description = "Description is required";
    else if (description.trim().length < 20) e.description = "Please describe in at least 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (validate()) mutate();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>New Ticket</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Input
            label="Subject"
            value={subject}
            onChangeText={setSubject}
            placeholder="Brief summary of the issue"
            error={errors.subject}
          />

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your issue in detail..."
            multiline
            numberOfLines={5}
            style={{ minHeight: 120, textAlignVertical: "top" }}
            error={errors.description}
          />

          <Text style={styles.priorityLabel}>Priority</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityBtn,
                  priority === p && styles.priorityBtnActive,
                  p === "High" && priority === p && styles.priorityHigh,
                  p === "Low" && priority === p && styles.priorityLow,
                ]}
                onPress={() => setPriority(p)}
              >
                <Text
                  style={[
                    styles.priorityBtnText,
                    priority === p && styles.priorityBtnTextActive,
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 Our team responds within 24 hours on business days. For urgent matters, mark priority as High.
            </Text>
          </View>

          <Button
            title="Raise Ticket"
            onPress={handleSubmit}
            loading={isPending}
            fullWidth
            size="lg"
            style={{ marginTop: Spacing.md }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  backText: { fontSize: FontSize.base, color: Colors.primary, fontWeight: "600" },
  heading: { fontSize: FontSize.lg, fontWeight: "700", color: Colors.ink },
  content: { padding: Spacing.xl, paddingBottom: 40 },
  priorityLabel: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.inkLight, marginBottom: 8 },
  priorityRow: { flexDirection: "row", gap: Spacing.md, marginBottom: Spacing.xl },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.line,
    alignItems: "center",
    backgroundColor: Colors.soft,
  },
  priorityBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  priorityHigh: { borderColor: Colors.danger, backgroundColor: "#FEE2E2" },
  priorityLow: { borderColor: Colors.success, backgroundColor: "#D1FAE5" },
  priorityBtnText: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.muted },
  priorityBtnTextActive: { color: Colors.primary },
  infoBox: {
    backgroundColor: Colors.soft,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoText: { fontSize: FontSize.sm, color: Colors.muted, lineHeight: 20 },
});
