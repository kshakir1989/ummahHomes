import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { operations } from "@/domain/operations";
import { getDemoState } from "@/store/demoStore";
import { getSession } from "@/store/session";
import { Button, Container, Input, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

export default function MessageThreadScreen() {
  const session = getSession();
  const router = useRouter();
  const [body, setBody] = useState("");
  const [tick, setTick] = useState(0);

  if (!session) {
    router.replace("/sign-in");
    return null;
  }

  const thread = useMemo(() => {
    void tick;
    return getDemoState().threads.find((t) =>
      t.participantIds.includes(session.id),
    );
  }, [session.id, tick]);

  const messages = thread ? operations.listMessages(thread.id) : [];

  const send = () => {
    if (!thread || !body.trim()) return;
    operations.sendMessage(thread.id, body.trim());
    setBody("");
    setTick((n) => n + 1);
  };

  return (
    <Screen testID="message-thread">
      <Container>
        <Text style={styles.heading}>Messages</Text>
        {messages.map((message) => (
          <View key={message.id} style={styles.bubble}>
            <Text style={styles.meta}>{message.senderId}</Text>
            <Text style={styles.body}>{message.body}</Text>
          </View>
        ))}
        <Input
          label="Message"
          value={body}
          onChangeText={setBody}
          testID="message-thread-input"
        />
        <Button label="Send" onPress={send} testID="message-thread-send" />
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
  bubble: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.brownWarm,
  },
  meta: { fontSize: 12, color: colors.textMuted },
  body: { color: colors.text },
});
