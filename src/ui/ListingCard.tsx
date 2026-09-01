import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Listing, ListingType } from "../domain/types";
import { ListingImage } from "./ListingImage";
import { colors, radius, spacing, typography } from "./theme";

const TYPE_LABELS: Record<ListingType, string> = {
  home_sale: "Sale",
  home_rent: "Home rent",
  room_rent: "Room",
  basement_rent: "Basement",
};

export interface ListingCardProps {
  listing: Listing;
  onPress?: () => void;
  testID?: string;
  photoHeight?: number;
}

export function ListingCard({
  listing,
  onPress,
  testID,
  photoHeight = 200,
}: ListingCardProps) {
  const priceLabel =
    listing.type === "home_sale"
      ? `$${listing.price.toLocaleString()}`
      : `$${listing.price.toLocaleString()}/mo`;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      testID={testID ?? `listing-card-${listing.id}`}
    >
      <ListingImage uri={listing.imageUrl} style={[styles.photo, { height: photoHeight }]} />
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.price}>{priceLabel}</Text>
          <Text style={styles.badge}>{TYPE_LABELS[listing.type]}</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {listing.title}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          {listing.locationText}
        </Text>
        <View style={styles.amenityRow}>
          {listing.amenities.slice(0, 3).map((amenity) => (
            <Text key={amenity} style={styles.amenity} numberOfLines={1}>
              {amenity}
            </Text>
          ))}
        </View>
        <Text style={styles.ownerListed}>Owner-listed</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.brownWarm,
  },
  pressed: {
    opacity: 0.95,
  },
  photo: {},
  body: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: typography.sizeHeading,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  badge: {
    fontSize: typography.sizeSmall,
    color: colors.primary,
    backgroundColor: colors.greenSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.chip,
    overflow: "hidden",
  },
  title: {
    fontSize: typography.sizeBody,
    fontWeight: typography.weightMedium,
    color: colors.text,
  },
  location: {
    fontSize: typography.sizeSmall,
    color: colors.textMuted,
  },
  amenityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  amenity: {
    fontSize: typography.sizeSmall,
    color: colors.brownMid,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.brownWarm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.chip,
    overflow: "hidden",
  },
  ownerListed: {
    fontSize: typography.sizeSmall,
    color: colors.brownMid,
    marginTop: spacing.xs,
  },
});
