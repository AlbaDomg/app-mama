import React, { useState } from 'react';
import { CalendarPlus, Music, Calendar, Clock, Sparkles } from 'lucide-react';

export default function ConcertRegistrar({ onAddEvent }) {
  const [artist, setArtist] = useState('');
  const [weekday, setWeekday] = useState('Viernes');
  const [date, setDate] = useState('2026-05-29');
  const [time, setTime] = useState('21:30');
  const [type, setType] = useState('Concierto en Vivo');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!artist.trim() || !date || !time) {
      alert('Por favor, rellena el nombre de la banda, la fecha y la hora.');
      return;
    }

    onAddEvent({
      title: `${type}: ${artist.trim()}`,
      artist: artist.trim(),
      weekday: weekday,
      date: date,
      time: time,
      type: type,
      description: `${type} programado para el ${weekday} ${date.split('-').reverse().join('/')} a las ${time} hs.`
    });

    setArtist('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="glass-panel p-6 glow-brand/5 flex flex-col justify-between h-full animate-scale-in">
      <div>
        <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <CalendarPlus className="w-5 h-5 text-purple-400" />
          Programar Nuevo Concierto
        </h4>
        <p className="text-xs text-slate-400 mb-5 leading-normal">
          Introduce los datos del show de esta semana. Al guardarlo, se añadirá a la lista y se **crearán automáticamente las tareas asociadas para Canva, Instagram, Facebook y TikTok**.
        </p>

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-xl mb-4 font-semibold flex items-center gap-2 animate-scale-in">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>¡Concierto registrado y tareas creadas!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Artist / Band Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-350 flex items-center gap-1">
              <Music className="w-3.5 h-3.5 text-purple-400" /> Nombre de la Banda / Artista
            </label>
            <input
              type="text"
              placeholder="Ej: Los Rumberos de la Noche"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 focus:border-purple-500 text-slate-200 px-3.5 py-2.5 rounded-xl outline-none transition-all text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Weekday */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-350">Día de la Semana</label>
              <select
                value={weekday}
                onChange={(e) => setWeekday(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 text-slate-200 px-3 py-2.5 rounded-xl outline-none text-sm cursor-pointer"
              >
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
                <option value="Otro">Otro día</option>
              </select>
            </div>

            {/* Event Type */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-350">Tipo de Show</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 text-slate-200 px-3 py-2.5 rounded-xl outline-none text-sm cursor-pointer"
              >
                <option value="Concierto en Vivo">🎸 Concierto</option>
                <option value="Dj de la Casa">🎧 DJ Set</option>
                <option value="Concierto Acústico">🎤 Acústico</option>
                <option value="Espectáculo Flamenco">💃 Flamenco</option>
                <option value="Tarde de Micro Abierto">🎙️ Micro Abierto</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-350 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" /> Fecha del Evento
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 text-slate-200 px-3 py-2.5 rounded-xl outline-none text-sm"
                required
              />
            </div>

            {/* Time Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-350 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" /> Hora
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 text-slate-200 px-3 py-2.5 rounded-xl outline-none text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-gold w-full py-3 font-bold mt-2 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-yellow-950/20 hover:shadow-yellow-500/25 transition-all"
          >
            <CalendarPlus className="w-4.5 h-4.5 text-slate-950" />
            Agendar Concierto y Crear Tareas
          </button>
        </form>
      </div>
    </div>
  );
}
