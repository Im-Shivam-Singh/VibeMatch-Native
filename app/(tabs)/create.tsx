// Create Party screen — host a new vibe
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
import { CITIES, VIBE_TAGS, VIBE_EMOJI } from "../../src/types";

export default function CreateScreen() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fee, setFee] = useState("0");
  const [maxGuests, setMaxGuests] = useState("10");
  const [description, setDescription] = useState("");
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleVibe = (vibe: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const handleCreate = async () => {
    if (!title || !city || !area || !date || !time) {
      Alert.alert("Missing fields", "Please fill in all required fields");
      return;
    }
    if (!currentUser) {
      Alert.alert("Not logged in", "Please login first");
      return;
    }

    setLoading(true);
    try {
      await api.createParty({
        title,
        city,
        area,
        date,
        time,
        fee: parseInt(fee) || 0,
        maxGuests: parseInt(maxGuests) || 10,
        vibes: selectedVibes,
        description,
        hostName: currentUser.name,
      });
      Alert.alert("🎉 Party created!", "Your vibe is live");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create party");
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
        <Text style={styles.headerTitle}>Launch a Vibe</Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Party Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Rooftop R&B Night"
          placeholderTextColor={theme.colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>City *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {CITIES.map((c) => (
            <Pressable
              key={c}
              style={[styles.cityChip, city === c && styles.cityChipActive]}
              onPress={() => setCity(c)}
            >
              <Text style={[styles.cityChipText, city === c && styles.cityChipTextActive]}>
                {c}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.label}>Area / Neighbourhood *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Hauz Khas"
          placeholderTextColor={theme.colors.textMuted}
          value={area}
          onChangeText={setArea}
        />

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Date *</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.colors.textMuted}
              value={date}
              onChangeText={setDate}
            />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Time *</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:mm"
              placeholderTextColor={theme.colors.textMuted}
              value={time}
              onChangeText={setTime}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Entry Fee</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="number-pad"
              value={fee}
              onChangeText={setFee}
            />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Max Guests</Text>
            <TextInput
              style={styles.input}
              placeholder="10"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="number-pad"
              value={maxGuests}
              onChangeText={setMaxGuests}
            />
          </View>
        </View>

        <Text style={styles.label}>Vibe Tags</Text>
        <View style={styles.vibeGrid}>
          {VIBE_TAGS.map((vibe) => {
            const isActive = selectedVibes.includes(vibe);
            return (
              <Pressable
                key={vibe}
                style={[styles.vibeChip, isActive && styles.vibeChipActive]}
                onPress={() => toggleVibe(vibe)}
              >
                <Text style={styles.vibeEmoji}>{VIBE_EMOJI[vibe]}</Text>
                <Text style={[styles.vibeLabel, isActive && styles.vibeLabelActive]}>
                  {vibe}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What's the vibe? Tell people what to expect..."
          placeholderTextColor={theme.colors.textMuted}
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <Pressable
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          <Ionicons name="rocket" size={20} color="#fff" />
          <Text style={styles.submitText}>
            {loading ? "Creating..." : "Launch Vibe"}
          </Text>
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>
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
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },
  form: {
    flex: 1,
    paddingHorizontal: 16,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  cityChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 6,
  },
  cityChipActive: {
    backgroundColor: theme.colors.primaryBg,
    borderColor: theme.colors.primary,
  },
  cityChipText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  cityChipTextActive: {
    color: theme.colors.primaryLight,
  },
  vibeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  vibeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  vibeChipActive: {
    backgroundColor: theme.colors.primaryBg,
    borderColor: theme.colors.primary,
  },
  vibeEmoji: {
    fontSize: 14,
  },
  vibeLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  vibeLabelActive: {
    color: theme.colors.primaryLight,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
