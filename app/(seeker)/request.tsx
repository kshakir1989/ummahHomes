import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { DomainError, operations } from "@/domain/operations";
import { primarySeekerCtaLabel } from "@/domain/labels";
import { isSaleListing } from "@/domain/types";
import { getDemoState } from "@/store/demoStore";
import { getSession } from "@/store/session";
import { Button, Container, Input, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

export default function SeekerRequestScreen() {
  const { listingId } = useLocalSearchParams<{ listingId: string }>();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [showBg, setShowBg] = useState(false);
  const listing = listingId ? operations.getListing(String(listingId)) : null;
  const session = getSession();

  if (!session) {
    router.replace("/sign-in");
    return null;
  }

  if (!listing) {
    return (
      <Screen testID="seeker-request">
        <Container>
          <Text>Listing not found</Text>
        </Container>
      </Screen>
    );
  }

  const label = primarySeekerCtaLabel(listing.type);
  const isBuyerInterest = isSaleListing(listing.type);

  const goToThread = (id: string) => {
    const thread = getDemoState().threads.find(
      (t) => t.applicationInterestId === id,
    );
    if (thread) {
      router.replace(
        `/thread/${thread.id}?from=${isBuyerInterest ? "interests" : "applications"}`,
      );
      return;
    }
    router.replace(isBuyerInterest ? "/my-interests" : "/my-applications");
  };

  const submit = () => {
    setError("");
    try {
      const request = operations.createRequest(
        listing.id,
        isBuyerInterest ? { initialMessage: message } : undefined,
      );
      setRequestId(request.id);
      if (!isBuyerInterest && request.backgroundCheckRequired) {
        setShowBg(true);
        return;
      }
      const thread = getDemoState().threads.find(
        (t) => t.applicationInterestId === request.id,
      );
      if (message.trim() && thread && !isBuyerInterest) {
        operations.sendMessage(thread.id, message.trim());
      }
      if (isBuyerInterest) {
        router.replace("/browse?interestSubmitted=1");
        return;
      }
      router.replace("/browse?applicationSubmitted=1");
    } catch (err) {
      setError(err instanceof DomainError ? err.code : "Unable to submit");
    }
  };

  const passBg = () => {
    if (!requestId) return;
    operations.completeBackgroundCheckStub(requestId, "passed");
    const thread = getDemoState().threads.find(
      (t) => t.applicationInterestId === requestId,
    );
    if (message.trim() && thread) {
      operations.sendMessage(thread.id, message.trim());
    }
    goToThread(requestId);
  };

  return (
    <Screen testID="seeker-request">
      <Container>
        <Text style={styles.heading}>{label}</Text>
        <Text style={styles.summary}>{listing.title}</Text>
        {isBuyerInterest ? (
          <Text style={styles.note}>
            The seller will be notified. You can message after they respond.
          </Text>
        ) : null}
        <Input
          label={isBuyerInterest ? "Optional note for seller" : "Optional message"}
          value={message}
          onChangeText={setMessage}
          testID="seeker-request-message"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button label={label} onPress={submit} testID="seeker-request-submit" />
        {showBg ? (
          <View style={styles.bg} testID="seeker-bg-stub">
            <Text style={styles.heading}>Background check (demo)</Text>
            <Button
              label="Start stub"
              onPress={() => requestId && operations.startBackgroundCheckStub(requestId)}
              testID="seeker-bg-stub-start"
            />
            <Button label="Pass" onPress={passBg} testID="seeker-bg-stub-pass" />
            <Button
              label="Fail"
              variant="outline"
              onPress={() =>
                requestId &&
                operations.completeBackgroundCheckStub(requestId, "failed")
              }
              testID="seeker-bg-stub-fail"
            />
            <Button
              label="Decline"
              variant="outline"
              onPress={() =>
                requestId && operations.declineBackgroundCheckStub(requestId)
              }
              testID="seeker-bg-stub-decline"
            />
          </View>
        ) : null}
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  summary: { color: colors.brownMid, marginBottom: spacing.md },
  note: { color: colors.brownMid, marginBottom: spacing.md, lineHeight: 22 },
  error: { color: colors.danger, marginBottom: spacing.sm },
  bg: {
    marginTop: spacing.lg,
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.brownWarm,
  },
});
