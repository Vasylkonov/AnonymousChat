const socket = io();


let nickname="";


const login = document.getElementById("login");
const chat = document.getElementById("chat");

const joinBtn = document.getElementById("joinBtn");
const sendBtn = document.getElementById("sendBtn");


const nickInput = document.getElementById("nickname");

const messageInput = document.getElementById("message");

const messages = document.getElementById("messages");



joinBtn.onclick = ()=>{


nickname = nickInput.value.trim();


if(nickname===""){

nickname="Anonymous";

}



socket.emit("join",nickname);



login.style.display="none";

chat.style.display="flex";


};





function sendMessage(){


let text = messageInput.value.trim();


if(text==="") return;



socket.emit("chat message",{


nick:nickname,

text:text


});



messageInput.value="";


}



sendBtn.onclick=sendMessage;



messageInput.addEventListener("keydown",(e)=>{


if(e.key==="Enter"){

sendMessage();

}


});





socket.on("chat message",(data)=>{


let div=document.createElement("div");


div.className="message";


if(typeof data==="object"){


div.innerHTML=
"<b>"+data.nick+
":</b> "+
data.text;


}else{


div.textContent=data;


}



messages.appendChild(div);


messages.scrollTop=messages.scrollHeight;


});