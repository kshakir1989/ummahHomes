import { StyleSheet, View } from "react-native";
import { GlassNavLink } from "./GlassNavLink";
import { spacing } from "./theme";

const NAV_LINKS = [
  {
    href: "/browse" as const,
    label: "View Homes",
    testID: "entry-search-submit",
  },
  {
    href: "/sign-in" as const,
    label: "Sign In",
    testID: "entry-sign-in",
  },
  {
    href: "/sign-up" as const,
    label: "Sign Up",
    testID: "entry-sign-up",
  },
] as const;

export function HeroDiscoverNav() {
  return (
    <View style={styles.wrap} testID="entry-nav-links">
      {NAV_LINKS.map((link) => (
        <GlassNavLink
          key={link.testID}
          href={link.href}
          label={link.label}
          testID={link.testID}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
});
