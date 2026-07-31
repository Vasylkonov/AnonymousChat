const express = require("express");
const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static("public"));


let users = {};


io.on("connection", (socket)=>{

    console.log("Пользователь подключился");


    socket.on("join", (nickname)=>{

        users[socket.id] = nickname || "Anonymous";


        io.emit("users", users);


        io.emit("chat message", {
            nick:"SERVER",
            text: users[socket.id] + " вошёл в чат"
        });

    });



    socket.on("chat message", (data)=>{

        io.emit("chat message", data);

    });



    socket.on("disconnect", ()=>{


        let name = users[socket.id];


        delete users[socket.id];


        io.emit("users", users);


        if(name){

            io.emit("chat message", {

                nick:"SERVER",
                text:name + " вышел из чата"

            });

        }


        console.log("Пользователь вышел");

    });


});



const PORT = process.env.PORT || 3000;


server.listen(PORT, ()=>{

    console.log("Сервер запущен на порту " + PORT);

});