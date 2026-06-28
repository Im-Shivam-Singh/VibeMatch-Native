// Home / Explore screen — party feed with filters
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../src/theme";
import { api } from "../../src/api";
import { useAppStore } from "../../src/store";
import { Party, CITIES, VIBE_TAGS, parseVibes } from "../../src/types";
import { PartyCard } from "../../src/components/PartyCard";
import { LoadingSpinner } from "../../src/components/LoadingSpinner";
import { EmptyState } from "../../src/components/EmptyState";

export default function HomeScreen() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const cityFilter = useAppStore((s) => s.cityFilter);
  const vibeFilter = useAppStore((s) => s.vibeFilter);
  const searchQuery = useAppStore((s) => s.searchQuery);

  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchParties = useCallback(async () => {
    try {
      const res = await api.listParties({
        city: cityFilter,
        vibe: vibeFilter,
        q: searchQuery || undefined,
      });
      setParties(res.parties);
    } catch (err) {
      console.error("Failed to fetch parties:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [cityFilter, vibeFilter, searchQuery]);

  useEffect(() => {
    fetchParties();
  }, [fetchParties]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchParties();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hey {currentUser?.name?.split(" ")[0] || "there"} 👋
          </Text>
          <Text style={styles.subtitle}>Find your vibe tonight</Text>
        </View>
        <Pressable
          style={styles.filterBtn}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name="options"
            size={20}
            color={
              cityFilter || vibeFilter
                ? theme.colors.primaryLight
                : theme.colors.textSecondary
            }
          />
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={theme.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search parties..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={useAppStore((s) => s.setSearchQuery)}
        />
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersSection}>
          <Text style={styles.filterLabel}>City</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={["All", ...CITIES]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isActive =
                item === "All" ? !cityFilter : cityFilter === item;
              return (
                <Pressable
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() =>
                    useAppStore.getState().setCityFilter(item === "All" ? null : item)
                  }
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isActive && styles.filterChipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            }}
            contentContainerStyle={{ gap: 6, paddingBottom: 8 }}
          />

          <Text style={[styles.filterLabel, { marginTop: 8 }]}>Vibe</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={["All", ...VIBE_TAGS]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isActive =
                item === "All" ? !vibeFilter : vibeFilter === item;
              return (
                <Pressable
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() =>
                    useAppStore.getState().setVibeFilter(item === "All" ? null : item)
                  }
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isActive && styles.filterChipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            }}
            contentContainerStyle={{ gap: 6, paddingBottom: 8 }}
          />
        </View>
      )}

      {/* Party Feed */}
      <FlatList
        data={parties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PartyCard
            party={item}
            onPress={() =>
              router.push({
                pathname: "/party/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        contentContainerStyle={styles.feed}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            emoji="🔍"
            title="No parties found"
            subtitle="Try adjusting your filters or check back later"
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: theme.colors.text,
  },
  filtersSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.surface,
    marginHorizontal: 16,
    borderRadius: theme.borderRadius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primaryBg,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: theme.colors.primaryLight,
  },
  feed: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
});
