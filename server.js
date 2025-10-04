// server.js
const WebSocket = require("ws");

// Fly.io will pass the port from process.env.PORT
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT, host: "0.0.0.0" });

wss.on("connection", (ws) => {
  console.log("New client connected!");

  ws.on("message", (msg) => {
    // Echo back to everyone (basic relay logic)
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});

console.log(`Relay server running on port ${PORT}`);
