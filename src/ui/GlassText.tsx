import { StyleSheet, Text, View, type TextStyle, type ViewProps, type ViewStyle } from "react-native";
import { glassPanelStyle } from "./glass";
import { colors, radius, spacing, typography } from "./theme";

export interface GlassTextProps extends ViewProps {
  children: string;
  variant?: "brand" | "discover" | "link";
  compact?: boolean;
  /** Stretch brand panel to fill row height (mobile hero beside nav). */
  fillHeight?: boolean;
  brandFontSize?: number;
  brandLetterSpacing?: number;
}

export function GlassText({
  children,
  variant = "link",
  compact = false,
  fillHeight = false,
  brandFontSize,
  brandLetterSpacing,
  style,
  ...rest
}: GlassTextProps) {
  const brandPanelStyle: ViewStyle | undefined =
    variant === "brand" && compact && !fillHeight
      ? styles.brandCompactPanel
      : undefined;
  const brandFillStyle: ViewStyle | undefined =
    variant === "brand" && fillHeight ? styles.brandFillHeight : undefined;
  const brandTextStyle: TextStyle | undefined =
    variant === "brand"
      ? {
          fontSize: brandFontSize ?? (compact || fillHeight ? 13 : 18),
          letterSpacing: brandLetterSpacing ?? (compact || fillHeight ? 2 : 4),
        }
      : undefined;

  return (
    <View
      style={[
        styles.base,
        glassPanelStyle,
        styles[variant],
        brandPanelStyle,
        brandFillStyle,
        style,
      ]}
      {...rest}
    >
      <Text
        adjustsFontSizeToFit={variant === "brand"}
        minimumFontScale={variant === "brand" ? 0.55 : undefined}
        numberOfLines={
          variant === "brand" && fillHeight
            ? 2
            : variant === "brand"
              ? 1
              : undefined
        }
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
  brandFillHeight: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minWidth: 0,
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
    width: "100%",
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
