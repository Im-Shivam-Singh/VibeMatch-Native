// Edit Profile screen
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../src/theme";
import { api } from "../../src/api";
import { useAppStore } from "../../src/store";
import { CITIES, PROFESSIONS } from "../../src/types";

export default function EditProfileScreen() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);

  const [name, setName] = useState(currentUser?.name || "");
  const [username, setUsername] = useState(currentUser?.username || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [city, setCity] = useState(currentUser?.city || "");
  const [profession, setProfession] = useState(currentUser?.profession || "");
  const [instagram, setInstagram] = useState(currentUser?.instagram || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await api.updateUser(currentUser.id, {
        name,
        username: username || undefined,
        bio: bio || undefined,
        city: city || undefined,
        profession: profession || undefined,
        instagram: instagram || undefined,
      });
      setCurrentUser(res.user);
      Alert.alert("Saved!", "Profile updated");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={theme.colors.textMuted}
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="@username"
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us about yourself..."
          placeholderTextColor={theme.colors.textMuted}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>City</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {CITIES.map((c) => (
            <Pressable
              key={c}
              style={[styles.chip, city === c && styles.chipActive]}
              onPress={() => setCity(c)}
            >
              <Text style={[styles.chipText, city === c && styles.chipTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.label}>Profession</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {PROFESSIONS.map((p) => (
            <Pressable
              key={p}
              style={[styles.chip, profession === p && styles.chipActive]}
              onPress={() => setProfession(p)}
            >
              <Text style={[styles.chipText, profession === p && styles.chipTextActive]}>{p}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.label}>Instagram</Text>
        <TextInput
          style={styles.input}
          value={instagram}
          onChangeText={setInstagram}
          placeholder="@handle"
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="none"
        />

        <Pressable
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>{loading ? "Saving..." : "Save Changes"}</Text>
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>
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
  form: { flex: 1, paddingHorizontal: 16 },
  label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: "700", textTransform: "uppercase", marginBottom: 6 },
  input: {
    backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md, padding: 12, fontSize: 15, color: theme.colors.text, marginBottom: 12,
  },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, marginRight: 6,
  },
  chipActive: { backgroundColor: theme.colors.primaryBg, borderColor: theme.colors.primary },
  chipText: { color: theme.colors.textSecondary, fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: theme.colors.primaryLight },
  saveBtn: {
    backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.md,
    padding: 16, alignItems: "center", marginTop: 8,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
