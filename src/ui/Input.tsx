import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
} from "react-native";
import { colors, radius, spacing, typography } from "./theme";

export interface InputProps extends TextInputProps {
  label?: string;
}

export function Input({ label, style, ...rest }: InputProps) {
  return (
    <>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, style]}
        {...rest}
      />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.xs,
    color: colors.text,
    fontSize: typography.sizeSmall,
    fontWeight: typography.weightMedium,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.brownWarm,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    color: colors.text,
    fontSize: typography.sizeBody,
  },
});
