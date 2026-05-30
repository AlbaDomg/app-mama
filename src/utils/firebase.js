import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  writeBatch,
  getDocs,
  query,
  limit
} from 'firebase/firestore';

// Keys stored in LocalStorage for dynamic user setup
const LOCAL_STORAGE_CONFIG_KEY = 'mama_firebase_config_keys';

/**
 * Retrieves the current Firebase configuration either from .env or localStorage.
 */
export function getFirebaseConfig() {
  // Hardcoded default configuration to guarantee zero-config shared sync on all devices (PC & Mobile)
  const defaultFirebaseConfig = {
    apiKey: "AIzaSyD6oBDUInzADiy0mpHi-en5SdBLzeJOy90",
    authDomain: "app-mama-a44ef.firebaseapp.com",
    projectId: "app-mama-a44ef",
    storageBucket: "app-mama-a44ef.firebasestorage.app",
    messagingSenderId: "594642334331",
    appId: "1:594642334331:web:5245ee84fa785d9a0a28de"
  };

  // 1. Try env variables
  if (
    import.meta.env &&
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  ) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
  }

  // 2. Try localStorage
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error parsing Firebase config from localStorage", e);
  }

  // 3. Fallback to hardcoded configuration
  return defaultFirebaseConfig;
}

/**
 * Saves a new Firebase config in localStorage.
 * Accepts a config object or a raw JSON string.
 */
export function saveFirebaseConfig(configInput) {
  try {
    let configObj = configInput;
    if (typeof configInput === 'string') {
      let cleaned = configInput.trim();
      
      // 1. If it contains the JavaScript code block, extract only the part inside curly braces { ... }
      if (cleaned.includes('firebaseConfig')) {
        const configIndex = cleaned.indexOf('firebaseConfig');
        const firstBrace = cleaned.indexOf('{', configIndex);
        const lastBrace = cleaned.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }
      } else if (cleaned.includes('{')) {
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }
      }
      
      // 2. Convert standard JS unquoted keys to double-quoted JSON keys (e.g. apiKey: "..." -> "apiKey": "...")
      cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
      
      // 3. Convert single quoted string values to double quotes
      cleaned = cleaned.replace(/:\s*'([^']*)'/g, ': "$1"');
      
      // 4. Remove trailing commas before a closing brace or bracket to keep JSON parser happy
      cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
      
      configObj = JSON.parse(cleaned);
    }

    // Basic structure validation
    if (!configObj || !configObj.apiKey || !configObj.projectId) {
      throw new Error("La configuración debe contener al menos 'apiKey' y 'projectId'.");
    }

    localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(configObj));
    return true;
  } catch (e) {
    console.error("Error saving Firebase config", e);
    throw new Error("El formato del texto no es correcto. Asegúrate de copiar solo las claves dentro de { ... } o pega el código completo sin modificar.");
  }
}

/**
 * Clears Firebase config from localStorage.
 */
export function clearFirebaseConfig() {
  localStorage.removeItem(LOCAL_STORAGE_CONFIG_KEY);
}

// Global references for initialized instances
let firebaseApp = null;
let firestoreDb = null;

/**
 * Initializes and returns the Firestore instance.
 * Returns null if no configuration is found or if initialization fails.
 */
export function getFirestoreDb() {
  if (firestoreDb) return firestoreDb;

  const config = getFirebaseConfig();
  if (!config) return null;

  try {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApp();
    }
    
    // Enable multi-tab offline support if possible
    firestoreDb = getFirestore(firebaseApp);
    return firestoreDb;
  } catch (e) {
    console.error("Failed to initialize Firebase", e);
    return null;
  }
}

/**
 * Test if the current database connection is valid by making a fast read query.
 */
export async function testConnection() {
  const db = getFirestoreDb();
  if (!db) return false;
  try {
    // Attempt a simple fast limit-1 fetch of tasks
    const testQuery = query(collection(db, 'tasks'), limit(1));
    await getDocs(testQuery);
    return true;
  } catch (e) {
    console.error("Firebase connection test failed", e);
    return false;
  }
}

// ----------------------------------------------------
// FIRESTORE SYNC & OPERATION UTILITIES
// ----------------------------------------------------

/**
 * Subscribes in real-time to the 'tasks' collection.
 */
export function subscribeToTasks(onUpdate, onError) {
  const db = getFirestoreDb();
  if (!db) {
    if (onError) onError(new Error("Database not initialized"));
    return () => {};
  }

  const tasksCollection = collection(db, 'tasks');
  return onSnapshot(tasksCollection, (snapshot) => {
    const tasks = [];
    snapshot.forEach((doc) => {
      tasks.push({ ...doc.data(), id: doc.id });
    });
    // Sort tasks by orderIndex in JS to avoid complex compound indexes in Firestore
    tasks.sort((a, b) => {
      const idxA = a.orderIndex !== undefined ? a.orderIndex : 999;
      const idxB = b.orderIndex !== undefined ? b.orderIndex : 999;
      return idxA - idxB;
    });
    onUpdate(tasks);
  }, (error) => {
    console.error("Error fetching real-time tasks", error);
    if (onError) onError(error);
  });
}

