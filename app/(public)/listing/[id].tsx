import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View testID="listing-detail">
      <Text>listing-detail — placeholder ({id})</Text>
    </View>
  );
}
