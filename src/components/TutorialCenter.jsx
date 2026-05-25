import React, { useState, useEffect } from 'react';
import { HelpCircle, BookOpen, Clock, AlertTriangle, ExternalLink, ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function TutorialCenter({ tutorials, selectedTutorialId, setSelectedTutorialId }) {
  const [activeId, setActiveId] = useState(tutorials[0]?.id || '');

  // Synchronize when a task requests a specific tutorial
  useEffect(() => {
    if (selectedTutorialId) {
      setActiveId(selectedTutorialId);
    }
  }, [selectedTutorialId]);

  const activeTutorial = tutorials.find(t => t.id === activeId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up">
      
      {/* Sidebar - Tutorial Lists (takes 4 columns) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="glass-panel p-5 glow-brand/5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white font-sans m-0">Temas de Ayuda</h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {tutorials.map(tut => {
              const isActive = tut.id === activeId;
              return (
                <button
                  key={tut.id}
                  onClick={() => {
                    setActiveId(tut.id);
                    if (setSelectedTutorialId) setSelectedTutorialId(tut.id);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-600/15 border-purple-500 text-white shadow-md glow-brand'
                      : 'bg-slate-950/40 border-slate-850 hover:border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isActive ? 'text-purple-400' : 'text-slate-500'}`}>
                    {tut.category}
                  </span>
                  <span className="block font-bold text-sm leading-tight text-white mb-2">
                    {tut.title}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-medium bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      ⏱️ {tut.duration}
                    </span>
                    <span className="flex items-center gap-1 font-medium bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      💡 {tut.difficulty}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area - Active Tutorial (takes 8 columns) */}
      <div className="lg:col-span-8">
        {activeTutorial ? (
          <div className="glass-panel p-6 md:p-8 glow-brand/5 space-y-6 animate-scale-in">
            {/* Guide Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pb-5 border-b border-slate-800">
              <div>
                <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  {activeTutorial.category}
                </span>
                <h4 className="text-2xl font-extrabold text-white mt-3 leading-snug">
                  {activeTutorial.title}
                </h4>
              </div>

              {/* Action Buttons for External Software */}
              {activeTutorial.id.includes('canva') && (
                <a
                  href="https://www.canva.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold text-sm py-2.5 font-bold self-start flex items-center justify-center gap-2 glow-gold"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir Canva Gratis
                </a>
              )}
              {activeTutorial.id.includes('instagram') && (
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-sm py-2.5 font-bold self-start flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ir a Instagram
                </a>
              )}
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-6">
              <h5 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Pasos a seguir:
              </h5>

              <div className="space-y-4">
                {activeTutorial.steps.map((step, idx) => (
                  <div 
                    key={idx} 
                    className="flex gap-4 p-4 bg-slate-950/40 rounded-xl border border-slate-850 hover:border-slate-800/80 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-md">
                      {step.num}
                    </div>
                    <div className="space-y-1">
                      <h6 className="font-extrabold text-base text-slate-100">
                        {step.title}
                      </h6>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Tips Box */}
            {activeTutorial.tips && activeTutorial.tips.length > 0 && (
              <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl space-y-3 mt-6">
                <h5 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertTriangle className="w-4.5 h-4.5" />
                  Consejos Clave
                </h5>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  {activeTutorial.tips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed pl-1">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-center mb-4 text-slate-500">
              <HelpCircle className="w-8 h-8 text-slate-600" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Selecciona una guía</h4>
            <p className="text-slate-400 text-sm max-w-xs">
              Elige cualquiera de los temas de la izquierda para ver el tutorial paso a paso con consejos útiles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
