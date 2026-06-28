// My Parties screen — list of parties the user has hosted
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../src/theme";
import { api } from "../../src/api";
import { useAppStore } from "../../src/store";
import { Party, formatDateLabel, formatTime, formatFee, parseVibes } from "../../src/types";
import { LoadingSpinner } from "../../src/components/LoadingSpinner";
import { EmptyState } from "../../src/components/EmptyState";
import { VibeBadge } from "../../src/components/VibeBadge";

export default function MyPartiesScreen() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchParties = async () => {
    if (!currentUser) return;
    try {
      const res = await api.listParties({});
      const mine = res.parties.filter((p) => p.hostId === currentUser.id);
      setParties(mine);
    } catch (err) {
      console.error("Failed:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, [currentUser]);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>My Parties</Text>
      </View>

      <FlatList
        data={parties}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchParties(); }} tintColor={theme.colors.primary} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => {
          const vibes = parseVibes(item.vibes);
          return (
            <Pressable
              style={styles.partyCard}
              onPress={() => router.push({ pathname: "/party/[id]", params: { id: item.id } })}
            >
              <View style={styles.partyTop}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.partyTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.partyMeta}>
                    {formatDateLabel(item.date)} · {formatTime(item.time)}
                  </Text>
                </View>
                <Text style={styles.partyFee}>{formatFee(item.fee, item.city)}</Text>
              </View>
              <View style={styles.vibeRow}>
                {vibes.slice(0, 3).map((v) => <VibeBadge key={v} vibe={v} size="sm" />)}
              </View>
              <View style={styles.partyFooter}>
                <Text style={styles.partyGuests}>
                  👥 {item.guestCount}/{item.maxGuests}
                </Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={<EmptyState emoji="🎉" title="No parties yet" subtitle="Host your first vibe!" />}
      />
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
  partyCard: {
    backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
    padding: 14, borderWidth: 1, borderColor: theme.colors.border, gap: 8,
  },
  partyTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  partyTitle: { color: theme.colors.text, fontSize: 16, fontWeight: "700" },
  partyMeta: { color: theme.colors.textMuted, fontSize: 12 },
  partyFee: { color: theme.colors.primaryLight, fontSize: 16, fontWeight: "700" },
  vibeRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  partyFooter: { flexDirection: "row", justifyContent: "space-between" },
  partyGuests: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: "600" },
});