/**
 * Subscribes in real-time to the 'events' collection.
 */
export function subscribeToEvents(onUpdate, onError) {
  const db = getFirestoreDb();
  if (!db) {
    if (onError) onError(new Error("Database not initialized"));
    return () => {};
  }

  const eventsCollection = collection(db, 'events');
  return onSnapshot(eventsCollection, (snapshot) => {
    const events = [];
    snapshot.forEach((doc) => {
      events.push({ ...doc.data(), id: doc.id });
    });
    onUpdate(events);
  }, (error) => {
    console.error("Error fetching real-time events", error);
    if (onError) onError(error);
  });
}

/**
 * Adds or overwrites a task document in Firestore.
 */
export async function saveTaskToCloud(task) {
  const db = getFirestoreDb();
  if (!db) return;
  const docRef = doc(db, 'tasks', task.id);
  await setDoc(docRef, task);
}

/**
 * Updates specific fields of a task document.
 */
export async function updateTaskInCloud(taskId, updatedFields) {
  const db = getFirestoreDb();
  if (!db) return;
  const docRef = doc(db, 'tasks', taskId);
  await updateDoc(docRef, updatedFields);
}

/**
 * Deletes a task document from Firestore.
 */
export async function deleteTaskFromCloud(taskId) {
  const db = getFirestoreDb();
  if (!db) return;
  const docRef = doc(db, 'tasks', taskId);
  await deleteDoc(docRef);
}

/**
 * Adds or overwrites an event document in Firestore.
 */
export async function saveEventToCloud(event) {
  const db = getFirestoreDb();
  if (!db) return;
  const docRef = doc(db, 'events', event.id);
  await setDoc(docRef, event);
}

/**
 * Deletes an event document and cascades delete to associated tasks.
 */
export async function deleteEventFromCloud(eventId) {
  const db = getFirestoreDb();
  if (!db) return;

  // Batch operations for atomicity
  const batch = writeBatch(db);
  
  // 1. Delete event document
  const eventRef = doc(db, 'events', eventId);
  batch.delete(eventRef);

  // 2. Query and delete associated tasks containing the eventId
  const tasksCol = collection(db, 'tasks');
  const tasksSnapshot = await getDocs(tasksCol);
  
  tasksSnapshot.forEach((docSnap) => {
    if (docSnap.id.includes(eventId)) {
      batch.delete(docSnap.ref);
    }
  });

  await batch.commit();
}

/**
 * Seed cloud database with initial data in bulk if empty.
 */
export async function seedCloudDatabaseIfEmpty(defaultTasks, defaultEvents) {
  const db = getFirestoreDb();
  if (!db) return;

  try {
    const tasksSnapshot = await getDocs(query(collection(db, 'tasks'), limit(1)));
    const eventsSnapshot = await getDocs(query(collection(db, 'events'), limit(1)));

    const isTasksEmpty = tasksSnapshot.empty;
    const isEventsEmpty = eventsSnapshot.empty;

    if (isTasksEmpty || isEventsEmpty) {
      const batch = writeBatch(db);

      if (isTasksEmpty) {
        defaultTasks.forEach((task) => {
          const docRef = doc(db, 'tasks', task.id);
          batch.set(docRef, task);
        });
      }

      if (isEventsEmpty) {
        defaultEvents.forEach((event) => {
          const docRef = doc(db, 'events', event.id);
          batch.set(docRef, event);
        });
      }

      await batch.commit();
      console.log("Database seeded successfully with default data.");
    }
  } catch (e) {
    console.error("Error seeding database:", e);
  }
}

/**
 * Completely resets cloud database with default values (admin option).
 */
export async function resetCloudDatabase(defaultTasks, defaultEvents) {
  const db = getFirestoreDb();
  if (!db) return;

  const batch = writeBatch(db);

  // 1. Delete all tasks
  const tasksSnapshot = await getDocs(collection(db, 'tasks'));
  tasksSnapshot.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  // 2. Delete all events
  const eventsSnapshot = await getDocs(collection(db, 'events'));
  eventsSnapshot.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  // 3. Write defaults
  defaultTasks.forEach((task) => {
    const docRef = doc(db, 'tasks', task.id);
    batch.set(docRef, task);
  });

  defaultEvents.forEach((event) => {
    const docRef = doc(db, 'events', event.id);
    batch.set(docRef, event);
  });

  await batch.commit();
}
