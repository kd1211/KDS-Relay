const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT, host: "0.0.0.0" });

console.log(`🚀 Relay server ready at wss://reliable-expression-production.up.railway.app`);
console.log(`🟢 Listening on 0.0.0.0:${PORT}`);

// Heartbeat to prevent idle termination
function heartbeat() {
  this.isAlive = true;
}

wss.on("connection", (ws) => {
  console.log("✅ Client connected");
  ws.isAlive = true;
  ws.on("pong", heartbeat);

  ws.on("message", (msg) => {
    const message = msg.toString();

    // respond to ping messages
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

// Keep-alive ping every 25 seconds
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 25000);

wss.on("close", () => clearInterval(interval));
