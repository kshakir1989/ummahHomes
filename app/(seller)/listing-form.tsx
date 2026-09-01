import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { operations, DomainError } from "@/domain/operations";
import type { ListingType } from "@/domain/types";
import { getSession, hasRole } from "@/store/session";
import { Button, Container, Input, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

const TYPES: { value: ListingType; label: string }[] = [
  { value: "home_sale", label: "Sale" },
  { value: "home_rent", label: "Home rent" },
  { value: "room_rent", label: "Room" },
  { value: "basement_rent", label: "Basement" },
];

export default function SellerListingFormScreen() {
  const router = useRouter();
  const { book, id } = useLocalSearchParams<{ book?: string; id?: string }>();
  const session = getSession();
  const editId = id ? String(id) : book ? String(book) : null;
  const [listingId, setListingId] = useState<string | null>(editId);
  const [type, setType] = useState<ListingType>("home_rent");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationText, setLocationText] = useState("");
  const [price, setPrice] = useState("");
  const [showFeeStub, setShowFeeStub] = useState(false);
  const [feeAcknowledged, setFeeAcknowledged] = useState(false);
  const [error, setError] = useState("");
  const [bookedNote, setBookedNote] = useState("");

  useEffect(() => {
    if (!editId) {
      return;
    }
    try {
      const listing = operations.getListing(editId);
      setType(listing.type);
      setTitle(listing.title);
      setDescription(listing.description);
      setLocationText(listing.locationText);
      setPrice(String(listing.price));
      setFeeAcknowledged(listing.listingFeeCompleted);
    } catch {
      setError("Listing not found");
    }
  }, [editId]);

  if (!session || !hasRole(session, "seller")) {
    router.replace("/sign-in");
    return null;
  }

  const ensureListing = () => {
    if (listingId) {
      return listingId;
    }
    const created = operations.createListing({ type });
    setListingId(created.id);
    return created.id;
  };

  const saveDraft = () => {
    const id = ensureListing();
    operations.updateListing(id, {
      type,
      title,
      description,
      locationText,
      price: Number(price),
    });
  };

  const publish = () => {
    setError("");
    try {
      const id = ensureListing();
      operations.updateListing(id, {
        type,
        title,
        description,
        locationText,
        price: Number(price),
      });
      operations.publishListing(id);
      router.replace("/listings");
    } catch (err) {
      if (err instanceof DomainError && err.code === "FEE_REQUIRED") {
        setShowFeeStub(true);
        return;
      }
      setError(err instanceof Error ? err.message : "Unable to publish");
    }
  };

  const acknowledgeFee = () => {
    const id = ensureListing();
    operations.completeListingFeeStub(id);
    setFeeAcknowledged(true);
    setShowFeeStub(false);
  };

  const markBooked = () => {
    if (!listingId) return;
    operations.markListingBooked(listingId);
    setBookedNote("Listing marked booked");
  };

  const shouldShowFeeStub =
    type === "home_sale" && (!feeAcknowledged || showFeeStub);

  return (
    <Screen testID="seller-listing-form">
      <Container>
        <Text style={styles.heading}>List your home</Text>
        <View style={styles.typeRow}>
          {TYPES.map((item) => (
            <Button
              key={item.value}
              label={item.label}
              variant={type === item.value ? "primary" : "outline"}
              onPress={() => setType(item.value)}
              testID={`seller-listing-form-type-${item.value}`}
            />
          ))}
        </View>
        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          testID="seller-listing-form-title"
        />
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          testID="seller-listing-form-description"
        />
        <Input
          label="Location"
          value={locationText}
          onChangeText={setLocationText}
          testID="seller-listing-form-location"
        />
        <Input
          label="Price (USD)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          testID="seller-listing-form-price"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {bookedNote ? <Text style={styles.booked}>{bookedNote}</Text> : null}
        <Button
          label="Save draft"
          onPress={saveDraft}
          testID="seller-listing-form-save"
        />
        <Button
          label="Publish"
          onPress={publish}
          testID="seller-listing-form-publish"
        />
        {listingId ? (
          <Button
            label="Mark booked"
            variant="secondary"
            onPress={markBooked}
            testID="seller-mark-booked"
          />
        ) : null}
        {shouldShowFeeStub ? (
          <View style={styles.feeCard} testID="seller-fee-stub">
            <Text style={styles.feeTitle}>Listing fee (demo stub)</Text>
            <Text style={styles.feeCopy}>
              Acknowledge the demo listing fee to publish this sale.
            </Text>
            <Button
              label="Acknowledge & continue"
              onPress={acknowledgeFee}
              testID="seller-fee-stub-acknowledge"
            />
          </View>
        ) : null}
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing.md,
    color: colors.text,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  error: {
    color: colors.danger,
    marginVertical: spacing.sm,
  },
  booked: {
    color: colors.primary,
    marginVertical: spacing.sm,
  },
  feeCard: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.brownWarm,
    gap: spacing.sm,
  },
  feeTitle: {
    fontWeight: "700",
    color: colors.text,
  },
  feeCopy: {
    color: colors.brownMid,
  },
});
