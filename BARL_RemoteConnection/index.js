const net = require('net');
const fs = require('fs');

// Load config
let config;
try {
  config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
} catch (err) {
  console.error('[x] Failed to read config.json');
  process.exit(1);
}

const REMOTE_IP = config.remote_ip;
const REMOTE_PORT = config.remote_port;
const LOCAL_PORT = config.local_port;
const DEBUG = config.debug === true;

console.log(`[*] Remote target: ${REMOTE_IP}:${REMOTE_PORT} (TCP)`);

let remoteSocket = null;
let remoteReady = false;
const localClients = new Set();

function connectToRemote() {
  remoteReady = false;
  remoteSocket = net.connect(REMOTE_PORT, REMOTE_IP, () => {
    remoteReady = true;
    console.log('[v] Connected to remote TCP host');
  });

  remoteSocket.on('data', (chunk) => {
    if (DEBUG) {
      console.log(`[REMOTE -> LOCAL] ${chunk.length} bytes`);
    }
    for (const client of localClients) {
      client.write(chunk);
    }
  });

  remoteSocket.on('close', () => {
    remoteReady = false;
    console.log('[!] Remote TCP connection closed. Reconnecting in 3s...');
    setTimeout(connectToRemote, 3000);
  });

  remoteSocket.on('error', (err) => {
    console.error('[x] Remote TCP error:', err.message);
  });
}

connectToRemote();

// Local TCP server
const localServer = net.createServer((localSocket) => {
  console.log('[>] Local client connected');
  localClients.add(localSocket);

  // Local -> Remote
  localSocket.on('data', (chunk) => {
    if (DEBUG) {
      console.log(`[LOCAL -> REMOTE] ${chunk.length} bytes`);
    }
    if (remoteSocket && remoteReady) {
      remoteSocket.write(chunk);
    }
  });

  localSocket.on('close', () => {
    console.log('[<] Local client disconnected');
    localClients.delete(localSocket);
  });

  localSocket.on('error', (err) => {
    console.error('[x] Local client error:', err.message);
    localClients.delete(localSocket);
  });
});

localServer.on('error', (err) => {
  console.error('[x] Local server error:', err.message);
});

localServer.listen(LOCAL_PORT, '127.0.0.1', () => {
  console.log(`[*] Local TCP relay listening at 127.0.0.1:${LOCAL_PORT}`);
});
