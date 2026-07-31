const socket=io();



let nickname="";



const auth=document.getElementById("auth");

const chat=document.getElementById("chat");


const login=document.getElementById("login");

const password=document.getElementById("password");


const info=document.getElementById("info");



const messages=document.getElementById("messages");

const users=document.getElementById("users");


const message=document.getElementById("message");





document.getElementById("register").onclick=()=>{


socket.emit(
"register",
{

login:login.value,

password:password.value

}

);


};






socket.on(
"register success",
()=>{

info.innerHTML="Регистрация успешна";

});



socket.on(
"register error",
(msg)=>{

info.innerHTML=msg;

});








document.getElementById("enter").onclick=()=>{


socket.emit(
"login",
{

login:login.value,

password:password.value

}

);


};






socket.on(
"login success",
(name)=>{


nickname=name;


auth.style.display="none";

chat.style.display="block";


});




socket.on(
"login error",
(msg)=>{

info.innerHTML=msg;

});








document.getElementById("send").onclick=sendMessage;



function sendMessage(){


let text=message.value.trim();


if(!text)return;


socket.emit(
"chat message",
{

nick:nickname,

text:text

}

);


message.value="";


}






socket.on(
"chat message",
(data)=>{


let div=document.createElement("div");


div.innerHTML=

"<b>"+data.nick+
":</b> "+
data.text;


messages.appendChild(div);


});






socket.on(
"old messages",
(list)=>{


list.forEach(data=>{


let div=document.createElement("div");


div.innerHTML=

"<b>"+data.nick+
":</b> "+
data.text;


messages.appendChild(div);


});


});







socket.on(
"users online",
(list)=>{


users.innerHTML="";


list.forEach(u=>{


let div=document.createElement("div");


div.innerHTML=

`
<img width="35" src="${u.avatar}">
${u.nick}
`;



users.appendChild(div);



});


});