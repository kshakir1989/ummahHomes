import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LISTING_IMAGE_URLS } from "../../data/listing-catalog";
import { ListingImage } from "./ListingImage";
import { Button } from "./Button";
import { pickImageFromDevice } from "./pickImage";
import { colors, spacing, typography } from "./theme";

export interface ListingPhotoEditorProps {
  imageUrls: string[];
  onChange: (urls: string[]) => void;
  testID?: string;
}

export function ListingPhotoEditor({
  imageUrls,
  onChange,
  testID = "listing-photo-editor",
}: ListingPhotoEditorProps) {
  const [error, setError] = useState("");

  const addUrl = (uri: string) => {
    if (imageUrls.includes(uri)) {
      return;
    }
    onChange([...imageUrls, uri]);
  };

  const removeAt = (index: number) => {
    onChange(imageUrls.filter((_, i) => i !== index));
  };

  const moveToFront = (index: number) => {
    if (index === 0) {
      return;
    }
    const next = [...imageUrls];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  };

  const onUpload = async () => {
    setError("");
    const uri = await pickImageFromDevice();
    if (!uri) {
      setError("No photo selected.");
      return;
    }
    addUrl(uri);
  };

  return (
    <View style={styles.wrap} testID={testID}>
      <Text style={styles.label}>Photos</Text>
      <Text style={styles.hint}>
        The first photo appears in browse. Add from demo gallery or upload your own.
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {imageUrls.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.thumbWrap}>
            <ListingImage uri={uri} style={styles.thumb} />
            {index === 0 ? (
              <Text style={styles.heroBadge}>List photo</Text>
            ) : null}
            <View style={styles.thumbActions}>
              {index > 0 ? (
                <Pressable onPress={() => moveToFront(index)} testID={`photo-set-hero-${index}`}>
                  <Text style={styles.action}>Set as list photo</Text>
                </Pressable>
              ) : null}
              <Pressable onPress={() => removeAt(index)} testID={`photo-remove-${index}`}>
                <Text style={styles.remove}>Remove</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
      <Button label="Upload photo" variant="outline" onPress={onUpload} testID="listing-photo-upload" />
      <Text style={styles.demoLabel}>Demo gallery</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {LISTING_IMAGE_URLS.slice(0, 8).map((uri) => (
          <Pressable
            key={uri}
            onPress={() => addUrl(uri)}
            style={styles.demoThumb}
            testID="listing-photo-demo"
          >
            <ListingImage uri={uri} style={styles.demoImage} />
          </Pressable>
        ))}
      </ScrollView>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, marginBottom: spacing.md },
  label: {
    fontWeight: typography.weightBold,
    color: colors.text,
    fontSize: typography.sizeBody,
  },
  hint: { color: colors.brownMid, fontSize: typography.sizeSmall },
  row: { flexGrow: 0 },
  thumbWrap: {
    width: 120,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  thumb: {
    width: 120,
    height: 90,
    borderRadius: 8,
  },
  heroBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.primary,
  },
  thumbActions: { gap: 2 },
  action: { fontSize: 11, color: colors.primary },
  remove: { fontSize: 11, color: colors.danger },
  demoLabel: {
    fontWeight: "600",
    color: colors.brownMid,
    marginTop: spacing.xs,
  },
  demoThumb: {
    marginRight: spacing.sm,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.brownWarm,
  },
  demoImage: { width: 72, height: 54 },
  error: { color: colors.danger },
});
