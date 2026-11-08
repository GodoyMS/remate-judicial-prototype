import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** `false` en el render de servidor y en la hidratación; `true` después. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

/**
 * ¿Coincide la media query? `null` mientras no se conoce (servidor e
 * hidratación), para que el primer render sea idéntico en ambos lados.
 */
export function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => null
  );
}
