import { globalSaveSchema, type GlobalSaveData } from "@modelverse/shared-types";

export const CURRENT_SAVE_VERSION = 1;
export const createDefaultSave = (reducedMotion = false): GlobalSaveData => ({
  schemaVersion: 1,
  currentWorldId: "",
  currentEntryPointId: "",
  worldsVisited: [],
  worldStates: {},
  settings: { masterVolume: 0.8, graphicsQuality: "medium", reducedMotion },
});
export type SaveMigration = (value: Record<string, unknown>) => Record<string, unknown>;
export const migrateSave = (value: unknown): GlobalSaveData => {
  if (typeof value !== "object" || value === null)
    throw new Error("Save is not an object");
  const candidate = value as Record<string, unknown>;
  if (candidate.schemaVersion !== CURRENT_SAVE_VERSION)
    throw new Error(`Unsupported save schema ${String(candidate.schemaVersion)}`);
  return globalSaveSchema.parse(candidate);
};
export type SaveService = {
  load: () => Promise<GlobalSaveData>;
  save: (data: GlobalSaveData) => Promise<void>;
  clear: () => Promise<void>;
};
export const createIndexedDbSaveService = (databaseName = "modelverse"): SaveService => {
  const open = () =>
    new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);
      request.onupgradeneeded = () => request.result.createObjectStore("saves");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error("IndexedDB open failed"));
    });
  const transaction = async <T>(
    mode: IDBTransactionMode,
    action: (store: IDBObjectStore) => IDBRequest<T>,
  ) => {
    const db = await open();
    try {
      return await new Promise<T>((resolve, reject) => {
        const tx = db.transaction("saves", mode);
        const request = action(tx.objectStore("saves"));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () =>
          reject(request.error ?? new Error("IndexedDB request failed"));
        tx.onerror = () => reject(tx.error ?? new Error("IndexedDB transaction failed"));
      });
    } finally {
      db.close();
    }
  };
  return {
    load: async () => {
      try {
        const stored = await transaction("readonly", (store) => store.get("global"));
        return stored === undefined
          ? createDefaultSave(matchMedia("(prefers-reduced-motion: reduce)").matches)
          : migrateSave(stored);
      } catch (error) {
        console.error("Save recovery: stored data could not be loaded", error);
        return createDefaultSave();
      }
    },
    save: async (data) => {
      globalSaveSchema.parse(data);
      await transaction("readwrite", (store) => store.put(data, "global"));
    },
    clear: async () => {
      await transaction("readwrite", (store) => store.delete("global"));
    },
  };
};
