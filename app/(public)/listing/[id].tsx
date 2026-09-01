import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { operations } from "@/domain/operations";
import { primarySeekerCtaLabel } from "@/domain/labels";
import { isRentListing, isSaleListing, ListingStatus } from "@/domain/types";
import { getSession } from "@/store/session";
import { Button, Container, ListingImage, Screen } from "@/ui";
import { colors, spacing, typography } from "@/ui/theme";

export default function ListingDetailScreen() {
  const { id, continue: continueParam } = useLocalSearchParams<{
    id: string;
    continue?: string;
  }>();
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
  const resolved = listing.status === ListingStatus.Resolved;
  const isOwner = session?.id === listing.ownerId;
  const existingInterest = isSaleListing(listing.type)
    ? operations.getMyInterestForListing(listing.id)
    : null;
  const existingApplication = isRentListing(listing.type)
    ? operations.getMyApplicationForListing(listing.id)
    : null;
  const ctaLabel = primarySeekerCtaLabel(listing.type);
  const gallery = listing.imageUrls?.length
    ? listing.imageUrls
    : [listing.imageUrl];

  const onPrimary = () => {
    if (!session) {
      router.push(
        `/sign-in?returnTo=${encodeURIComponent(`/listing/${listing.id}?continue=1`)}`,
      );
      return;
    }
    router.push(`/request?listingId=${listing.id}`);
  };

  const existingRequest = existingInterest ?? existingApplication;
  const thread = existingRequest
    ? operations.getThreadForRequest(existingRequest.id)
    : null;

  return (
    <Screen testID="listing-detail">
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScrollView contentContainerStyle={styles.gallery}>
          {gallery.map((uri, index) => (
            <ListingImage
              key={`${uri}-${index}`}
              uri={uri}
              style={styles.galleryImage}
            />
          ))}
        </ScrollView>
        <Container>
          <View style={styles.column}>
            {continueParam === "1" && session ? (
              <View style={styles.continueBanner} testID="listing-continue-prompt">
                <Text style={styles.continueText}>
                  You are signed in. Continue your {ctaLabel.toLowerCase()} for
                  this listing.
                </Text>
                <Button
                  label={`Continue — ${ctaLabel}`}
                  onPress={() => router.push(`/request?listingId=${listing.id}`)}
                  testID="listing-continue-action"
                />
              </View>
            ) : null}
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
            {resolved ? (
              <Text style={styles.booked}>This sale has been resolved</Text>
            ) : booked ? (
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
            ) : existingRequest ? (
              <View style={styles.interestBlock}>
                <Text style={styles.interestNote} testID="listing-detail-request-status">
                  {isSaleListing(listing.type) ? "Interest" : "Application"}{" "}
                  {existingRequest.status}
                </Text>
                <View style={styles.actionRow}>
                  <Button
                    label={
                      isSaleListing(listing.type)
                        ? "View my interests"
                        : "View my applications"
                    }
                    variant="outline"
                    onPress={() =>
                      router.push(
                        isSaleListing(listing.type)
                          ? "/my-interests"
                          : "/my-applications",
                      )
                    }
                    testID="listing-detail-view-request"
                  />
                  {thread ? (
                    <Button
                      label="Open messages"
                      onPress={() =>
                        router.push(
                          `/thread/${thread.id}?from=${
                            isSaleListing(listing.type) ? "interests" : "applications"
                          }`,
                        )
                      }
                      testID="listing-detail-open-messages"
                    />
                  ) : null}
                </View>
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
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  galleryImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
  },
  column: { gap: spacing.sm },
  continueBanner: {
    backgroundColor: colors.greenSoft,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  continueText: {
    color: colors.primary,
    lineHeight: 22,
  },
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
  interestBlock: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  interestNote: {
    color: colors.primary,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
