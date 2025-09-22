const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

// Socket.io connection logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for incoming chat messages
  socket.on("chat message", (msg) => {
    // Broadcast the message to all connected clients
    io.emit("chat message", { txt: msg, id: socket.id });
    console.log(`message: ${socket.id}:${msg}`);
  });

  // Handle a user disconnecting
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
