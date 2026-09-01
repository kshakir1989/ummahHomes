import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Listing, ListingType } from "../domain/types";
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
}

export function ListingCard({ listing, onPress, testID }: ListingCardProps) {
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
      <View style={styles.photoPlaceholder}>
        <Text style={styles.photoText}>Photo</Text>
      </View>
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
  photoPlaceholder: {
    height: 160,
    backgroundColor: colors.greenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  photoText: {
    color: colors.brownMid,
    fontSize: typography.sizeSmall,
  },
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
  ownerListed: {
    fontSize: typography.sizeSmall,
    color: colors.brownMid,
    marginTop: spacing.xs,
  },
});
