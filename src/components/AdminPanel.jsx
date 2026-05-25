import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, RefreshCw, PlusCircle, CheckCircle, ListTodo, Award } from 'lucide-react';

export default function AdminPanel({ 
  tasks, 
  onAddTask, 
  onResetTasks
}) {
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;
  const totalTasksCount = tasks.length;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasks.length / totalTasksCount) * 100) : 0;

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

  return (
    <div className="space-y-8 animate-slide-up">
      
      {/* Top Banner */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
        <ShieldCheck className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white font-sans m-0">Panel de Control Administrativo</h3>
      </div>

      {/* Progress & Reward Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Progress Ring Card (5 columns) */}
        <div className="md:col-span-5 glass-panel p-6 flex flex-col items-center justify-center text-center glow-brand/5">
          <h4 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-1.5 justify-center">
            <ListTodo className="w-5 h-5 text-purple-400" />
            Progreso del Período
          </h4>

          {/* SVG Progress Ring */}
          <div className="relative w-36 h-36 flex items-center justify-center mb-6">
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

          <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-slate-800/60 text-sm">
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="block text-xs font-semibold text-slate-400 mb-0.5">Total Tareas</span>
              <span className="text-lg font-bold text-white">{totalTasksCount}</span>
            </div>
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="block text-xs font-semibold text-slate-400 mb-0.5">Entregadas</span>
              <span className="text-lg font-bold text-emerald-400">{completedTasks.length}</span>
            </div>
          </div>
        </div>

        {/* Financial Reward Box (7 columns) */}
        <div className="md:col-span-7 flex flex-col justify-between">
          {progressPercent < 100 ? (
            <div className="glass-panel p-6 md:p-8 border-amber-500/30 bg-amber-500/5 glow-gold/5 flex-1 flex flex-col justify-between animate-scale-in">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 shadow-lg glow-gold/10">
                    <AlertTriangle className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-amber-300 m-0">Retribución Económica: EN ESPERA</h4>
                    <p className="text-xs text-amber-500/80 font-bold uppercase tracking-wider">Faltan {pendingTasksCount} tareas por entregar</p>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900/60 text-sm text-slate-300 leading-relaxed">
                  ⚠️ <span className="font-bold text-white">Recordatorio del Acuerdo:</span> La retribución económica mensual asignada de <span className="text-amber-400 font-extrabold text-base">400€</span> está directamente asociada a la correcta entrega y validación del 100% de las tareas de marketing digital en Canva y redes sociales. 
                  <br /><br />
                  Actualmente hay <span className="text-amber-400 font-bold">{pendingTasksCount} tareas pendientes</span> en tu tablero de control. ¡Completa las tareas del calendario para activar de forma automática la orden de pago!
                </div>
              </div>

              <div className="text-xs text-amber-500/60 mt-4 font-semibold italic">
                * El estado de retribución se actualizará a aprobado automáticamente al entregar la última tarea del mes.
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 md:p-8 border-emerald-500/30 bg-emerald-500/5 glow-green/5 flex-1 flex flex-col justify-between animate-scale-in">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg">
                    <Award className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-emerald-400 m-0">Retribución Económica: ¡APROBADA!</h4>
                    <p className="text-xs text-emerald-400/80 font-bold uppercase tracking-wider">100% de tareas completadas</p>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900/60 text-sm text-slate-350 leading-relaxed">
                  🎉 <span className="font-bold text-white">¡Enhorabuena, objetivo cumplido!</span> Has entregado todos los carteles en Canva y publicado en redes sociales de manera excelente de acuerdo al calendario.
                  <br /><br />
                  La retribución económica mensual de <span className="text-emerald-400 font-extrabold text-base">400€</span> ha sido <span className="text-emerald-400 font-bold">DESBLOQUEADA y APROBADA</span> de forma automática para su procesamiento bancario. ¡Excelente trabajo y dedicación!
                </div>
              </div>

              <div className="text-xs text-emerald-400/60 mt-4 font-semibold italic">
                * Todas las evidencias de entregas han sido registradas y almacenadas de forma correcta.
              </div>
            </div>
          )}
        </div>
      </div>

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
