import React, { useRef } from 'react';
import { CheckCircle2, FolderHeart, FolderPlus, Music, Sparkles, X } from 'lucide-react';

interface MusicPermissionModalProps {
  open: boolean;
  savedFolderName: string | null;
  isImporting: boolean;
  onConnectFolder: () => void;
  onSelectFallbackFiles: (files: FileList | File[]) => void;
  onDismiss: (rememberDontAsk: boolean) => void;
}

export const MusicPermissionModal: React.FC<MusicPermissionModalProps> = ({
  open,
  savedFolderName,
  isImporting,
  onConnectFolder,
  onSelectFallbackFiles,
  onDismiss,
}) => {
  const fallbackFilesRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Permiso para acceder a tu música"
      onClick={() => onDismiss(false)}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 shadow-2xl border relative text-center"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--divider-color)',
          color: 'var(--text-main)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onDismiss(false)}
          aria-label="Cerrar"
          className="absolute top-4 right-4 min-w-[40px] min-h-[40px] rounded-2xl flex items-center justify-center border"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--divider-color)',
          }}
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center border shadow-sm"
          style={{
            backgroundColor: 'var(--accent-soft)',
            borderColor: 'var(--accent-color)',
          }}
        >
          <FolderHeart className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-extrabold tracking-tight mt-4 font-display">
          {savedFolderName
            ? `Sincronizar "${savedFolderName}"`
            : 'Conectar tu música del dispositivo'}
        </h2>

        <p className="text-xs sm:text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {savedFolderName
            ? 'Permite el acceso una vez para revisar automáticamente si agregaste canciones nuevas en tu carpeta de música.'
            : 'Permite el acceso a tu carpeta de música (ej. Música / Downloads) para importar todas tus canciones de golpe de forma automática, sin pasarlas una por una.'}
        </p>

        <div
          className="mt-4 p-3 rounded-2xl border text-left text-xs space-y-1.5"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--divider-color)',
          }}
        >
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Privado y automático en tu dispositivo</span>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            Tus archivos no se suben a internet: se guardan directo en tu reproductor y se recuerdan para futuras entradas.
          </p>
        </div>

        <div className="mt-5 space-y-2.5">
          <button
            type="button"
            disabled={isImporting}
            onClick={onConnectFolder}
            className="w-full min-h-[48px] px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: '#1C1B1F',
            }}
          >
            {savedFolderName ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Permitir acceso y sincronizar música</span>
              </>
            ) : (
              <>
                <FolderPlus className="w-4 h-4" />
                <span>Permitir carpeta de música (todas)</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={isImporting}
            onClick={() => fallbackFilesRef.current?.click()}
            className="w-full min-h-[42px] px-4 py-2 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--divider-color)',
            }}
          >
            <Music className="w-4 h-4" />
            <span>Elegir varios archivos de música</span>
          </button>

          <input
            ref={fallbackFilesRef}
            type="file"
            multiple
            accept="audio/*,.flac,.wav,.alac,.aiff,.aif,.m4a,.m4b,.mp3,.ogg,.opus,.aac,.wma,.webm,.mp4"
            className="hidden"
            onChange={(e) => {
              const picked = e.target.files ? Array.from(e.target.files) : [];
              e.target.value = '';
              if (picked.length > 0) {
                onSelectFallbackFiles(picked);
                onDismiss(false);
              }
            }}
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          <button
            type="button"
            onClick={() => onDismiss(false)}
            className="hover:underline py-1"
          >
            Ahora no
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => onDismiss(true)}
            className="hover:underline py-1"
          >
            No volver a preguntar al entrar
          </button>
        </div>
      </div>
    </div>
  );
};
