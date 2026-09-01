import { StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { getSession, hasRole } from "@/store/session";
import { Container, InboxThreadList, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

export default function RenterInboxScreen() {
  const session = getSession();
  const router = useRouter();

  if (!session || !hasRole(session, "renter")) {
    router.replace("/sign-in");
    return null;
  }

  return (
    <Screen testID="renter-inbox">
      <Container>
        <Text style={styles.heading}>Messages</Text>
        <InboxThreadList session={session} fromRoute="renter-inbox" testIdPrefix="renter-inbox" />
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
});
