// Onboarding screen — select vibe preferences
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../src/theme";
import { VIBE_TAGS, VIBE_EMOJI } from "../../src/types";
import { useAppStore } from "../../src/store";
import { api } from "../../src/api";

export default function OnboardingScreen() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const setOnboarded = useAppStore((s) => s.setOnboarded);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggle = (vibe: string) => {
    setSelected((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const handleContinue = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await api.updateUser(currentUser.id, {
        vibePrefs: selected.join(","),
      });
      setOnboarded(true);
      router.replace("/(tabs)");
    } catch {
      // Even if API fails, let them continue
      setOnboarded(true);
      router.replace("/(tabs)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>✨</Text>
        <Text style={styles.title}>What's your vibe?</Text>
        <Text style={styles.subtitle}>
          Pick at least 2 so we can find the right parties for you
        </Text>
      </View>

      <ScrollView style={styles.grid} showsVerticalScrollIndicator={false}>
        <View style={styles.vibeGrid}>
          {VIBE_TAGS.map((vibe) => {
            const isSelected = selected.includes(vibe);
            return (
              <Pressable
                key={vibe}
                onPress={() => toggle(vibe)}
                style={[
                  styles.vibeChip,
                  isSelected && styles.vibeChipSelected,
                ]}
              >
                <Text style={styles.vibeEmoji}>{VIBE_EMOJI[vibe]}</Text>
                <Text
                  style={[
                    styles.vibeLabel,
                    isSelected && styles.vibeLabelSelected,
                  ]}
                >
                  {vibe}
                </Text>
                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={theme.colors.primaryLight}
                    style={{ marginLeft: 2 }}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.button,
            (selected.length < 2 || loading) && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selected.length < 2 || loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Saving..." : "Continue"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 6,
    textAlign: "center",
  },
  grid: {
    flex: 1,
    paddingHorizontal: 20,
  },
  vibeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  vibeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  vibeChipSelected: {
    backgroundColor: theme.colors.primaryBg,
    borderColor: theme.colors.primary,
  },
  vibeEmoji: {
    fontSize: 18,
  },
  vibeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  vibeLabelSelected: {
    color: theme.colors.primaryLight,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
