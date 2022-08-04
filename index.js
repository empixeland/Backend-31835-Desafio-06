const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");

const arr = [
  {
    title: "Guitar Stratocaster",
    price: 100,
    thumbnail:
      "Url de la foto del producto",
    id: 1,
  },
  {
    title: "Guitar Telecaster",
    price: 120,
    thumbnail:
      "url de la foto del producto",
    id: 2,
  },
  {
    title: "Guitar Jazz Master",
    price: 150,
    thumbnail:
      "url de la foto del producto",
    id: 3,
  },
  {
    title: "Bass Jazz",
    price: 110,
    thumbnail:
      "url de la foto del producto",
    id: 4,
  },
  {
    title: "Bass Presicion",
    price: 140,
    thumbnail:
      "url de la foto del producto",
    id: 5,
  },
];


const msgs = [];

app.use(express.static(__dirname + "/public"));

server.listen(4000, () => {
  console.log("Servidor corriendo en:" + PORT);
});

app.use(express.json());
io.on("connection", (socket) => {
  console.log("Un usuario entró con exito");

  socket.emit("msg_back", msgs);

  socket.emit("data_ready", arr);

  socket.on("data_client", (data) => {
    msgs.push(data);

    io.sockets.emit("msg_back", msgs);

    fs.unlink("chatlog.txt", (err) => {
      if (err) throw "Error al eliminar";
    });
    fs.writeFile("chatlog.txt", "", "utf-8", (err) => {
      if (err) throw "Error al crear un nuevo producto";
    });
    fs.appendFile("chatlog.txt", JSON.stringify(msgs), "utf-8", (err) => {
      if (err) throw "Error error";

      console.log("Agregado exitosamente");
    });
  });

  socket.on("data_array", (data) => {
    arr.push(data);
    io.sockets.emit("data_ready", arr);
  });

  //Routes
});
app.get("/", (req, res) => {
  res.sendFile("index.html");
});