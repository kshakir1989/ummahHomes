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

export default function MyApplicationsScreen() {
  const session = getSession();
  const router = useRouter();
  const [tick, setTick] = useState(0);

  if (!session || !hasRole(session, "renter")) {
    router.replace("/sign-in");
    return null;
  }

  void tick;
  const applications = operations.listMyApplications();
  const listingsById = new Map(
    getDemoState().listings.map((listing) => [listing.id, listing]),
  );

  return (
    <Screen testID="renter-applications">
      <Container>
        <Text style={styles.heading}>My applications</Text>
        {applications.length === 0 ? (
          <Text style={styles.empty}>You have not applied to a rental yet.</Text>
        ) : (
          applications.map((application) => {
            const listing = listingsById.get(application.listingId);
            const thread = operations.getThreadForRequest(application.id);
            return (
              <View
                key={application.id}
                style={styles.card}
                testID={`renter-application-${application.id}`}
              >
                <Text style={styles.title}>
                  {listing?.title ?? application.listingId}
                </Text>
                <Text style={styles.meta}>
                  {STATUS_LABELS[application.status] ?? application.status}
                  {application.backgroundCheckRequired
                    ? ` · BG ${application.backgroundCheckStatus ?? "required"}`
                    : ""}
                </Text>
                <View style={styles.actions}>
                  {application.status === "submitted" ||
                  application.status === "accepted" ? (
                    <Button
                      label="Withdraw"
                      variant="outline"
                      onPress={() => {
                        operations.withdrawRequest(application.id);
                        setTick((n) => n + 1);
                      }}
                      testID={`renter-application-withdraw-${application.id}`}
                    />
                  ) : null}
                  {thread ? (
                    <Button
                      label="Open messages"
                      onPress={() =>
                        router.push(`/thread/${thread.id}?from=applications`)
                      }
                      testID={`renter-application-messages-${application.id}`}
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
    textAlign: "center",
  },
  empty: {
    color: colors.textMuted,
    textAlign: "center",
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
