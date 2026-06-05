import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { Colors, Radius } from "../../../constants/theme";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = Radius.md,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        { width: width as number, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

export function CardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Skeleton width={48} height={48} borderRadius={24} />
        <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
          <Skeleton height={14} width="70%" />
          <Skeleton height={12} width="50%" />
        </View>
      </View>
      <Skeleton height={12} style={{ marginTop: 12 }} />
      <Skeleton height={12} width="80%" style={{ marginTop: 6 }} />
      <Skeleton height={6} style={{ marginTop: 16, borderRadius: 99 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: Colors.line },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.line,
    marginBottom: 12,
  },
  row: { flexDirection: "row", alignItems: "center" },
});
