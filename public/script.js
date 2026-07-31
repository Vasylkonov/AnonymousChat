const socket = io();

let nickname = "";


const login = document.getElementById("login");
const chat = document.getElementById("chat");


const messages = document.getElementById("messages");



// РЕГИСТРАЦИЯ

async function register(){


let loginName = document.getElementById("loginName").value;

let password = document.getElementById("loginPass").value;



let response = await fetch("/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

login:loginName,

password:password

})


});



let data = await response.json();


alert(data.message || "Готово");


}




// ВХОД

async function loginUser(){


let loginName = document.getElementById("loginName").value;

let password = document.getElementById("loginPass").value;



let response = await fetch("/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

login:loginName,

password:password

})


});



let data = await response.json();



if(data.success){


nickname=data.login;


document.getElementById("login").style.display="none";

document.getElementById("chat").style.display="flex";


socket.emit("join",nickname);



}else{


alert(data.message);


}


}




// ОТПРАВКА СООБЩЕНИЯ

function sendMessage(){


let input=document.getElementById("message");


let text=input.value.trim();



if(text==="") return;



socket.emit("chat message",{

nick:nickname,

text:text

});



input.value="";


}




document.getElementById("sendBtn").onclick=sendMessage;



document.getElementById("message").addEventListener("keydown",(e)=>{


if(e.key==="Enter"){

sendMessage();

}


});






socket.on("chat message",(data)=>{


let div=document.createElement("div");


div.className="message";


div.innerHTML=
"<b>"+data.nick+"</b>: "+data.text;



messages.appendChild(div);


messages.scrollTop=messages.scrollHeight;


});