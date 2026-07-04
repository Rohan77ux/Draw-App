import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
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
          return messageData.shape ?? null;
        } catch (error) {
          console.error("Error parsing message:", x.message, error);
          return null;
        }
      })
      .filter((shape: unknown) => shape !== null);
  } catch (error) {
    console.error("Error fetching existing shapes:", error);
    return [];
  }
}
