import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button, Container, Input, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

export default function EntryScreen() {
  return (
    <Screen testID="entry">
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Owner-listed homes, rooms & basements</Text>
        <Container>
          <Input label="Location" placeholder="City, state or ZIP" testID="entry-search-location" />
          <View style={styles.tabs}>
            {["Sale", "Home rent", "Room", "Basement"].map((tab) => (
              <Text key={tab} style={styles.tab}>
                {tab}
              </Text>
            ))}
          </View>
          <Link href="/browse" asChild>
            <Button label="Search listings" testID="entry-search-submit" />
          </Link>
          <Link href="/sign-in" asChild>
            <Button label="Sign in" variant="outline" testID="entry-sign-in" />
          </Link>
        </Container>
      </View>
      <Container>
        <Text style={styles.trust}>Owner-listed only · No MLS · Direct connection</Text>
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.brownDeep,
    paddingVertical: spacing.xl,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  tabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    color: colors.white,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    overflow: "hidden",
  },
  trust: {
    color: colors.brownMid,
    textAlign: "center",
    marginTop: spacing.lg,
  },
});
