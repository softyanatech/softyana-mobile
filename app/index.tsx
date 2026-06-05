import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../src/contexts/AuthContext";
import { Colors } from "../constants/theme";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(tagOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      if (isLoading) return;
      if (isAuthenticated && user) {
        router.replace(user.role === "intern" ? "/(intern)" : "/(client)");
      } else {
        router.replace("/onboarding");
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, user]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ scale: logoScale }], opacity: logoOpacity },
        ]}
      >
        <View style={styles.logoBox}>
          <Text style={styles.logoLetter}>S</Text>
        </View>
        <Text style={styles.logoText}>Softyana</Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
        Technologies
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: { alignItems: "center" },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  logoLetter: {
    fontSize: 40,
    fontWeight: "900",
    color: Colors.white,
    letterSpacing: -1,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 4,
    marginTop: 8,
    textTransform: "uppercase",
  },
});
