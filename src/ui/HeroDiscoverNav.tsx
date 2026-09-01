import { StyleSheet, View } from "react-native";
import { GlassNavLink } from "./GlassNavLink";
import { HERO_NAV_STACK_WIDTH } from "./heroNav";
import { HeroSignOutButton } from "./HeroSignOutButton";
import { useSession } from "@/store/useSession";
import { hasRole } from "@/store/session";
import { spacing } from "./theme";

const linkProps = {
  compact: true,
  fillWidth: true,
} as const;

export function HeroDiscoverNav() {
  const session = useSession();

  const viewHomes = (
    <GlassNavLink
      href="/browse"
      label="View Homes"
      testID="entry-search-submit"
      {...linkProps}
    />
  );

  if (session) {
    const dashboards = [
      hasRole(session, "buyer")
        ? {
            href: "/buyer-dashboard",
            label: "Buyer",
            testID: "entry-buyer-dashboard",
          }
        : null,
      hasRole(session, "renter")
        ? {
            href: "/renter-dashboard",
            label: "Renter",
            testID: "entry-renter-dashboard",
          }
        : null,
      hasRole(session, "seller")
        ? {
            href: "/dashboard",
            label: "Seller",
            testID: "entry-seller-dashboard",
          }
        : null,
    ].filter(Boolean) as { href: string; label: string; testID: string }[];

    return (
      <View style={styles.navStack} testID="entry-nav-links">
        {viewHomes}
        {dashboards.map((item) => (
          <GlassNavLink key={item.testID} {...item} {...linkProps} />
        ))}
        <HeroSignOutButton compact fillWidth />
      </View>
    );
  }

  return (
    <View style={styles.navStack} testID="entry-nav-links">
      {viewHomes}
      <GlassNavLink
        href="/sign-in"
        label="Sign In"
        testID="entry-sign-in"
        {...linkProps}
      />
      <GlassNavLink
        href="/sign-up"
        label="Sign Up"
        testID="entry-sign-up"
        {...linkProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  navStack: {
    width: HERO_NAV_STACK_WIDTH,
    alignItems: "stretch",
    gap: spacing.xs,
  },
});
