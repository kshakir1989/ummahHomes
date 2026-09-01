import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { operations } from "@/domain/operations";
import { getDemoState } from "@/store/demoStore";
import { getSession } from "@/store/session";
import { Button, Container, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

export default function SellerRequestsScreen() {
  const session = getSession();
  const router = useRouter();
  const [tick, setTick] = useState(0);

  if (!session) {
    router.replace("/sign-in");
    return null;
  }

  void tick;
  const ownedListingIds = new Set(
    getDemoState()
      .listings.filter((l) => l.ownerId === session.id)
      .map((l) => l.id),
  );
  const requests = getDemoState().requests.filter((r) =>
    ownedListingIds.has(r.listingId),
  );

  return (
    <Screen testID="seller-requests">
      <Container>
        <Text style={styles.heading}>Applications & interest</Text>
        {requests.length === 0 ? (
          <Text style={styles.empty}>No requests yet</Text>
        ) : (
          requests.map((request) => (
            <View
              key={request.id}
              style={styles.row}
              testID={`seller-request-${request.id}`}
            >
              <Text style={styles.meta}>
                {request.seekerId} · {request.kind} · {request.status}
              </Text>
              {request.status === "submitted" ? (
                <View style={styles.actions}>
                  <Button
                    label="Accept"
                    onPress={() => {
                      operations.acceptRequest(request.id);
                      setTick((n) => n + 1);
                    }}
                    testID="seller-request-accept"
                  />
                  <Button
                    label="Deny"
                    variant="outline"
                    onPress={() => {
                      operations.denyRequest(request.id);
                      setTick((n) => n + 1);
                    }}
                    testID="seller-request-deny"
                  />
                </View>
              ) : null}
            </View>
          ))
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
  empty: { color: colors.textMuted },
  row: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.brownWarm,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  meta: { color: colors.text },
  actions: { flexDirection: "row", gap: spacing.sm },
});
