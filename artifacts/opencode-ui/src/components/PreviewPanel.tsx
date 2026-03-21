import { useState, useRef, useEffect } from 'react';
import { RefreshCcw, ExternalLink, Globe, Layout, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PreviewPanelProps {
  url?: string;
  onClose?: () => void;
}

export function PreviewPanel({ url = 'about:blank', onClose }: PreviewPanelProps) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      setIsLoading(true);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    setCurrentUrl(url);
  }, [url]);

  return (
    <div className="flex flex-col h-full w-full bg-card/50 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-2xl glass-effect animation-slide-in">
      {/* Barra de Herramientas de Navegación */}
      <div className="h-12 flex items-center justify-between px-4 bg-background/40 border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 mr-2">
            <button className="w-3 h-3 rounded-full bg-destructive/80 hover:bg-destructive shadow-sm shadow-destructive/20 transition-all" onClick={onClose} />
            <button className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 shadow-sm shadow-yellow-500/20 transition-all" />
            <button className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 shadow-sm shadow-green-500/20 transition-all" />
          </div>
          
          <div className="flex items-center gap-1 bg-background/60 border border-border/40 rounded-full px-4 py-1.5 w-full max-w-md shadow-inner transition-all hover:border-primary/30">
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <input 
              type="text" 
              value={currentUrl} 
              onChange={(e) => setCurrentUrl(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-foreground w-full font-sans tracking-wide"
              placeholder="https://su-proyecto.opencode.local"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleRefresh} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="Actualizar">
            <RefreshCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all" title="Abrir en nueva pestaña">
            <ExternalLink className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contenedor del Iframe */}
      <div className="flex-1 bg-white dark:bg-[#0d0d0d] relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/20 backdrop-blur-sm z-10 transition-opacity">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-4 shadow-lg shadow-primary/20" />
            <p className="text-sm font-medium text-foreground/70 animate-pulse tracking-tight">Renderizando interfaz...</p>
          </div>
        )}
        <iframe 
          ref={iframeRef}
          src={currentUrl} 
          onLoad={handleLoad}
          className="w-full h-full border-none"
          title="Vista Previa de Proyecto OpenCode"
          sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
        />
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
