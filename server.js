const express = require("express");
const { WebSocketServer } = require("ws");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(path.join(__dirname, "public")));

let rooms = {};

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    let data = {};
    try {
      data = JSON.parse(message);
    } catch (err) {
      return;
    }

    const { type, room, payload } = data;

    if (type === "join") {
      if (!rooms[room]) rooms[room] = [];
      rooms[room].push(ws);
      if (rooms[room].length === 2) {
        rooms[room].forEach((client) =>
          client.send(JSON.stringify({ type: "ready" }))
        );
      }
    }

    if (type === "signal") {
      rooms[room]?.forEach((client) => {
        if (client !== ws)
          client.send(JSON.stringify({ type: "signal", payload }));
      });
    }

    ws.on("close", () => {
      rooms[room] = rooms[room]?.filter((c) => c !== ws);
    });
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log("✅ Server running on port " + port));    if (type === "signal") {
      rooms[room]?.forEach((client) => {
        if (client !== ws)
          client.send(JSON.stringify({ type: "signal", payload }));
      });
    }

    ws.on("close", () => {
      rooms[room] = rooms[room]?.filter((c) => c !== ws);
    });
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log("Server running on port " + port));
