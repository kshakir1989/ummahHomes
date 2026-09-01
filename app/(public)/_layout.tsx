import { Stack } from "expo-router";
import { stackWithHomeNav } from "@/ui/navHeader";

export default function PublicLayout() {
  return (
    <Stack screenOptions={stackWithHomeNav}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="browse" options={{ title: "" }} />
      <Stack.Screen
        name="listing/[id]"
        options={{ title: "Listing" }}
      />
    </Stack>
  );
}
