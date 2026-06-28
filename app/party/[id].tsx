// Party Detail screen — full party info, join request, menu, reviews
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../src/theme";
import { api } from "../../src/api";
import { useAppStore } from "../../src/store";
import {
  Party,
  VibeUser,
  MenuItem as MenuItemType,
  PartyReview,
  parseVibes,
  formatFee,
  formatDateLabel,
  formatTime,
  slotsLeft,
  countdownTo,
} from "../../src/types";
import { VibeBadge } from "../../src/components/VibeBadge";
import { LoadingSpinner } from "../../src/components/LoadingSpinner";

export default function PartyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUser = useAppStore((s) => s.currentUser);

  const [party, setParty] = useState<Party | null>(null);
  const [host, setHost] = useState<VibeUser | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [reviews, setReviews] = useState<PartyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [introMessage, setIntroMessage] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [partyRes, menuRes, reviewRes] = await Promise.all([
          api.getParty(id),
          api.listMenu(id).catch(() => ({ items: [] })),
          api.listReviews(id).catch(() => ({ reviews: [], avgRating: 0, count: 0 })),
        ]);
        setParty(partyRes.party);
        setHost(partyRes.host || null);
        setMenuItems(menuRes.items);
        setReviews(reviewRes.reviews);
      } catch (err) {
        console.error("Failed to load party:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleJoin = async () => {
    if (!currentUser || !party) return;
    if (!introMessage.trim()) {
      Alert.alert("Missing intro", "Tell the host why you want to join!");
      return;
    }
    setJoining(true);
    try {
      await api.sendRequest({
        partyId: party.id,
        requesterName: currentUser.name,
        introMessage: introMessage.trim(),
      });
      Alert.alert("Request sent! 🎉", "The host will review your request");
      setShowJoinForm(false);
      setIntroMessage("");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send request");
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!party) {
    return (
      <View style={styles.container}>
        <EmptyState emoji="😕" title="Party not found" />
      </View>
    );
  }

  const vibes = parseVibes(party.vibes);
  const slots = slotsLeft(party.maxGuests, party.guestCount);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover */}
        {party.coverUrl ? (
          <ImageBackground
            source={{ uri: party.coverUrl }}
            style={styles.cover}
            imageStyle={styles.coverImage}
          >
            <View style={styles.coverOverlay}>
              <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </Pressable>
            </View>
          </ImageBackground>
        ) : (
          <View style={[styles.cover, styles.coverFallback]}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
            </Pressable>
            <Text style={styles.coverEmoji}>🎉</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Countdown */}
          <View style={styles.countdownBadge}>
            <Ionicons name="flash" size={14} color={theme.colors.primaryLight} />
            <Text style={styles.countdownText}>
              {countdownTo(party.date, party.time)}
            </Text>
          </View>

          <Text style={styles.title}>{party.title}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="calendar" size={14} color={theme.colors.textMuted} />
            <Text style={styles.metaText}>
              {formatDateLabel(party.date)} · {formatTime(party.time)}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="location" size={14} color={theme.colors.textMuted} />
            <Text style={styles.metaText}>{party.area}, {party.city}</Text>
          </View>

          <View style={styles.feeRow}>
            <Text style={styles.fee}>{formatFee(party.fee, party.city)}</Text>
            <Text style={[styles.slots, slots <= 3 && styles.slotsLow]}>
              {slots} slots left
            </Text>
          </View>

          {/* Vibe Tags */}
          <View style={styles.vibeRow}>
            {vibes.map((v) => (
              <VibeBadge key={v} vibe={v} size="md" />
            ))}
          </View>

          {/* Host */}
          <Pressable
            style={styles.hostCard}
            onPress={() => {
              if (host && currentUser) {
                // Navigate to chat with host
                api.ensureThread(currentUser.id, host.id, party.id).then((res) => {
                  router.push({ pathname: "/chat/[id]", params: { id: res.threadId } });
                });
              }
            }}
          >
            <View style={styles.hostAvatar}>
              <Text style={styles.hostAvatarText}>
                {party.hostName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.hostInfo}>
              <Text style={styles.hostName}>Hosted by {party.hostName}</Text>
              {host && (
                <Text style={styles.hostRating}>
                  ⭐ {host.rating.toFixed(1)} · {host.hosted} parties
                </Text>
              )}
            </View>
            <Ionicons name="chatbubble-outline" size={20} color={theme.colors.primaryLight} />
          </Pressable>

          {/* Description */}
          {party.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{party.description}</Text>
            </View>
          ) : null}

          {/* Menu */}
          {menuItems.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Menu</Text>
              {menuItems.map((item) => (
                <View key={item.id} style={styles.menuItem}>
                  <Text style={styles.menuEmoji}>{item.emoji}</Text>
                  <Text style={styles.menuName}>{item.name}</Text>
                  <Text style={styles.menuPrice}>
                    {formatFee(item.price, party.city)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              {reviews.slice(0, 5).map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewUser}>
                      {review.user?.name || "Guest"}
                    </Text>
                    <Text style={styles.reviewRating}>
                      {"⭐".repeat(review.rating)}
                    </Text>
                  </View>
                  {review.comment ? (
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}

          {/* Join Request Form */}
          {showJoinForm ? (
            <View style={styles.joinForm}>
              <Text style={styles.joinFormTitle}>Why do you want to join?</Text>
              <TextInput
                style={styles.joinInput}
                placeholder="Tell the host a bit about yourself..."
                placeholderTextColor={theme.colors.textMuted}
                multiline
                numberOfLines={3}
                value={introMessage}
                onChangeText={setIntroMessage}
                autoFocus
              />
              <View style={styles.joinBtnRow}>
                <Pressable
                  style={styles.cancelBtn}
                  onPress={() => setShowJoinForm(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.joinBtn, joining && styles.joinBtnDisabled]}
                  onPress={handleJoin}
                  disabled={joining}
                >
                  <Text style={styles.joinText}>
                    {joining ? "Sending..." : "Send Request"}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              style={styles.ctaButton}
              onPress={() => setShowJoinForm(true)}
            >
              <Ionicons name="enter" size={20} color="#fff" />
              <Text style={styles.ctaText}>Request to Join</Text>
            </Pressable>
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

// Simple inline empty state
function EmptyState({ emoji, title }: { emoji: string; title: string }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 8 }}>
      <Text style={{ fontSize: 48 }}>{emoji}</Text>
      <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "700" }}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  cover: {
    height: 220,
    width: "100%",
  },
  coverImage: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  coverOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 16,
  },
  coverFallback: {
    backgroundColor: theme.colors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  coverEmoji: {
    fontSize: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 16,
    gap: 12,
  },
  countdownBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.primaryBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  countdownText: {
    color: theme.colors.primaryLight,
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fee: {
    color: theme.colors.primaryLight,
    fontSize: 20,
    fontWeight: "800",
  },
  slots: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  slotsLow: {
    color: theme.colors.warning,
  },
  vibeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  hostCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryBg,
    alignItems: "center",
    justifyContent: "center",
  },
  hostAvatarText: {
    color: theme.colors.primaryLight,
    fontSize: 16,
    fontWeight: "700",
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  hostRating: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  menuEmoji: {
    fontSize: 18,
  },
  menuName: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
  },
  menuPrice: {
    color: theme.colors.primaryLight,
    fontSize: 14,
    fontWeight: "600",
  },
  reviewCard: {
    backgroundColor: theme.colors.surface,
    padding: 10,
    borderRadius: theme.borderRadius.sm,
    gap: 4,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewUser: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  reviewRating: {
    fontSize: 12,
  },
  reviewComment: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  joinForm: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    gap: 12,
  },
  joinFormTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  joinInput: {
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    fontSize: 14,
    color: theme.colors.text,
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  joinBtnRow: {
    flexDirection: "row",
    gap: 8,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
  },
  cancelText: {
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  joinBtn: {
    flex: 1,
    padding: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
  },
  joinBtnDisabled: {
    opacity: 0.6,
  },
  joinText: {
    color: "#fff",
    fontWeight: "700",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    marginTop: 8,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
