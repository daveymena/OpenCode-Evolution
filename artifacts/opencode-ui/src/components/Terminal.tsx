import { useState, useRef, useEffect } from 'react';
import { useExecuteCommand } from '@workspace/api-client-react';
import { Terminal as TerminalIcon, Play, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OutputLine {
  id: string;
  type: 'command' | 'stdout' | 'stderr' | 'system';
  content: string;
}

export function TerminalPanel({ className }: { className?: string }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<OutputLine[]>([
    { id: 'start', type: 'system', content: 'OpenCode OS Evolución - Terminal Autónoma Lista.' }
  ]);
  const endOfOutputRef = useRef<HTMLDivElement>(null);
  
  const { mutateAsync: executeCmd, isPending } = useExecuteCommand();

  const scrollToBottom = () => {
    endOfOutputRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isExpanded]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const cmd = input.trim();
    setInput('');
    
    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    setHistory(prev => [...prev, { id: Date.now().toString(), type: 'command', content: `λ ${cmd}` }]);

    try {
      const res = await executeCmd({ data: { command: cmd } });
      if (res.stdout) {
        setHistory(prev => [...prev, { id: `${Date.now()}-out`, type: 'stdout', content: res.stdout }]);
      }
      if (res.stderr) {
        setHistory(prev => [...prev, { id: `${Date.now()}-err`, type: 'stderr', content: res.stderr }]);
      }
      if (!res.stdout && !res.stderr && res.exitCode === 0) {
        setHistory(prev => [...prev, { id: `${Date.now()}-sys`, type: 'system', content: `[Proceso finalizado con código 0]` }]);
      }
    } catch (err: any) {
      setHistory(prev => [...prev, { id: `${Date.now()}-err`, type: 'stderr', content: err.message || 'Error al ejecutar comando' }]);
    }
  };

  if (!isExpanded) {
    return (
      <div className={cn("bg-card/40 backdrop-blur-md border-t border-border/50 flex items-center justify-between px-6 py-2.5 text-sm text-muted-foreground hover:bg-white/5 cursor-pointer transition-all", className)} onClick={() => setIsExpanded(true)}>
        <div className="flex items-center gap-3">
          <TerminalIcon className="w-4 h-4 text-primary" />
          <span className="font-bold tracking-tight outfit">TERMINAL AUTÓNOMA</span>
        </div>
        <ChevronUp className="w-4 h-4" />
      </div>
    );
  }

  return (
    <div className={cn("bg-[#0A0A0C] border-t border-border/50 flex flex-col font-mono text-sm shadow-inner relative", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 outfit">ESTACIÓN DE COMANDO</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setHistory([])} className="text-muted-foreground hover:text-white transition-all p-1.5 hover:bg-white/5 rounded-lg" title="Limpiar">
            <XCircle className="w-4 h-4" />
          </button>
          <button onClick={() => setIsExpanded(false)} className="text-muted-foreground hover:text-white transition-all p-1.5 hover:bg-white/5 rounded-lg" title="Minimizar">
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Output Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-1.5 leading-relaxed bg-gradient-to-b from-transparent to-black/30">
        {history.map(line => (
          <div key={line.id} className={cn(
            "whitespace-pre-wrap break-words transition-all hover:translate-x-0.5",
            line.type === 'command' && "text-primary font-bold border-l-2 border-primary/40 pl-3 my-2",
            line.type === 'stdout' && "text-white/80",
            line.type === 'stderr' && "text-red-400 bg-red-500/5 px-2 py-0.5 rounded border-l-2 border-red-500/50",
            line.type === 'system' && "text-muted-foreground italic text-xs pt-1 opacity-60"
          )}>
            {line.content}
          </div>
        ))}
        <div ref={endOfOutputRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleCommand} className="flex items-center px-6 py-4 border-t border-white/5 bg-black/40 backdrop-blur-md">
        <span className="text-primary mr-3 font-black select-none text-lg">λ</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isPending ? "Procesando ejecución..." : "Escriba un comando para OpenCode..."}
          disabled={isPending}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/20 disabled:opacity-50 font-medium"
          autoComplete="off"
          spellCheck="false"
        />
        {isPending && (
          <div className="flex items-center gap-1 ml-3 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Ejecutando</span>
          </div>
        )}
      </form>
    </div>
  );
}
