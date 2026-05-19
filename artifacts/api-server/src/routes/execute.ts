import { Router } from 'express';
import { spawn, ChildProcess } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const router = Router();

// Mapa de procesos en ejecución
const runningProcesses = new Map<string, any>();

// Detectar tipo de proyecto
function detectProjectType(projectPath: string) {
  const packageJsonPath = join(projectPath, 'package.json');
  const requirementsPath = join(projectPath, 'requirements.txt');
  const goModPath = join(projectPath, 'go.mod');
  const indexHtmlPath = join(projectPath, 'index.html');

  // Node.js / JavaScript / TypeScript
  if (existsSync(packageJsonPath)) {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    if (pkg.dependencies?.['next']) return { type: 'next', port: 3000, cmd: 'npm', args: ['run', 'dev'] };
    if (pkg.dependencies?.['nuxt']) return { type: 'nuxt', port: 3000, cmd: 'npm', args: ['run', 'dev'] };
    if (pkg.dependencies?.['react']) return { type: 'react', port: 5173, cmd: 'npm', args: ['run', 'dev'] };
    if (pkg.dependencies?.['vue']) return { type: 'vue', port: 5173, cmd: 'npm', args: ['run', 'dev'] };
    if (pkg.dependencies?.['@angular/core']) return { type: 'angular', port: 4200, cmd: 'npm', args: ['start'] };
    if (pkg.dependencies?.['svelte']) return { type: 'svelte', port: 5173, cmd: 'npm', args: ['run', 'dev'] };
    if (pkg.dependencies?.['express']) return { type: 'express', port: 3000, cmd: 'npm', args: ['start'] };
    
    if (pkg.scripts?.dev) return { type: 'node', port: 3000, cmd: 'npm', args: ['run', 'dev'] };
    if (pkg.scripts?.start) return { type: 'node', port: 3000, cmd: 'npm', args: ['start'] };
  }

  // Python
  if (existsSync(requirementsPath)) {
    const requirements = readFileSync(requirementsPath, 'utf8');
    if (requirements.includes('fastapi')) return { type: 'fastapi', port: 8000, cmd: 'uvicorn', args: ['main:app', '--reload', '--host', '0.0.0.0'] };
    if (requirements.includes('django')) return { type: 'django', port: 8000, cmd: 'python', args: ['manage.py', 'runserver', '0.0.0.0:8000'] };
    if (requirements.includes('flask')) return { type: 'flask', port: 5000, cmd: 'flask', args: ['run', '--host=0.0.0.0'] };
    return { type: 'python', port: 8000, cmd: 'python', args: ['main.py'] };
  }

  // Go
  if (existsSync(goModPath)) {
    return { type: 'go', port: 8080, cmd: 'go', args: ['run', '.'] };
  }

  // HTML estático
  if (existsSync(indexHtmlPath)) {
    return { type: 'static', port: 8080, cmd: null };
  }

  return null;
}

// POST /api/execute/run - Ejecutar un proyecto
router.post('/run', async (req, res): Promise<void> => {
  try {
    const { projectPath, projectId } = req.body;

    if (!projectPath) {
      res.status(400).json({ error: 'projectPath is required' });
      return;
    }

    const projectType = detectProjectType(projectPath);

    if (!projectType) {
      res.status(400).json({ 
        error: 'Could not detect project type',
        suggestion: 'Make sure you have package.json, requirements.txt, or index.html'
      });
      return;
    }

    // Si es estático, no necesita proceso
    if (projectType.type === 'static') {
      res.json({
        success: true,
        type: projectType.type,
        url: `http://localhost:${projectType.port}/static`,
        port: projectType.port,
        message: 'Static files ready to serve'
      });
      return;
    }

    // Verificar si ya está corriendo
    const key = projectId || projectPath;
    if (runningProcesses.has(key)) {
      const existing = runningProcesses.get(key);
      res.json({
        success: true,
        type: projectType.type,
        url: `http://localhost:${projectType.port}`,
        port: projectType.port,
        pid: existing.pid,
        status: 'already_running'
      });
      return;
    }

    // Instalar dependencias si es necesario
    if (projectType.type.includes('node') || projectType.type === 'react' || projectType.type === 'vue') {
      if (!existsSync(join(projectPath, 'node_modules'))) {
        console.log('📦 Installing dependencies...');
        const install = spawn('npm', ['install'], { cwd: projectPath });
        
        await new Promise((resolve, reject) => {
          install.on('close', code => code === 0 ? resolve(null) : reject(new Error('Install failed')));
        });
      }
    }

    // Iniciar proceso
    console.log(`🚀 Starting ${projectType.type} on port ${projectType.port}...`);
    const childProcess: ChildProcess = spawn(projectType.cmd!, projectType.args || [], {
      cwd: projectPath,
      env: { 
        ...process.env, 
        PORT: projectType.port.toString(),
        HOST: '0.0.0.0',
        NODE_ENV: 'development',
        BROWSER: 'none'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    const logs: string[] = [];
    childProcess.stdout?.on('data', (data: Buffer) => {
      const msg = data.toString();
      logs.push(msg);
      console.log(msg);
    });

    childProcess.stderr?.on('data', (data: Buffer) => {
      const msg = data.toString();
      logs.push(msg);
      console.error(msg);
    });

    childProcess.on('error', (err: Error) => {
      console.error('❌ Error starting process:', err);
      runningProcesses.delete(key);
    });

    childProcess.on('exit', (code: number | null) => {
      console.log(`⚠️ Process exited with code ${code}`);
      runningProcesses.delete(key);
    });

    runningProcesses.set(key, {
      process: childProcess,
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
      pid: childProcess.pid,
      message: `${projectType.type} server started successfully`
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// GET /api/execute/status - Ver estado de un proyecto
router.get('/status', (req, res): void => {
  const { projectPath, projectId } = req.query;
  const key = (projectId as string) || (projectPath as string);

  if (!key) {
    res.status(400).json({ error: 'projectPath or projectId is required' });
    return;
  }

  const running = runningProcesses.get(key);
  
  if (!running) {
    res.json({ running: false });
    return;
  }

  res.json({
    running: true,
    type: running.type,
    port: running.port,
    pid: running.process.pid,
    uptime: Date.now() - running.startTime,
    logs: running.logs.slice(-50)
  });
});

// GET /api/execute/logs - Obtener logs
router.get('/logs', (req, res): void => {
  const { projectPath, projectId } = req.query;
  const key = (projectId as string) || (projectPath as string);

  if (!key) {
    res.status(400).json({ error: 'projectPath or projectId is required' });
    return;
  }

  const running = runningProcesses.get(key);
  
  if (!running) {
    res.json({ logs: [] });
    return;
  }

  res.json({ logs: running.logs });
});

// POST /api/execute/stop - Detener un proyecto
router.post('/stop', (req, res): void => {
  const { projectPath, projectId } = req.body;
  const key = projectId || projectPath;

  if (!key) {
    res.status(400).json({ error: 'projectPath or projectId is required' });
    return;
  }

  const running = runningProcesses.get(key);
  
  if (!running) {
    res.status(404).json({ error: 'No running process found' });
    return;
  }

  running.process.kill();
  runningProcesses.delete(key);
  
  res.json({ 
    success: true, 
    message: 'Process stopped successfully' 
  });
});

export default router;
