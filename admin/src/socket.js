import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: true,      // ✅ let it connect once
  transports: ["websocket"], // ✅ prevent polling reconnects
});

export default socket;