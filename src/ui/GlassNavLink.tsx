import { Link } from "expo-router";
import { GlassButton } from "./GlassButton";

export interface GlassNavLinkProps {
  href: string;
  label: string;
  testID: string;
  tone?: "onDark" | "onLight";
}

export function GlassNavLink({
  href,
  label,
  testID,
  tone = "onDark",
}: GlassNavLinkProps) {
  return (
    <Link href={href} asChild>
      <GlassButton
        label={label}
        tone={tone}
        uppercase={tone === "onDark"}
        testID={testID}
      />
    </Link>
  );
}
