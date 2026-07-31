const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));


let users = {};


// подключение пользователя
io.on("connection", (socket) => {

    console.log("Пользователь подключился");


    // вход в чат
    socket.on("join", (userData)=>{

        users[socket.id] = {
            nick: userData.nick || "Anonymous",
            avatar: userData.avatar || "👤"
        };


        // обновляем список пользователей
        io.emit("users", users);



        // сообщение сервера
        io.emit("chat message", {

            nick:"SERVER",
            avatar:"⚙️",
            text: users[socket.id].nick + " вошёл в чат"

        });


    });



    // сообщение
    socket.on("chat message", (msg)=>{


        let user = users[socket.id];


        if(user){

            io.emit("chat message", {

                nick:user.nick,
                avatar:user.avatar,
                text:msg

            });

        }


    });



    // выход
    socket.on("disconnect", ()=>{


        let user = users[socket.id];


        delete users[socket.id];


        io.emit("users", users);



        if(user){

            io.emit("chat message", {

                nick:"SERVER",
                avatar:"⚙️",
                text:user.nick + " вышел из чата"

            });

        }



        console.log("Пользователь отключился");


    });


});



const PORT = process.env.PORT || 3000;


server.listen(PORT, ()=>{

    console.log(
        "Сервер запущен на порту " + PORT
    );

});