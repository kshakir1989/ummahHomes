import { StyleSheet, Text, View } from "react-native";
import type { Message } from "../domain/types";
import { colors, spacing, typography } from "./theme";

export interface MessageThreadViewProps {
  messages: Message[];
  currentUserId: string;
  senderName: (senderId: string) => string;
}

export function MessageThreadView({
  messages,
  currentUserId,
  senderName,
}: MessageThreadViewProps) {
  return (
    <View style={styles.thread}>
      {messages.map((message) => {
        const isMine = message.senderId === currentUserId;
        const label = isMine ? "You" : senderName(message.senderId);

        return (
          <View
            key={message.id}
            style={[styles.row, isMine ? styles.rowMine : styles.rowOther]}
            testID={`message-bubble-${message.id}`}
          >
            <Text style={[styles.meta, isMine && styles.metaMine]}>{label}</Text>
            <View style={[styles.bubble, isMine ? styles.sent : styles.received]}>
              <Text style={[styles.body, isMine && styles.bodyMine]}>
                {message.body}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  thread: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  row: {
    width: "50%",
    maxWidth: "50%",
    gap: spacing.xs,
  },
  rowMine: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  rowOther: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  meta: {
    fontSize: typography.sizeSmall,
    color: colors.textMuted,
    fontWeight: typography.weightMedium,
  },
  metaMine: {
    color: colors.brownMid,
  },
  bubble: {
    width: "100%",
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sent: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: spacing.xs,
  },
  received: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.brownWarm,
    borderBottomLeftRadius: spacing.xs,
  },
  body: {
    color: colors.text,
    fontSize: typography.sizeBody,
    lineHeight: 22,
  },
  bodyMine: {
    color: colors.white,
  },
});
