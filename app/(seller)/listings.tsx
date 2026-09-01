import { useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { operations } from "@/domain/operations";
import { ListingStatus } from "@/domain/types";
import { getSession, hasRole } from "@/store/session";
import { Button, Container, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

const STATUS_LABEL: Record<ListingStatus, string> = {
  [ListingStatus.Draft]: "Draft",
  [ListingStatus.Published]: "Published",
  [ListingStatus.Booked]: "Booked",
  [ListingStatus.Resolved]: "Resolved",
};

export default function SellerListingsScreen() {
  const session = getSession();
  const router = useRouter();
  const [tick, setTick] = useState(0);

  if (!session || !hasRole(session, "seller")) {
    router.replace("/sign-in");
    return null;
  }

  void tick;
  const listings = operations.listMyListings();

  const confirmDelete = (id: string, title: string) => {
    const runDelete = () => {
      operations.deleteListing(id);
      setTick((n) => n + 1);
    };
    if (typeof Alert.alert === "function") {
      Alert.alert(
        "Delete listing?",
        `Permanently delete "${title || "this listing"}"? This cannot be undone.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: runDelete },
        ],
      );
      return;
    }
    if (typeof globalThis.confirm === "function") {
      if (
        globalThis.confirm(
          `Permanently delete "${title || "this listing"}"? This cannot be undone.`,
        )
      ) {
        runDelete();
      }
      return;
    }
    runDelete();
  };

  return (
    <Screen testID="seller-listings">
      <Container style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>My listings</Text>
          <Button
            label="New listing"
            onPress={() => router.push("/listing-form")}
            testID="seller-listings-new"
          />
        </View>

        {listings.length === 0 ? (
          <Text style={styles.empty}>You have not listed any homes yet.</Text>
        ) : (
          <FlatList
            data={listings}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.row} testID={`seller-listing-row-${item.id}`}>
                <View style={styles.meta}>
                  <Text style={styles.title}>{item.title || "Untitled listing"}</Text>
                  <Text style={styles.detail}>
                    {item.locationText} · {STATUS_LABEL[item.status]}
                  </Text>
                  <Text style={styles.price}>
                    {item.type === "home_sale"
                      ? `$${item.price.toLocaleString()}`
                      : `$${item.price.toLocaleString()}/mo`}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <Button
                    label="Edit"
                    variant="outline"
                    onPress={() => router.push(`/listing-form?id=${item.id}`)}
                    testID={`seller-listing-edit-${item.id}`}
                  />
                  {item.status === ListingStatus.Published ? (
                    <Button
                      label="Unpublish"
                      variant="outline"
                      onPress={() => {
                        operations.unpublishListing(item.id);
                        setTick((n) => n + 1);
                      }}
                      testID={`seller-listing-unpublish-${item.id}`}
                    />
                  ) : null}
                  {item.type === "home_sale" &&
                  item.status === ListingStatus.Booked ? (
                    <Button
                      label="Resolve sale"
                      onPress={() => {
                        operations.resolveListingSale(item.id);
                        setTick((n) => n + 1);
                      }}
                      testID={`seller-listing-resolve-${item.id}`}
                    />
                  ) : null}
                  <Button
                    label="Delete"
                    variant="secondary"
                    onPress={() => confirmDelete(item.id, item.title)}
                    testID={`seller-listing-delete-${item.id}`}
                  />
                </View>
              </View>
            )}
          />
        )}
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
  },
  empty: {
    color: colors.textMuted,
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  row: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.brownWarm,
    gap: spacing.sm,
  },
  meta: {
    gap: spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  detail: {
    color: colors.brownMid,
  },
  price: {
    color: colors.primary,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
