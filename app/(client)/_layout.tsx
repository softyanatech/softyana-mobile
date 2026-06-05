import React from "react";
import { Tabs, Redirect } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { Colors, Shadow } from "../../constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconActive]}>
      <View style={{ fontSize: 20 } as any}>
        {/* Using text emoji icons since no icon library is required */}
        <View style={{ width: 22, height: 22, alignItems: "center", justifyContent: "center" }}>
          {/* rendered inline below */}
        </View>
      </View>
    </View>
  );
}

export default function ClientLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (!isLoading && !isAuthenticated) return <Redirect href="/auth/login" />;
  if (!isLoading && user?.role === "intern") return <Redirect href="/(intern)" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }}
      />
      <Tabs.Screen
        name="projects/index"
        options={{ title: "Projects", tabBarIcon: ({ focused }) => <TabIcon emoji="📁" focused={focused} /> }}
      />
      <Tabs.Screen
        name="invoices/index"
        options={{ title: "Invoices", tabBarIcon: ({ focused }) => <TabIcon emoji="🧾" focused={focused} /> }}
      />
      <Tabs.Screen
        name="support/index"
        options={{ title: "Support", tabBarIcon: ({ focused }) => <TabIcon emoji="🎧" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }}
      />
      {/* Hidden screens (detail screens shown via stack) */}
      <Tabs.Screen name="projects/[id]" options={{ href: null }} />
      <Tabs.Screen name="invoices/emi" options={{ href: null }} />
      <Tabs.Screen name="support/new" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    paddingTop: 8,
    height: Platform.OS === "ios" ? 84 : 64,
    ...Shadow.md,
  },
  tabLabel: { fontSize: 11, fontWeight: "600", marginTop: -4 },
  tabItem: { paddingTop: 4 },
  iconWrapper: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  iconActive: { backgroundColor: Colors.primaryLight },
});
