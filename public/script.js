const socket = io();

let nickname = "";


const login = document.getElementById("login");
const chat = document.getElementById("chat");

const joinBtn = document.getElementById("joinBtn");
const sendBtn = document.getElementById("sendBtn");

const nicknameInput = document.getElementById("nickname");
const messageInput = document.getElementById("message");

const messages = document.getElementById("messages");



// вход в чат

joinBtn.addEventListener("click", ()=>{


nickname = nicknameInput.value.trim();


if(nickname === ""){
    nickname = "Anonymous";
}


socket.emit("join", nickname);


login.style.display="none";
chat.style.display="block";


});





// отправка сообщения

sendBtn.addEventListener("click", sendMessage);



function sendMessage(){


let text = messageInput.value.trim();


if(text==="") return;



socket.emit("chat message", {

nick:nickname,
text:text

});


messageInput.value="";


}





// Enter отправка

messageInput.addEventListener("keydown",(e)=>{


if(e.key==="Enter"){
sendMessage();
}


});





// получение сообщений

socket.on("chat message",(data)=>{


let div=document.createElement("div");


div.className="message";


div.innerHTML =
"<b>"+data.nick+
":</b> "+
data.text;



messages.appendChild(div);


messages.scrollTop=messages.scrollHeight;


});