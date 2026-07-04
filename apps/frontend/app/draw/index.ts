import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Canvas context is not available.");
    return () => {};
  }

  let existingShapes: Shape[] = await getExistingShapes(roomId);

  const handleSocketMessage = (e: MessageEvent) => {
    try {
      const message = JSON.parse(e.data);
      if (
        message.type === "chat" &&
        message.roomId === roomId &&
        message.message
      ) {
        const parsedShape = JSON.parse(message.message);
        if (parsedShape?.shape) {
          existingShapes.push(parsedShape.shape);
          clearCanvas(existingShapes, canvas, ctx);
        }
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };
  socket.addEventListener("message", handleSocketMessage);

  clearCanvas(existingShapes, canvas, ctx);

  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let rect = canvas.getBoundingClientRect();

  const handleMouseDown = (e: MouseEvent) => {
    isDrawing = true;
    rect = canvas.getBoundingClientRect(); // cache once per drag
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDrawing) return;
    isDrawing = false;

    const currX = e.clientX - rect.left;
    const currY = e.clientY - rect.top;
    const width = currX - startX;
    const height = currY - startY;

    const selectedTool = (window as any).selectedTool;
    let shape: Shape | null = null;

    if (selectedTool === "rect") {
      shape = { type: "rect", x: startX, y: startY, width, height };
    } else if (selectedTool === "circle") {
      const radius = Math.abs(Math.max(Math.abs(width), Math.abs(height)) / 2);
      shape = {
        type: "circle",
        radius,
        centerX: startX + (width < 0 ? -radius : radius),
        centerY: startY + (height < 0 ? -radius : radius),
      };
    }

    if (!shape) return;
    existingShapes.push(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId,
      }),
    );
    clearCanvas(existingShapes, canvas, ctx);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;

    const currX = e.clientX - rect.left;
    const currY = e.clientY - rect.top;
    const width = currX - startX;
    const height = currY - startY;

    clearCanvas(existingShapes, canvas, ctx);
    ctx.strokeStyle = "rgba(255, 255, 255)";

    const selectedTool = (window as any).selectedTool;
    if (selectedTool === "rect") {
      ctx.strokeRect(startX, startY, width, height);
    } else if (selectedTool === "circle") {
      const radius = Math.abs(Math.max(Math.abs(width), Math.abs(height)) / 2);
      const centerX = startX + (width < 0 ? -radius : radius);
      const centerY = startY + (height < 0 ? -radius : radius);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);

  // Return a cleanup function — call this from your useEffect's return
  return () => {
    socket.removeEventListener("message", handleSocketMessage);
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mousemove", handleMouseMove);
  };
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.forEach((shape) => {
    if (!shape || !shape.type) return;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 255, 255)";

    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  });
}

async function getExistingShapes(roomId: string): Promise<Shape[]> {
  try {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;

    if (!Array.isArray(messages)) {
      console.warn("Unexpected API response format.");
      return [];
    }

    return messages
      .map((x: { message: string }) => {
        try {
          const messageData = JSON.parse(x.message);
          return messageData.shape || null;
        } catch (error) {
          console.error("Error parsing message:", x.message, error);
          return null;
        }
      })
      .filter((shape): shape is Shape => shape !== null);
  } catch (error) {
    console.error("Error fetching shapes:", error);
    return [];
  }
}
