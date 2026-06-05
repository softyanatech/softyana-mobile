import React from "react";
import { Tabs, Redirect } from "expo-router";
import { StyleSheet, Platform } from "react-native";
import { Colors } from "../../constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";

export default function InternLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (!isLoading && !isAuthenticated) return <Redirect href="/auth/login" />;
  if (!isLoading && user?.role === "client") return <Redirect href="/(client)" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="tasks/index" options={{ title: "Tasks" }} />
      <Tabs.Screen name="standup/index" options={{ title: "Standup" }} />
      <Tabs.Screen name="documents/index" options={{ title: "Docs" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
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
  },
  tabLabel: { fontSize: 11, fontWeight: "600" },
  tabItem: { paddingTop: 4 },
});
