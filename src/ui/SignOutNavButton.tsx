import { useRouter } from "expo-router";
import { GlassButton } from "./GlassButton";
import { operations } from "@/domain/operations";

export function SignOutNavButton() {
  const router = useRouter();

  return (
    <GlassButton
      label="Sign out"
      compact
      testID="nav-sign-out"
      style={{ marginRight: 4 }}
      onPress={() => {
        operations.signOut();
        router.replace("/");
      }}
    />
  );
}
