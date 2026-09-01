import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { requestKindLabel, requestStatusLabel } from "@/domain/labels";
import { operations } from "@/domain/operations";
import { RequestKind, RequestStatus, isRentListing } from "@/domain/types";
import { getDemoState } from "@/store/demoStore";
import { getSession, hasRole } from "@/store/session";
import { Button, Container, Input, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

export default function SellerRequestsScreen() {
  const session = getSession();
  const router = useRouter();
  const [tick, setTick] = useState(0);
  const [respondId, setRespondId] = useState<string | null>(null);
  const [responseBody, setResponseBody] = useState("");
  const [listingFilter, setListingFilter] = useState("");
  const [bgListingId, setBgListingId] = useState<string | null>(null);
  const [bgScope, setBgScope] = useState<"all" | "selected">("all");
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);

  if (!session || !hasRole(session, "seller")) {
    router.replace("/sign-in");
    return null;
  }

  void tick;
  const state = getDemoState();
  const ownedListingIds = new Set(
    state.listings.filter((l) => l.ownerId === session.id).map((l) => l.id),
  );
  const requests = useMemo(
    () =>
      state.requests
        .filter((r) => ownedListingIds.has(r.listingId))
        .filter((r) =>
          listingFilter ? r.listingId === listingFilter : true,
        ),
    [state.requests, ownedListingIds, listingFilter, tick],
  );
  const usersById = new Map(state.users.map((user) => [user.id, user]));
  const listingsById = new Map(state.listings.map((listing) => [listing.id, listing]));
  const ownedListings = state.listings.filter((l) => l.ownerId === session.id);

  const openApplyRequestsForListing = (listingId: string) =>
    state.requests.filter(
      (r) =>
        r.listingId === listingId &&
        r.kind === RequestKind.Apply &&
        (r.status === RequestStatus.Submitted ||
          r.status === RequestStatus.Accepted),
    );

  const applyBgRequirement = () => {
    if (!bgListingId) return;
    if (bgScope === "all") {
      operations.requireBackgroundCheckForApplications(bgListingId, { mode: "all" });
    } else {
      operations.requireBackgroundCheckForApplications(bgListingId, {
        mode: "selected",
        requestIds: selectedRequestIds,
      });
    }
    setBgListingId(null);
    setSelectedRequestIds([]);
    setTick((n) => n + 1);
  };

  const toggleSelected = (requestId: string) => {
    setSelectedRequestIds((current) =>
      current.includes(requestId)
        ? current.filter((id) => id !== requestId)
        : [...current, requestId],
    );
  };

  return (
    <Screen testID="seller-requests">
      <Container>
        <Text style={styles.heading}>Review potential customers</Text>
        <View style={styles.filterRow}>
          <Button
            label={listingFilter ? "All listings" : "Filter by listing"}
            variant="outline"
            onPress={() => setListingFilter("")}
            testID="seller-requests-filter-clear"
          />
          {ownedListings.map((listing) => (
            <Button
              key={listing.id}
              label={listing.title.slice(0, 24)}
              variant={listingFilter === listing.id ? "primary" : "outline"}
              onPress={() => setListingFilter(listing.id)}
              testID={`seller-requests-filter-${listing.id}`}
            />
          ))}
        </View>
        {requests.length === 0 ? (
          <Text style={styles.empty}>No requests yet</Text>
        ) : (
          requests.map((request) => {
            const listing = listingsById.get(request.listingId);
            const isRent = listing ? isRentListing(listing.type) : false;
            return (
              <View
                key={request.id}
                style={styles.row}
                testID={`seller-request-${request.id}`}
              >
                <Text style={styles.meta}>
                  {usersById.get(request.seekerId)?.displayName ?? request.seekerId}
                </Text>
                <Text style={styles.meta}>
                  {listing?.title ?? request.listingId}
                </Text>
                <View style={styles.chips}>
                  <Text style={styles.chip}>
                    {requestKindLabel(request.kind)}
                  </Text>
                  <Text style={styles.chip}>
                    {requestStatusLabel(request.status)}
                  </Text>
                  {request.backgroundCheckRequired ? (
                    <Text style={styles.chipBg} testID={`seller-request-bg-${request.id}`}>
                      BG {request.backgroundCheckStatus ?? "required"}
                    </Text>
                  ) : null}
                </View>
                {request.status === RequestStatus.Submitted ? (
                  <View style={styles.actions}>
                    <Button
                      label="Accept"
                      onPress={() => {
                        operations.acceptRequest(request.id);
                        setTick((n) => n + 1);
                      }}
                      testID="seller-request-accept"
                    />
                    <Button
                      label="Deny"
                      variant="outline"
                      onPress={() => {
                        operations.denyRequest(request.id);
                        setTick((n) => n + 1);
                      }}
                      testID="seller-request-deny"
                    />
                    {request.kind === RequestKind.Interest ? (
                      <Button
                        label="Respond"
                        variant="secondary"
                        onPress={() => {
                          setRespondId(request.id);
                          setResponseBody("");
                        }}
                        testID={`seller-request-respond-${request.id}`}
                      />
                    ) : null}
                  </View>
                ) : null}
                {respondId === request.id ? (
                  <View style={styles.respondBox}>
                    <Input
                      label="Message to buyer"
                      value={responseBody}
                      onChangeText={setResponseBody}
                      testID="seller-request-response-input"
                    />
                    <Button
                      label="Send response"
                      onPress={() => {
                        const thread = operations.getThreadForRequest(request.id);
                        if (thread && responseBody.trim()) {
                          operations.sendMessage(thread.id, responseBody.trim());
                          setRespondId(null);
                          setResponseBody("");
                          setTick((n) => n + 1);
                        }
                      }}
                      testID="seller-request-response-send"
                    />
                  </View>
                ) : null}
                {isRent &&
                (request.status === RequestStatus.Submitted ||
                  request.status === RequestStatus.Accepted) ? (
                  <Button
                    label="Require background check"
                    variant="outline"
                    onPress={() => {
                      setBgListingId(request.listingId);
                      setBgScope("all");
                      setSelectedRequestIds([]);
                    }}
                    testID={`seller-request-require-bg-${request.id}`}
                  />
                ) : null}
                {operations.getThreadForRequest(request.id) ? (
                  <Button
                    label="Open conversation"
                    variant="outline"
                    onPress={() => {
                      const thread = operations.getThreadForRequest(request.id);
                      if (thread) {
                        router.push(`/thread/${thread.id}?from=requests`);
                      }
                    }}
                    testID={`seller-request-thread-${request.id}`}
                  />
                ) : null}
              </View>
            );
          })
        )}
        {bgListingId ? (
          <View style={styles.bgPanel} testID="seller-bg-scope-panel">
            <Text style={styles.bgTitle}>Background check scope</Text>
            <Button
              label="All open applications on this listing"
              variant={bgScope === "all" ? "primary" : "outline"}
              onPress={() => setBgScope("all")}
              testID="seller-bg-scope-all"
            />
            <Button
              label="Select applicants"
              variant={bgScope === "selected" ? "primary" : "outline"}
              onPress={() => setBgScope("selected")}
              testID="seller-bg-scope-selected"
            />
            {bgScope === "selected"
              ? openApplyRequestsForListing(bgListingId).map((request) => (
                  <Button
                    key={request.id}
                    label={`${usersById.get(request.seekerId)?.displayName ?? request.seekerId}${
                      selectedRequestIds.includes(request.id) ? " ✓" : ""
                    }`}
                    variant={
                      selectedRequestIds.includes(request.id) ? "primary" : "outline"
                    }
                    onPress={() => toggleSelected(request.id)}
                    testID={`seller-bg-select-${request.id}`}
                  />
                ))
              : null}
            <Button
              label="Apply requirement"
              onPress={applyBgRequirement}
              testID="seller-bg-scope-apply"
            />
            <Button
              label="Cancel"
              variant="outline"
              onPress={() => setBgListingId(null)}
            />
          </View>
        ) : null}
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
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  empty: { color: colors.textMuted },
  row: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.brownWarm,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  meta: { color: colors.text, fontWeight: "600" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  chip: {
    fontSize: 12,
    color: colors.brownMid,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
  },
  chipBg: {
    fontSize: 12,
    color: colors.danger,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
  },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  respondBox: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  bgPanel: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.brownWarm,
    gap: spacing.sm,
  },
  bgTitle: {
    fontWeight: "700",
    color: colors.text,
  },
});
