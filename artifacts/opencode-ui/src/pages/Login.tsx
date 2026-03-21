import { useState } from "react";
import { useLocation } from "wouter";
import { Terminal, Code2, Sparkles, ChevronRight, Lock } from "lucide-react";
import { motion } from "framer-motion";

export function Login() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login/register for now
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Orbs (Glassmorphism effect) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Presentation */}
        <div className="hidden lg:flex flex-col gap-8 pr-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 backdrop-blur-md">
              <Terminal className="text-primary w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
              OpenCode OS
            </h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tight leading-tight">
              El Sistema Operativo <br/>
              <span className="text-primary">Evolucionado por IA</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-lg">
              Tu IDE en la nube. Crea código, lanza bots, despliega servidores reales y administra integraciones externas sin tocar tu disco duro.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              { icon: <Code2 />, text: "IDE Completo en la nube" },
              { icon: <Sparkles />, text: "IA con MCP nativo" },
              { icon: <Terminal />, text: "Bots 24/7 en segundo plano" },
              { icon: <Lock />, text: "Espacio aislado y seguro" }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                <div className="text-primary">{feature.icon}</div>
                <span className="text-sm font-medium opacity-90">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Auth Card (Glassmorphism) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-[#18181b]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">
                  {isLogin ? "Bienvenido de nuevo" : "Comienza tu evolución"}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  {!isLogin && (
                    <span className="px-2.5 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full border border-primary/30">
                      14 Días Gratis
                    </span>
                  )}
                  {isLogin ? "Inicia sesión en tu Workspace" : "Empieza a crear sin límites de inmediato."}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/70 ml-1">Nombre Completo</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Gavy Mosquera"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20"
                      required={!isLogin}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/70 ml-1">Correo Electrónico</label>
                  <input 
                    type="email" 
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/70 ml-1">Contraseña</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20"
                    required 
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 mt-4"
                >
                  {isLogin ? "Ingresar al Workspace" : "Iniciar mis 14 días gratis"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6 text-center">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {isLogin ? "¿No tienes cuenta? Regístrate y prueba gratis" : "¿Ya tienes una cuenta? Inicia sesión"}
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
