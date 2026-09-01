import { StyleSheet, Text, View, type ViewProps } from "react-native";
import { glassPanelStyle } from "./glass";
import { colors, radius, spacing, typography } from "./theme";

export interface GlassTextProps extends ViewProps {
  children: string;
  variant?: "brand" | "discover" | "link";
}

export function GlassText({
  children,
  variant = "link",
  style,
  ...rest
}: GlassTextProps) {
  return (
    <View style={[styles.base, glassPanelStyle, styles[variant], style]} {...rest}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  brand: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  discover: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  link: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    color: "rgba(255, 255, 255, 0.95)",
    fontWeight: typography.weightMedium,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  brandText: {
    fontSize: 18,
    fontWeight: typography.weightBold,
    letterSpacing: 4,
  },
  discoverText: {
    fontSize: 17,
    fontWeight: typography.weightBold,
    letterSpacing: 3,
  },
  linkText: {
    fontSize: 14,
    fontWeight: typography.weightMedium,
    letterSpacing: 1.5,
    color: colors.white,
  },
});
