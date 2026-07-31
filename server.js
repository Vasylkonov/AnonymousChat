const express = require("express");
const app = express();

const http = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(http);

app.use(express.static("public"));

let users = {};
let messages = [];


io.on("connection", (socket)=>{

    console.log("Пользователь подключился");


    // отправляем старые сообщения
    socket.emit("old messages", messages);



    socket.on("join", (nickname)=>{

        users[socket.id] = nickname || "Anonymous";


        io.emit("users", users);


        io.emit("chat message", {
            nick:"SERVER",
            text: users[socket.id] + " вошёл в чат"
        });

    });



    socket.on("chat message", (data)=>{


        if(!data.text) return;


        let msg = {
            nick:data.nick || "Anonymous",
            text:data.text
        };


        messages.push(msg);


        // максимум 100 сообщений
        if(messages.length > 100){
            messages.shift();
        }


        io.emit("chat message", msg);


    });



    socket.on("disconnect", ()=>{


        let name = users[socket.id];


        delete users[socket.id];


        io.emit("users", users);



        if(name){

            io.emit("chat message",{
                nick:"SERVER",
                text:name+" вышел из чата"
            });

        }


        console.log("Пользователь отключился");

    });


});



const PORT = process.env.PORT || 3000;


http.listen(PORT, ()=>{

console.log("Сервер запущен: "+PORT);
 
}); 