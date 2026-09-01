import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import type { User } from "@/domain/types";
import { getSession } from "./session";

export function useSession(): User | null {
  const [session, setSession] = useState<User | null>(() => getSession());

  useFocusEffect(
    useCallback(() => {
      setSession(getSession());
    }, []),
  );

  return session;
}
