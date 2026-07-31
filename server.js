const express = require("express");
const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static("public"));

io.on("connection", (socket) => {

    console.log("Пользователь подключился");

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
        console.log("Пользователь вышел");
    });

});


const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log("Сервер запущен на порту " + PORT);
});