import { Link } from "expo-router";
import { GlassButton } from "./GlassButton";

export function HomeNavButton() {
  return (
    <Link href="/" asChild>
      <GlassButton
        label="Home"
        compact
        testID="nav-home"
        style={{ marginLeft: 4 }}
      />
    </Link>
  );
}
