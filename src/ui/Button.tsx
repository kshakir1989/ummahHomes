import { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { GlassButton, glassVariantPanel } from "./GlassButton";
import { colors, radius, spacing, typography } from "./theme";

type ButtonVariant = "primary" | "secondary" | "outline";

export interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
  /** Glass styling for dark hero surfaces */
  onDark?: boolean;
  animatedHover?: boolean;
  size?: "default" | "large";
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  variant = "primary",
  onDark = false,
  animatedHover = true,
  size = "default",
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const hoverAnim = useRef(new Animated.Value(0)).current;

  const animateTo = (value: number) => {
    if (!animatedHover || disabled) {
      return;
    }
    Animated.spring(hoverAnim, {
      toValue: value,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  const scale = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  const translateY = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });

  const panelStyle = [
    styles.base,
    size === "large" && styles.baseLarge,
    glassVariantPanel(variant, onDark),
  ];

  const labelColor =
    variant === "outline" && !onDark ? colors.primary : colors.white;

  if (!animatedHover) {
    return (
      <GlassButton
        label={label}
        tone={onDark ? "onDark" : "onLight"}
        animatedHover={false}
        disabled={disabled}
        panelStyle={[panelStyle, variant === "outline" && !onDark && styles.outlineLabelPanel]}
        labelStyle={{
          color: labelColor,
          textAlign: "center",
          width: "100%",
          ...(size === "large" ? styles.labelLarge : null),
        }}
        style={style}
        {...rest}
      />
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onHoverIn={() => animateTo(1)}
      onHoverOut={() => animateTo(0)}
      onPressIn={() => animateTo(1)}
      onPressOut={() => animateTo(0)}
      style={[disabled && styles.disabled, style]}
      {...rest}
    >
      <Animated.View
        style={[
          panelStyle,
          {
            transform: [{ scale }, { translateY }],
          },
        ]}
      >
        <Text
          style={[
            styles.label,
            size === "large" && styles.labelLarge,
            { color: labelColor },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
  },
  baseLarge: {
    minHeight: 88,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radius.card,
    alignSelf: "flex-start",
  },
  outlineLabelPanel: {
    backgroundColor: "rgba(255, 255, 255, 0.72)",
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: typography.sizeBody,
    fontWeight: typography.weightMedium,
    textAlign: "center",
    width: "100%",
  },
  labelLarge: {
    fontSize: 32,
    fontWeight: typography.weightBold,
    textAlign: "center",
    width: "100%",
  },
});
