const express = require("express");

const app = express();


const server = require("http").createServer(app);


const io = require("socket.io")(server);



app.use(express.static("public"));



let users = {};

let messages = [];





io.on("connection",(socket)=>{


console.log("Пользователь подключился");



socket.emit("old messages", messages);





socket.on("join",(nickname)=>{


users[socket.id]=nickname;


io.emit("chat message",{

nick:"SERVER",

text:nickname+" вошёл в чат"

});


});






socket.on("chat message",(data)=>{


messages.push(data);



if(messages.length>100){

messages.shift();

}



io.emit("chat message",data);



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


console.log("Сервер запущен: "+PORT);


});