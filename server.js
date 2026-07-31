const express = require("express");
const fs = require("fs");

const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server);


app.use(express.static("public"));



const messagesFile="messages.json";
const usersFile="users.json";


let messages=[];
let accounts=[];


let online={};





function load(file){

try{

if(!fs.existsSync(file)){
fs.writeFileSync(file,"[]");
}


let data=fs.readFileSync(file,"utf8");


if(!data.trim()){
return [];
}


return JSON.parse(data);


}catch(e){

return [];

}

}




function save(file,data){

fs.writeFileSync(
file,
JSON.stringify(data,null,2)
);

}





messages=load(messagesFile);

accounts=load(usersFile);







io.on("connection",(socket)=>{


console.log("Пользователь подключился");





// регистрация


socket.on("register",(data)=>{


let check=accounts.find(
u=>u.login===data.login
);



if(check){

socket.emit(
"register error",
"Такой логин уже существует"
);


return;

}



accounts.push({

login:data.login,

password:data.password

});



save(
usersFile,
accounts
);



socket.emit(
"register success"
);



});








// вход


socket.on("login",(data)=>{


let user=accounts.find(
u=>
u.login===data.login &&
u.password===data.password
);



if(!user){


socket.emit(
"login error",
"Неверный логин или пароль"
);


return;

}



online[socket.id]={


nick:user.login,


avatar:
"https://api.dicebear.com/7.x/bottts/svg?seed="+user.login


};




socket.emit(
"login success",
user.login
);



socket.emit(
"old messages",
messages
);



io.emit(
"users online",
Object.values(online)
);



});










// сообщения


socket.on("chat message",(data)=>{


messages.push(data);


if(messages.length>100){

messages.shift();

}


save(
messagesFile,
messages
);



io.emit(
"chat message",
data
);


});








// выход


socket.on("disconnect",()=>{


delete online[socket.id];



io.emit(
"users online",
Object.values(online)
);



console.log("Пользователь вышел");


});




});








const PORT=process.env.PORT || 3000;


server.listen(PORT,()=>{


console.log(
"Сервер запущен: "+PORT
);


});