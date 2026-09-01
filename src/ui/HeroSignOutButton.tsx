import { useRouter } from "expo-router";
import type { StyleProp, ViewStyle } from "react-native";
import { GlassButton } from "./GlassButton";
import { operations } from "@/domain/operations";

export function HeroSignOutButton({
  compact = false,
  shrink = false,
  fillWidth = false,
  style,
}: {
  compact?: boolean;
  shrink?: boolean;
  fillWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const router = useRouter();

  return (
    <GlassButton
      label="Sign out"
      tone="onDark"
      uppercase={!shrink}
      compact={compact}
      shrink={shrink}
      fillWidth={fillWidth}
      testID="entry-sign-out"
      style={style}
      onPress={() => {
        operations.signOut();
        router.replace("/");
      }}
    />
  );
}
