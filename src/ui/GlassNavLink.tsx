import type { StyleProp, ViewStyle } from "react-native";
import { Link } from "expo-router";
import { GlassButton } from "./GlassButton";

export interface GlassNavLinkProps {
  href: string;
  label: string;
  testID: string;
  tone?: "onDark" | "onLight";
  compact?: boolean;
  shrink?: boolean;
  fillWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function GlassNavLink({
  href,
  label,
  testID,
  tone = "onDark",
  compact = false,
  shrink = false,
  fillWidth = false,
  style,
}: GlassNavLinkProps) {
  return (
    <Link href={href} asChild>
      <GlassButton
        label={label}
        tone={tone}
        compact={compact}
        shrink={shrink}
        fillWidth={fillWidth}
        uppercase={tone === "onDark" && !shrink}
        testID={testID}
        style={style}
      />
    </Link>
  );
}
