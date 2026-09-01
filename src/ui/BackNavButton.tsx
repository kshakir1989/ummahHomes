import { Link, useRouter, type Href } from "expo-router";
import { GlassButton } from "./GlassButton";

export interface BackNavButtonProps {
  href?: Href;
  label?: string;
  onPress?: () => void;
}

export function BackNavButton({
  href,
  label = "Back",
  onPress,
}: BackNavButtonProps) {
  if (onPress) {
    return (
      <GlassButton
        label={label}
        compact
        testID="nav-back"
        onPress={onPress}
        style={{ marginLeft: 4 }}
      />
    );
  }

  if (!href) {
    return null;
  }

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

export function BackNavRouterButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();
  return <BackNavButton label={label} onPress={() => router.back()} />;
}
