import { Link, type Href } from "expo-router";
import { GlassButton } from "./GlassButton";

export interface BackNavButtonProps {
  href: Href;
  label?: string;
}

export function BackNavButton({ href, label = "Back" }: BackNavButtonProps) {
  return (
    <Link href={href} asChild>
      <GlassButton
        label={label}
        compact
        testID="nav-back"
        style={{ marginLeft: 4 }}
      />
    </Link>
  );
}
