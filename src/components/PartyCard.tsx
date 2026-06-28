// PartyCard — displays a party summary card in the feed
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";
import {
  Party,
  parseVibes,
  formatFee,
  formatDateLabel,
  formatTime,
  slotsLeft,
  funScore,
  funTier,
  FUN_TIER_COLORS,
} from "../types";
import { VibeBadge } from "./VibeBadge";

interface PartyCardProps {
  party: Party;
  onPress: () => void;
}

export function PartyCard({ party, onPress }: PartyCardProps) {
  const vibes = parseVibes(party.vibes);
  const score = funScore(party);
  const tier = funTier(score);
  const tierMeta = FUN_TIER_COLORS[tier];
  const slots = slotsLeft(party.maxGuests, party.guestCount);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Cover image or gradient */}
      {party.coverUrl ? (
        <ImageBackground
          source={{ uri: party.coverUrl }}
          style={styles.cover}
          imageStyle={styles.coverImage}
        >
          <View style={styles.coverOverlay}>
            <View style={[styles.tierBadge, { backgroundColor: tierMeta.color + "25", borderColor: tierMeta.color }]}>
              <Text style={[styles.tierText, { color: tierMeta.color }]}>
                {tierMeta.label}
              </Text>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <View style={[styles.cover, styles.coverFallback]}>
          <View style={[styles.tierBadge, { backgroundColor: tierMeta.color + "25", borderColor: tierMeta.color }]}>
            <Text style={[styles.tierText, { color: tierMeta.color }]}>
              {tierMeta.label}
            </Text>
          </View>
          <Text style={styles.coverEmoji}>🎉</Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.date} numberOfLines={1}>
            {formatDateLabel(party.date)} · {formatTime(party.time)}
          </Text>
          <Text style={styles.fee}>{formatFee(party.fee, party.city)}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {party.title}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location" size={12} color={theme.colors.textMuted} />
          <Text style={styles.location} numberOfLines={1}>
            {party.area}, {party.city}
          </Text>
        </View>

        <View style={styles.vibeRow}>
          {vibes.slice(0, 3).map((v) => (
            <VibeBadge key={v} vibe={v} size="sm" />
          ))}
          {vibes.length > 3 && (
            <Text style={styles.moreVibes}>+{vibes.length - 3}</Text>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.hostRow}>
            <Ionicons name="person" size={12} color={theme.colors.textMuted} />
            <Text style={styles.hostName}>{party.hostName}</Text>
          </View>
          <Text style={[styles.slots, slots <= 3 && styles.slotsLow]}>
            {slots} left
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  cover: {
    height: 140,
    width: "100%",
  },
  coverImage: {
    borderRadius: 0,
  },
  coverOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
  },
  coverFallback: {
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  coverEmoji: {
    fontSize: 40,
    marginTop: 8,
  },
  tierBadge: {
    alignSelf: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  tierText: {
    fontSize: 10,
    fontWeight: "700",
  },
  content: {
    padding: 12,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  fee: {
    color: theme.colors.primaryLight,
    fontSize: 14,
    fontWeight: "700",
  },
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 21,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  location: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  vibeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 2,
  },
  moreVibes: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "600",
    alignSelf: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  hostRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  hostName: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  slots: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  slotsLow: {
    color: theme.colors.warning,
  },
});
