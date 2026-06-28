// Root layout — sets up Expo Router, theme, and initial route
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAppStore } from "../src/store";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const authed = useAppStore((s) => s.authed);

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!authed && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/(auth)/login");
    } else if (authed && inAuthGroup) {
      // Redirect to home if authenticated and on auth screen
      router.replace("/(tabs)");
    }
  }, [authed, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <AuthGuard>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0a0a0f" },
            animation: "slide_from_right",
          }}
        />
      </AuthGuard>
    </GestureHandlerRootView>
  );
}
