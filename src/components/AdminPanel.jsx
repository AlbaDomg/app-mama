import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  PlusCircle, 
  CheckCircle, 
  ListTodo, 
  Award, 
  Cloud, 
  CloudOff, 
  Database, 
  Copy, 
  Check, 
  Info 
} from 'lucide-react';
import { 
  getFirebaseConfig, 
  saveFirebaseConfig, 
  clearFirebaseConfig, 
  testConnection 
} from '../utils/firebase';

export default function AdminPanel({ 
  tasks, 
  onAddTask, 
  onResetTasks,
  onFirebaseConfigChange,
  isDbConnected
}) {
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;
  const totalTasksCount = tasks.length;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasks.length / totalTasksCount) * 100) : 0;

  // Firebase Config State
  const [configText, setConfigText] = useState(() => {
    const cfg = getFirebaseConfig();
    return cfg ? JSON.stringify(cfg, null, 2) : '';
  });
  const [dbStatus, setDbStatus] = useState(isDbConnected ? 'connected' : 'disconnected');
  const [dbError, setDbError] = useState('');
  const [dbSuccess, setDbSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isEditingConfig, setIsEditingConfig] = useState(!isDbConnected);

  const [clickCount, setClickCount] = useState(0);
  const [showCloudSettings, setShowCloudSettings] = useState(false);

  const handleTitleClick = () => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setShowCloudSettings(curr => !curr);
        return 0;
      }
      return next;
    });
  };

  useEffect(() => {
    setDbStatus(isDbConnected ? 'connected' : 'disconnected');
    if (isDbConnected) {
      setIsEditingConfig(false);
    }
  }, [isDbConnected]);

  // Form State for Adding Custom Task (Manual Extra)
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Diseño en Canva');
  const [taskDueDate, setTaskDueDate] = useState('2026-05-29');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskSuccessMsg, setTaskSuccessMsg] = useState('');

  const handleAddTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDesc.trim()) {
      alert('Por favor, rellena el título y la descripción de la tarea.');
      return;
    }

    onAddTask({
      title: taskTitle.trim(),
      category: taskCategory,
      dueDate: taskDueDate,
      description: taskDesc.trim(),
    });

    setTaskTitle('');
    setTaskDesc('');
    setTaskSuccessMsg('¡Nueva tarea añadida correctamente!');
    setTimeout(() => setTaskSuccessMsg(''), 4000);
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setDbStatus('testing');
    setDbError('');
    setDbSuccess('');

    if (!configText.trim()) {
      // Clear configuration
      clearFirebaseConfig();
      onFirebaseConfigChange();
      setDbStatus('disconnected');
      setDbSuccess('Configuración de base de datos eliminada. La app ahora está en Modo Local.');
      return;
    }

    try {
      // Validate and save
      saveFirebaseConfig(configText);
      
      // Notify parent to reinitialize
      onFirebaseConfigChange();
      
      // Give a tiny moment for firebase to initialize before testing
      setTimeout(async () => {
        const isOk = await testConnection();
        if (isOk) {
          setDbStatus('connected');
          setDbSuccess('¡Conectado exitosamente a la base de datos en la nube! Los datos se sincronizan en tiempo real.');
        } else {
          setDbStatus('error');
          setDbError('No se pudo conectar a la base de datos de Firebase. Revisa que el JSON sea correcto y que las reglas de Firestore estén configuradas en modo público.');
        }
      }, 500);

    } catch (err) {
      setDbStatus('error');
      setDbError(err.message || 'Error al procesar la configuración. Asegúrate de pegar el objeto de configuración JSON completo.');
    }
  };

  const handleCopyConfig = () => {
    if (!configText.trim()) return;
    navigator.clipboard.writeText(configText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      
      {/* Top Banner (Click 5 times secretly to show cloud settings) */}
      <div 
        onClick={handleTitleClick}
        className="flex items-center gap-2 pb-4 border-b border-slate-800 cursor-pointer select-none active:opacity-80 transition-opacity"
        title="Panel de Control Administrativo"
      >
        <ShieldCheck className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white font-sans m-0">Panel de Control Administrativo</h3>
      </div>

      {/* Progress Card Section */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Progress Ring Card (Full width premium layout) */}
        <div className="glass-panel p-6 md:p-8 flex flex-col md:flex-row items-center justify-around gap-6 md:gap-12 glow-brand/5">
          <div className="flex flex-col items-center text-center">
            <h4 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-1.5 justify-center">
              <ListTodo className="w-5 h-5 text-purple-400" />
              Progreso del Período
            </h4>

            {/* SVG Progress Ring */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  strokeWidth="10"
                  stroke="#1e293b"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  strokeWidth="10"
                  stroke="url(#progressGradientAdmin)"
                  strokeDasharray={402}
                  strokeDashoffset={402 - (402 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradientAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white tracking-tight">{progressPercent}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Completado</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center w-full md:w-80 space-y-4 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-slate-800/60 md:pl-12 text-sm">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center md:text-left">Métricas de Rendimiento</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-900 text-center">
                <span className="block text-xs font-semibold text-slate-400 mb-0.5">Total Tareas</span>
                <span className="text-lg font-bold text-white">{totalTasksCount}</span>
              </div>
              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-900 text-center">
                <span className="block text-xs font-semibold text-slate-400 mb-0.5">Entregadas</span>
                <span className="text-lg font-bold text-emerald-400">{completedTasks.length}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 text-center md:text-left leading-relaxed">
              El cumplimiento de todas las tareas optimiza el impacto del canal de marketing digital de forma automática.
            </p>
          </div>
        </div>
      </div>

      {/* Cloud Database Integration Section (Hidden by default, click the panel title 5 times to reveal) */}
      {showCloudSettings && (
        <div className="glass-panel p-6 md:p-8 glow-brand/5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-950/40 rounded-xl border border-purple-900/40">
                <Database className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white m-0">Sincronización en la Nube (Compartir App)</h4>
                <p className="text-xs text-slate-400 mt-0.5">Comparte la misma información en tiempo real con otros dispositivos</p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center">
              {dbStatus === 'connected' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <Cloud className="w-3.5 h-3.5 animate-pulse" />
                  Modo Nube Activo ✅
                </span>
              )}
              {dbStatus === 'testing' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-bold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Comprobando conexión...
                </span>
              )}
              {dbStatus === 'error' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full text-xs font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Error de conexión ⚠️
                </span>
              )}
              {dbStatus === 'disconnected' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 text-slate-400 rounded-full text-xs font-bold">
                  <CloudOff className="w-3.5 h-3.5" />
                  Modo Local (Sin compartir) 🔴
                </span>
              )}
            </div>
          </div>

          {dbSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-4 rounded-xl font-medium flex items-start gap-2.5 animate-slide-up">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-300">¡Configuración Guardada!</p>
                <p className="text-xs text-emerald-400/90 mt-1 leading-relaxed">{dbSuccess}</p>
              </div>
            </div>
          )}

          {dbError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-xl font-medium flex items-start gap-2.5 animate-slide-up">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-300">Error de conexión</p>
                <p className="text-xs text-red-400/90 mt-1 leading-relaxed">{dbError}</p>
              </div>
            </div>
          )}

          {/* Clean Connected View: Hides credentials and form from casual users */}
          {dbStatus === 'connected' && !isEditingConfig && (
            <div className="bg-slate-950/40 rounded-2xl border border-slate-900/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-in">
              <div className="space-y-1 text-left">
                <p className="text-sm font-bold text-white flex items-center gap-1.5 justify-start">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Conectado a la Base de Datos en la Nube
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tus tareas, conciertos y progresos se comparten en tiempo real entre todos los dispositivos del local. Las credenciales están protegidas y ocultas.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyConfig}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? '¡Copiado!' : 'Copiar Configuración'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingConfig(true)}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-purple-950/40 hover:bg-purple-900/30 border border-purple-900/40 text-purple-300 rounded-xl text-xs font-bold hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Cambiar Configuración
                </button>
              </div>
            </div>
          )}

          {/* Dynamic setup and input box - only displayed when disconnected or editing */}
          {isEditingConfig && (
            <div className="space-y-6 animate-slide-up">
              {/* Step-by-Step Guide Accordion */}
              <div className="bg-slate-950/40 rounded-xl border border-slate-900 p-4">
                <button 
                  type="button"
                  onClick={() => setShowGuide(!showGuide)}
                  className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-300 hover:text-white cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-purple-400" />
                    ¿Cómo crear una base de datos en 2 minutos gratis?
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 rounded text-slate-400">
                    {showGuide ? 'Ocultar Guía' : 'Mostrar Guía'}
                  </span>
                </button>

                {showGuide && (
                  <div className="mt-4 pt-4 border-t border-slate-900/60 text-xs text-slate-400 space-y-3 leading-relaxed">
                    <p className="text-slate-300 font-medium">Sigue estos pasos sencillos para tener tu base de datos compartida gratis:</p>
                    <ol className="list-decimal list-inside space-y-2.5 pl-1">
                      <li>Ve a <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline font-semibold">console.firebase.google.com</a> e inicia sesión con tu cuenta de Google.</li>
                      <li>Haz clic en <strong>"Crear un proyecto"</strong> y ponle un nombre (ej: <code>app-mama-local</code>). Desactiva Google Analytics si quieres ir más rápido.</li>
                      <li>Una vez creado el proyecto, haz clic en el botón de la web <strong><code>&lt;/&gt;</code></strong> (icono de código) para añadir una aplicación Web. Ponle un apodo y regístrala.</li>
                      <li>Firebase te mostrará un código con un objeto llamado <code>firebaseConfig</code>. Copia todo lo que hay dentro de las llaves <code>{"{"} ... {"}"}</code> (incluyendo las llaves).</li>
                      <li>Ve al menú lateral izquierdo en Firebase, haz clic en <strong>Firestore Database</strong> (Base de datos Firestore) y luego en <strong>"Crear base de datos"</strong>.</li>
                      <li>Selecciona la ubicación que prefieras, y al configurar las reglas elige <strong>"Iniciar en modo de prueba"</strong> (esto permite leer y escribir libremente). Haz clic en <strong>Crear</strong>.</li>
                      <li>¡Listo! Pega el código copiado en el cuadro de abajo, haz clic en <strong>"Guardar y Conectar"</strong> y envíaselo a las personas con las que quieras compartir la app.</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Form to Input Firebase Configuration */}
              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">Objeto de Configuración de Firebase (JSON)</label>
                    {configText && (
                      <button
                        type="button"
                        onClick={handleCopyConfig}
                        className="flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
                        title="Copia esta configuración para compartirla con tu equipo"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar Configuración para Compartir</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <textarea
                    rows={6}
                    value={configText}
                    onChange={(e) => setConfigText(e.target.value)}
                    placeholder={`{
  "apiKey": "AIzaSy...",
  "authDomain": "app-mama.firebaseapp.com",
  "projectId": "app-mama",
  "storageBucket": "app-mama.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456:web:abcd..."
}`}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-300 px-3.5 py-3 rounded-xl outline-none font-mono text-[11px] leading-relaxed transition-all focus:shadow-[0_0_15px_rgba(168,85,247,0.05)]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={dbStatus === 'testing'}
                    className="btn-primary flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${dbStatus === 'testing' ? 'animate-spin' : ''}`} />
                    {configText.trim() ? 'Guardar y Conectar Base de Datos' : 'Usar Modo Local'}
                  </button>
                  
                  {configText.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('¿Seguro que quieres borrar la configuración y volver al Modo Local? Tu base de datos en la nube seguirá existiendo, pero este dispositivo ya no se sincronizará.')) {
                          setConfigText('');
                          clearFirebaseConfig();
                          onFirebaseConfigChange();
                          setDbStatus('disconnected');
                          setDbSuccess('Configuración eliminada. Has vuelto al Modo Local.');
                        }
                      }}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-300 rounded-xl text-sm font-semibold hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Volver a Modo Local
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      )}


      {/* Admin Utilities Form and Reset Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Add Custom Task Form (8 columns) */}
        <div className="lg:col-span-8 glass-panel p-6 glow-brand/5">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-purple-400" />
            Asignar Tarea Manual Extra
          </h4>

          {taskSuccessMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-3 rounded-xl mb-4 font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{taskSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleAddTaskSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Título de la Tarea</label>
                <input
                  type="text"
                  placeholder="Ej: Diseñar flyer del concierto acústico"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-200 px-3.5 py-2.5 rounded-xl outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Categoría</label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-200 px-3.5 py-2.5 rounded-xl outline-none transition-all text-sm cursor-pointer"
                >
                  <option value="Diseño en Canva">🎨 Diseño en Canva</option>
                  <option value="Redes Sociales">📱 Redes Sociales</option>
                  <option value="Formación / Ayuda">📖 Formación / Ayuda</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Fecha de Entrega Límite</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-200 px-3.5 py-2.5 rounded-xl outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Descripción detallada</label>
                <input
                  type="text"
                  placeholder="Ej: Cambiar textos en plantilla..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-200 px-3.5 py-2.5 rounded-xl outline-none transition-all text-sm"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-2.5 text-sm mt-2">
              Añadir Tarea Extra
            </button>
          </form>
        </div>

        {/* Reset Actions (4 columns) */}
        <div className="lg:col-span-4 glass-panel p-6 flex flex-col justify-between border-red-500/20 bg-red-950/5">
          <div>
            <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-red-400" />
              Herramientas de Test
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Restablece todas las tareas y eventos locales en caché de `localStorage` para poder volver a testear la demo con sus datos de ejemplo.
            </p>
          </div>

          <button
            onClick={() => {
              if (window.confirm('¿Seguro que quieres reiniciar todas las tareas y eventos? Se borrarán tus entregas y configuraciones.')) {
                onResetTasks();
                alert('¡Dashboard reiniciado!');
              }
            }}
            className="w-full px-4 py-2.5 bg-red-950/40 hover:bg-red-900/30 text-red-300 border border-red-900/40 hover:border-red-700/60 font-semibold rounded-xl text-xs sm:text-sm hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            Reiniciar Todo el Tablero
          </button>
        </div>
      </div>
    </div>
  );
}
