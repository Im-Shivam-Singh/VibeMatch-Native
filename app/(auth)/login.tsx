// Login screen — phone OTP authentication
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../src/theme";
import { api } from "../../src/api";
import { useAppStore } from "../../src/store";

export default function LoginScreen() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert("Invalid phone", "Please enter a valid phone number");
      return;
    }
    setLoading(true);
    try {
      const res = await api.sendOtp(phone);
      setDevOtp(res.devOtp);
      setStep("otp");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert("Invalid OTP", "Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await api.verifyOtp(phone, otp, name || undefined);
      login(res.user);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        {/* Logo area */}
        <View style={styles.logoSection}>
          <Text style={styles.logoEmoji}>🎉</Text>
          <Text style={styles.logoText}>VibeMatch</Text>
          <Text style={styles.tagline}>Find your vibe. Join the party.</Text>
        </View>

        {step === "phone" ? (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Enter your phone number</Text>
            <Text style={styles.formSubtitle}>
              We'll send you a verification code
            </Text>

            <TextInput
              style={styles.input}
              placeholder="+91 9677026531"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              autoCapitalize="none"
              autoFocus
            />

            <TextInput
              style={[styles.input, { marginTop: 12 }]}
              placeholder="Your name (optional)"
              placeholderTextColor={theme.colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendOtp}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Sending..." : "Send OTP"}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Enter verification code</Text>
            <Text style={styles.formSubtitle}>Sent to {phone}</Text>

            {devOtp && (
              <View style={styles.devOtpBanner}>
                <Ionicons name="information-circle" size={16} color={theme.colors.warning} />
                <Text style={styles.devOtpText}>Dev OTP: {devOtp}</Text>
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              autoFocus
            />

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Verifying..." : "Verify & Login"}
              </Text>
            </Pressable>

            <Pressable onPress={() => setStep("phone")} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={16} color={theme.colors.primaryLight} />
              <Text style={styles.backText}>Change phone number</Text>
            </Pressable>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoEmoji: {
    fontSize: 56,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.colors.text,
    marginTop: 8,
  },
  tagline: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  form: {
    gap: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  formSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    fontSize: 16,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  devOtpBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.warningBg,
    padding: 10,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 8,
  },
  devOtpText: {
    color: theme.colors.warning,
    fontSize: 12,
    fontWeight: "600",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 16,
    justifyContent: "center",
  },
  backText: {
    color: theme.colors.primaryLight,
    fontSize: 13,
    fontWeight: "600",
  },
});
