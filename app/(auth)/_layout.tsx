import { Stack } from "expo-router";
import { stackWithHomeNav } from "@/ui/navHeader";

export default function AuthLayout() {
  return (
    <Stack screenOptions={stackWithHomeNav}>
      <Stack.Screen name="sign-in" options={{ title: "" }} />
      <Stack.Screen name="sign-up" options={{ title: "" }} />
      <Stack.Screen name="role-picker" options={{ title: "" }} />
    </Stack>
  );
}
