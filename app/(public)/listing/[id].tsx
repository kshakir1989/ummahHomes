import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { operations } from "@/domain/operations";
import { primarySeekerCtaLabel } from "@/domain/labels";
import { ListingStatus } from "@/domain/types";
import { getSession } from "@/store/session";
import { Button, Container, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const listing = id ? operations.getListing(String(id)) : null;
  const session = getSession();

  if (!listing) {
    return (
      <Screen testID="listing-detail">
        <Container>
          <Text>Listing not found</Text>
        </Container>
      </Screen>
    );
  }

  const booked = listing.status === ListingStatus.Booked;
  const ctaLabel = primarySeekerCtaLabel(listing.type);

  const onPrimary = () => {
    if (!session) {
      router.push("/sign-in");
      return;
    }
    router.push(`/request?listingId=${listing.id}`);
  };

  return (
    <Screen testID="listing-detail">
      <Container>
        <View style={styles.gallery}>
          <Text style={styles.galleryText}>Photo gallery</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.price}>
            {listing.type === "home_sale"
              ? `$${listing.price.toLocaleString()}`
              : `$${listing.price.toLocaleString()}/mo`}
          </Text>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.meta}>{listing.locationText}</Text>
          <Text style={styles.meta}>{listing.description}</Text>
          {booked ? (
            <Text testID="listing-detail-booked" style={styles.booked}>
              This listing is booked
            </Text>
          ) : (
            <Button
              label={ctaLabel}
              onPress={onPrimary}
              testID="listing-detail-primary-cta"
            />
          )}
        </View>
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gallery: {
    height: 220,
    backgroundColor: colors.greenSoft,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  galleryText: { color: colors.brownMid },
  column: { gap: spacing.sm },
  price: { fontSize: 24, fontWeight: "700", color: colors.text },
  title: { fontSize: 20, fontWeight: "600", color: colors.text },
  meta: { color: colors.brownMid },
  booked: { color: colors.danger, fontWeight: "600" },
});
