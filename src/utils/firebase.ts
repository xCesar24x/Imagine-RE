"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { Property } from "@/constants/properties";
import { getPersistentItem, setPersistentItem } from "./storage";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

let activeApp: any = null;
let activeDb: any = null;
let activeStorage: any = null;

export async function getActiveFirebaseConfig(): Promise<FirebaseConfig> {
  if (typeof window === "undefined") return DEFAULT_FIREBASE_CONFIG;
  const saved = await getPersistentItem<FirebaseConfig>("imagine_firebase_config", DEFAULT_FIREBASE_CONFIG);
  return saved && saved.apiKey ? saved : DEFAULT_FIREBASE_CONFIG;
}

export async function initFirebase() {
  if (typeof window === "undefined") return null;
  const config = await getActiveFirebaseConfig();
  if (!config.apiKey || !config.projectId) {
    return null;
  }
  try {
    activeApp = getApps().length === 0 ? initializeApp(config) : getApp();
    activeDb = getFirestore(activeApp);
    activeStorage = getStorage(activeApp);
    return { app: activeApp, db: activeDb, storage: activeStorage };
  } catch (e) {
    console.warn("Firebase initialization skipped or misconfigured:", e);
    return null;
  }
}

// Upload base64 image or file to Firebase Storage and get download URL
export async function uploadImageToFirebase(base64Data: string, pathName: string): Promise<string> {
  const fb = await initFirebase();
  if (!fb || !fb.storage || !base64Data.startsWith("data:")) {
    return base64Data; // Return base64 as fallback if Firebase storage is not configured
  }

  try {
    const storageRef = ref(fb.storage, `properties/${pathName}_${Date.now()}.jpg`);
    await uploadString(storageRef, base64Data, "data_url");
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error("Firebase Storage Upload Error:", error);
    return base64Data;
  }
}

// Save or Update Property in Firestore
export async function savePropertyToFirebase(property: Property): Promise<boolean> {
  const fb = await initFirebase();
  if (!fb || !fb.db) return false;

  try {
    // Process cover image if it's base64
    let coverUrl = property.image;
    if (coverUrl && coverUrl.startsWith("data:")) {
      coverUrl = await uploadImageToFirebase(coverUrl, `cover_${property.id}`);
    }

    // Process gallery images if they're base64
    const processedGallery: string[] = [];
    if (Array.isArray(property.gallery)) {
      for (let i = 0; i < property.gallery.length; i++) {
        const item = property.gallery[i];
        if (item && item.startsWith("data:")) {
          const uploaded = await uploadImageToFirebase(item, `gallery_${property.id}_${i}`);
          processedGallery.push(uploaded);
        } else {
          processedGallery.push(item);
        }
      }
    }

    const payload: Property = {
      ...property,
      image: coverUrl,
      gallery: processedGallery,
    };

    const docRef = doc(fb.db, "properties", property.id);
    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (e) {
    console.error("Firestore Save Error:", e);
    return false;
  }
}

// Fetch all Properties from Firestore
export async function getPropertiesFromFirebase(): Promise<Property[] | null> {
  const fb = await initFirebase();
  if (!fb || !fb.db) return null;

  try {
    const colRef = collection(fb.db, "properties");
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return null;

    const list: Property[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as Property);
    });
    return list;
  } catch (e) {
    console.error("Firestore Fetch Error:", e);
    return null;
  }
}

// Delete Property from Firestore
export async function deletePropertyFromFirebase(propertyId: string): Promise<boolean> {
  const fb = await initFirebase();
  if (!fb || !fb.db) return false;

  try {
    const docRef = doc(fb.db, "properties", propertyId);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error("Firestore Delete Error:", e);
    return false;
  }
}
