import { useLayoutEffect, useMemo, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import type { BrowseFilterCriteria } from "@/domain/browseFilters";
import { DEFAULT_BROWSE_COLUMNS } from "@/domain/browseView";
import type { BrowseColumnsPerRow } from "@/domain/browseView";
import { operations } from "@/domain/operations";
import {
  BrowseFiltersNavButton,
  BrowseSearchBar,
  HomeNavButton,
  ListingCard,
  Screen,
} from "@/ui";
import { colors, layout, spacing } from "@/ui/theme";

function photoHeightForColumns(columns: BrowseColumnsPerRow): number {
  if (columns >= 4) return 120;
  if (columns === 3) return 140;
  if (columns === 2) return 160;
  return 200;
}

export default function BrowseScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [filters, setFilters] = useState<BrowseFilterCriteria>({});
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [columnsPerRow, setColumnsPerRow] =
    useState<BrowseColumnsPerRow>(DEFAULT_BROWSE_COLUMNS);
  const listings = useMemo(
    () => operations.listPublished(filters),
    [filters],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HomeNavButton />,
      headerRight: () => (
        <BrowseFiltersNavButton
          expanded={filtersExpanded}
          onPress={() => setFiltersExpanded((open) => !open)}
        />
      ),
    });
  }, [navigation, filtersExpanded]);

  return (
    <Screen testID="browse" style={styles.screen}>
      <FlatList
        style={styles.list}
        data={listings}
        key={columnsPerRow}
        numColumns={columnsPerRow}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={columnsPerRow > 1 ? styles.gridRow : undefined}
        ListHeaderComponent={
          <BrowseSearchBar
            filters={filters}
            onChange={setFilters}
            resultCount={listings.length}
            columnsPerRow={columnsPerRow}
            onColumnsPerRowChange={setColumnsPerRow}
            filtersExpanded={filtersExpanded}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No listings match your search. Try clearing a filter or searching
              another Atlanta metro city or ZIP.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.gridCell, columnsPerRow > 1 && styles.gridCellMulti]}>
            <ListingCard
              listing={item}
              photoHeight={photoHeightForColumns(columnsPerRow)}
              onPress={() => router.push(`/listing/${item.id}`)}
            />
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    width: "100%",
    maxWidth: layout.maxContentWidth,
    alignSelf: "center",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  gridRow: {
    gap: spacing.md,
  },
  gridCell: {
    width: "100%",
  },
  gridCellMulti: {
    flex: 1,
  },
  empty: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  emptyText: {
    color: colors.brownMid,
    textAlign: "center",
    lineHeight: 22,
  },
});
