const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const fs = require("fs");

app.use(express.static("public"));


// пользователи
let users = {};


// файл сообщений
const messagesFile = "messages.json";


// если файла нет - создаём
if(!fs.existsSync(messagesFile)){
    fs.writeFileSync(messagesFile, JSON.stringify([]));
}


// загрузка сообщений
function loadMessages(){

    let data = fs.readFileSync(messagesFile);

    return JSON.parse(data);

}


// сохранение сообщений
function saveMessage(message){

    let messages = loadMessages();


    messages.push(message);


    // оставляем последние 100 сообщений
    if(messages.length > 100){
        messages.shift();
    }


    fs.writeFileSync(
        messagesFile,
        JSON.stringify(messages,null,2)
    );

}



io.on("connection",(socket)=>{


    console.log("Пользователь подключился");



    // отправляем историю новым игрокам
    socket.emit(
        "history",
        loadMessages()
    );



    // вход
    socket.on("join",(userData)=>{


        users[socket.id]={

            nick:userData.nick || "Anonymous",

            avatar:userData.avatar || "👤"

        };


        io.emit("users",users);



        let message={

            nick:"SERVER",
            avatar:"⚙️",
            text:
            users[socket.id].nick+
            " вошёл в чат"

        };


        saveMessage(message);


        io.emit(
            "chat message",
            message
        );


    });




    // сообщение
    socket.on("chat message",(text)=>{


        let user=users[socket.id];


        if(user){


            let message={

                nick:user.nick,

                avatar:user.avatar,

                text:text,

                time:new Date().toLocaleTimeString()

            };


            saveMessage(message);


            io.emit(
                "chat message",
                message
            );

        }


    });
socket.on("history",(messages)=>{

    messages.forEach((msg)=>{

        addMessage(msg);

    });

});
socket.on("history", (messages)=>{

    messages.forEach((msg)=>{

        showMessage(msg);

    });

});


socket.on("chat message",(msg)=>{

    showMessage(msg);

});



function showMessage(msg){

    let chat = document.getElementById("messages");


    let div = document.createElement("div");


    div.className = "message";


    div.innerHTML = `
        <b>${msg.avatar || "👤"} ${msg.nick}</b>: 
        ${msg.text}
    `;


    chat.appendChild(div);


    chat.scrollTop = chat.scrollHeight;

}




    // выход
    socket.on("disconnect",()=>{


        let user=users[socket.id];


        delete users[socket.id];


        io.emit("users",users);



        if(user){


            let message={

                nick:"SERVER",

                avatar:"⚙️",

                text:user.nick+
                " вышел из чата"

            };


            saveMessage(message);


            io.emit(
                "chat message",
                message
            );

        }


        console.log("Пользователь вышел");


    });


});





const PORT=process.env.PORT || 3000;


server.listen(PORT,()=>{

    console.log(
        "Сервер запущен: "+PORT
    );

});