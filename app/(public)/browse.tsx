import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { operations } from "@/domain/operations";
import { Container, ListingCard, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

export default function BrowseScreen() {
  const router = useRouter();
  const listings = operations.listPublished();

  return (
    <Screen testID="browse">
      <View style={styles.strip}>
        <Text style={styles.stripText}>Search owner-listed homes</Text>
      </View>
      <Container>
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          numColumns={1}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              onPress={() => router.push(`/listing/${item.id}`)}
            />
          )}
        />
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  strip: {
    height: 120,
    backgroundColor: colors.brownDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  stripText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
});
