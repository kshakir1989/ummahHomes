import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ATLANTA_METRO_CITIES } from "../../data/listing-catalog";
import type { BrowseFilterCriteria } from "@/domain/browseFilters";
import { LISTING_TYPE_FILTER_OPTIONS } from "@/domain/browseFilters";
import type { BrowseColumnsPerRow } from "@/domain/browseView";
import type { ListingType } from "@/domain/types";
import {
  glassPanelActiveStyle,
  glassPanelOnLightStyle,
} from "./glass";
import { BrowseViewColumnsPicker } from "./BrowseViewColumnsPicker";
import { colors, radius, spacing, typography } from "./theme";

const FILTER_PANEL_MAX_HEIGHT = 760;
const FILTER_OPEN_MS = 280;
const FILTER_CLOSE_MS = 220;

export interface BrowseSearchBarProps {
  filters: BrowseFilterCriteria;
  onChange: (filters: BrowseFilterCriteria) => void;
  resultCount: number;
  columnsPerRow: BrowseColumnsPerRow;
  onColumnsPerRowChange: (columns: BrowseColumnsPerRow) => void;
  filtersExpanded: boolean;
  buyerMode?: boolean;
}

export function BrowseSearchBar({
  filters,
  onChange,
  resultCount,
  columnsPerRow,
  onColumnsPerRowChange,
  filtersExpanded,
  buyerMode = false,
}: BrowseSearchBarProps) {
  const [panelMounted, setPanelMounted] = useState(filtersExpanded);
  const expandAnim = useRef(new Animated.Value(0)).current;
  const selectedTypes = new Set(filters.types ?? []);

  useEffect(() => {
    if (filtersExpanded) {
      setPanelMounted(true);
      Animated.timing(expandAnim, {
        toValue: 1,
        duration: FILTER_OPEN_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
      return;
    }

    Animated.timing(expandAnim, {
      toValue: 0,
      duration: FILTER_CLOSE_MS,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        setPanelMounted(false);
      }
    });
  }, [filtersExpanded, expandAnim]);

  const panelMaxHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FILTER_PANEL_MAX_HEIGHT],
  });

  const panelOpacity = expandAnim.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, 0.7, 1],
  });

  const panelTranslateY = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  const toggleType = (type: ListingType) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) {
      next.delete(type);
    } else {
      next.add(type);
    }
    onChange({ ...filters, types: [...next] });
  };

  const setCity = (city: string) => {
    onChange({ ...filters, city: city || undefined });
  };

  return (
    <View style={styles.wrap} testID="browse-search-bar">
      <TextInput
        value={filters.query ?? ""}
        onChangeText={(query) => onChange({ ...filters, query })}
        placeholder="Search Atlanta metro listings..."
        placeholderTextColor={colors.textMuted}
        style={styles.searchInput}
        testID="browse-search-input"
      />

      {panelMounted ? (
        <Animated.View
          style={[
            styles.panelAnimated,
            {
              maxHeight: panelMaxHeight,
              opacity: panelOpacity,
              transform: [{ translateY: panelTranslateY }],
            },
          ]}
          testID="browse-filters-panel"
        >
          <View style={styles.panel}>
          {!buyerMode ? (
            <>
          <Text style={styles.sectionLabel}>Listing type</Text>
          <View style={styles.chipRow}>
            {LISTING_TYPE_FILTER_OPTIONS.map((option) => {
              const active = selectedTypes.has(option.value);
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  onPress={() => toggleType(option.value)}
                  style={[styles.chip, active && styles.chipActive]}
                  testID={`browse-filter-type-${option.value}`}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
            </>
          ) : null}

          <Text style={styles.sectionLabel}>City</Text>
          <View style={styles.chipRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setCity("")}
              style={[styles.chip, !filters.city && styles.chipActive]}
              testID="browse-filter-city-all"
            >
              <Text
                style={[styles.chipText, !filters.city && styles.chipTextActive]}
              >
                All cities
              </Text>
            </Pressable>
            {ATLANTA_METRO_CITIES.map((city) => {
              const active = filters.city === city;
              return (
                <Pressable
                  key={city}
                  accessibilityRole="button"
                  onPress={() => setCity(city)}
                  style={[styles.chip, active && styles.chipActive]}
                  testID={`browse-filter-city-${city.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {city}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>State</Text>
              <TextInput
                value={filters.state ?? ""}
                onChangeText={(state) =>
                  onChange({ ...filters, state: state || undefined })
                }
                placeholder="GA"
                placeholderTextColor={colors.textMuted}
                style={styles.fieldInput}
                testID="browse-filter-state"
                autoCapitalize="characters"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>ZIP code</Text>
              <TextInput
                value={filters.zipCode ?? ""}
                onChangeText={(zipCode) =>
                  onChange({ ...filters, zipCode: zipCode || undefined })
                }
                placeholder="30309"
                placeholderTextColor={colors.textMuted}
                style={styles.fieldInput}
                keyboardType="number-pad"
                testID="browse-filter-zip"
              />
            </View>
          </View>

          <BrowseViewColumnsPicker
            value={columnsPerRow}
            onChange={onColumnsPerRowChange}
          />
        </View>
        </Animated.View>
      ) : null}

      <Text style={styles.resultCount}>
        {resultCount} {resultCount === 1 ? "home" : "homes"}
        {buyerMode ? " for sale in Atlanta metro" : " in Atlanta metro"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.brownDeep,
    gap: spacing.md,
    borderRadius: radius.card,
    overflow: "hidden",
  },
  searchInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.brownWarm,
    borderRadius: radius.chip,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    color: colors.text,
    fontSize: typography.sizeBody,
  },
  panelAnimated: {
    overflow: "hidden",
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionLabel: {
    color: colors.text,
    fontSize: typography.sizeSmall,
    fontWeight: typography.weightBold,
    marginTop: spacing.xs,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  chip: {
    borderRadius: radius.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    ...glassPanelOnLightStyle,
  },
  chipActive: {
    ...glassPanelActiveStyle,
  },
  chipText: {
    color: colors.primary,
    fontSize: typography.sizeSmall,
    textAlign: "center",
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: typography.weightMedium,
  },
  fieldRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  field: {
    flex: 1,
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: typography.sizeSmall,
    fontWeight: typography.weightMedium,
  },
  fieldInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.brownWarm,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    color: colors.text,
    fontSize: typography.sizeBody,
  },
  resultCount: {
    color: colors.blue,
    fontSize: typography.sizeSmall,
    fontWeight: typography.weightMedium,
  },
});
