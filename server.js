const http = require('http');
const app = require('./app');

// Single entry point so cPanel Node.js App can start the Express server directly
// Docker standard port is 8080, cPanel/Passenger will override via PORT env
const port = normalizePort(process.env.PORT || process.env.APP_PORT || '8080');
app.set('port', port);

const server = http.createServer(app);
server.listen(port, onListening);
server.on('error', onError);

function normalizePort(value) {
  const parsedPort = parseInt(value, 10);
  if (Number.isNaN(parsedPort)) {
    return value; // named pipe
  }
  if (parsedPort >= 0) {
    return parsedPort; // port number
  }
  return false;
}

function onListening() {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${address.port}`;
  console.log(`Express server listening on ${bind}`);
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}
