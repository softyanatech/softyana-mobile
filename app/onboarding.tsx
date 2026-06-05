import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, Spacing } from "../constants/theme";
import { Button } from "../src/components/ui/Button";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    emoji: "📊",
    title: "Track your project\nin real-time",
    description:
      "Monitor milestones, timelines, and team progress with live updates from your dedicated project manager.",
    bg: "#EBF1FD",
    accent: Colors.primary,
  },
  {
    id: "2",
    emoji: "💳",
    title: "Pay in easy\nEMI installments",
    description:
      "Spread your project cost over months with zero-interest EMI. No hidden charges, ever.",
    bg: "#EFEFFD",
    accent: Colors.accent,
  },
  {
    id: "3",
    emoji: "📈",
    title: "Get monthly\nperformance reports",
    description:
      "Receive detailed reports on website speed, uptime, SEO score, and growth metrics every month.",
    bg: "#D1FAE5",
    accent: Colors.success,
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  function handleNext() {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex((i) => i + 1);
    } else {
      router.replace("/auth/login");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => router.replace("/auth/login")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(idx);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.emojiContainer, { backgroundColor: item.bg }]}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
        <Button
          title={activeIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          fullWidth
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  skipBtn: { alignSelf: "flex-end", padding: Spacing.lg },
  skipText: { fontSize: FontSize.base, color: Colors.muted, fontWeight: "600" },

  slide: {
    alignItems: "center",
    paddingHorizontal: Spacing["3xl"],
    paddingTop: Spacing["2xl"],
  },
  emojiContainer: {
    width: 140,
    height: 140,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  emoji: { fontSize: 64 },
  title: {
    fontSize: FontSize["3xl"],
    fontWeight: "800",
    color: Colors.ink,
    textAlign: "center",
    lineHeight: 40,
    marginBottom: Spacing.lg,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: 26,
  },

  footer: {
    padding: Spacing.xl,
    paddingBottom: Spacing["3xl"],
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.line,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
});
