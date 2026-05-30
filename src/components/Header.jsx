import React from 'react';
import { Calendar, CheckSquare, HelpCircle, ShieldAlert, Sparkles } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, tasks }) {
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="w-full flex flex-col gap-6 mb-8 animate-slide-up">
      {/* Top Bar with Brand and Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-950/40 glow-brand">
            <Calendar className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans m-0">
              App-<span className="bg-gradient-to-r from-purple-400 to-amber-300 bg-clip-text text-transparent">Mama</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Asistente de Redes y Canva</p>
          </div>
        </div>

        {/* Big visual navigation tabs */}
        <nav className="flex flex-wrap gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800/80 shadow-inner">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Mis Tareas
          </button>
          
          <button
            onClick={() => setActiveTab('help')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'help'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Guías de Ayuda
          </button>
          
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Panel de Control
          </button>
        </nav>
      </div>

      {/* Welcome Card & Summary Progress */}
      <div className="glass-panel p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 glow-brand/10">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-sans tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 to-amber-300 bg-clip-text text-transparent">¡Bienvenida de nuevo, mamá!</span> 👋❤️
          </h2>
          <p className="text-slate-300 text-base max-w-xl">
            Aquí tienes tu plan de trabajo de este mes. Vamos a preparar carteles hermosos en Canva y subirlos a redes sociales de forma fácil y guiada.
          </p>
        </div>

        {/* Progress Display */}
        <div className="flex flex-col gap-2 min-w-[240px] bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-semibold">Progreso Mensual</span>
            <span className="text-white font-bold bg-purple-900/40 px-2 py-0.5 rounded-md border border-purple-800/40">
              {completedCount} de {totalCount} Hechas
            </span>
          </div>
          <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="text-right">
            <span className="text-xs font-extrabold text-purple-400">{progressPercent}% completado</span>
          </div>
        </div>
      </div>
    </header>
  );
}
