// Chat screen — 1-on-1 messaging
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../src/theme";
import { api } from "../../src/api";
import { useAppStore } from "../../src/store";
import { ChatMessage, VibeUser, relativeTime } from "../../src/types";
import { LoadingSpinner } from "../../src/components/LoadingSpinner";

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUser = useAppStore((s) => s.currentUser);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [otherUser, setOtherUser] = useState<VibeUser | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!id || !currentUser) return;
    (async () => {
      try {
        const res = await api.getThread(id, currentUser.id);
        setMessages(res.messages);
        setOtherUser(res.otherUser);
      } catch (err) {
        console.error("Failed to load chat:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, currentUser]);

  const handleSend = async () => {
    if (!input.trim() || !currentUser || !otherUser || sending) return;
    setSending(true);
    try {
      const msg = await api.sendMessage({
        threadId: id!,
        senderId: currentUser.id,
        receiverId: otherUser.id,
        content: input.trim(),
      });
      setMessages((prev) => [...prev, msg]);
      setInput("");
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
        </Pressable>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>
            {otherUser?.name?.charAt(0)?.toUpperCase() || "?"}
          </Text>
        </View>
        <Text style={styles.headerName}>{otherUser?.name || "Chat"}</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isMine = item.senderId === currentUser?.id;
          return (
            <View
              style={[
                styles.messageRow,
                isMine && styles.messageRowMine,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  isMine ? styles.bubbleMine : styles.bubbleOther,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isMine && styles.messageTextMine,
                  ]}
                >
                  {item.content}
                </Text>
              </View>
              <Text style={styles.messageTime}>
                {relativeTime(item.createdAt)}
              </Text>
            </View>
          );
        }}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <Pressable
          style={[styles.sendBtn, (!input.trim() || sending) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || sending}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backBtn: {
    padding: 4,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryBg,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {
    color: theme.colors.primaryLight,
    fontSize: 14,
    fontWeight: "700",
  },
  headerName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageRow: {
    marginBottom: 12,
    maxWidth: "80%",
  },
  messageRowMine: {
    alignSelf: "flex-end",
  },
  messageBubble: {
    padding: 10,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  bubbleMine: {
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  messageText: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 19,
  },
  messageTextMine: {
    color: "#fff",
  },
  messageTime: {
    color: theme.colors.textMuted,
    fontSize: 10,
    marginTop: 4,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    padding: 12,
    paddingBottom: 36,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
