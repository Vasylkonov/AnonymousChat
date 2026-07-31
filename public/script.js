const socket = io();
const loginBtn=document.getElementById("loginBtn");

const registerBtn=document.getElementById("registerBtn");


let nickname="";



registerBtn.onclick=function(){


let login=document.getElementById("loginName").value;

let password=document.getElementById("loginPass").value;



socket.emit("register",{

login:login,

password:password

});


};





loginBtn.onclick=function(){


let login=document.getElementById("loginName").value;

let password=document.getElementById("loginPass").value;



socket.emit("login",{

login:login,

password:password

});


};





socket.on("registerSuccess",(msg)=>{

alert(msg);

});



socket.on("registerError",(msg)=>{

alert(msg);

});



socket.on("loginSuccess",(name)=>{


nickname=name;


document.getElementById("login").style.display="none";


document.getElementById("chat").style.display="block";


});



socket.on("loginError",(msg)=>{

alert(msg);

});



let nickname = "Anonymous";


const login = document.getElementById("login");
const chat = document.getElementById("chat");

const joinBtn = document.getElementById("joinBtn");
const sendBtn = document.getElementById("sendBtn");


const nicknameInput = document.getElementById("nickname");
const messageInput = document.getElementById("message");

const messages = document.getElementById("messages");



// вход в чат

joinBtn.addEventListener("click", function(){

    nickname = nicknameInput.value.trim();


    if(nickname === ""){
        nickname = "Anonymous";
    }


    socket.emit("join", nickname);


    login.style.display = "none";
    chat.style.display = "block";


});




// отправка сообщения

function sendMessage(){


    let text = messageInput.value.trim();


    if(text === ""){
        return;
    }


    socket.emit("chat message", {

        nick:nickname,

        text:text

    });


    messageInput.value="";


}



sendBtn.addEventListener("click", sendMessage);



messageInput.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        sendMessage();

    }

});




// получение сообщений


socket.on("chat message", function(data){


    let div=document.createElement("div");


    div.className="message";


    if(typeof data === "object"){


        div.innerHTML =
        "<b>"+data.nick+"</b>: "+data.text;


    }else{


        div.textContent=data;


    }


    messages.appendChild(div);


    messages.scrollTop = messages.scrollHeight;


});




// старые сообщения


socket.on("old messages", function(list){


    list.forEach(function(data){


        let div=document.createElement("div");


        div.className="message";


        div.innerHTML =
        "<b>"+data.nick+"</b>: "+data.text;


        messages.appendChild(div);


    });


});