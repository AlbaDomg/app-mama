import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  setDoc,
  writeBatch
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD6oBDUInzADiy0mpHi-en5SdBLzeJOy90",
  authDomain: "app-mama-a44ef.firebaseapp.com",
  projectId: "app-mama-a44ef",
  storageBucket: "app-mama-a44ef.firebasestorage.app",
  messagingSenderId: "594642334331",
  appId: "1:594642334331:web:5245ee84fa785d9a0a28de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function resetAndCleanDatabase() {
  console.log("Starting cloud database cleanup...");
  
  const batch = writeBatch(db);
  
  // 1. Fetch and delete all tasks
  const tasksCol = collection(db, 'tasks');
  const tasksSnapshot = await getDocs(tasksCol);
  tasksSnapshot.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });
  console.log(`Queued deletion for ${tasksSnapshot.size} old tasks.`);

  // 2. Fetch and delete all events
  const eventsCol = collection(db, 'events');
  const eventsSnapshot = await getDocs(eventsCol);
  eventsSnapshot.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });
  console.log(`Queued deletion for ${eventsSnapshot.size} old events.`);

  await batch.commit();
  console.log("Cleanup completed. Now seeding database with clean defaults...");

  // 3. Create Rubenline Event
  const eventId = `event-manual-rubenline`;
  const eventObj = {
    id: eventId,
    title: 'Espectáculo Flamenco: Rubenline',
    artist: 'Rubenline',
    weekday: 'Domingo',
    date: '2026-05-31',
    time: '20:30',
    type: 'Concierto en Vivo',
    description: 'Noche especial de flamenco en directo de la mano del gran guitarrista Rubenline.',
    isGoogleEvent: false
  };

  // 4. Create the 4 complementary tasks for Rubenline
  const canvaTask = {
    id: `task-auto-${eventId}-canva`,
    title: `Crear cartel para: Rubenline`,
    category: 'Diseño en Canva',
    description: 'Diseñar en Canva el cartel promocional para el concierto de "Espectáculo Flamenco: Rubenline" del 31/05/2026. Usa la plantilla base.',
    dueDate: '2026-05-31',
    status: 'pending',
    points: 15,
    tutorialId: 'tut-canva-poster',
    canvaTemplateUrl: 'https://www.canva.com/templates/',
    deliveryInfo: null,
    orderIndex: 0
  };

  const instagramTask = {
    id: `task-auto-${eventId}-instagram`,
    title: `Publicar cartel de Rubenline en Instagram`,
    category: 'Redes Sociales',
    description: 'Subir el cartel promocional del concierto de "Espectáculo Flamenco: Rubenline" a las historias y feed de Instagram con hashtags del local. Copia el link del post al terminar.',
    dueDate: '2026-05-31',
    status: 'pending',
    points: 10,
    tutorialId: 'tut-instagram-post',
    deliveryInfo: null,
    orderIndex: 1
  };

  const facebookTask = {
    id: `task-auto-${eventId}-facebook`,
    title: `Publicar cartel de Rubenline en Facebook`,
    category: 'Redes Sociales',
    description: 'Subir la imagen del cartel del concierto de "Espectáculo Flamenco: Rubenline" en la página oficial de Facebook con una invitación para reservar. Copia el link del post al terminar.',
    dueDate: '2026-05-31',
    status: 'pending',
    points: 10,
    tutorialId: 'tut-facebook-post',
    deliveryInfo: null,
    orderIndex: 2
  };

  const tiktokTask = {
    id: `task-auto-${eventId}-tiktok`,
    title: `Publicar vídeo/historia de Rubenline en TikTok`,
    category: 'Redes Sociales',
    description: 'Crear un TikTok corto o subir el cartel animado con la música del artista de "Espectáculo Flamenco: Rubenline" usando hashtags del local. Copia el link del vídeo al terminar.',
    dueDate: '2026-05-31',
    status: 'pending',
    points: 15,
    tutorialId: 'tut-instagram-story',
    deliveryInfo: null,
    orderIndex: 3
  };

  // 5. Add default week program history task
  const weeklyHistoryTask = {
    id: 'task-weekly-story',
    title: 'Subir Historia de "Programación de la Semana"',
    category: 'Redes Sociales',
    description: 'Subir una historia atractiva a Instagram mostrando los eventos del viernes y sábado.',
    dueDate: '2026-05-27',
    status: 'pending',
    points: 10,
    tutorialId: 'tut-instagram-story',
    deliveryInfo: null,
    orderIndex: 4
  };

  const finalBatch = writeBatch(db);
  
  // Write the clean event
  finalBatch.set(doc(db, 'events', eventId), eventObj);
  
  // Write the clean tasks
  finalBatch.set(doc(db, 'tasks', canvaTask.id), canvaTask);
  finalBatch.set(doc(db, 'tasks', instagramTask.id), instagramTask);
  finalBatch.set(doc(db, 'tasks', facebookTask.id), facebookTask);
  finalBatch.set(doc(db, 'tasks', tiktokTask.id), tiktokTask);
  finalBatch.set(doc(db, 'tasks', weeklyHistoryTask.id), weeklyHistoryTask);

  await finalBatch.commit();
  
  console.log("Database reset and seeded successfully!");
  console.log("Now your screen will show only the Rubenline event with all 4 clean tasks!");
}

resetAndCleanDatabase().catch(err => {
  console.error("Failed to reset database", err);
});
