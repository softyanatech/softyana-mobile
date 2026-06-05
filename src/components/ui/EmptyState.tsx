import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, FontSize, Spacing } from "../../../constants/theme";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          size="sm"
          style={{ marginTop: Spacing.lg }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: Spacing["4xl"],
    paddingHorizontal: Spacing["2xl"],
  },
  icon: { fontSize: 48, marginBottom: Spacing.lg },
  title: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.ink,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.base,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: 22,
  },
});
