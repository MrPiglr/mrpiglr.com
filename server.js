import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8079;
const DIST_PATH = join(__dirname, 'dist');

// Ensure dist folder exists
if (!fs.existsSync(DIST_PATH)) {
  console.error('Error: dist folder not found. Run `npm run build` first.');
  process.exit(1);
}

// Serve static files from dist
app.use(express.static(DIST_PATH, {
  maxAge: '1d',
  etag: false
}));

// SPA routing: serve index.html for all non-file routes
app.get('*', (req, res) => {
  const indexPath = join(DIST_PATH, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`   Railway will access it at: https://<your-railway-url>.railway.app`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
