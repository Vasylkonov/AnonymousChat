const socket = io();

const input = document.getElementById("message");
const messages = document.getElementById("messages");


function sendMessage(){

    let text = input.value;

    if(text.trim() !== ""){
        socket.emit("chat message", text);
        input.value="";
    }

}


socket.on("chat message", (msg)=>{

    let div = document.createElement("div");

    div.className="message";

    div.textContent=msg;

    messages.appendChild(div);

});