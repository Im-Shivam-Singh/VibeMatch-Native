// Host Dashboard screen — analytics and party management
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../src/theme";
import { api } from "../../src/api";
import { useAppStore } from "../../src/store";
import { HostAnalytics } from "../../src/types";
import { LoadingSpinner } from "../../src/components/LoadingSpinner";
import { EmptyState } from "../../src/components/EmptyState";

export default function HostDashboardScreen() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const [analytics, setAnalytics] = useState<HostAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    if (!currentUser) return;
    try {
      const res = await api.getHostAnalytics(currentUser.id);
      setAnalytics(res);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [currentUser]);

  if (loading) return <LoadingSpinner />;
  if (!analytics) return <EmptyState emoji="📊" title="No data yet" subtitle="Host a party to see your analytics" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Host Dashboard</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAnalytics(); }} tintColor={theme.colors.primary} />}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard icon="eye" label="Total Views" value={String(analytics.totalViews)} />
          <StatCard icon="people" label="Total Guests" value={String(analytics.totalGuests)} />
          <StatCard icon="mail" label="Requests" value={String(analytics.totalRequests)} />
          <StatCard icon="checkmark-circle" label="Accepted" value={String(analytics.acceptedRequests)} />
          <StatCard icon="close-circle" label="Rejected" value={String(analytics.rejectedRequests)} />
          <StatCard icon="speedometer" label="Accept Rate" value={`${analytics.acceptanceRate}%`} />
          <StatCard icon="star" label="Avg Rating" value={analytics.avgRating.toFixed(1)} />
          <StatCard icon="calendar" label="Parties" value={String(analytics.partyCount)} />
        </View>

        {/* Top Parties */}
        {analytics.topParties.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Parties</Text>
            {analytics.topParties.map((tp) => (
              <View key={tp.partyId} style={styles.topPartyCard}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.topPartyTitle} numberOfLines={1}>{tp.title}</Text>
                  <Text style={styles.topPartyMeta}>
                    👁 {tp.views} · 📩 {tp.requests} · 👥 {tp.guests}/{tp.capacity}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <Pressable
          style={styles.requestsBtn}
          onPress={() => router.push("/requests")}
        >
          <Ionicons name="mail-open" size={20} color={theme.colors.primaryLight} />
          <Text style={styles.requestsBtnText}>View Join Requests</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function StatCard({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={18} color={theme.colors.primaryLight} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 22, fontWeight: "800", color: theme.colors.text },
  statsGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 8, padding: 16,
  },
  statCard: {
    width: "47%", backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md,
    padding: 14, gap: 4, borderWidth: 1, borderColor: theme.colors.border,
  },
  statValue: { color: theme.colors.primaryLight, fontSize: 22, fontWeight: "800" },
  statLabel: { color: theme.colors.textMuted, fontSize: 11, fontWeight: "600" },
  section: { paddingHorizontal: 16, gap: 8 },
  sectionTitle: { color: theme.colors.text, fontSize: 16, fontWeight: "700" },
  topPartyCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: theme.colors.surface,
    padding: 12, borderRadius: theme.borderRadius.md, borderWidth: 1, borderColor: theme.colors.border,
  },
  topPartyTitle: { color: theme.colors.text, fontSize: 14, fontWeight: "600" },
  topPartyMeta: { color: theme.colors.textMuted, fontSize: 12 },
  requestsBtn: {
    flexDirection: "row", alignItems: "center", gap: 10,
    marginHorizontal: 16, marginTop: 16, padding: 14,
    backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  requestsBtnText: { flex: 1, color: theme.colors.text, fontSize: 15, fontWeight: "600" },
});
