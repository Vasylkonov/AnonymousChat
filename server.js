const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {};
let messages = [];

const file = "messages.json";


// загрузка сообщений
function loadMessages(){

    if(fs.existsSync(file)){

        try{

            let data = fs.readFileSync(file,"utf8");

            if(data.trim()){
                messages = JSON.parse(data);
            }

        }catch(e){

            console.log("Ошибка загрузки сообщений");
            messages = [];

        }

    }

}


// сохранение сообщений
function saveMessages(){

    fs.writeFileSync(
        file,
        JSON.stringify(messages,null,2)
    );

}


loadMessages();



io.on("connection",(socket)=>{


    console.log("Пользователь подключился");


    // вход
    socket.on("join",(nickname)=>{


        users[socket.id] = nickname || "Anonymous";


        socket.emit("old messages",messages);


        io.emit("users",Object.values(users));


        io.emit("chat message",{

            nick:"SERVER",
            text: users[socket.id]+" вошёл в чат"

        });


    });



    // сообщение
    socket.on("chat message",(msg)=>{


        let message={

            nick: users[socket.id] || "Anonymous",
            text: msg,
            time:new Date().toLocaleTimeString()

        };


        messages.push(message);


        // максимум 100 сообщений
        if(messages.length>100){

            messages.shift();

        }


        saveMessages();


        io.emit("chat message",message);


    });



    // выход
    socket.on("disconnect",()=>{


        let name=users[socket.id];


        delete users[socket.id];


        io.emit("users",Object.values(users));


        if(name){

            io.emit("chat message",{

                nick:"SERVER",
                text:name+" вышел из чата"

            });

        }


        console.log("Пользователь вышел");


    });


});



const PORT=process.env.PORT || 3000;


server.listen(PORT,()=>{

console.log("Сервер запущен:",PORT);

});