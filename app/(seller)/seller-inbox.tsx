import { StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { getSession, hasRole } from "@/store/session";
import { Container, InboxThreadList, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

export default function SellerInboxScreen() {
  const session = getSession();
  const router = useRouter();

  if (!session || !hasRole(session, "seller")) {
    router.replace("/sign-in");
    return null;
  }

  return (
    <Screen testID="seller-inbox">
      <Container>
        <Text style={styles.heading}>Messages</Text>
        <InboxThreadList session={session} fromRoute="seller-inbox" testIdPrefix="seller-inbox" />
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
