import React from 'react';
import { CalendarDays, Music, Clock, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ConcertFeed({ events, tasks, onDeleteEvent }) {
  // Sort events chronologically (newest first or oldest first? Oldest first is standard for upcoming shows!)
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Formatter for date ("29/05")
  const formatDateMini = (dateStr) => {
    if (!dateStr) return '';
    const [, month, day] = dateStr.split('-');
    return `${day}/${month}`;
  };

  return (
    <div className="glass-panel p-6 glow-brand/5 flex flex-col h-full min-h-[440px] animate-scale-in">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <h4 className="text-lg font-bold text-white flex items-center gap-2 m-0">
          <CalendarDays className="w-5 h-5 text-amber-400" />
          Conciertos Programados ({events.length})
        </h4>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[360px] pr-1.5 space-y-3.5 custom-scrollbar">
        {sortedEvents.length > 0 ? (
          sortedEvents.map(event => {
            // Find tasks linked to this event
            const eventTasks = tasks.filter(t => 
              t.dueDate === event.date && 
              ((t.title || '').includes(event.artist || '') || (t.id || '').includes(event.id || ''))
            );
            
            const completedEventTasks = eventTasks.filter(t => t.status === 'completed');
            const marketingProgress = eventTasks.length > 0 
              ? Math.round((completedEventTasks.length / eventTasks.length) * 100)
              : 0;

            return (
              <div 
                key={event.id}
                className="p-4 bg-slate-950/40 hover:bg-slate-950/70 border border-slate-850 hover:border-slate-700/60 rounded-xl transition-all duration-200 flex flex-col justify-between gap-3 relative group"
              >
                {/* Header: Artist & Action Delete */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {event.type}
                    </span>
                    <h5 className="font-extrabold text-base text-white mt-1.5 leading-tight">
                      {event.artist}
                    </h5>
                  </div>
                  
                  {/* Delete Button (Hover effect) */}
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Seguro que quieres eliminar el concierto de "${event.artist}"? También se borrarán sus tareas de marketing.`)) {
                        onDeleteEvent(event.id, event.date, event.artist);
                      }
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
                    title="Eliminar concierto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Event Schedule Info */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-350 bg-slate-900/50 p-2.5 rounded-lg border border-slate-900">
                  <div className="flex items-center gap-1">
                    <span className="text-purple-400 font-bold">{event.weekday}</span>
                    <span className="text-slate-500">•</span>
                    <span className="font-semibold text-slate-200">{formatDateMini(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    <span>{event.time} hs</span>
                  </div>
                </div>

                {/* Progress & Task Status Indicator */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400 font-medium">Progreso Marketing:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-900">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          marketingProgress === 100 
                            ? 'bg-emerald-500' 
                            : 'bg-purple-500'
                        }`}
                        style={{ width: `${marketingProgress}%` }}
                      ></div>
                    </div>
                    <span className={`font-bold ${marketingProgress === 100 ? 'text-emerald-400' : 'text-purple-400'}`}>
                      {marketingProgress}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 text-slate-500">
            <span className="text-3xl animate-pulse mb-2">🎸</span>
            <h5 className="font-bold text-sm text-slate-300">Sin Conciertos</h5>
            <p className="text-[11px] text-slate-500 max-w-[180px] mx-auto mt-1 leading-normal">
              Rellena el formulario de la izquierda para programar tu primer concierto de la semana.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
