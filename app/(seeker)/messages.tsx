import { Redirect } from "expo-router";

/** Legacy route — messaging lives in shared /thread and /renter-inbox. */
export default function SeekerMessagesRedirect() {
  return <Redirect href="/renter-inbox" />;
}
