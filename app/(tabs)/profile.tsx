// Profile screen — user profile with menu items
import React from "react";
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
import { useAppStore } from "../../src/store";

export default function ProfileScreen() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const logout = useAppStore((s) => s.logout);

  if (!currentUser) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUser.name?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{currentUser.name}</Text>
            {currentUser.username && (
              <Text style={styles.userUsername}>@{currentUser.username}</Text>
            )}
            {currentUser.city && (
              <View style={styles.cityRow}>
                <Ionicons name="location" size={12} color={theme.colors.textMuted} />
                <Text style={styles.userCity}>{currentUser.city}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentUser.vibes}</Text>
            <Text style={styles.statLabel}>Vibes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentUser.hosted}</Text>
            <Text style={styles.statLabel}>Hosted</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentUser.rating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <MenuItem
            icon="create"
            label="Edit Profile"
            onPress={() => router.push("/edit-profile")}
          />
          <MenuItem
            icon="calendar"
            label="My Parties"
            onPress={() => router.push("/my-parties")}
          />
          <MenuItem
            icon="stats-chart"
            label="Host Dashboard"
            onPress={() => router.push("/host-dashboard")}
          />
          <MenuItem
            icon="mail-open"
            label="Join Requests"
            onPress={() => router.push("/requests")}
          />
          <MenuItem
            icon="bookmark"
            label="Saved Parties"
            onPress={() => {}}
          />
          <MenuItem
            icon="settings"
            label="Settings"
            onPress={() => {}}
          />
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutBtn} onPress={() => {
          logout();
          router.replace("/(auth)/login");
        }}>
          <Ionicons name="log-out" size={20} color={theme.colors.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={20} color={theme.colors.textSecondary} />
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.text,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryBg,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: theme.colors.primaryLight,
    fontSize: 24,
    fontWeight: "700",
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  userUsername: {
    color: theme.colors.primaryLight,
    fontSize: 13,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  userCity: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: {
    color: theme.colors.primaryLight,
    fontSize: 20,
    fontWeight: "800",
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  menuSection: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuLabel: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "500",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.dangerBg,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
  },
  logoutText: {
    color: theme.colors.danger,
    fontSize: 15,
    fontWeight: "700",
  },
});
