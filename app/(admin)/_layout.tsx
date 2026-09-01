import { Stack } from "expo-router";
import { stackWithHomeNav } from "@/ui/navHeader";

export default function AdminLayout() {
  return (
    <Stack screenOptions={stackWithHomeNav}>
      <Stack.Screen name="admin" options={{ title: "Admin" }} />
    </Stack>
  );
}
