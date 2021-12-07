import express from "express";
import http from "http";
import WebSocket from "ws";
import { routes } from "./routes";
import { api } from "./services/api";

const app = express();

const port = 3333;
const server = http.createServer(app);
const wss = new WebSocket.Server({ port: 3000 });

let ws: WebSocket;

wss.on("connection", function connection(socket, req) {
  ws = socket;

  ws.on("message", async function message(data: WebSocket.RawData) {
    let message = "";

    if (req.headers["user-agent"] !== undefined) {
      message = `Desconhecido: ${data.toString()}`;
    } else {
      message = data.toString();
    }

    const date = new Date().toLocaleString("pt-br", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    const time = new Date().toLocaleString("pt-br", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const author = message.split(":")[0];
    const messageContent = message.split(":")[1];

    const content = {
      author: author.trim(),
      message: messageContent.trim(),
      date: `${date}, ás ${time}`,
    };

    console.log(message);
    await api.post("/messages", content);

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});

app.use(express.json());
app.use(routes);

server.listen(port, () => console.log(`Server is running on port ${port}`));
