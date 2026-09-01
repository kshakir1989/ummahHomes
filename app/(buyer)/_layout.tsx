import { Redirect, Stack } from "expo-router";
import { getSession } from "@/store/session";
import { stackWithBackNav, stackWithWelcomeSignOut } from "@/ui/navHeader";

export default function BuyerLayout() {
  const session = getSession();

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  const welcomeOptions = stackWithWelcomeSignOut(session);

  return (
    <Stack screenOptions={welcomeOptions}>
      <Stack.Screen name="buyer-dashboard" options={{ title: "" }} />
      <Stack.Screen
        name="my-interests"
        options={{ ...stackWithBackNav("/buyer-dashboard"), title: "" }}
      />
      <Stack.Screen
        name="inbox"
        options={{ ...stackWithBackNav("/buyer-dashboard"), title: "" }}
      />
    </Stack>
  );
}
