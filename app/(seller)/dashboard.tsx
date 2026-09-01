import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { operations } from "@/domain/operations";
import { getDemoState } from "@/store/demoStore";
import { getSession, hasRole } from "@/store/session";
import { Button, Container, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

export default function SellerDashboardScreen() {
  const session = getSession();
  const router = useRouter();

  const stats = useMemo(() => {
    if (!session) {
      return { listings: 0, pending: 0 };
    }
    const listings = getDemoState().listings.filter((l) => l.ownerId === session.id);
    const listingIds = new Set(listings.map((l) => l.id));
    const pending = getDemoState().requests.filter(
      (r) => listingIds.has(r.listingId) && r.status === "submitted",
    ).length;
    return { listings: listings.length, pending };
  }, [session]);

  if (!session || !hasRole(session, "seller")) {
    router.replace("/sign-in");
    return null;
  }

  return (
    <Screen testID="seller-dashboard">
      <Container>
        <Text style={styles.heading}>Seller dashboard</Text>
        <Text style={styles.subheading}>
          Welcome back, {session.displayName}. Manage your listings and review
          interested seekers.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.listings}</Text>
            <Text style={styles.statLabel}>My listings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending reviews</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            label="View my listings"
            onPress={() => router.push("/listings")}
            testID="seller-dashboard-listings"
          />
          <Button
            label="List a new home"
            variant="secondary"
            onPress={() => router.push("/listing-form")}
            testID="seller-dashboard-new-listing"
          />
          <Button
            label="Review potential customers"
            variant="outline"
            onPress={() => router.push("/requests")}
            testID="seller-dashboard-requests"
          />
          <Button
            label="Messages"
            variant="outline"
            onPress={() => router.push("/seller-inbox")}
            testID="seller-dashboard-inbox"
          />
          {hasRole(session, "buyer") ? (
            <Button
              label="My interests"
              variant="outline"
              onPress={() => router.push("/my-interests")}
              testID="seller-dashboard-buyer-link"
            />
          ) : null}
        </View>
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: spacing.sm,
    color: colors.text,
  },
  subheading: {
    color: colors.brownMid,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.brownWarm,
    padding: spacing.md,
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
  },
  statLabel: {
    color: colors.brownMid,
    fontSize: 14,
  },
  actions: {
    gap: spacing.sm,
  },
});
