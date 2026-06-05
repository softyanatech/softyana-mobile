import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  RefreshControlProps,
  StatusBar,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/theme";

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  noPadding?: boolean;
  dark?: boolean;
}

export function ScreenWrapper({
  children,
  scrollable = true,
  refreshControl,
  style,
  contentStyle,
  noPadding = false,
  dark = false,
}: ScreenWrapperProps) {
  const bg = dark ? Colors.navy : Colors.bg;

  if (scrollable) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: bg }, style]}>
        <StatusBar
          barStyle={dark ? "light-content" : "dark-content"}
          backgroundColor={bg}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            !noPadding && styles.content,
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }, style]}>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor={bg}
      />
      <View style={[!noPadding && styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
});
