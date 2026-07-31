const express = require("express");
const fs = require("fs");

const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server);


app.use(express.static("public"));



const USERS = "users.json";
const MESSAGES = "messages.json";



let users = [];
let messages = [];

let online = {};





function load(file){


try{


if(!fs.existsSync(file)){

fs.writeFileSync(file,"[]");

}


let data =
fs.readFileSync(file,"utf8");


return data ? JSON.parse(data) : [];



}catch(e){


console.log("Ошибка загрузки");

return [];

}


}






function save(file,data){


fs.writeFileSync(
file,
JSON.stringify(data,null,2)
);


}







users = load(USERS);

messages = load(MESSAGES);









function onlineList(){


return Object.values(online);


}










io.on("connection",(socket)=>{


console.log("Пользователь подключился");



socket.emit(
"old messages",
messages
);









// ======================
// РЕГИСТРАЦИЯ
// ======================


socket.on("register",(data)=>{


let exists =
users.find(
u=>u.login===data.login
);



if(exists){


socket.emit(
"register error",
"Логин занят"
);


return;


}





let user={


id:Date.now(),


login:data.login,


password:data.password,


avatar:
data.avatar ||
"https://api.dicebear.com/7.x/bottts/svg?seed="+data.login,


created:
new Date().toLocaleDateString(),


status:"Offline"


};





users.push(user);



save(
USERS,
users
);



socket.emit(
"register success"
);



});












// ======================
// ВХОД
// ======================


socket.on("login",(data)=>{



let user =
users.find(
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





user.status="Online";



online[socket.id]=user;



save(
USERS,
users
);





socket.emit(
"login success",
user
);





io.emit(
"users online",
onlineList()
);





io.emit(
"chat message",
{

nick:"SERVER",

text:user.login+" вошёл в чат",

time:""

}

);



});











// ======================
// СООБЩЕНИЯ
// ======================


socket.on(
"chat message",
(data)=>{


if(!data.text)return;



messages.push({

nick:data.nick,

text:data.text,

time:new Date().toLocaleTimeString()


});



if(messages.length>200){

messages.shift();

}



save(
MESSAGES,
messages
);



io.emit(
"chat message",
messages[messages.length-1]
);



});












// ======================
// ИЗМЕНЕНИЕ ПРОФИЛЯ
// ======================


socket.on(
"update profile",
(data)=>{


let user =
online[socket.id];



if(!user)return;





if(data.login){

user.login=data.login;

}



if(data.avatar){

user.avatar=data.avatar;

}




let index =
users.findIndex(
u=>u.id===user.id
);



if(index!==-1){

users[index]=user;

}



save(
USERS,
users
);





socket.emit(
"profile updated",
user
);



io.emit(
"users online",
onlineList()
);



});












// ======================
// СМЕНА ПАРОЛЯ
// ======================


socket.on(
"change password",
(pass)=>{


let user =
online[socket.id];



if(!user)return;



user.password=pass;



save(
USERS,
users
);



socket.emit(
"password changed"
);



});












// ======================
// ВЫХОД
// ======================


socket.on(
"logout",
()=>{


let user =
online[socket.id];


if(user){


user.status="Offline";


delete online[socket.id];


save(
USERS,
users
);



io.emit(
"users online",
onlineList()
);



}



});











// отключение
// ==========================
// ОБНОВЛЕНИЕ ПРОФИЛЯ
// ==========================

socket.on("update profile",(data)=>{


let oldLogin = users[socket.id];



if(!oldLogin){
    return;
}



// новый ник

if(data.login && data.login.trim() !== ""){

    users[socket.id] = data.login.trim();

}



// новый аватар

if(data.avatar && data.avatar.trim() !== ""){

    avatars[socket.id] = data.avatar.trim();

}




let user = {

    login: users[socket.id],

    avatar: avatars[socket.id],

    created: new Date().toLocaleDateString()

};




// отправляем обновлённый профиль

socket.emit(
"profile updated",
user
);




// обновляем онлайн список

io.emit(
"users online",
getUsers()
);




// сообщение в чат

io.emit(
"chat message",
{

nick:"SERVER",

text:
oldLogin+" изменил профиль"

}

);



});

socket.on(
"disconnect",
()=>{


let user =
online[socket.id];



if(user){


user.status="Offline";


delete online[socket.id];


save(
USERS,
users
);



io.emit(
"users online",
onlineList()
);



io.emit(
"chat message",
{

nick:"SERVER",

text:user.login+" вышел",

time:""

}

);



}



console.log(
"Пользователь отключился"
);



});



});









const PORT =
process.env.PORT || 3000;



server.listen(
PORT,
()=>{

console.log(
"Сервер запущен:",
PORT
);

});