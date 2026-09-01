import { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import {
  glassPanelActiveStyle,
  glassPanelForTone,
  glassPanelPrimaryStyle,
  glassPanelSecondaryStyle,
  type GlassTone,
} from "./glass";
import { colors, radius, spacing, typography } from "./theme";

export interface GlassButtonProps extends Omit<PressableProps, "children"> {
  label: string;
  tone?: GlassTone;
  active?: boolean;
  compact?: boolean;
  shrink?: boolean;
  fillWidth?: boolean;
  uppercase?: boolean;
  animatedHover?: boolean;
  panelStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export function GlassButton({
  label,
  tone = "onLight",
  active = false,
  compact = false,
  shrink = false,
  fillWidth = false,
  uppercase = false,
  animatedHover = true,
  disabled,
  style,
  panelStyle,
  labelStyle,
  ...rest
}: GlassButtonProps) {
  const hoverAnim = useRef(new Animated.Value(0)).current;

  const animateTo = (value: number) => {
    if (!animatedHover || disabled) {
      return;
    }
    Animated.spring(hoverAnim, {
      toValue: value,
      useNativeDriver: true,
      speed: 22,
      bounciness: 5,
    }).start();
  };

  const scale = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  const translateY = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2],
  });

  const resolvedPanel = [
    styles.panel,
    compact && styles.panelCompact,
    glassPanelForTone(tone, active),
    panelStyle,
  ];

  const resolvedLabelColor =
    active || tone === "onDark" ? colors.white : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled: !!disabled }}
      disabled={disabled}
      onHoverIn={() => animateTo(1)}
      onHoverOut={() => animateTo(0)}
      onPressIn={() => animateTo(1)}
      onPressOut={() => animateTo(0)}
      style={[fillWidth && styles.fillWidth, shrink && styles.shrink, disabled && styles.disabled, style]}
      {...rest}
    >
      <Animated.View
        style={[
          resolvedPanel,
          fillWidth && styles.panelFillWidth,
          shrink && styles.panelShrink,
          animatedHover && {
            transform: [{ scale }, { translateY }],
          },
        ]}
      >
        <Text
          adjustsFontSizeToFit={shrink || fillWidth}
          minimumFontScale={shrink || fillWidth ? 0.72 : undefined}
          numberOfLines={shrink || fillWidth ? 1 : undefined}
          style={[
            styles.label,
            compact && styles.labelCompact,
            shrink && styles.labelShrink,
            fillWidth && styles.labelFillWidth,
            uppercase && styles.uppercase,
            { color: resolvedLabelColor },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function glassVariantPanel(
  variant: "primary" | "secondary" | "outline",
  onDark: boolean,
): ViewStyle {
  if (variant === "primary") {
    return glassPanelPrimaryStyle;
  }
  if (variant === "secondary") {
    return glassPanelSecondaryStyle;
  }
  return glassPanelForTone(onDark ? "onDark" : "onLight");
}

const styles = StyleSheet.create({
  panel: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
  },
  panelCompact: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  shrink: {
    flexShrink: 1,
    minWidth: 0,
  },
  fillWidth: {
    alignSelf: "stretch",
    width: "100%",
  },
  panelFillWidth: {
    width: "100%",
  },
  panelShrink: {
    minHeight: 34,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    maxWidth: "100%",
  },
  label: {
    fontSize: typography.sizeBody,
    fontWeight: typography.weightMedium,
    textAlign: "center",
  },
  labelCompact: {
    fontSize: typography.sizeSmall,
    textAlign: "center",
  },
  labelShrink: {
    fontSize: 11,
    textAlign: "center",
  },
  labelFillWidth: {
    width: "100%",
    textAlign: "center",
  },
  uppercase: {
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  disabled: {
    opacity: 0.5,
  },
});
