import { useLocalSearchParams } from "expo-router";
import { getSession } from "@/store/session";
import { RolePickerScreen } from "@/ui/RolePickerScreen";
import { Redirect } from "expo-router";

export default function RolePickerRoute() {
  const session = getSession();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  if (session.roles.length <= 1) {
    return <Redirect href="/browse" />;
  }

  return <RolePickerScreen user={session} returnTo={returnTo} />;
}
