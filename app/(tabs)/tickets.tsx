// Tickets screen — view purchased tickets with QR codes
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../src/theme";
import { api } from "../../src/api";
import { useAppStore } from "../../src/store";
import { Ticket, formatDateLabel, formatTime, formatFee } from "../../src/types";
import { LoadingSpinner } from "../../src/components/LoadingSpinner";
import { EmptyState } from "../../src/components/EmptyState";

export default function TicketsScreen() {
  const currentUser = useAppStore((s) => s.currentUser);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTickets = async () => {
    if (!currentUser) return;
    try {
      const res = await api.listTickets(currentUser.id);
      setTickets(res.tickets);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [currentUser]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tickets</Text>
      </View>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <View style={styles.ticketCard}>
            <View style={styles.ticketTop}>
              <View style={styles.ticketIcon}>
                <Ionicons name="ticket" size={24} color={theme.colors.primaryLight} />
              </View>
              <View style={styles.ticketInfo}>
                <Text style={styles.ticketTitle} numberOfLines={1}>
                  {item.party?.title || "Party Ticket"}
                </Text>
                <Text style={styles.ticketMeta}>
                  {item.party ? `${formatDateLabel(item.party.date)} · ${formatTime(item.party.time)}` : ""}
                </Text>
              </View>
              <View style={[styles.statusBadge, item.scannedAt ? styles.statusScanned : styles.statusActive]}>
                <Text style={[styles.statusText, item.scannedAt ? styles.statusTextScanned : styles.statusTextActive]}>
                  {item.scannedAt ? "Used" : "Active"}
                </Text>
              </View>
            </View>
            <View style={styles.ticketDivider}>
              <View style={styles.ticketCircle} />
              <View style={styles.ticketLine} />
              <View style={styles.ticketCircle} />
            </View>
            <View style={styles.ticketBottom}>
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code" size={48} color={theme.colors.textMuted} />
              </View>
              <Text style={styles.qrHash} numberOfLines={1}>
                {item.qrHash.slice(0, 16)}...
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            emoji="🎟️"
            title="No tickets yet"
            subtitle="Join a party and get your ticket!"
          />
        }
      />
    </View>
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
  ticketCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ticketTop: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  ticketIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryBg,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketInfo: {
    flex: 1,
    gap: 2,
  },
  ticketTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  ticketMeta: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: theme.colors.successBg,
  },
  statusScanned: {
    backgroundColor: theme.colors.surfaceLight,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusTextActive: {
    color: theme.colors.success,
  },
  statusTextScanned: {
    color: theme.colors.textMuted,
  },
  ticketDivider: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: -8,
  },
  ticketCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    marginLeft: -8,
    marginRight: -8,
  },
  ticketLine: {
    flex: 1,
    height: 1,
    borderStyle: "dashed",
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  ticketBottom: {
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  qrPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  qrHash: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontFamily: "monospace",
  },
});
