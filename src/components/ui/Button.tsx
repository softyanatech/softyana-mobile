import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors, Radius, FontSize, Shadow } from "../../../constants/theme";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const containerStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    variant === "primary" && Shadow.lg,
    style,
  ];

  const tStyle = [styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], textStyle];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? Colors.white : Colors.primary}
          size="small"
        />
      ) : (
        <Text style={tStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.lg,
  },
  fullWidth: { width: "100%" },
  disabled: { opacity: 0.5 },

  primary: { backgroundColor: Colors.primary },
  secondary: { backgroundColor: Colors.navy },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: { backgroundColor: Colors.soft },
  danger: { backgroundColor: Colors.danger },

  size_sm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: Radius.md },
  size_md: { paddingVertical: 13, paddingHorizontal: 24 },
  size_lg: { paddingVertical: 16, paddingHorizontal: 32 },

  text: { fontWeight: "700", letterSpacing: 0.2 },
  text_primary: { color: Colors.white },
  text_secondary: { color: Colors.white },
  text_outline: { color: Colors.primary },
  text_ghost: { color: Colors.ink },
  text_danger: { color: Colors.white },

  textSize_sm: { fontSize: FontSize.sm },
  textSize_md: { fontSize: FontSize.base },
  textSize_lg: { fontSize: FontSize.md },
});
