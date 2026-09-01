import { Stack } from "expo-router";
import { stackWithBackNav, stackWithHomeNav, stackWithSignOut } from "@/ui/navHeader";

export default function SellerLayout() {
  return (
    <Stack screenOptions={stackWithHomeNav}>
      <Stack.Screen name="dashboard" options={{ ...stackWithSignOut(), title: "" }} />
      <Stack.Screen name="listings" options={{ ...stackWithBackNav("/dashboard"), title: "" }} />
      <Stack.Screen name="listing-form" options={{ ...stackWithBackNav("/listings"), title: "" }} />
      <Stack.Screen name="requests" options={{ ...stackWithBackNav("/dashboard"), title: "" }} />
      <Stack.Screen
        name="seller-inbox"
        options={{ ...stackWithBackNav("/dashboard"), title: "" }}
      />
    </Stack>
  );
}
