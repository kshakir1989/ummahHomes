import { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { isDevEnvironment } from "@/config/env";
import { requestKindLabel, requestStatusLabel } from "@/domain/labels";
import { operations } from "@/domain/operations";
import { ListingStatus } from "@/domain/types";
import { getDemoState } from "@/store/demoStore";
import { getSession, hasRole } from "@/store/session";
import { Button, Container, Input, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

const PAGE_SIZE = 20;

type AdminTab = "users" | "listings" | "applicants";

export default function AdminSurfaceScreen() {
  const session = getSession();
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("users");
  const [tick, setTick] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  if (!session || !hasRole(session, "admin")) {
    router.replace("/sign-in");
    return null;
  }

  void tick;
  const state = getDemoState();
  const users = operations.listUsers();
  const listings = operations.listAllListings();
  const applicants = operations.listAllRequests();
  const usersById = new Map(users.map((user) => [user.id, user]));
  const listingsById = new Map(listings.map((listing) => [listing.id, listing]));

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return listings;
    }
    return listings.filter(
      (listing) =>
        listing.title.toLowerCase().includes(query) ||
        listing.locationText.toLowerCase().includes(query) ||
        listing.id.toLowerCase().includes(query),
    );
  }, [listings, search, tick]);

  const pageCount = Math.max(1, Math.ceil(filteredListings.length / PAGE_SIZE));
  const pagedListings = filteredListings.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  const resetDemo = () => {
    const run = () => {
      operations.resetDemoData();
      setTick((n) => n + 1);
    };
    if (typeof Alert.alert === "function") {
      Alert.alert(
        "Reset demo data?",
        "This restores the seed dataset and clears all demo changes.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Reset", style: "destructive", onPress: run },
        ],
      );
      return;
    }
    if (typeof globalThis.confirm === "function") {
      if (globalThis.confirm("Reset demo data to seed state?")) {
        run();
      }
      return;
    }
    run();
  };

  return (
    <Screen testID="admin-surface">
      <Container>
        <Text style={styles.heading}>Admin</Text>
        {isDevEnvironment() ? (
          <Button
            label="Reset demo data (dev only)"
            variant="outline"
            onPress={resetDemo}
            testID="admin-reset-demo"
          />
        ) : null}
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
            onPress={() => {
              setTab("listings");
              setPage(0);
            }}
            testID="admin-tab-listings"
          />
          <Button
            label="Applicants"
            variant={tab === "applicants" ? "primary" : "outline"}
            onPress={() => setTab("applicants")}
            testID="admin-tab-applicants"
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
          : null}
        {tab === "listings" ? (
          <>
            <Input
              label="Search listings"
              value={search}
              onChangeText={(value) => {
                setSearch(value);
                setPage(0);
              }}
              testID="admin-listings-search"
            />
            <Text style={styles.count}>
              {filteredListings.length} listings · page {page + 1} of {pageCount}
            </Text>
            {pagedListings.map((listing) => (
              <View key={listing.id} style={styles.row}>
                <Text style={styles.meta}>
                  {listing.title} · {listing.status}
                </Text>
                <View style={styles.actions}>
                  {listing.status === ListingStatus.Published ? (
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
                  {listing.status === ListingStatus.Published ? (
                    <Button
                      label="Mark booked"
                      onPress={() => {
                        operations.adminMarkBooked(listing.id);
                        setTick((n) => n + 1);
                      }}
                      testID={`admin-book-${listing.id}`}
                    />
                  ) : null}
                  {listing.type === "home_sale" &&
                  listing.status === ListingStatus.Booked ? (
                    <Button
                      label="Resolve sale"
                      onPress={() => {
                        operations.adminResolveListingSale(listing.id);
                        setTick((n) => n + 1);
                      }}
                      testID={`admin-resolve-${listing.id}`}
                    />
                  ) : null}
                </View>
              </View>
            ))}
            <View style={styles.pager}>
              <Button
                label="Previous"
                variant="outline"
                onPress={() => setPage((p) => Math.max(0, p - 1))}
                testID="admin-listings-prev"
              />
              <Button
                label="Next"
                variant="outline"
                onPress={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                testID="admin-listings-next"
              />
            </View>
          </>
        ) : null}
        {tab === "applicants"
          ? applicants.map((request) => {
              const listing = listingsById.get(request.listingId);
              const seeker = usersById.get(request.seekerId);
              return (
                <View key={request.id} style={styles.row} testID={`admin-applicant-${request.id}`}>
                  <Text style={styles.meta}>
                    {seeker?.displayName ?? request.seekerId} ·{" "}
                    {listing?.title ?? request.listingId}
                  </Text>
                  <Text style={styles.meta}>
                    {requestKindLabel(request.kind)} ·{" "}
                    {requestStatusLabel(request.status)}
                  </Text>
                  {request.status === "submitted" ? (
                    <View style={styles.actions}>
                      <Button
                        label="Accept"
                        onPress={() => {
                          operations.adminAcceptRequest(request.id);
                          setTick((n) => n + 1);
                        }}
                        testID={`admin-accept-${request.id}`}
                      />
                      <Button
                        label="Deny"
                        variant="outline"
                        onPress={() => {
                          operations.adminDenyRequest(request.id);
                          setTick((n) => n + 1);
                        }}
                        testID={`admin-deny-${request.id}`}
                      />
                    </View>
                  ) : null}
                </View>
              );
            })
          : null}
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
  tabs: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  count: { color: colors.brownMid, marginBottom: spacing.sm },
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
  pager: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
