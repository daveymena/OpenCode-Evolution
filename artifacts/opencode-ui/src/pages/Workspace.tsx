import { useState, useEffect } from 'react';
import { 
  useListModels, 
  useListSessions, 
  useCreateSession,
  getListSessionsQueryKey,
  useListFiles, 
  useCreateFile, 
  useDeleteFile, 
  useGetFileContent, 
  useUpdateFileContent 
} from "@workspace/api-client-react";
import { FileExplorer } from '@/components/FileExplorer';
import { CodeEditorPanel } from '@/components/CodeEditor';
import { TerminalPanel } from '@/components/Terminal';
import { ChatPanel } from '@/components/ChatPanel';
import { Dashboard } from '@/components/Dashboard';
import { PreviewPanel } from '@/components/PreviewPanel';
import { Terminal, Plus, LayoutGrid, Monitor, Code2, Rocket, Settings, Cpu } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

type ViewMode = 'dashboard' | 'editor' | 'preview';

export function Workspace() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('claude-sonnet-4-6');
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  const [activeProjectPath, setActiveProjectPath] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const queryClient = useQueryClient();

  const { data: modelsData } = useListModels();
  const { data: sessionsData, isLoading: sessionsLoading } = useListSessions();
  const { mutateAsync: createSession, isPending: isCreatingSession } = useCreateSession();

  // Escanear proyectos al cargar
  useEffect(() => {
     // Aquí se llamaría a la API de sincronización si estuviera disponible en el cliente generado
  }, []);

  const handleLaunchProject = (path: string) => {
    setActiveProjectPath(path);
    setViewMode('editor');
  };

  const handleCreateSession = async () => {
    try {
      const newSession = await createSession({
        data: {
          title: `Sesión ${new Date().toLocaleTimeString('es-ES')}`,
          model: selectedModel
        }
      });
      setActiveSessionId(newSession.id);
      queryClient.invalidateQueries({ queryKey: getListSessionsQueryKey() });
    } catch (err) {
      console.error("Error al crear sesión", err);
    }
  };

  const { data: filesData } = useListFiles({ path: "." });

  // Escapar a una estructura compatible con el Dashboard
  const activeProjects = filesData?.files?.map((file, idx) => ({
    id: idx,
    name: file.name,
    path: file.path,
    type: file.name.endsWith('.py') ? 'python' : file.name.endsWith('.ts') ? 'web' : 'folder',
    updatedAt: new Date().toISOString(),
  })) || [];

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden selection:bg-primary/30 font-sans">
      
      {/* Navbar Superior Premium */}
      <nav className="h-14 border-b border-border/50 bg-card/30 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-30 shadow-2xl relative">
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-2.5 font-black text-white cursor-pointer group"
            onClick={() => setViewMode('dashboard')}
          >
            <div className="p-1.5 premium-gradient rounded-lg shadow-lg group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="tracking-tighter text-xl outfit">OpenCode <span className="text-primary tracking-widest text-[10px] bg-primary/10 px-1.5 py-0.5 rounded ml-1 border border-primary/20">OS</span></span>
          </div>
          
          <div className="h-6 w-px bg-border/50 hidden md:block" />

          {/* Selectores de Modo */}
          <div className="flex bg-muted/40 p-1 rounded-xl border border-border/40 scale-90 md:scale-100">
            <button 
              onClick={() => setViewMode('dashboard')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'dashboard' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-white/5'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>TABLERO</span>
            </button>
            <button 
              onClick={() => setViewMode('editor')}
              disabled={!activeProjectPath}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'editor' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-white/5'} ${!activeProjectPath ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>CÓDIGO</span>
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              disabled={!activeProjectPath}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-white/5'} ${!activeProjectPath ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>VISTA PREVIA</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Selector de Modelos */}
          <div className="flex items-center gap-3 bg-card/50 border border-border/40 px-3 py-1.5 rounded-xl shadow-inner">
            <Rocket className="w-3.5 h-3.5 text-primary" />
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent border-none py-0 text-xs font-bold focus:ring-0 outline-none text-foreground w-[160px] cursor-pointer"
            >
              {modelsData?.models?.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
              {!modelsData?.models?.length && (
                <>
                  <option value="groq-llama-3">Groq LLaMA 3 (Rápido)</option>
                  <option value="claude-sonnet-3.5">Claude 3.5 Sonnet</option>
                  <option value="gpt-4o">OpenAI GPT-4o</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="claude-sonnet-4-6">Claude 4.6 (Genial)</option>
                </>
              )}
            </select>
          </div>

          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors hover:rotate-45" title="Configuración">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Área Principal con Transiciones y Panel Siempre Activo */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex overflow-hidden relative">
          <AnimatePresence mode="wait">
            {viewMode === 'dashboard' ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="w-full h-full flex flex-col overflow-y-auto"
              >
                <Dashboard 
                  onCreateProject={() => {
                    setActiveProjectPath('nuevo_proyecto');
                    setActiveFilePath('main.py');
                    setViewMode('editor');
                  }}
                  onProjectSelect={handleLaunchProject} 
                  projects={activeProjects} 
                />
              </motion.div>
            ) : viewMode === 'preview' ? (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full h-full p-6 bg-[#0a0a0c]"
              >
                 <PreviewPanel url="http://localhost:3000" onClose={() => setViewMode('editor')} />
              </motion.div>
            ) : (
              <motion.div 
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex overflow-hidden w-full"
              >
                {/* Barra Lateral Izquierda - Explorador de Archivos */}
                <div className={`w-72 shrink-0 glass-effect z-20 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-ml-72'}`}>
                  <FileExplorer 
                    onFileSelect={(path) => {
                      setActiveFilePath(path);
                    }}
                    activeFile={activeFilePath}
                  />
                </div>

                {/* Panel Central - Editor y Terminal */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d0f]">
                  <div className="flex-1 relative">
                    <CodeEditorPanel filePath={activeFilePath} />
                  </div>
                  <div className="h-[280px] shrink-0 border-t border-border/50 glass-effect">
                    <TerminalPanel className="h-full" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Barra Lateral Derecha Fija (IA) SIEMPRE VISIBLE */}
        <div className="w-96 lg:w-[450px] shrink-0 hidden md:flex flex-col border-l border-border/50 glass-effect relative z-40 bg-[#0d0d0f]/80 backdrop-blur-2xl">
          <ChatPanel sessionId={activeSessionId} selectedModel={selectedModel} />
        </div>
      </div>
    </div>
  );
}
