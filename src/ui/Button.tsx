import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors, radius, spacing, typography } from "./theme";

type ButtonVariant = "primary" | "secondary" | "outline";

export interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
  /** Outline on dark surfaces (hero): light border + label */
  onDark?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  variant = "primary",
  onDark = false,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        variant === "outline" && onDark && styles.outlineOnDark,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      {...rest}
    >
      <Text
        style={[
          styles.label,
          styles[`${variant}Label` as const],
          variant === "outline" && onDark && styles.outlineOnDarkLabel,
        ]}
      >
        {label}
      </Text>
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
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.brownDeep,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.brownWarm,
  },
  outlineOnDark: {
    borderColor: colors.blue,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.9,
  },
  label: {
    fontSize: typography.sizeBody,
    fontWeight: typography.weightMedium,
  },
  primaryLabel: {
    color: colors.white,
  },
  secondaryLabel: {
    color: colors.white,
  },
  outlineLabel: {
    color: colors.brownDeep,
  },
  outlineOnDarkLabel: {
    color: colors.white,
  },
});
