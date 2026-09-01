import { StyleSheet, Text, View, type TextStyle, type ViewProps, type ViewStyle } from "react-native";
import { glassPanelStyle } from "./glass";
import { colors, radius, spacing, typography } from "./theme";

export interface GlassTextProps extends ViewProps {
  children: string;
  variant?: "brand" | "discover" | "link";
  compact?: boolean;
  brandFontSize?: number;
  brandLetterSpacing?: number;
}

export function GlassText({
  children,
  variant = "link",
  compact = false,
  brandFontSize,
  brandLetterSpacing,
  style,
  ...rest
}: GlassTextProps) {
  const brandPanelStyle: ViewStyle | undefined =
    variant === "brand" && compact ? styles.brandCompactPanel : undefined;
  const brandTextStyle: TextStyle | undefined =
    variant === "brand"
      ? {
          fontSize: brandFontSize ?? (compact ? 13 : 18),
          letterSpacing: brandLetterSpacing ?? (compact ? 2.5 : 4),
        }
      : undefined;

  return (
    <View
      style={[styles.base, glassPanelStyle, styles[variant], brandPanelStyle, style]}
      {...rest}
    >
      <Text
        adjustsFontSizeToFit={variant === "brand"}
        minimumFontScale={variant === "brand" ? 0.72 : undefined}
        numberOfLines={variant === "brand" ? 1 : undefined}
        style={[styles.text, styles[`${variant}Text`], brandTextStyle]}
      >
        {children}
      </Text>
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
    maxWidth: "100%",
  },
  brandCompactPanel: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignSelf: "center",
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
    textAlign: "center",
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
