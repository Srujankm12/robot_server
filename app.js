const express = require("express");
const ws = require("ws");

const app = express();

const Clients = new Set();

const handleMessage = (socket, message) => {
  Clients.forEach((client) => {
    console.log(message.toString());
    client.send(message.toString());
  });
};

const handleDisconnect = (socket) => {
  console.log("disconnected");
  Clients.delete(socket);
};

const wsServer = new ws.Server({ noServer: true });

wsServer.on("connection", (socket) => {
  Clients.add(socket);
  console.log(Clients.size);
  socket.on("message", (message) => handleMessage(socket, message));
  socket.on("close", () => handleDisconnect(socket));
});

const server = app.listen(5000, () => {
  console.log(`server running on port: 5000`);
});

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});
