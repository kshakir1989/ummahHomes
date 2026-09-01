import { Stack } from "expo-router";
import { stackWithHomeNav } from "@/ui/navHeader";

export default function SeekerLayout() {
  return (
    <Stack screenOptions={stackWithHomeNav}>
      <Stack.Screen name="request" options={{ title: "Request" }} />
      <Stack.Screen name="messages" options={{ title: "Messages" }} />
    </Stack>
  );
}
