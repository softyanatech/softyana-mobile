import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Colors, Radius, Shadow, Spacing } from "../../../constants/theme";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "default" | "elevated" | "flat" | "colored";
  padding?: number;
}

export function Card({
  children,
  style,
  variant = "default",
  padding = Spacing.lg,
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        variant === "elevated" && Shadow.md,
        variant === "flat" && styles.flat,
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.line,
    ...Shadow.sm,
  },
  flat: {
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
    backgroundColor: Colors.soft,
  },
});
