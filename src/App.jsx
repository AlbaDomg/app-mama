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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Events state (manually registered concerts, loaded from localStorage or initialized with defaults)
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('mama_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sanitize: Keep only tasks that have valid id, title, and dueDate
          const sanitized = parsed.filter(t => t && typeof t === 'object' && t.id && t.title && t.dueDate);
          if (sanitized.length > 0) return sanitized;
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

  // Sync tasks to localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('mama_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error("Error writing tasks to localStorage", e);
    }
  }, [tasks]);

  // Sync events to localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('mama_events', JSON.stringify(events));
    } catch (e) {
      console.error("Error writing events to localStorage", e);
    }
  }, [events]);

  // Handle task validation confirmation
  const handleValidateConfirm = (taskId, deliveryInfo) => {
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
    setValidationTask(null);
  };

  // Add custom manual task from Admin Panel
  const handleAddTask = (newTaskData) => {
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
      deliveryInfo: null
    };

    setTasks(prev => [...prev, taskObj]);
  };

  // Manual Concert Registrar - Adds show and automatically generates marketing tasks!
  const handleRegisterEvent = (newEventData) => {
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
      deliveryInfo: null
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
      deliveryInfo: null
    };

    // Update state (both will automatically persist to localStorage in their effects)
    setEvents(prev => [...prev, eventObj]);
    setTasks(prev => [...prev, canvaTask, socialTask]);
  };

  // Delete Concert - Cascades down and deletes its dynamic tasks too!
  const handleDeleteEvent = (eventId, eventDate, artistName) => {
    // Delete event
    setEvents(prev => prev.filter(e => e.id !== eventId));
    // Delete tasks generated for this event
    setTasks(prev => prev.filter(t => {
      // Keep if it is NOT an auto task containing the deleted event ID
      return !t.id.includes(eventId);
    }));
  };

  // Reset local states and clean storage
  const handleResetTasks = () => {
    setTasks(DEFAULT_TASKS);
    setEvents(DEFAULT_EVENTS);
    try {
      localStorage.removeItem('mama_tasks');
      localStorage.removeItem('mama_events');
    } catch (e) {
      console.error("Error clearing localStorage", e);
    }
  };

  // Navigate to help tab and activate a specific tutorial
  const handleSelectTutorial = (tutorialId) => {
    setSelectedTutorialId(tutorialId);
    setActiveTab('help');
  };

  // Handle task edit (all fields)
  const handleEditTask = (taskId, updatedData) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          ...updatedData
        };
      }
      return task;
    }));
  };

  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Handle task reordering
  const handleReorderTasks = (newTasks) => {
    setTasks(newTasks);
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
