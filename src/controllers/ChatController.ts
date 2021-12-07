import { Request, Response } from "express";
import WebSocket from "ws";
import { api } from "../services/api";

interface IData {
  author: string;
  message: string;
  date: string;
}

interface IRequest {
  author: string;
  message: string;
}

class ChatController {
  async listMessages(req: Request, res: Response) {
    try {
      const { data } = await api.get("/messages");

      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }

  async sendMessage(req: Request, res: Response) {
    const { author, message } = req.body as IRequest;

    if (!author) return res.status(404).json({ warning: "Identifique-se!" });

    let ws = new WebSocket("ws://localhost:3000");

    const content = `${author}: ${message}`;

    try {
      ws.onopen = (e) => {
        ws.send(content);
      };

      return res.json({ message, author });
    } catch (error) {
      console.log("Erro: ", error);
      return res.status(500).send(error);
    }
  }

  async deleteMessage(req: Request, res: Response) {
    const { id } = req.params;
    const { author } = req.headers;

    if (!author)
      return res.status(404).json({ warning: "Insira o autor no header!" });

    try {
      const { data } = await api.get<IData>(`/messages/${id}`);

      if (data.author !== author) {
        return res
          .status(404)
          .json({ warning: "Você só pode excluir mensagens próprias!" });
      }

      await api.delete(`/messages/${id}`);

      return res.json({ success: true });
    } catch (error) {
      console.log(error);
    }
  }
}

export { ChatController };
