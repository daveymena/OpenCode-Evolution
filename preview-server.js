#!/usr/bin/env node

/**
 * Servidor de Preview Profesional para OpenCode
 * Soporta múltiples lenguajes y frameworks
 */

const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PREVIEW_PORT || 8080;
const WORKSPACE = process.env.WORKSPACE || '/root/workspace';

app.use(cors());
app.use(express.json());

// Estado de procesos en ejecución
const runningProcesses = new Map();

// Detectar tipo de proyecto
function detectProjectType(projectPath) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const requirementsPath = path.join(projectPath, 'requirements.txt');
  const goModPath = path.join(projectPath, 'go.mod');
  const cargoPath = path.join(projectPath, 'Cargo.toml');
  const composerPath = path.join(projectPath, 'composer.json');
  const gemfilePath = path.join(projectPath, 'Gemfile');

  // Node.js / JavaScript / TypeScript
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (pkg.dependencies?.['next']) return { type: 'next', port: 3000, cmd: 'npm', args: ['run', 'dev'] };
    if (pkg.dependencies?.['nuxt']) return { type: 'nuxt', port: 3000, cmd: 'npm', args: ['run', 'dev'] };
    if (pkg.dependencies?.['react']) return { type: 'react', port: 5173, cmd: 'npm', args: ['run', 'dev'] };
    if (pkg.dependencies?.['vue']) return { type: 'vue', port: 5173, cmd: 'npm', args: ['run', 'dev'] };
    if (pkg.dependencies?.['@angular/core']) return { type: 'angular', port: 4200, cmd: 'npm', args: ['start'] };
    if (pkg.dependencies?.['svelte']) return { type: 'svelte', port: 5173, cmd: 'npm', args: ['run', 'dev'] };
    if (pkg.dependencies?.['express']) return { type: 'express', port: 3000, cmd: 'npm', args: ['start'] };
    if (pkg.dependencies?.['gatsby']) return { type: 'gatsby', port: 8000, cmd: 'npm', args: ['run', 'develop'] };
    
    // Genérico Node.js
    if (pkg.scripts?.dev) return { type: 'node', port: 3000, cmd: 'npm', args: ['run', 'dev'] };
    if (pkg.scripts?.start) return { type: 'node', port: 3000, cmd: 'npm', args: ['start'] };
  }

  // Python
  if (fs.existsSync(requirementsPath)) {
    const requirements = fs.readFileSync(requirementsPath, 'utf8');
    if (requirements.includes('fastapi')) return { type: 'fastapi', port: 8000, cmd: 'uvicorn', args: ['main:app', '--reload', '--host', '0.0.0.0'] };
    if (requirements.includes('django')) return { type: 'django', port: 8000, cmd: 'python', args: ['manage.py', 'runserver', '0.0.0.0:8000'] };
    if (requirements.includes('flask')) return { type: 'flask', port: 5000, cmd: 'flask', args: ['run', '--host=0.0.0.0'] };
    return { type: 'python', port: 8000, cmd: 'python', args: ['main.py'] };
  }

  // Go
  if (fs.existsSync(goModPath)) {
    return { type: 'go', port: 8080, cmd: 'go', args: ['run', '.'] };
  }

  // Rust
  if (fs.existsSync(cargoPath)) {
    return { type: 'rust', port: 8080, cmd: 'cargo', args: ['run'] };
  }

  // PHP
  if (fs.existsSync(composerPath)) {
    return { type: 'php', port: 8000, cmd: 'php', args: ['-S', '0.0.0.0:8000'] };
  }

  // Ruby
  if (fs.existsSync(gemfilePath)) {
    return { type: 'ruby', port: 3000, cmd: 'bundle', args: ['exec', 'rails', 'server', '-b', '0.0.0.0'] };
  }

  // HTML estático
  if (fs.existsSync(path.join(projectPath, 'index.html'))) {
    return { type: 'static', port: 8080, cmd: null };
  }

  return null;
}

