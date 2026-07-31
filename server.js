const express = require("express");
const fs = require("fs");

const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server);


app.use(express.static("public"));



let users = {};

const file = "messages.json";


// загрузка сообщений

function loadMessages(){

    try{

        if(!fs.existsSync(file)){
            fs.writeFileSync(file,"[]");
        }


        let data = fs.readFileSync(file,"utf8");


        if(!data.trim()){
            return [];
        }


        return JSON.parse(data);


    }catch(e){

        console.log("Ошибка загрузки сообщений");
        return [];

    }

}



let messages = loadMessages();





// сохранение

function saveMessages(){

    fs.writeFileSync(
        file,
        JSON.stringify(messages,null,2)
    );

}





io.on("connection",(socket)=>{


console.log("Пользователь подключился");


// отправляем историю

socket.emit(
"old messages",
messages
);





// вход

socket.on("join",(nickname)=>{


if(!nickname || nickname.trim()==""){

nickname="Anonymous";

}


users[socket.id]=nickname;



io.emit("chat message",{

nick:"SERVER",

text:nickname+" вошёл в чат"

});


});






// сообщение

socket.on("chat message",(data)=>{


if(!data.text) return;



messages.push(data);



if(messages.length>100){

messages.shift();

}



saveMessages();



io.emit(
"chat message",
data
);



});







socket.on("disconnect",()=>{


let name=users[socket.id];


delete users[socket.id];



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


server.listen(PORT,()=>{

console.log(
"Сервер запущен: "+PORT
);

});