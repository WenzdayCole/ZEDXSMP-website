import { useRef, useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns `compute()` once on the client; `serverValue` during SSR.
 * Avoids setState inside effects for client-only data (e.g. random UI).
 */
export function useClientSnapshot(compute, serverValue = null) {
  const valueRef = useRef(undefined);

  return useSyncExternalStore(
    subscribe,
    () => {
      if (valueRef.current === undefined) {
        valueRef.current = compute();
      }
      return valueRef.current;
    },
    () => serverValue,
  );
}
