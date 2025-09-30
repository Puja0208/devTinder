const socket = require("socket.io");
const crypto = require("crypto");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("No token provided"));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id);

      if (!user) {
        return next(new Error("User not authenticated"));
      }

      // Attach user to socket
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });
  io.on("connection", async (socket) => {
    console.log("✅ User connected:", socket.user.firstName);

    //handle events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`${firstName} joined room ${roomId}`);
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`${firstName}: ${text}`);
      io.to(roomId).emit("messageReceived", {
        firstName,
        text,
      });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
