import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Colors, FontSize, Radius, Spacing } from "../../../constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secure?: boolean;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  secure,
  style,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.container, error ? styles.containerError : null]}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithLeft : null, style]}
          placeholderTextColor={Colors.muted}
          secureTextEntry={secure && !showPassword}
          autoCapitalize="none"
          {...props}
        />
        {secure && (
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setShowPassword((v) => !v)}
          >
            <Text style={{ color: Colors.muted, fontSize: FontSize.sm }}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        )}
        {!secure && rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.md },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.inkLight,
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.soft,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.line,
  },
  containerError: { borderColor: Colors.danger },
  input: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.base,
    color: Colors.ink,
  },
  inputWithLeft: { paddingLeft: Spacing.sm },
  icon: { paddingHorizontal: Spacing.md },
  error: {
    fontSize: FontSize.xs,
    color: Colors.danger,
    marginTop: 4,
  },
});
