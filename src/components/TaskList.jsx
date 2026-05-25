import React, { useState } from 'react';
import { CheckSquare, AlertCircle, Calendar, ArrowRight, HelpCircle, ExternalLink, Image, Edit2, Check, X, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

export default function TaskList({ tasks, onValidateTask, onSelectTutorial, onEditTaskTitle, onDeleteTask, onReorderTasks }) {
  const [filter, setFilter] = useState('pending'); // default to pending for focused work
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [dragOverTaskId, setDragOverTaskId] = useState(null);

  const startEditing = (id, title) => {
    setEditingTaskId(id);
    setEditingTaskTitle(title);
  };

  const handleSaveEdit = (id) => {
    if (!editingTaskTitle.trim()) {
      alert('El nombre de la tarea no puede estar vacío.');
      return;
    }
    if (onEditTaskTitle) {
      onEditTaskTitle(id, editingTaskTitle.trim());
    }
    setEditingTaskId(null);
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDragOverTaskId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e, taskId) => {
    e.preventDefault();
    setDragOverTaskId(taskId);
  };

  const handleDragLeave = () => {
    // Left intentionally empty
  };

  const handleDrop = (e, targetTaskId) => {
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData('text/plain');
    if (draggedTaskId && draggedTaskId !== targetTaskId) {
      const draggedIndex = tasks.findIndex(t => t.id === draggedTaskId);
      const targetIndex = tasks.findIndex(t => t.id === targetTaskId);
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const updatedTasks = [...tasks];
        const [draggedItem] = updatedTasks.splice(draggedIndex, 1);
        updatedTasks.splice(targetIndex, 0, draggedItem);
        if (onReorderTasks) {
          onReorderTasks(updatedTasks);
        }
      }
    }
    setDragOverTaskId(null);
  };

  // Move task using Up/Down buttons (filter-aware)
  const handleMoveTask = (taskId, direction) => {
    const filteredIndex = filteredTasks.findIndex(t => t.id === taskId);
    if (filteredIndex === -1) return;
    const targetFilteredIndex = direction === 'up' ? filteredIndex - 1 : filteredIndex + 1;
    if (targetFilteredIndex < 0 || targetFilteredIndex >= filteredTasks.length) return;

    const targetTaskId = filteredTasks[targetFilteredIndex].id;
    
    const masterIndex = tasks.findIndex(t => t.id === taskId);
    const masterTargetIndex = tasks.findIndex(t => t.id === targetTaskId);
    if (masterIndex === -1 || masterTargetIndex === -1) return;

    const updatedTasks = [...tasks];
    const [draggedItem] = updatedTasks.splice(masterIndex, 1);
    updatedTasks.splice(masterTargetIndex, 0, draggedItem);
    if (onReorderTasks) {
      onReorderTasks(updatedTasks);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Filtering Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-bold text-white font-sans m-0">Lista de Tareas</h3>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/60">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              filter === 'pending'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pendientes ({tasks.filter(t => t.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              filter === 'completed'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Entregadas ({tasks.filter(t => t.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              filter === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas
          </button>
        </div>
      </div>

      {/* Task List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => {
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                draggable={editingTaskId !== task.id}
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, task.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, task.id)}
                className={`glass-panel p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                  dragOverTaskId === task.id
                    ? 'border-purple-500 bg-purple-950/20 scale-[1.01] glow-brand/10 z-10'
                    : isCompleted 
                      ? 'border-emerald-500/30 bg-emerald-950/5 hover:border-emerald-500/50' 
                      : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80 hover:bg-slate-900/60 glow-brand/5'
                }`}
              >
                {/* Visual Accent Bar */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${
                  isCompleted ? 'bg-emerald-500' : 'bg-purple-600'
                }`}></div>

                {/* Card Top */}
                <div className="pl-2.5">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      {/* Grip Drag Cue Handle */}
                      <div
                        className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-purple-400 p-0.5 rounded transition-colors shrink-0"
                        title="Arrastrar tarjeta para reordenar"
                      >
                        <GripVertical className="w-3.5 h-3.5" />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        (task.category || '').includes('Canva')
                          ? 'bg-purple-950/60 text-purple-300 border-purple-800/40'
                          : 'bg-indigo-950/60 text-indigo-300 border-indigo-800/40'
                      }`}>
                        {task.category || 'Tarea'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      Límite: {task.dueDate && typeof task.dueDate === 'string' && task.dueDate.includes('-') ? task.dueDate.split('-').reverse().join('/') : 'Sin fecha'}
                    </span>
                  </div>

                  {editingTaskId === task.id ? (
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="text"
                        value={editingTaskTitle}
                        onChange={(e) => setEditingTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(task.id);
                          if (e.key === 'Escape') setEditingTaskId(null);
                        }}
                        className="flex-1 bg-slate-950/80 border border-purple-500 text-white rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-sans"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(task.id)}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Guardar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingTaskId(null)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Cancelar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2 mb-2 group/title">
                      <h4 className="text-lg font-bold text-white leading-snug m-0">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-0.5 shrink-0 bg-slate-950/40 p-0.5 rounded-lg border border-slate-800/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleMoveTask(task.id, 'up')}
                          className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
                          title="Subir tarea"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveTask(task.id, 'down')}
                          className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
                          title="Bajar tarea"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-px h-3.5 bg-slate-800 mx-0.5"></div>
                        <button
                          onClick={() => startEditing(task.id, task.title)}
                          className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Editar nombre de la tarea"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`)) {
                              if (onDeleteTask) onDeleteTask(task.id);
                            }
                          }}
                          className="p-1 hover:bg-rose-950/55 rounded-md text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Eliminar tarea"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {task.description}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pl-2.5 pt-4 border-t border-slate-800/60 flex flex-col gap-3 mt-auto">
                  {isCompleted ? (
                    <div className="space-y-3">
                      {/* Completion status summary */}
                      <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-sm font-semibold">
                        <CheckSquare className="w-5 h-5" />
                        <span>¡Tarea completada con éxito!</span>
                      </div>

                      {/* Display delivery evidence if exists */}
                      {task.deliveryInfo && (
                        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 text-xs text-slate-300 space-y-2">
                          {task.deliveryInfo.url && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-medium">Enlace:</span>
                              <a 
                                href={task.deliveryInfo.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1 font-bold"
                              >
                                Abrir Enlace <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                          {task.deliveryInfo.image && (
                            <div className="space-y-1">
                              <span className="text-slate-400 font-medium flex items-center gap-1">
                                <Image className="w-3 h-3 text-purple-400" /> Captura entregada:
                              </span>
                              <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                                <img 
                                  src={task.deliveryInfo.image} 
                                  alt="Captura de entrega" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                          {task.deliveryInfo.completedAt && (
                            <div className="text-[10px] text-slate-500 text-right">
                              Entregado el {task.deliveryInfo.completedAt}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      {/* Help guide button */}
                      {task.tutorialId && (
                        <button
                          onClick={() => onSelectTutorial(task.tutorialId)}
                          className="btn-secondary text-xs sm:text-sm py-2.5 flex-1 shrink-0 cursor-pointer"
                        >
                          <HelpCircle className="w-4 h-4 text-purple-400" />
                          ¿Cómo se hace?
                        </button>
                      )}
                      
                      {/* Deliver work button */}
                      <button
                        onClick={() => onValidateTask(task)}
                        className="btn-success text-xs sm:text-sm py-2.5 flex-1 font-bold cursor-pointer"
                      >
                        Entregar Trabajo
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 glass-panel p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center mb-4 text-slate-500">
              <CheckSquare className="w-8 h-8 text-slate-600" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">No hay tareas en esta sección</h4>
            <p className="text-slate-400 text-sm max-w-sm">
              {filter === 'pending' 
                ? '¡Increíble! Has terminado todas tus tareas pendientes. ¡Buen trabajo!' 
                : 'Aún no has completado ninguna tarea del mes. ¡Pulsa "Entregar Trabajo" en tus tareas pendientes para empezar!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
