import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="(public)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ title: "Sign in" }} />
      <Stack.Screen name="(seller)" options={{ title: "Seller" }} />
      <Stack.Screen name="(seeker)" options={{ title: "Seeker" }} />
      <Stack.Screen name="(admin)" options={{ title: "Admin" }} />
    </Stack>
  );
}
