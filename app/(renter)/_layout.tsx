import { Redirect, Stack } from "expo-router";
import { getSession } from "@/store/session";
import { stackWithBackNav, stackWithWelcomeSignOut } from "@/ui/navHeader";

export default function RenterLayout() {
  const session = getSession();

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  const welcomeOptions = stackWithWelcomeSignOut(session);

  return (
    <Stack screenOptions={welcomeOptions}>
      <Stack.Screen name="renter-dashboard" options={{ title: "" }} />
      <Stack.Screen
        name="my-applications"
        options={{ ...stackWithBackNav("/renter-dashboard"), title: "" }}
      />
      <Stack.Screen
        name="renter-inbox"
        options={{ ...stackWithBackNav("/renter-dashboard"), title: "" }}
      />
    </Stack>
  );
}
