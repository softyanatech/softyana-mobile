import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, FontSize, Radius } from "../../../constants/theme";

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  progress,
  color = Colors.primary,
  height = 6,
  showLabel = false,
  label,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View>
      {(showLabel || label) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.labelText}>{label}</Text>}
          {showLabel && (
            <Text style={[styles.labelText, { color }]}>{clampedProgress}%</Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height, borderRadius: height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              height,
              borderRadius: height,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: Colors.line,
    overflow: "hidden",
    borderRadius: Radius.full,
  },
  fill: { borderRadius: Radius.full },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  labelText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.muted,
  },
});
