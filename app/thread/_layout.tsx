import { Stack, useGlobalSearchParams, type Href } from "expo-router";
import { resolveThreadBackRoute } from "@/domain/threadRoutes";
import { getSession } from "@/store/session";
import { BackNavButton } from "@/ui/BackNavButton";
import { SignOutNavButton } from "@/ui/SignOutNavButton";
import { colors } from "@/ui/theme";

function ThreadHeaderBack() {
  const { from } = useGlobalSearchParams<{ from?: string }>();
  const session = getSession();
  const backHref = resolveThreadBackRoute(
    typeof from === "string" ? from : undefined,
    session,
  ) as Href;

  return <BackNavButton href={backHref} label="Back" />;
}

export default function ThreadLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerTitle: "Conversation",
        headerLeft: () => <ThreadHeaderBack />,
        headerRight: () => <SignOutNavButton />,
      }}
    >
      <Stack.Screen name="[threadId]" options={{ title: "Conversation" }} />
    </Stack>
  );
}
