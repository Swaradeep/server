const web_socket = require("ws");

const wss = new web_socket.Server({ port: 8081 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: ", message);
    ws.send("Hello, you sent -> " + message);
  });

  ws.send("Hi there, I am a WebSocket server");
});

console.log("WebSocket server is running on port 8080");

exports.wss = wss;
