import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DomainError, operations } from "@/domain/operations";
import { renterNeedsBackgroundCheckBanner } from "@/domain/catalogBrowse";
import { canSeekerSendMessage, sellerHasResponded } from "@/domain/messageRules";
import { getDemoState } from "@/store/demoStore";
import { getSession } from "@/store/session";
import { Button, Container, Input, MessageThreadView, Screen } from "@/ui";
import { colors, spacing, typography } from "@/ui/theme";

export default function ThreadScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const router = useRouter();
  const session = getSession();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  const context = useMemo(() => {
    void tick;
    if (!threadId || !session) {
      return null;
    }
    const state = getDemoState();
    const usersById = new Map(state.users.map((user) => [user.id, user]));
    const thread = state.threads.find((t) => t.id === String(threadId));
    if (!thread) {
      return null;
    }
    const request = state.requests.find(
      (r) => r.id === thread.applicationInterestId,
    );
    const listing = request
      ? state.listings.find((l) => l.id === request.listingId)
      : undefined;
    const messages = operations.listMessages(thread.id);
    const isSeeker = request?.seekerId === session.id;
    const isOwner = listing?.ownerId === session.id;
    const canSend =
      request && listing
        ? isSeeker
          ? canSeekerSendMessage(session.id, request, listing, messages)
          : isOwner
        : false;
    const awaitingSeller =
      Boolean(
        request &&
          listing &&
          isSeeker &&
          !sellerHasResponded(messages, listing.ownerId),
      );
    const bgBanner =
      Boolean(request && listing && isSeeker) &&
      renterNeedsBackgroundCheckBanner(listing, request);

    const senderName = (senderId: string) =>
      usersById.get(senderId)?.displayName ?? "Unknown user";

    return {
      thread,
      listing,
      messages,
      canSend,
      awaitingSeller,
      bgBanner,
      request,
      senderName,
    };
  }, [session, threadId, tick]);

  if (!session) {
    router.replace("/sign-in");
    return null;
  }

  if (!context) {
    return (
      <Screen testID="message-thread">
        <Container>
          <Text>Conversation not found</Text>
        </Container>
      </Screen>
    );
  }

  const send = () => {
    if (!body.trim()) {
      return;
    }
    setError("");
    try {
      operations.sendMessage(context.thread.id, body.trim());
      setBody("");
      setTick((n) => n + 1);
    } catch (err) {
      setError(
        err instanceof DomainError ? err.code : "Unable to send message",
      );
    }
  };

  return (
    <Screen testID="message-thread" style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
        <Container style={styles.flex}>
          <ScrollView
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContent}
            keyboardShouldPersistTaps="handled"
            testID="message-thread-scroll"
          >
            <Text style={styles.heading}>
              {context.listing?.title ?? "Messages"}
            </Text>
            {context.bgBanner ? (
              <View style={styles.bgBanner} testID="thread-bg-required-banner">
                <Text style={styles.bgBannerText}>
                  Background check required — complete the stub to continue
                  messaging.
                </Text>
                {context.request ? (
                  <Button
                    label="Complete background check"
                    variant="outline"
                    onPress={() =>
                      router.push(`/request?listingId=${context.listing?.id}`)
                    }
                    testID="thread-bg-complete"
                  />
                ) : null}
              </View>
            ) : null}
            {context.awaitingSeller ? (
              <Text style={styles.notice} testID="thread-awaiting-seller">
                The seller has been notified. You can reply after they message
                you.
              </Text>
            ) : null}
            <MessageThreadView
              messages={context.messages}
              currentUserId={session.id}
              senderName={context.senderName}
            />
          </ScrollView>

          {context.canSend ? (
            <View style={styles.composer}>
              <Input
                label="Message"
                value={body}
                onChangeText={setBody}
                testID="message-thread-input"
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Button
                label="Send"
                onPress={send}
                testID="message-thread-send"
              />
            </View>
          ) : null}
        </Container>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    flexGrow: 1,
    paddingBottom: spacing.md,
  },
  heading: {
    fontSize: typography.sizeHeading,
    fontWeight: typography.weightBold,
    marginBottom: spacing.sm,
    color: colors.text,
  },
  notice: {
    color: colors.brownMid,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  bgBanner: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.danger,
    gap: spacing.sm,
  },
  bgBannerText: {
    color: colors.danger,
    fontWeight: "600",
    lineHeight: 22,
  },
  composer: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.brownWarm,
    backgroundColor: colors.background,
  },
  error: {
    color: colors.danger,
  },
});