// Endpoint para iniciar proyecto
app.post('/api/preview/start', async (req, res) => {
  const { projectPath = WORKSPACE } = req.body;
  
  try {
    const projectType = detectProjectType(projectPath);
    
    if (!projectType) {
      return res.status(400).json({ 
        error: 'No se pudo detectar el tipo de proyecto',
        suggestion: 'Asegúrate de tener package.json, requirements.txt, o archivos de configuración apropiados'
      });
    }

    // Si es estático, servir directamente
    if (projectType.type === 'static') {
      app.use('/preview', express.static(projectPath));
      return res.json({ 
        success: true, 
        type: projectType.type,
        url: `http://localhost:${PORT}/preview`,
        port: PORT
      });
    }

    // Verificar si ya está corriendo
    if (runningProcesses.has(projectPath)) {
      const existing = runningProcesses.get(projectPath);
      return res.json({ 
        success: true, 
        type: projectType.type,
        url: `http://localhost:${projectType.port}`,
        port: projectType.port,
        pid: existing.pid,
        status: 'already_running'
      });
    }

    // Instalar dependencias si es necesario
    if (projectType.type.includes('node') || projectType.type === 'react' || projectType.type === 'vue') {
      if (!fs.existsSync(path.join(projectPath, 'node_modules'))) {
        console.log('📦 Instalando dependencias...');
        await new Promise((resolve, reject) => {
          const install = spawn('npm', ['install'], { cwd: projectPath });
          install.on('close', code => code === 0 ? resolve() : reject(new Error('Install failed')));
        });
      }
    }

    // Iniciar proceso
    console.log(`🚀 Iniciando ${projectType.type} en puerto ${projectType.port}...`);
    const process = spawn(projectType.cmd, projectType.args, {
      cwd: projectPath,
      env: { 
        ...process.env, 
        PORT: projectType.port,
        HOST: '0.0.0.0',
        NODE_ENV: 'development'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    const logs = [];
    process.stdout.on('data', data => {
      const msg = data.toString();
      logs.push(msg);
      console.log(msg);
    });

    process.stderr.on('data', data => {
      const msg = data.toString();
      logs.push(msg);
      console.error(msg);
    });

    process.on('error', err => {
      console.error('❌ Error al iniciar proceso:', err);
      runningProcesses.delete(projectPath);
    });

    process.on('exit', code => {
      console.log(`⚠️ Proceso terminado con código ${code}`);
      runningProcesses.delete(projectPath);
    });

    runningProcesses.set(projectPath, { 
      process, 
      type: projectType.type, 
      port: projectType.port,
      logs,
      startTime: Date.now()
    });

    // Esperar a que el servidor esté listo
    await new Promise(resolve => setTimeout(resolve, 3000));

    res.json({ 
      success: true, 
      type: projectType.type,
      url: `http://localhost:${projectType.port}`,
      port: projectType.port,
      pid: process.pid
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para detener proyecto
app.post('/api/preview/stop', (req, res) => {
  const { projectPath = WORKSPACE } = req.body;
  
  const running = runningProcesses.get(projectPath);
  if (!running) {
    return res.status(404).json({ error: 'No hay proceso corriendo para este proyecto' });
  }

  running.process.kill();
  runningProcesses.delete(projectPath);
  
  res.json({ success: true, message: 'Proceso detenido' });
});

// Endpoint para obtener estado
app.get('/api/preview/status', (req, res) => {
  const { projectPath = WORKSPACE } = req.query;
  
  const running = runningProcesses.get(projectPath);
  if (!running) {
    return res.json({ running: false });
  }

  res.json({ 
    running: true,
    type: running.type,
    port: running.port,
    pid: running.process.pid,
    uptime: Date.now() - running.startTime,
    logs: running.logs.slice(-50) // Últimas 50 líneas
  });
});

// Endpoint para obtener logs
app.get('/api/preview/logs', (req, res) => {
  const { projectPath = WORKSPACE } = req.query;
  
  const running = runningProcesses.get(projectPath);
  if (!running) {
    return res.json({ logs: [] });
  }

  res.json({ logs: running.logs });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    runningProcesses: runningProcesses.size,
    workspace: WORKSPACE
  });
});

// Servir archivos estáticos del workspace
app.use('/static', express.static(WORKSPACE));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Preview Server corriendo en puerto ${PORT}`);
  console.log(`✓ Workspace: ${WORKSPACE}`);
});

// Cleanup al cerrar
process.on('SIGTERM', () => {
  console.log('🛑 Deteniendo todos los procesos...');
  for (const [path, { process }] of runningProcesses) {
    process.kill();
  }
  process.exit(0);
});
