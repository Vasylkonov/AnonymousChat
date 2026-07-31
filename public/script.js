const socket = io();


let nick = "";



const login = document.getElementById("login");
const chat = document.getElementById("chat");

const nickname = document.getElementById("nickname");

const message = document.getElementById("message");

const messages = document.getElementById("messages");





document.getElementById("joinBtn").onclick = function(){


    nick = nickname.value.trim();


    if(nick === ""){
        nick = "Anonymous";
    }


    socket.emit("join", nick);


    login.style.display = "none";

    chat.style.display = "block";


};






document.getElementById("sendBtn").onclick = function(){


    let text = message.value.trim();


    if(text === ""){
        return;
    }



    socket.emit("chat message", {

        nick:nick,

        text:text

    });



    message.value="";


};







message.addEventListener("keydown", function(e){


    if(e.key === "Enter"){

        document.getElementById("sendBtn").click();

    }


});







socket.on("chat message", function(data){


    addMessage(data);


});






socket.on("old messages", function(data){


    data.forEach(addMessage);


});







function addMessage(data){


    let div = document.createElement("div");


    div.className="message";


    div.innerHTML = 
    "<b>"+data.nick+"</b>: "+data.text;



    messages.appendChild(div);



    messages.scrollTop = messages.scrollHeight;


}