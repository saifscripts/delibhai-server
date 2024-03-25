/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");

// route imports
const userRoutes = require("./routes/v1/user.route");

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://hero.localhost:5173",
      "https://delibhai.com",
      "https://hero.delibhai.com",
    ],
  },
});

// Application level middleware
// app.use(viewCount);

// Middleware
app.use(express.json());
app.use(cors());

const userLocations = {};

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("updateLocation", (data) => {
    const { userId, location } = data;
    userLocations[userId] = location;
    io.emit("locationUpdated", userLocations);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.DATABASE_URI).then(() => {
  const port = process.env.PORT || 5000;

  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
  });
});

app.use("/api/v1/user", userRoutes);
