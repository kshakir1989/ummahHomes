import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import type { BrowseColumnsPerRow } from "@/domain/browseView";
import { BROWSE_COLUMNS_OPTIONS } from "@/domain/browseView";
import { GlassButton } from "./GlassButton";
import { colors, radius, spacing, typography } from "./theme";

const PREVIEW_HEIGHT = 44;
const PREVIEW_GAP = 4;
const ANIM_MS = 320;

export interface BrowseViewColumnsPickerProps {
  value: BrowseColumnsPerRow;
  onChange: (columns: BrowseColumnsPerRow) => void;
}

function AnimatedColumnPreview({ columnsAnim }: { columnsAnim: Animated.Value }) {
  return (
    <View style={styles.previewFrame} testID="browse-view-preview">
      <View style={[styles.previewRow, { gap: PREVIEW_GAP }]}>
        {BROWSE_COLUMNS_OPTIONS.map((_, index) => {
          const flex = columnsAnim.interpolate({
            inputRange: [index, index + 1],
            outputRange: [0, 1],
            extrapolate: "clamp",
          });

          const opacity = columnsAnim.interpolate({
            inputRange: [index + 0.15, index + 0.85],
            outputRange: [0, 1],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.previewCell,
                {
                  flex,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

export function BrowseViewColumnsPicker({
  value,
  onChange,
}: BrowseViewColumnsPickerProps) {
  const columnsAnim = useRef(new Animated.Value(value)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(columnsAnim, {
        toValue: value,
        duration: ANIM_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: ANIM_MS * 0.45,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: ANIM_MS * 0.55,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [columnsAnim, pulseAnim, value]);

  const previewScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionLabel}>View</Text>
      <Text style={styles.hint}>Listings per row</Text>

      <Animated.View style={{ transform: [{ scale: previewScale }] }}>
        <AnimatedColumnPreview columnsAnim={columnsAnim} />
      </Animated.View>

      <View style={styles.optionRow}>
        {BROWSE_COLUMNS_OPTIONS.map((option) => {
          const active = value === option;
          return (
            <GlassButton
              key={option}
              label={String(option)}
              compact
              active={active}
              animatedHover={false}
              testID={
                active
                  ? `browse-filter-view-${option}-selected`
                  : `browse-filter-view-${option}`
              }
              style={styles.option}
              onPress={() => onChange(option)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  sectionLabel: {
    color: colors.text,
    fontSize: typography.sizeSmall,
    fontWeight: typography.weightBold,
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.sizeSmall,
    marginBottom: spacing.xs,
  },
  previewFrame: {
    height: PREVIEW_HEIGHT,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.brownWarm,
    backgroundColor: colors.white,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  previewRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
  },
  previewCell: {
    borderRadius: radius.chip,
    backgroundColor: colors.primary,
    minWidth: 0,
  },
  optionRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  option: {
    flex: 1,
  },
});
