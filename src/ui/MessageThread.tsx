import { StyleSheet, Text, View } from "react-native";
import type { Message } from "../domain/types";
import { colors, spacing } from "./theme";

export interface MessageThreadProps {
  messages: Message[];
  currentUserId?: string;
}

export function MessageThreadView({ messages, currentUserId }: MessageThreadProps) {
  return (
    <View>
      {messages.map((message) => (
        <View
          key={message.id}
          style={[
            styles.bubble,
            message.senderId === currentUserId ? styles.sent : styles.received,
          ]}
        >
          <Text style={styles.body}>{message.body}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    maxWidth: "85%",
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.brownWarm,
  },
  body: { color: colors.text },
});
