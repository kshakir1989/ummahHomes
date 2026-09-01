import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { operations } from "@/domain/operations";
import { getDemoState } from "@/store/demoStore";
import { getSession, hasRole } from "@/store/session";
import { Button, Container, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  accepted: "Accepted",
  denied: "Denied",
  withdrawn: "Withdrawn",
  unavailable: "Unavailable",
};

export default function MyInterestsScreen() {
  const session = getSession();
  const router = useRouter();
  const [tick, setTick] = useState(0);

  if (!session || !hasRole(session, "buyer")) {
    router.replace("/sign-in");
    return null;
  }

  void tick;
  const interests = operations.listMyInterests();
  const listingsById = new Map(
    getDemoState().listings.map((listing) => [listing.id, listing]),
  );

  return (
    <Screen testID="buyer-interests">
      <Container>
        <Text style={styles.heading}>My interests</Text>
        {interests.length === 0 ? (
          <Text style={styles.empty}>You have not expressed interest yet.</Text>
        ) : (
          interests.map((interest) => {
            const listing = listingsById.get(interest.listingId);
            const thread = operations.getThreadForRequest(interest.id);
            return (
              <View
                key={interest.id}
                style={styles.card}
                testID={`buyer-interest-${interest.id}`}
              >
                <Text style={styles.title}>
                  {listing?.title ?? interest.listingId}
                </Text>
                <Text style={styles.meta}>
                  {STATUS_LABELS[interest.status] ?? interest.status}
                </Text>
                <View style={styles.actions}>
                  {interest.status === "submitted" ||
                  interest.status === "accepted" ? (
                    <Button
                      label="Withdraw"
                      variant="outline"
                      onPress={() => {
                        operations.withdrawRequest(interest.id);
                        setTick((n) => n + 1);
                      }}
                      testID={`buyer-interest-withdraw-${interest.id}`}
                    />
                  ) : null}
                  {thread ? (
                    <Button
                      label="Open messages"
                      onPress={() => router.push(`/thread/${thread.id}?from=interests`)}
                      testID={`buyer-interest-messages-${interest.id}`}
                    />
                  ) : null}
                </View>
              </View>
            );
          })
        )}
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
  empty: {
    color: colors.textMuted,
  },
  card: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.brownWarm,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  meta: {
    color: colors.brownMid,
    textTransform: "capitalize",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
