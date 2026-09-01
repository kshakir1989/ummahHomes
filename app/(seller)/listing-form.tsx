import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { operations, DomainError } from "@/domain/operations";
import { ListingStatus, type ListingType } from "@/domain/types";
import { isRentListing } from "@/domain/types";
import { getSession, hasRole } from "@/store/session";
import { listingImageGallery } from "../../data/listing-catalog";
import {
  Button,
  Container,
  Input,
  ListingPhotoEditor,
  ScreenScroll,
} from "@/ui";
import { colors, spacing } from "@/ui/theme";

const TYPES: { value: ListingType; label: string }[] = [
  { value: "home_sale", label: "House for Sale" },
  { value: "home_rent", label: "House for Rent" },
  { value: "room_rent", label: "Room for Rent" },
  { value: "basement_rent", label: "Basement for Rent" },
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
  const [imageUrls, setImageUrls] = useState<string[]>(listingImageGallery(0));
  const [requiresBackgroundCheck, setRequiresBackgroundCheck] = useState(false);
  const [status, setStatus] = useState<ListingStatus>(ListingStatus.Draft);
  const [showFeeStub, setShowFeeStub] = useState(false);
  const [feeAcknowledged, setFeeAcknowledged] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

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
      setImageUrls(
        listing.imageUrls?.length ? listing.imageUrls : [listing.imageUrl],
      );
      setRequiresBackgroundCheck(listing.requiresBackgroundCheck);
      setStatus(listing.status);
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
    setImageUrls(created.imageUrls);
    return created.id;
  };

  const persistFields = (targetId: string) => {
    operations.updateListing(targetId, {
      type,
      title,
      description,
      locationText,
      price: Number(price),
      imageUrls,
      requiresBackgroundCheck: isRentListing(type) ? requiresBackgroundCheck : false,
    });
  };

  const saveDraft = () => {
    const targetId = ensureListing();
    persistFields(targetId);
    setNote("Draft saved");
  };

  const publish = () => {
    setError("");
    try {
      const targetId = ensureListing();
      persistFields(targetId);
      operations.publishListing(targetId);
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
    const targetId = ensureListing();
    operations.completeListingFeeStub(targetId);
    setFeeAcknowledged(true);
    setShowFeeStub(false);
  };

  const markBooked = () => {
    if (!listingId) return;
    operations.markListingBooked(listingId);
    setStatus(ListingStatus.Booked);
    setNote("Listing marked booked");
  };

  const resolveSale = () => {
    if (!listingId) return;
    operations.resolveListingSale(listingId);
    setStatus(ListingStatus.Resolved);
    setNote("Sale resolved — removed from public browse");
  };

  const unpublish = () => {
    if (!listingId) return;
    operations.unpublishListing(listingId);
    setStatus(ListingStatus.Draft);
    setNote("Listing unpublished");
  };

  const shouldShowFeeStub =
    type === "home_sale" && (!feeAcknowledged || showFeeStub);

  return (
    <ScreenScroll testID="seller-listing-form">
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
        <ListingPhotoEditor imageUrls={imageUrls} onChange={setImageUrls} />
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
        {isRentListing(type) ? (
          <Button
            label={
              requiresBackgroundCheck
                ? "Background check: required for new applications"
                : "Background check: off"
            }
            variant={requiresBackgroundCheck ? "primary" : "outline"}
            onPress={() => {
              const next = !requiresBackgroundCheck;
              setRequiresBackgroundCheck(next);
              if (listingId) {
                operations.setListingBackgroundCheck(listingId, next);
              }
            }}
            testID="seller-listing-form-bg-toggle"
          />
        ) : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {note ? <Text style={styles.note}>{note}</Text> : null}
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
        {listingId && status === ListingStatus.Published ? (
          <Button
            label="Unpublish"
            variant="outline"
            onPress={unpublish}
            testID="seller-listing-unpublish"
          />
        ) : null}
        {listingId ? (
          <Button
            label="Mark booked"
            variant="secondary"
            onPress={markBooked}
            testID="seller-mark-booked"
          />
        ) : null}
        {listingId &&
        type === "home_sale" &&
        status === ListingStatus.Booked ? (
          <Button
            label="Resolve sale"
            variant="primary"
            onPress={resolveSale}
            testID="seller-resolve-sale"
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
    </ScreenScroll>
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
  note: {
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
