import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, FontSize } from "../../../constants/theme";

interface AvatarProps {
  name: string;
  size?: number;
  bg?: string;
  color?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const BG_COLORS = [
  "#EBF1FD",
  "#EFEFFD",
  "#D1FAE5",
  "#FEF3C7",
  "#FEE2E2",
  "#E0F2FE",
];
const TEXT_COLORS = [
  "#1A56DB",
  "#6C63FF",
  "#059669",
  "#D97706",
  "#DC2626",
  "#0369A1",
];

function colorIndex(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h) % BG_COLORS.length;
}

export function Avatar({ name, size = 40, bg, color }: AvatarProps) {
  const idx = colorIndex(name);
  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg ?? BG_COLORS[idx],
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: size * 0.35,
            color: color ?? TEXT_COLORS[idx],
          },
        ]}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
  text: { fontWeight: "700" },
});
