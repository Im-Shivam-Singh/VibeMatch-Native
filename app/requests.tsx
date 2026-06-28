// Requests screen — view and manage join requests for hosted parties
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../src/theme";
import { api } from "../../src/api";
import { useAppStore } from "../../src/store";
import { JoinRequest, relativeTime, Party } from "../../src/types";
import { LoadingSpinner } from "../../src/components/LoadingSpinner";
import { EmptyState } from "../../src/components/EmptyState";

export default function RequestsScreen() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const [parties, setParties] = useState<Party[]>([]);
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const res = await api.listParties({});
        const mine = res.parties.filter((p) => p.hostId === currentUser.id);
        setParties(mine);
        if (mine.length > 0) {
          setSelectedParty(mine[0].id);
          const reqRes = await api.listRequests(mine[0].id);
          setRequests(reqRes.requests);
        }
      } catch (err) {
        console.error("Failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  const handleStatusUpdate = async (requestId: string, status: "accepted" | "rejected") => {
    setUpdating(requestId);
    try {
      await api.updateRequest(requestId, status);
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status } : r))
      );
      Alert.alert(
        status === "accepted" ? "Accepted! 🎉" : "Rejected",
        status === "accepted" ? "The guest has been notified" : "Request declined"
      );
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update request");
    } finally {
      setUpdating(null);
    }
  };

  const fetchRequestsForParty = async (partyId: string) => {
    setSelectedParty(partyId);
    try {
      const res = await api.listRequests(partyId);
      setRequests(res.requests);
    } catch (err) {
      console.error("Failed:", err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (selectedParty) {
      await fetchRequestsForParty(selectedParty);
    }
    setRefreshing(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Join Requests</Text>
      </View>

      {/* Party selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.partySelector}>
        {parties.map((p) => (
          <Pressable
            key={p.id}
            style={[styles.partyChip, selectedParty === p.id && styles.partyChipActive]}
            onPress={() => fetchRequestsForParty(p.id)}
          >
            <Text style={[styles.partyChipText, selectedParty === p.id && styles.partyChipTextActive]} numberOfLines={1}>
              {p.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.requestAvatar}>
                <Text style={styles.requestAvatarText}>
                  {item.requesterName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.requestName}>{item.requesterName}</Text>
                <Text style={styles.requestTime}>{relativeTime(item.createdAt)}</Text>
              </View>
              <StatusBadge status={item.status} />
            </View>
            <Text style={styles.requestMessage}>{item.introMessage}</Text>
            {item.status === "pending" && (
              <View style={styles.actionRow}>
                <Pressable
                  style={[styles.actionBtn, styles.acceptBtn, updating === item.id && styles.actionBtnDisabled]}
                  onPress={() => handleStatusUpdate(item.id, "accepted")}
                  disabled={updating === item.id}
                >
                  <Ionicons name="checkmark" size={18} color={theme.colors.success} />
                  <Text style={styles.acceptText}>Accept</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionBtn, styles.rejectBtn, updating === item.id && styles.actionBtnDisabled]}
                  onPress={() => handleStatusUpdate(item.id, "rejected")}
                  disabled={updating === item.id}
                >
                  <Ionicons name="close" size={18} color={theme.colors.danger} />
                  <Text style={styles.rejectText}>Reject</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <EmptyState emoji="📭" title="No requests" subtitle="Requests will appear here when guests want to join" />
        }
      />
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: theme.colors.warningBg, text: theme.colors.warning },
    accepted: { bg: theme.colors.successBg, text: theme.colors.success },
    rejected: { bg: theme.colors.dangerBg, text: theme.colors.danger },
  };
  const c = colors[status] || colors.pending;
  return (
    <View style={[styles.statusBadge, { backgroundColor: c.bg }]}>
      <Text style={[styles.statusText, { color: c.text }]}>{status}</Text>
    </View>
  );
}

import { ScrollView } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 22, fontWeight: "800", color: theme.colors.text },
  partySelector: {
    paddingHorizontal: 16, marginBottom: 8, maxHeight: 44,
  },
  partyChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, marginRight: 6,
  },
  partyChipActive: { backgroundColor: theme.colors.primaryBg, borderColor: theme.colors.primary },
  partyChipText: { color: theme.colors.textSecondary, fontSize: 13, fontWeight: "600" },
  partyChipTextActive: { color: theme.colors.primaryLight },
  requestCard: {
    backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
    padding: 14, borderWidth: 1, borderColor: theme.colors.border, gap: 10,
  },
  requestHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  requestAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: theme.colors.primaryBg, alignItems: "center", justifyContent: "center",
  },
  requestAvatarText: { color: theme.colors.primaryLight, fontSize: 14, fontWeight: "700" },
  requestName: { color: theme.colors.text, fontSize: 14, fontWeight: "600" },
  requestTime: { color: theme.colors.textMuted, fontSize: 11 },
  requestMessage: { color: theme.colors.textSecondary, fontSize: 13, lineHeight: 18 },
  actionRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, padding: 10, borderRadius: theme.borderRadius.md,
  },
  acceptBtn: { backgroundColor: theme.colors.successBg, borderWidth: 1, borderColor: "rgba(34,197,94,0.3)" },
  rejectBtn: { backgroundColor: theme.colors.dangerBg, borderWidth: 1, borderColor: "rgba(239,68,68,0.3)" },
  actionBtnDisabled: { opacity: 0.5 },
  acceptText: { color: theme.colors.success, fontWeight: "700", fontSize: 13 },
  rejectText: { color: theme.colors.danger, fontWeight: "700", fontSize: 13 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
});
