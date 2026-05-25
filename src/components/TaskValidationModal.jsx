import React, { useState } from 'react';
import { X, Upload, Link2, Check, Image as ImageIcon, MessageSquare, Sparkles } from 'lucide-react';

export default function TaskValidationModal({ task, onClose, onConfirm }) {
  const [url, setUrl] = useState('');
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!task) return null;

  // Handle Image Upload & convert to Base64 for localStorage persistence
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit to avoid exceeding localStorage quota (usually 5MB)
        setError('La imagen es demasiado grande. Por favor, sube una foto de menos de 2MB.');
        return;
      }
      
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple verification: must provide either link or image or both
    if (!url.trim() && !image) {
      setError('Por favor, añade el enlace de Canva/Instagram o sube una captura de pantalla del trabajo.');
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} a las ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    onConfirm(task.id, {
      url: url.trim(),
      image: image,
      comment: comment.trim(),
      completedAt: formattedDate
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-scale-in">
      <div className="glass-panel w-full max-w-lg bg-slate-900 border-slate-800 p-6 md:p-8 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider">
            {task.category}
          </span>
          <h3 className="text-2xl font-bold text-white mt-3 font-sans leading-tight">
            Entregar Trabajo
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Estás completando: <span className="text-slate-200 font-semibold">{task.title}</span>
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3.5 rounded-xl mb-4 font-medium flex items-start gap-2">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Delivery Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Link Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-purple-400" />
              Enlace de Canva o Publicación (Instagram/Facebook)
            </label>
            <input
              type="url"
              placeholder="https://www.canva.com/design/... o https://instagram.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-purple-500 text-slate-200 px-4 py-3 rounded-xl outline-none transition-all text-sm"
            />
            <p className="text-xs text-slate-500">
              Copia y pega la dirección de internet donde se puede ver tu cartel o publicación.
            </p>
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-purple-400" />
              Foto o Captura de Pantalla del Trabajo
            </label>
            
            {image ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video flex items-center justify-center shadow-inner group">
                <img src={image} alt="Vista previa de la entrega" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white p-2 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer"
                >
                  Quitar Imagen
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-800 hover:border-purple-500/60 rounded-xl p-6 bg-slate-950/40 text-center transition-all cursor-pointer relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-slate-500 group-hover:text-purple-400 mx-auto mb-3 transition-colors" />
                <span className="block text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                  Haz clic para subir una foto
                </span>
                <span className="block text-xs text-slate-500 mt-1">
                  PNG o JPG de hasta 2MB (ej: captura de pantalla desde el móvil u ordenador)
                </span>
              </div>
            )}
          </div>

          {/* Additional Comments */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              Comentario adicional (Opcional)
            </label>
            <textarea
              placeholder="¿Quieres dejar algún mensaje o nota sobre este trabajo?"
              rows="2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-purple-500 text-slate-200 px-4 py-3 rounded-xl outline-none resize-none transition-all text-sm"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-800/60">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-3 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-success flex-1 py-3 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-5 h-5" />
              Confirmar Entrega
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
