import { io } from "socket.io-client";

export const socket = io("https://housiehub-admin.vercel.app", {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
});