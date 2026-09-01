import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(public)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(seller)" />
      <Stack.Screen name="(seeker)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
}
