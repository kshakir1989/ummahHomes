import { Image, StyleSheet, View, type ImageStyle, type StyleProp } from "react-native";
import { colors } from "./theme";

export interface ListingImageProps {
  uri: string;
  style?: StyleProp<ImageStyle>;
  testID?: string;
}

export function ListingImage({ uri, style, testID }: ListingImageProps) {
  return (
    <View style={[styles.frame, style]} testID={testID}>
      <Image
        accessibilityIgnoresInvertColors
        source={{ uri }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: "hidden",
    backgroundColor: colors.greenSoft,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
