import { Router } from "express";
import { ChatController } from "./controllers/ChatController";

const routes = Router();
const chatController = new ChatController();

routes.get("/messages", chatController.listMessages);
routes.post("/message", chatController.sendMessage);
routes.delete("/message/:id", chatController.deleteMessage);

export { routes };
