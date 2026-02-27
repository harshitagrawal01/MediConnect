import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoutes.js'
import doctorRouter from './routes/doctorRoutes.js'
import userRouter from './routes/userRoutes.js'
import http from 'http'
import { Server } from "socket.io"
import ChatMessage from "./models/ChatMessage.js";
import chatRoutes from "./routes/chatRoutes.js";
import videoRoutes from "./routes/videoRoutes.js"
import contactRouter from './routes/contactRoutes.js'
import reviewRouter from './routes/reviewRoutes.js'


if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

const app = express()
const server = http.createServer(app);

const onlineUsers = {};

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

const PORT = process.env.PORT || 4000
connectDB()
connectCloudinary()

io.on("connection", (socket) => {
  console.log("CONNECTED:", socket.id);

  socket.on("join_room", ({ room, role }) => {
    console.log("JOIN:", room, role, socket.id);
    socket.join(room);

    if (!onlineUsers[room]) onlineUsers[room] = {};
    onlineUsers[room][role] = socket.id;

    io.to(room).emit("online_status", {
      patient: !!onlineUsers[room]?.patient,
      doctor: !!onlineUsers[room]?.doctor,
    });
  });

  socket.on("send_message", async (data) => {
    try {
      const savedMessage = await ChatMessage.create({
        appointmentId: data.room,
        senderRole: data.senderRole,
        message: data.message || "",
        messageType: data.messageType || "text",
        fileUrl: data.fileUrl || null,
        fileName: data.fileName || null,
        timestamp: data.timestamp,
        seen: false,
      });
      io.to(data.room).emit("receive_message", savedMessage);
    } catch (err) {
      console.error("Chat save error:", err);
    }
  });

  socket.on("message_seen", async ({ appointmentId, seenBy }) => {
    await ChatMessage.updateMany(
      { appointmentId, senderRole: { $ne: seenBy }, seen: false },
      { $set: { seen: true } }
    );
    io.to(appointmentId).emit("message_seen", { seenBy });
  });

  socket.on("typing", ({ room, senderRole }) => {
    socket.to(room).emit("typing", { senderRole });
  });

  socket.on("stop_typing", ({ room, senderRole }) => {
    socket.to(room).emit("stop_typing", { senderRole });
  });

  socket.on("disconnect", () => {
    console.log("DISCONNECTED:", socket.id);

    for (const room in onlineUsers) {
      for (const role in onlineUsers[room]) {
        if (onlineUsers[room][role] === socket.id) {
          delete onlineUsers[room][role];
          io.to(room).emit("online_status", {
            patient: !!onlineUsers[room]?.patient,
            doctor: !!onlineUsers[room]?.doctor,
          });
        }
      }
    }
  });
});

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json())

app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.use('/api/chat', chatRoutes)
app.use('/api/video',videoRoutes)
app.use('/api/contact',contactRouter)
app.use('/api/review', reviewRouter)

app.get('/', (req, res) => res.send('API working'))

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))


