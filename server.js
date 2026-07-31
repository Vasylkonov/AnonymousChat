const express = require("express");
const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static("public"));

io.on("connection", (socket)=>{

    console.log("Пользователь подключился");

socket.on("chat message", (data)=>{
    io.emit("chat message", data);
});
    });

    socket.on("disconnect", ()=>{
        console.log("Пользователь вышел");
    });



const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=>{
    console.log("Сервер запущен на порту " + PORT);
});