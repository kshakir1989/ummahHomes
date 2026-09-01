import { Text, View, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { operations } from "@/domain/operations";
import { Button, Container, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

const ROLES = [
  { id: "user-1", label: "Seller", testID: "sign-in-role-seller" },
  { id: "user-7", label: "Buyer", testID: "sign-in-role-buyer" },
  { id: "user-9", label: "Renter", testID: "sign-in-role-renter" },
  { id: "user-admin", label: "Admin", testID: "sign-in-role-admin" },
] as const;

export default function SignInScreen() {
  const router = useRouter();

  return (
    <Screen testID="sign-in">
      <Container>
        <Text style={styles.title}>Continue as demo user</Text>
        {ROLES.map((role) => (
          <Pressable
            key={role.id}
            testID={role.testID}
            onPress={() => {
              operations.signIn(role.id);
              router.replace("/browse");
            }}
            style={styles.role}
          >
            <Text style={styles.roleText}>{role.label}</Text>
          </Pressable>
        ))}
        <Button label="Back to browse" onPress={() => router.push("/browse")} />
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing.md,
    color: colors.text,
  },
  role: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.brownWarm,
  },
  roleText: {
    color: colors.text,
    fontSize: 16,
  },
});
