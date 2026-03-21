import { useState } from 'react';
import { LayoutGrid, Folder, Plus, Search, Terminal, Code2, Cpu, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Project {
  id: number;
  name: string;
  path: string;
  type: string;
  updatedAt: string;
}

interface DashboardProps {
  onProjectSelect: (path: string) => void;
  projects?: Project[];
}

export function Dashboard({ onProjectSelect, projects = [] }: DashboardProps) {
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0c] selection:bg-primary/30">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-3 premium-gradient rounded-2xl shadow-lg shadow-primary/20">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white mb-1 outfit">OpenCode <span className="text-primary font-black uppercase text-sm tracking-[0.3em] ml-2 px-2 py-0.5 bg-primary/10 rounded border border-primary/20">OS EVOLUTION</span></h1>
              <p className="text-muted-foreground font-medium">Gestiona y desarrolla tus ideas de forma autónoma.</p>
            </div>
          </motion.div>

          {/* Barra de Búsqueda */}
          <div className="relative group max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar proyectos por nombre o tecnología..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground shadow-2xl"
            />
          </div>
        </header>

        {/* Bento Grid de Proyectos */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Botón Nuevo Proyecto */}
          <motion.button 
            variants={item}
            whileHover={{ scale: 1.02, translateY: -5 }}
            className="group flex flex-col items-center justify-center gap-4 p-8 bg-primary/5 border-2 border-dashed border-primary/20 rounded-3xl hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer h-[240px]"
          >
            <div className="p-4 bg-primary/20 rounded-full group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-white">Nuevo Proyecto</h3>
              <p className="text-sm text-primary/60">Cualquier lenguaje, cualquier idea</p>
            </div>
          </motion.button>

          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={item}
              whileHover={{ scale: 1.02, translateY: -5 }}
              onClick={() => onProjectSelect(project.path)}
              className="group p-6 bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-secondary rounded-2xl group-hover:bg-primary/20 transition-colors">
                  {project.type === 'web' ? <Globe className="w-6 h-6 text-primary" /> : <Code2 className="w-6 h-6 text-primary" />}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white group-hover:text-primary transition-colors">{project.name}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Tipo: {project.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-black/20 p-3 rounded-xl mb-4">
                <Folder className="w-4 h-4" />
                <span className="truncate">{project.path}</span>
              </div>

              <div className="flex items-center justify-between text-xs border-t border-border/30 pt-4">
                <div className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-500" />
                  <span>Actualizado recientemente</span>
                </div>
                <button className="px-3 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-all font-bold">ABRIR</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* Sección de Integraciones en la Nube */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              Integraciones en la Nube
            </h2>
            <button className="text-sm text-primary font-bold hover:underline">Ver todas</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Google Drive Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-5 bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl flex items-center gap-4 relative overflow-hidden"
            >
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Folder className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Google Drive</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">gavimosquera3@gmail.com</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
            </motion.div>

            {/* Google Calendar Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-5 bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl flex items-center gap-4 relative overflow-hidden"
            >
              <div className="p-3 bg-red-500/10 rounded-xl">
                <Zap className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Google Calendar</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">gavimosquera3@gmail.com</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
            </motion.div>

            {/* Supabase Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-5 bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl flex items-center gap-4 relative overflow-hidden"
            >
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Cpu className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Supabase DB</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Active (Cloud)</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
            </motion.div>

            {/* Add More Integration */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="p-5 border-2 border-dashed border-border/40 rounded-2xl flex items-center justify-center gap-2 hover:border-primary/40 transition-all group"
            >
              <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              <span className="text-sm font-bold text-muted-foreground group-hover:text-primary">Conectar más</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Globe(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/><path d="M2 12h20"/></svg>
  );
}
