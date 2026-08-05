"use client";

const DB_NAME = "ImagineRE_DB";
const STORE_NAME = "keyvalue";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject("IndexedDB not available");
      return;
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function setPersistentItem(key: string, value: any): Promise<void> {
  const jsonString = typeof value === "string" ? value : JSON.stringify(value);

  // Attempt localStorage save
  try {
    localStorage.setItem(key, jsonString);
  } catch (e) {
    console.warn("localStorage quota exceeded, using IndexedDB primary storage.");
  }

  // Always save to IndexedDB (unlimited high-capacity browser database)
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(value, key);
  } catch (e) {
    console.error("IndexedDB write error:", e);
  }
}

export async function getPersistentItem<T>(key: string, fallback: T): Promise<T> {
  if (typeof window === "undefined") return fallback;

  // Try reading from IndexedDB first (highest storage capacity)
  try {
    const db = await openDB();
    const val = await new Promise<T | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    if (val !== undefined && val !== null) {
      return val as T;
    }
  } catch (e) {
    console.warn("IndexedDB read error, falling back to localStorage:", e);
  }

  // Fallback to localStorage
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (e) {}

  return fallback;
}

export async function removePersistentItem(key: string): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (e) {}

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(key);
  } catch (e) {
    console.error("IndexedDB delete error:", e);
  }
}
