import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { operations } from "@/domain/operations";
import { primarySeekerCtaLabel } from "@/domain/labels";
import { ListingStatus } from "@/domain/types";
import { getSession } from "@/store/session";
import { Button, Container, ListingImage, Screen } from "@/ui";
import { colors, spacing, typography } from "@/ui/theme";

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
  const isOwner = session?.id === listing.ownerId;
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
      <ScrollView contentContainerStyle={styles.scroll}>
        <ListingImage uri={listing.imageUrl} style={styles.gallery} />
        <Container>
          <View style={styles.column}>
            <Text style={styles.price}>
              {listing.type === "home_sale"
                ? `$${listing.price.toLocaleString()}`
                : `$${listing.price.toLocaleString()}/mo`}
            </Text>
            <Text style={styles.title}>{listing.title}</Text>
            <Text style={styles.meta}>{listing.locationText}</Text>
            <Text style={styles.meta}>{listing.description}</Text>
            <Text style={styles.amenitiesHeading}>Amenities</Text>
            <View style={styles.amenityRow}>
              {listing.amenities.map((amenity) => (
                <Text key={amenity} style={styles.amenity}>
                  {amenity}
                </Text>
              ))}
            </View>
            {booked ? (
              <Text testID="listing-detail-booked" style={styles.booked}>
                This listing is booked
              </Text>
            ) : isOwner ? (
              <View style={styles.ownerBlock}>
                <Text style={styles.ownerNote}>This is your listing</Text>
                <Button
                  label="Manage listing"
                  onPress={() => router.push(`/listing-form?id=${listing.id}`)}
                  testID="listing-detail-manage"
                />
              </View>
            ) : (
              <Button
                label={ctaLabel}
                onPress={onPrimary}
                testID="listing-detail-primary-cta"
              />
            )}
          </View>
        </Container>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xl,
  },
  gallery: {
    height: 280,
    borderRadius: 0,
  },
  column: { gap: spacing.sm },
  price: { fontSize: 24, fontWeight: "700", color: colors.text },
  title: { fontSize: 20, fontWeight: "600", color: colors.text },
  meta: { color: colors.brownMid },
  amenitiesHeading: {
    marginTop: spacing.sm,
    fontSize: typography.sizeBody,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  amenityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  amenity: {
    fontSize: typography.sizeSmall,
    color: colors.brownMid,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.brownWarm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    overflow: "hidden",
  },
  booked: { color: colors.danger, fontWeight: "600" },
  ownerBlock: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  ownerNote: {
    color: colors.primary,
    fontWeight: "600",
  },
});
