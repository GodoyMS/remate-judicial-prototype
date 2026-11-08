import { useSyncExternalStore } from "react";

/**
 * Pequeño store persistido en localStorage para el prototipo (sin backend).
 *
 * - Una sola instancia por clave, con snapshot cacheado para que
 *   `useSyncExternalStore` no re-renderice en bucle.
 * - Escucha el evento `storage`, de modo que el panel admin abierto en otra
 *   pestaña y el dashboard del inversionista se mantienen sincronizados:
 *   aprobar una solicitud en admin se refleja al instante en el usuario.
 */
export interface LocalStore<T> {
  get: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
  /** Vuelve a la semilla. Útil para pruebas y para "reiniciar demo". */
  reset: () => void;
  useValue: () => T;
}

export function createLocalStore<T>(key: string, seed: () => T): LocalStore<T> {
  const listeners = new Set<() => void>();
  let serverSnapshot: T | null = null;
  let cachedRaw: string | null | undefined;
  let cachedValue: T | null = null;

  const getServer = () => {
    if (serverSnapshot === null) serverSnapshot = seed();
    return serverSnapshot;
  };

  const get = (): T => {
    if (typeof window === "undefined") return getServer();
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      raw = null;
    }
    if (raw === cachedRaw && cachedValue !== null) return cachedValue;
    if (raw === null) {
      const initial = seed();
      try {
        localStorage.setItem(key, JSON.stringify(initial));
        raw = localStorage.getItem(key);
      } catch {
        /* almacenamiento bloqueado: se trabaja en memoria */
      }
      cachedRaw = raw;
      cachedValue = initial;
      return initial;
    }
    try {
      cachedValue = JSON.parse(raw) as T;
    } catch {
      cachedValue = seed();
    }
    cachedRaw = raw;
    return cachedValue;
  };

  const emit = () => listeners.forEach((l) => l());

  const set: LocalStore<T>["set"] = (next) => {
    const value = typeof next === "function" ? (next as (p: T) => T)(get()) : next;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      cachedRaw = localStorage.getItem(key);
    } catch {
      cachedRaw = undefined;
    }
    cachedValue = value;
    emit();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key || e.key === null) listener();
    };
    if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
    };
  };

  const reset = () => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    cachedRaw = undefined;
    cachedValue = null;
    emit();
  };

  const useValue = () => useSyncExternalStore(subscribe, get, getServer);

  return { get, set, subscribe, reset, useValue };
}
