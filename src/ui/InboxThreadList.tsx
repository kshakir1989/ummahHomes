import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { renterNeedsBackgroundCheckBanner } from "@/domain/catalogBrowse";
import { operations } from "@/domain/operations";
import { sellerHasResponded } from "@/domain/messageRules";
import { RequestKind } from "@/domain/types";
import { getDemoState } from "@/store/demoStore";
import type { User } from "@/domain/types";
import { Button } from "./Button";
import { colors, spacing, typography } from "./theme";

function formatMessageTimestamp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export interface InboxThreadListProps {
  session: User;
  fromRoute: string;
  testIdPrefix?: string;
}

export function InboxThreadList({
  session,
  fromRoute,
  testIdPrefix = "inbox",
}: InboxThreadListProps) {
  const router = useRouter();
  const entries = operations.listMyThreads();

  if (entries.length === 0) {
    return <Text style={styles.empty}>No conversations yet.</Text>;
  }

  return (
    <>
      {entries.map(({ thread, request, listing, lastMessage }) => {
        if (!request || !listing) {
          return null;
        }
        const messages = getDemoState().messages.filter(
          (m) => m.threadId === thread.id,
        );
        const sellerResponded = sellerHasResponded(messages, listing.ownerId);
        const isBuyerInterest = request.kind === RequestKind.Interest;
        const isSeeker = request.seekerId === session.id;
        const bgBanner =
          isSeeker && renterNeedsBackgroundCheckBanner(listing, request);
        const preview = lastMessage
          ? lastMessage.senderId === session.id
            ? `You: ${lastMessage.body}`
            : lastMessage.body
          : null;
        const timestampSource =
          lastMessage?.createdAt ?? request.updatedAt ?? request.createdAt;

        return (
          <View
            key={thread.id}
            style={styles.card}
            testID={`${testIdPrefix}-thread-${thread.id}`}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.title} numberOfLines={1}>
                {listing.title}
              </Text>
              <Text
                style={styles.timestamp}
                testID={`${testIdPrefix}-thread-time-${thread.id}`}
              >
                {formatMessageTimestamp(timestampSource)}
              </Text>
            </View>
            {bgBanner ? (
              <Text style={styles.banner} testID={`${testIdPrefix}-bg-banner-${thread.id}`}>
                Background check required — complete it to continue messaging.
              </Text>
            ) : null}
            <Text style={styles.meta}>
              {preview
                ? isBuyerInterest && !sellerResponded
                  ? `${preview} · Awaiting seller reply`
                  : preview
                : "Waiting for seller to respond"}
            </Text>
            <Button
              label={
                isBuyerInterest && !sellerResponded ? "View status" : "Open thread"
              }
              variant={isBuyerInterest && !sellerResponded ? "outline" : "primary"}
              onPress={() => router.push(`/thread/${thread.id}?from=${fromRoute}`)}
              testID={`${testIdPrefix}-open-${thread.id}`}
            />
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  timestamp: {
    fontSize: typography.sizeSmall,
    color: colors.textMuted,
    flexShrink: 0,
  },
  banner: {
    color: colors.danger,
    fontWeight: "600",
    fontSize: typography.sizeSmall,
  },
  meta: {
    color: colors.brownMid,
  },
});
