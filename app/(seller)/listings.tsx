import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
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
                    onPress={() =>
                      router.push(`/listing-form?id=${item.id}`)
                    }
                    testID={`seller-listing-edit-${item.id}`}
                  />
                  <Button
                    label="Delete"
                    variant="secondary"
                    onPress={() => {
                      operations.deleteListing(item.id);
                      setTick((n) => n + 1);
                    }}
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
    gap: spacing.sm,
  },
});
