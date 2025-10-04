// server.js
const WebSocket = require("ws");

// Railway will provide PORT automatically
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT, host: "0.0.0.0" });

console.log(`🚀 Relay server ready at wss://reliable-expression-production.up.railway.app`);
console.log(`🟢 Listening on 0.0.0.0:${PORT}`);

// 🧠 Helper to keep connections alive
function heartbeat() {
  this.isAlive = true;
}

// When a new client connects
wss.on("connection", (ws) => {
  console.log("✅ Client connected");
  ws.isAlive = true;
  ws.on("pong", heartbeat);

  ws.on("message", (msg) => {
    const message = msg.toString();

    // optional ping/pong handler
    if (message === "ping") {
      ws.send("pong");
      return;
    }

    // broadcast to everyone
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => console.log("❌ Client disconnected"));
});

// keep-alive system (prevents timeouts)
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) {
      console.log("⚠️ Terminating dead connection");
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on("close", () => clearInterval(interval));
