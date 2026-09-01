import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { BackNavButton } from "./BackNavButton";
import { HomeNavButton } from "./HomeNavButton";
import { SignOutNavButton } from "./SignOutNavButton";
import { colors } from "./theme";

export const stackWithHomeNav: NativeStackNavigationOptions = {
  headerShown: true,
  headerStyle: { backgroundColor: colors.surface },
  headerShadowVisible: false,
  headerLeft: () => <HomeNavButton />,
};

export function stackWithSignOut(): NativeStackNavigationOptions {
  return {
    ...stackWithHomeNav,
    headerRight: () => <SignOutNavButton />,
  };
}

export function stackWithBackNav(href: string): NativeStackNavigationOptions {
  return {
    ...stackWithHomeNav,
    headerLeft: () => <BackNavButton href={href} />,
  };
}
