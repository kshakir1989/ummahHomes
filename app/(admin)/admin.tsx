import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { operations } from "@/domain/operations";
import { getSession, hasRole } from "@/store/session";
import { Button, Container, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

export default function AdminSurfaceScreen() {
  const session = getSession();
  const router = useRouter();
  const [tab, setTab] = useState<"users" | "listings">("users");
  const [tick, setTick] = useState(0);

  if (!session || !hasRole(session, "admin")) {
    router.replace("/sign-in");
    return null;
  }

  void tick;
  const users = operations.listUsers();
  const listings = operations.listAllListings().slice(0, 20);

  return (
    <Screen testID="admin-surface">
      <Container>
        <Text style={styles.heading}>Admin</Text>
        <View style={styles.tabs}>
          <Button
            label="Users"
            variant={tab === "users" ? "primary" : "outline"}
            onPress={() => setTab("users")}
            testID="admin-tab-users"
          />
          <Button
            label="Listings"
            variant={tab === "listings" ? "primary" : "outline"}
            onPress={() => setTab("listings")}
            testID="admin-tab-listings"
          />
        </View>
        {tab === "users"
          ? users.map((user) => (
              <View key={user.id} style={styles.row}>
                <Text style={styles.meta}>
                  {user.displayName} · {user.id} · {user.status}
                </Text>
                {user.status === "active" && !user.roles.includes("admin") ? (
                  <Button
                    label="Suspend"
                    variant="outline"
                    onPress={() => {
                      operations.suspendUser(user.id);
                      setTick((n) => n + 1);
                    }}
                    testID={`admin-suspend-${user.id}`}
                  />
                ) : null}
              </View>
            ))
          : listings.map((listing) => (
              <View key={listing.id} style={styles.row}>
                <Text style={styles.meta}>
                  {listing.title} · {listing.status}
                </Text>
                <View style={styles.actions}>
                  {listing.status === "published" ? (
                    <Button
                      label="Unpublish"
                      variant="outline"
                      onPress={() => {
                        operations.adminUnpublishListing(listing.id);
                        setTick((n) => n + 1);
                      }}
                      testID={`admin-unpublish-${listing.id}`}
                    />
                  ) : null}
                  {listing.status === "published" ? (
                    <Button
                      label="Mark booked"
                      onPress={() => {
                        operations.adminMarkBooked(listing.id);
                        setTick((n) => n + 1);
                      }}
                      testID={`admin-book-${listing.id}`}
                    />
                  ) : null}
                </View>
              </View>
            ))}
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
  tabs: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
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
  actions: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
});
