import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontSize, Radius } from "../../../constants/theme";
import { StatusColors } from "../../../constants/theme";

interface BadgeProps {
  label: string;
  status?: string;
  bg?: string;
  color?: string;
  size?: "sm" | "md";
}

export function Badge({ label, status, bg, color, size = "md" }: BadgeProps) {
  const statusStyle = status ? StatusColors[status] ?? { bg: "#F3F4F6", text: "#6B7280" } : null;

  return (
    <View
      style={[
        styles.base,
        size === "sm" && styles.sm,
        { backgroundColor: bg ?? statusStyle?.bg ?? "#F3F4F6" },
      ]}
    >
      <Text
        style={[
          styles.text,
          size === "sm" && styles.textSm,
          { color: color ?? statusStyle?.text ?? "#6B7280" },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    alignSelf: "flex-start",
  },
  sm: { paddingHorizontal: 8, paddingVertical: 2 },
  text: { fontSize: FontSize.xs, fontWeight: "700", letterSpacing: 0.3 },
  textSm: { fontSize: 10 },
});
