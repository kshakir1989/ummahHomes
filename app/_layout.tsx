import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(public)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(seller)" />
      <Stack.Screen name="(buyer)" />
      <Stack.Screen name="(renter)" />
      <Stack.Screen name="(seeker)" />
      <Stack.Screen name="(admin)" />
      <Stack.Screen name="thread" options={{ headerShown: false }} />
    </Stack>
  );
}
