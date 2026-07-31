const express = require("express");
const fs = require("fs");

const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server);


app.use(express.static("public"));



let users = {};
let avatars = {};

const file = "messages.json";



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

        console.log("Ошибка файла сообщений");
        return [];

    }

}



let messages = loadMessages();





function saveMessages(){

    fs.writeFileSync(
        file,
        JSON.stringify(messages,null,2)
    );

}





function getUsers(){

    let list=[];


    for(let id in users){

        list.push({

            nick: users[id],
            avatar: avatars[id]

        });

    }


    return list;

}





io.on("connection",(socket)=>{


console.log("Пользователь подключился");



// отправляем историю

socket.emit(
"old messages",
messages
);





// вход пользователя

socket.on("join",(nickname)=>{


if(!nickname || nickname.trim()==""){

nickname="Anonymous";

}



users[socket.id]=nickname;



avatars[socket.id] =
"https://api.dicebear.com/7.x/bottts/svg?seed="+nickname;





io.emit(
"users online",
getUsers()
);





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







// выход

socket.on("disconnect",()=>{


let name = users[socket.id];



delete users[socket.id];

delete avatars[socket.id];



io.emit(
"users online",
getUsers()
);




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