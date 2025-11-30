// server.js pour Azure App Service avec Next.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

// Forcer le mode production sur Azure
const dev = false;
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = process.env.PORT || 8080;

console.log(`Starting Next.js server in ${dev ? 'development' : 'production'} mode`);
console.log(`Port: ${port}, Hostname: ${hostname}`);
console.log(`Working directory: ${process.cwd()}`);
console.log(`__dirname: ${__dirname}`);

// Vérifier que .next existe
const fs = require('fs');
const nextDir = path.join(__dirname, '.next');
if (!fs.existsSync(nextDir)) {
  console.error(`❌ ERROR: .next directory not found at ${nextDir}`);
  console.error('Current directory contents:');
  try {
    const files = fs.readdirSync(__dirname);
    console.error(files.join(', '));
  } catch (e) {
    console.error('Cannot read directory:', e.message);
  }
  process.exit(1);
}

const app = next({ 
  dev: dev,
  dir: __dirname
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  console.log('✅ Next.js app prepared successfully');
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, hostname, (err) => {
    if (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
    console.log(`✅ Server ready on http://${hostname}:${port}`);
  });
}).catch((err) => {
  console.error('❌ Failed to prepare Next.js app:', err);
  process.exit(1);
});

