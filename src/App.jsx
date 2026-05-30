import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ConcertRegistrar from './components/ConcertRegistrar';
import ConcertFeed from './components/ConcertFeed';
import TaskList from './components/TaskList';
import TutorialCenter from './components/TutorialCenter';
import AdminPanel from './components/AdminPanel';
import TaskValidationModal from './components/TaskValidationModal';

// Seed data and utilities
import { DEFAULT_TASKS, TUTORIALS } from './data/defaultData';
import { DEFAULT_EVENTS } from './utils/googleCalendar';

// Firebase cloud sync helpers
import { 
  getFirestoreDb, 
  subscribeToTasks, 
  subscribeToEvents, 
  saveTaskToCloud, 
  updateTaskInCloud, 
  deleteTaskFromCloud, 
  saveEventToCloud, 
  deleteEventFromCloud, 
  seedCloudDatabaseIfEmpty, 
  resetCloudDatabase,
  testConnection 
} from './utils/firebase';
import { doc, writeBatch } from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [dbRefreshTrigger, setDbRefreshTrigger] = useState(0);

  // Events state (manually registered concerts, loaded from localStorage or initialized with defaults)
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('mama_events');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Error parsing saved events", e);
    }
    return DEFAULT_EVENTS;
  });

  // Tasks state (loaded from localStorage or initialized with defaults)
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('mama_tasks');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Mantener todas las tareas válidas creadas por el usuario (sin requerir dueDate obligatorio)
          return parsed.filter(t => t && typeof t === 'object' && t.id && t.title);
        }
      }
    } catch (e) {
      console.error("Error parsing saved tasks", e);
    }
    return DEFAULT_TASKS;
  });

  // Active task to show in the validation modal
  const [validationTask, setValidationTask] = useState(null);

  // Active tutorial selection state
  const [selectedTutorialId, setSelectedTutorialId] = useState('');

  // Initialize and subscribe to database real-time sync when config changes
  useEffect(() => {
    let unsubTasks = null;
    let unsubEvents = null;
    let isActive = true;

    async function setupFirebase() {
      const db = getFirestoreDb();
      if (!db) {
        if (isActive) {
          setIsDbConnected(false);
        }
        return;
      }

      // Check if we can reach database
      const connected = await testConnection();
      if (!connected) {
        if (isActive) {
          setIsDbConnected(false);
        }
        return;
      }

      if (!isActive) return;

      setIsDbConnected(true);

      // Seed database with default values if completely empty
      await seedCloudDatabaseIfEmpty(DEFAULT_TASKS, DEFAULT_EVENTS);

      // Subscribe to real-time Tasks updates
      unsubTasks = subscribeToTasks(
        (updatedTasks) => {
          if (isActive) {
            setTasks(updatedTasks);
          }
        },
        (err) => {
          console.error("Error syncing tasks from Firestore:", err);
        }
      );

      // Subscribe to real-time Events updates
      unsubEvents = subscribeToEvents(
        (updatedEvents) => {
          if (isActive) {
            setEvents(updatedEvents);
          }
        },
        (err) => {
          console.error("Error syncing events from Firestore:", err);
        }
      );
    }

    setupFirebase();

    return () => {
      isActive = false;
      if (unsubTasks) unsubTasks();
      if (unsubEvents) unsubEvents();
    };
  }, [dbRefreshTrigger]);

  // Sync tasks to localStorage safely (only when NOT connected to DB, or as backup)
  useEffect(() => {
    if (!isDbConnected) {
      try {
        localStorage.setItem('mama_tasks', JSON.stringify(tasks));
      } catch (e) {
        console.error("Error writing tasks to localStorage", e);
      }
    }
  }, [tasks, isDbConnected]);

  // Sync events to localStorage safely (only when NOT connected to DB, or as backup)
  useEffect(() => {
    if (!isDbConnected) {
      try {
        localStorage.setItem('mama_events', JSON.stringify(events));
      } catch (e) {
        console.error("Error writing events to localStorage", e);
      }
    }
  }, [events, isDbConnected]);

  // Handle task validation confirmation
  const handleValidateConfirm = async (taskId, deliveryInfo) => {
    if (isDbConnected) {
      try {
        await updateTaskInCloud(taskId, {
          status: 'completed',
          deliveryInfo: deliveryInfo
        });
      } catch (e) {
        console.error("Error updating completed task in Firestore:", e);
      }
    } else {
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            status: 'completed',
            deliveryInfo: deliveryInfo
          };
        }
        return task;
      });
      setTasks(updatedTasks);
    }
    setValidationTask(null);
  };

  // Add custom manual task from Admin Panel
  const handleAddTask = async (newTaskData) => {
    let tutorialId = 'tut-canva-poster';
    if (newTaskData.category.includes('Redes') || newTaskData.category.includes('Instagram')) {
      tutorialId = 'tut-instagram-post';
    }

    const taskObj = {
      id: `task-manual-${Date.now()}`,
      title: newTaskData.title,
      category: newTaskData.category,
      description: newTaskData.description,
      dueDate: newTaskData.dueDate,
      status: 'pending',
      points: 10,
      tutorialId: tutorialId,
      canvaTemplateUrl: 'https://www.canva.com/templates/',
      deliveryInfo: null,
      orderIndex: tasks.length
    };

    if (isDbConnected) {
      try {
        await saveTaskToCloud(taskObj);
      } catch (e) {
        console.error("Error adding task to Firestore:", e);
      }
    } else {
      setTasks(prev => [...prev, taskObj]);
    }
  };

  // Manual Concert Registrar - Adds show and automatically generates marketing tasks!
  const handleRegisterEvent = async (newEventData) => {
    const eventId = `event-manual-${Date.now()}`;
    const eventObj = {
      id: eventId,
      title: newEventData.title,
      artist: newEventData.artist,
      weekday: newEventData.weekday,
      date: newEventData.date,
      time: newEventData.time,
      type: newEventData.type,
      description: newEventData.description,
      isGoogleEvent: false
    };

    // Auto-create associated Canva task
    const canvaTask = {
      id: `task-auto-${eventId}-canva`,
      title: `Crear cartel para: ${newEventData.artist}`,
      category: 'Diseño en Canva',
      description: `Diseñar en Canva el cartel promocional para el concierto de "${newEventData.title}" del ${newEventData.date.split('-').reverse().join('/')}. Usa la plantilla base.`,
      dueDate: newEventData.date,
      status: 'pending',
      points: 15,
      tutorialId: 'tut-canva-poster',
      canvaTemplateUrl: 'https://www.canva.com/templates/',
      deliveryInfo: null,
      orderIndex: tasks.length
    };

    // Auto-create associated Instagram post task
    const socialTask = {
      id: `task-auto-${eventId}-instagram`,
      title: `Publicar cartel de ${newEventData.artist} en Instagram`,
      category: 'Redes Sociales',
      description: `Subir el cartel promocional del concierto de "${newEventData.title}" a las historias y feed de Instagram con hashtags del local. Copia el link del post al terminar.`,
      dueDate: newEventData.date,
      status: 'pending',
      points: 10,
      tutorialId: 'tut-instagram-post',
      deliveryInfo: null,
      orderIndex: tasks.length + 1
    };

    // Auto-create associated Facebook post task
    const facebookTask = {
      id: `task-auto-${eventId}-facebook`,
      title: `Publicar cartel de ${newEventData.artist} en Facebook`,
      category: 'Redes Sociales',
      description: `Subir la imagen del cartel del concierto de "${newEventData.title}" en la página oficial de Facebook con una invitación para reservar. Copia el link del post al terminar.`,
      dueDate: newEventData.date,
      status: 'pending',
      points: 10,
      tutorialId: 'tut-facebook-post',
      deliveryInfo: null,
      orderIndex: tasks.length + 2
    };

    // Auto-create associated TikTok post task
    const tiktokTask = {
      id: `task-auto-${eventId}-tiktok`,
      title: `Publicar vídeo/historia de ${newEventData.artist} en TikTok`,
      category: 'Redes Sociales',
      description: `Crear un TikTok corto o subir el cartel animado con la música del artista de "${newEventData.title}" usando hashtags del local. Copia el link del vídeo al terminar.`,
      dueDate: newEventData.date,
      status: 'pending',
      points: 15,
      tutorialId: 'tut-instagram-story',
      deliveryInfo: null,
      orderIndex: tasks.length + 3
    };

    if (isDbConnected) {
      try {
        await saveEventToCloud(eventObj);
        await saveTaskToCloud(canvaTask);
        await saveTaskToCloud(socialTask);
        await saveTaskToCloud(facebookTask);
        await saveTaskToCloud(tiktokTask);
      } catch (e) {
        console.error("Error saving registered event to Firestore:", e);
      }
    } else {
      setEvents(prev => [...prev, eventObj]);
      setTasks(prev => [...prev, canvaTask, socialTask, facebookTask, tiktokTask]);
    }
  };

  // Delete Concert - Cascades down and deletes its dynamic tasks too!
  const handleDeleteEvent = async (eventId, eventDate, artistName) => {
    if (isDbConnected) {
      try {
        await deleteEventFromCloud(eventId);
      } catch (e) {
        console.error("Error deleting event from Firestore:", e);
      }
    } else {
      // Delete event
      setEvents(prev => prev.filter(e => e.id !== eventId));
      // Delete tasks generated for this event
      setTasks(prev => prev.filter(t => {
        // Keep if it is NOT an auto task containing the deleted event ID
        return !t.id.includes(eventId);
      }));
    }
  };

  // Reset local states and clean storage
  const handleResetTasks = async () => {
    if (isDbConnected) {
      try {
        await resetCloudDatabase(DEFAULT_TASKS, DEFAULT_EVENTS);
      } catch (e) {
        console.error("Error resetting Firestore database:", e);
      }
    } else {
      setTasks(DEFAULT_TASKS);
      setEvents(DEFAULT_EVENTS);
      try {
        localStorage.removeItem('mama_tasks');
        localStorage.removeItem('mama_events');
      } catch (e) {
        console.error("Error clearing localStorage", e);
      }
    }
  };

  // Navigate to help tab and activate a specific tutorial
  const handleSelectTutorial = (tutorialId) => {
    setSelectedTutorialId(tutorialId);
    setActiveTab('help');
  };

  // Handle task edit (all fields)
  const handleEditTask = async (taskId, updatedData) => {
    if (isDbConnected) {
      try {
        await updateTaskInCloud(taskId, updatedData);
      } catch (e) {
        console.error("Error editing task in Firestore:", e);
      }
    } else {
      setTasks(prev => prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            ...updatedData
          };
        }
        return task;
      }));
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (isDbConnected) {
      try {
        await deleteTaskFromCloud(taskId);
      } catch (e) {
        console.error("Error deleting task from Firestore:", e);
      }
    } else {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  // Handle task reordering
  const handleReorderTasks = async (newTasks) => {
    // Optimistic UI update
    setTasks(newTasks);
    if (isDbConnected) {
      const db = getFirestoreDb();
      if (db) {
        try {
          const batch = writeBatch(db);
          newTasks.forEach((task, index) => {
            const docRef = doc(db, 'tasks', task.id);
            batch.update(docRef, { orderIndex: index });
          });
          await batch.commit();
        } catch (e) {
          console.error("Error saving task order to Firestore:", e);
        }
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 min-h-screen flex flex-col justify-between">
      
      {/* App Content */}
      <div className="flex-1">
        {/* Main Application Header */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} tasks={tasks} />

        {/* Tab Content Renderer */}
        <main className="pb-12">
          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-slide-up">
              {/* Concert Management Section (Form + Feed in a two-column grid) */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <span className="w-1.5 h-6 bg-purple-600 rounded-full animate-pulse"></span>
                  <h2 className="text-xl font-bold tracking-tight text-white font-sans m-0">
                    Programador de Conciertos
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {/* Left Column: Form registrar */}
                  <ConcertRegistrar onAddEvent={handleRegisterEvent} />
                  
                  {/* Right Column: Visual Feed list */}
                  <ConcertFeed 
                    events={events} 
                    tasks={tasks} 
                    onDeleteEvent={handleDeleteEvent} 
                  />
                </div>
              </section>

              {/* Task Checklist Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                  <h2 className="text-xl font-bold tracking-tight text-white font-sans m-0">
                    Tareas Pendientes de Marketing
                  </h2>
                </div>
                <TaskList 
                  tasks={tasks} 
                  onValidateTask={(task) => setValidationTask(task)} 
                  onSelectTutorial={handleSelectTutorial}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onReorderTasks={handleReorderTasks}
                />
              </section>
            </div>
          )}

          {activeTab === 'help' && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                <h2 className="text-xl font-bold tracking-tight text-white font-sans m-0">
                  Biblioteca de Tutoriales
                </h2>
              </div>
              <TutorialCenter 
                tutorials={TUTORIALS} 
                selectedTutorialId={selectedTutorialId} 
                setSelectedTutorialId={setSelectedTutorialId}
              />
            </section>
          )}

          {activeTab === 'admin' && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                <h2 className="text-xl font-bold tracking-tight text-white font-sans m-0">
                  Panel de Administrador
                </h2>
              </div>
              <AdminPanel 
                tasks={tasks} 
                onAddTask={handleAddTask} 
                onResetTasks={handleResetTasks}
                onFirebaseConfigChange={() => setDbRefreshTrigger(prev => prev + 1)}
                isDbConnected={isDbConnected}
              />
            </section>
          )}
        </main>
      </div>

      {/* Persistent Footer */}
      <footer className="mt-auto border-t border-slate-900 pt-6 text-center text-xs text-slate-500 font-medium">
        <p>App-Mama © 2026. Diseñado con ❤️ para hacer el marketing digital simple y accesible.</p>
      </footer>

      {/* Task Delivery Modal Overlay */}
      {validationTask && (
        <TaskValidationModal 
          task={validationTask} 
          onClose={() => setValidationTask(null)} 
          onConfirm={handleValidateConfirm} 
        />
      )}
    </div>
  );
}
