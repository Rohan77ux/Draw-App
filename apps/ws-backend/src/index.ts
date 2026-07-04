console.log("🔥 WS BACKEND BOOTING");

import { WebSocket, WebSocketServer, RawData } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface UserConnection {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

let users: UserConnection[] = [];

function validateToken(token: string): string | null {
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded?.userId || null;
  } catch {
    return null;
  }
}

wss.on("connection", async function connection(ws: WebSocket, request) {
  console.log("🌐 WS CONNECTION HANDLER HIT");

  const url = request.url;
  if (!url) {
    ws.close(1008, "Invalid request");
    return;
  }

  const params = new URLSearchParams(url.split("?")[1]);
  const token = params.get("token") || "";

  const userId = validateToken(token);
  if (!userId) {
    ws.close(1008, "Invalid token");
    return;
  }

  console.log(`✅ Authenticated WebSocket user: ${userId}`);

  users.push({ userId, rooms: [], ws });

  ws.on("message", async (data: RawData) => {
    try {
      const parsed = JSON.parse(data.toString());

      if (!parsed?.roomId) {
        ws.send(
          JSON.stringify({ type: "error", message: "roomId is required" }),
        );
        return;
      }
      const roomId: string = String(parsed.roomId);

      // ---------- JOIN ROOM ----------
      if (parsed.type === "join_room") {
        console.log(`➡️ join_room request user=${userId} room=${roomId}`);
        const isCollaborator = await prismaClient.collaborator.findFirst({
          where: { roomId, userId },
        });
        const isAdmin = await prismaClient.room.findFirst({
          where: { id: roomId, adminId: userId },
        });
        if (!isCollaborator && !isAdmin) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "You are not allowed to join this room",
            }),
          );
          return;
        }
        const user = users.find((u) => u.ws === ws);
        if (user && !user.rooms.includes(roomId)) {
          user.rooms.push(roomId);
        }
        console.log(`👥 User ${userId} joined room ${roomId}`);
        return;
      }

      // ---------- LEAVE ROOM ----------
      if (parsed.type === "leave_room") {
        const user = users.find((u) => u.ws === ws);
        if (user) {
          user.rooms = user.rooms.filter((r) => r !== roomId);
        }
        console.log(`🏃 User ${userId} left room ${roomId}`);
        return;
      }

      // ---------- REORDER ----------
      // ---------- REORDER ----------
      if (parsed.type === "reorder") {
        const { order } = parsed;
        if (!order || !Array.isArray(order)) {
          ws.send(JSON.stringify({ type: "error", message: "Invalid order" }));
          return;
        }
        users.forEach((u) => {
          if (u.rooms.includes(roomId)) {
            u.ws.send(JSON.stringify({ type: "reorder", order, roomId }));
          }
        });
        console.log(`🔄 Reorder broadcasted to room ${roomId}`);
        return;
      }
      // ---------- CHAT (draw/erase/update) ----------
      if (parsed.type === "chat") {
        const { message } = parsed;
        console.log(`📨 Received chat message: ${message}`);

        // Erase
        let isErase = false;
        let eraseId: string | null = null;
        try {
          const msgObj = JSON.parse(message);
          if (msgObj.eraseId) {
            isErase = true;
            eraseId = msgObj.eraseId;
            console.log(`🧹 Erase detected for ID: ${eraseId}`);
          }
        } catch (e) {
          console.warn(`⚠️ Failed to parse message as JSON: ${message}`);
        }

        if (isErase && eraseId) {
          console.log(
            `🔍 Searching for shape with id ${eraseId} in room ${roomId}`,
          );
          const chat = await prismaClient.chat.findFirst({
            where: { roomId, message: { contains: `"id":"${eraseId}"` } },
          });
          if (chat) {
            await prismaClient.chat.delete({ where: { id: chat.id } });
            console.log(
              `✅ Deleted chat ${chat.id} containing shape ${eraseId}`,
            );
          } else {
            console.warn(`⚠️ No chat found with shape id ${eraseId}`);
          }
          users.forEach((u) => {
            if (u.rooms.includes(roomId)) {
              u.ws.send(JSON.stringify({ type: "chat", message, roomId }));
            }
          });
          console.log(`📡 Erase broadcasted to room ${roomId}`);
          return;
        }

        // Update
        let updateData: { id: string; [key: string]: any } | null = null;
        try {
          const msgObj = JSON.parse(message);
          if (msgObj.updateShape) {
            const payload = msgObj.updateShape;
            updateData = payload;
            console.log(`🔄 Update detected for shape id: ${payload.id}`);
          }
        } catch (e) {}

        if (updateData) {
          const chats = await prismaClient.chat.findMany({ where: { roomId } });
          let found = false;
          for (const chat of chats) {
            try {
              const chatData = JSON.parse(chat.message);
              if (chatData.shape && chatData.shape.id === updateData.id) {
                const updatedShape = { ...chatData.shape, ...updateData };
                await prismaClient.chat.update({
                  where: { id: chat.id },
                  data: { message: JSON.stringify({ shape: updatedShape }) },
                });
                console.log(
                  `✅ Updated chat ${chat.id} for shape ${updateData.id}`,
                );
                const broadcastMsg = JSON.stringify({
                  type: "chat",
                  message: JSON.stringify({ shape: updatedShape }),
                  roomId,
                });
                users.forEach((u) => {
                  if (u.rooms.includes(roomId)) {
                    u.ws.send(broadcastMsg);
                  }
                });
                found = true;
                break;
              }
            } catch (e) {
              console.error("Error parsing chat message:", e);
            }
          }
          if (!found) {
            console.warn(`⚠️ No chat found for shape id ${updateData.id}`);
          }
          return;
        }

        // Normal shape saving
        const dbUser = await prismaClient.user.findUnique({
          where: { id: userId },
        });
        if (!dbUser) {
          ws.send(
            JSON.stringify({ type: "error", message: "Unauthorized user" }),
          );
          return;
        }
        const dbRoom = await prismaClient.room.findUnique({
          where: { id: roomId },
        });
        if (!dbRoom) {
          ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
          return;
        }
        const isCollaborator = await prismaClient.collaborator.findFirst({
          where: { roomId, userId },
        });
        const isAdmin = dbRoom.adminId === userId;
        if (!isAdmin && !isCollaborator) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "You are not allowed to edit this room",
            }),
          );
          return;
        }
        await prismaClient.chat.create({ data: { roomId, message, userId } });
        console.log(`💬 Saved drawing for room ${roomId}`);
        users.forEach((u) => {
          if (u.rooms.includes(roomId)) {
            u.ws.send(JSON.stringify({ type: "chat", message, roomId }));
          }
        });
        console.log(`📡 Broadcasted drawing to room ${roomId}`);
        return;
      }
    } catch (err) {
      console.error("❌ WebSocket Error:", err);
      ws.send(
        JSON.stringify({ type: "error", message: "Invalid WebSocket request" }),
      );
    }
  });

  // Heartbeat
  const keepAlive = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "ping" }));
    }
  }, 25000);

  ws.on("close", () => {
    console.log(`❌ User disconnected: ${userId}`);
    users = users.filter((u) => u.ws !== ws);
    clearInterval(keepAlive);
  });
});

console.log("🚀 WebSocket Server running on ws://localhost:8080");
