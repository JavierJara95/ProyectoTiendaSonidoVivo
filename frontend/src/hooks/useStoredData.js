import { useSyncExternalStore } from "react";
import { subscribeStorage } from "../utils/storage";
export function useStoredData(key) {
  const raw = useSyncExternalStore(
    subscribeStorage,
    () => localStorage.getItem(key),
    () => null,
  );
  return raw ? JSON.parse(raw) : [];
}
