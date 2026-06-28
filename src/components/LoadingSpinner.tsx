// LoadingSpinner — centered activity indicator
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { theme } from "../theme";

export function LoadingSpinner({ size = "large" }: { size?: "small" | "large" }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});
