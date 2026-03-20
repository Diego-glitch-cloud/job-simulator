const http = require('http');
const routes = require('./routes/bands');

const PORT = 8080;

const server = http.createServer(async (req, res) => {
  // Configuración de CORS estricta y manual
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight response
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Interceptar la ruta
  if (req.url.startsWith('/bands')) {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          await routes(req, res);
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Formato JSON inválido' }));
        }
      });
    } else {
      req.body = {};
      await routes(req, res);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`API Node.js iniciada en el puerto ${PORT}`);
});
