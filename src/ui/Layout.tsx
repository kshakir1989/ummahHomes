import type { ComponentProps } from "react";
import { ScrollView, StyleSheet, View, type ViewProps } from "react-native";
import { colors, layout, spacing } from "./theme";

export function Screen({ children, style, ...rest }: ViewProps) {
  return (
    <View style={[styles.screen, style]} {...rest}>
      {children}
    </View>
  );
}

export function Container({ children, style, ...rest }: ViewProps) {
  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
}

export function ScreenScroll({
  children,
  style,
  ...rest
}: ComponentProps<typeof ScrollView>) {
  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, style]} {...rest}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    width: "100%",
    maxWidth: layout.maxContentWidth,
    alignSelf: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingBottom: spacing.xl,
  },
});
