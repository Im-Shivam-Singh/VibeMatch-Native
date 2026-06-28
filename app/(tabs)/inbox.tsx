// Inbox screen — list of chat threads
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
import { ChatThread, relativeTime } from "../../src/types";
import { LoadingSpinner } from "../../src/components/LoadingSpinner";
import { EmptyState } from "../../src/components/EmptyState";

export default function InboxScreen() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchThreads = async () => {
    if (!currentUser) return;
    try {
      const res = await api.listThreads(currentUser.id);
      setThreads(res.threads);
    } catch (err) {
      console.error("Failed to fetch threads:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [currentUser]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchThreads();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
      </View>

      <FlatList
        data={threads}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.threadCard}
            onPress={() =>
              router.push({
                pathname: "/chat/[id]",
                params: { id: item.id },
              })
            }
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.otherUser?.name?.charAt(0)?.toUpperCase() || "?"}
              </Text>
            </View>
            <View style={styles.threadInfo}>
              <View style={styles.threadHeader}>
                <Text style={styles.threadName}>
                  {item.otherUser?.name || "Unknown"}
                </Text>
                {item.lastMessage && (
                  <Text style={styles.threadTime}>
                    {relativeTime(item.lastMessage.createdAt)}
                  </Text>
                )}
              </View>
              <Text style={styles.threadPreview} numberOfLines={1}>
                {item.lastMessage?.content || "No messages yet"}
              </Text>
            </View>
            {(item.unreadCount ?? 0) > 0 && (
              <View style={styles.unreadDot}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <EmptyState
            emoji="💬"
            title="No conversations"
            subtitle="Join a party and chat with the host!"
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
  threadCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryBg,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: theme.colors.primaryLight,
    fontSize: 18,
    fontWeight: "700",
  },
  threadInfo: {
    flex: 1,
    gap: 2,
  },
  threadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  threadName: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  threadTime: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  threadPreview: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  unreadDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.coral,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
