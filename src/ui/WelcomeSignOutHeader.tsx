import { StyleSheet, Text, View } from "react-native";
import { SignOutNavButton } from "./SignOutNavButton";
import { colors, spacing, typography } from "./theme";

export interface WelcomeSignOutHeaderProps {
  displayName: string;
}

export function WelcomeSignOutHeader({ displayName }: WelcomeSignOutHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.welcome} testID="nav-welcome">
        Welcome, {displayName}
      </Text>
      <SignOutNavButton />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginRight: spacing.xs,
  },
  welcome: {
    color: colors.primary,
    fontSize: typography.sizeSmall,
    fontWeight: typography.weightMedium,
    maxWidth: 160,
  },
});
