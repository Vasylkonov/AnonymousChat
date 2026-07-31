const socket = io();



let nickname="";



const auth=document.getElementById("auth");
const chat=document.getElementById("chat");


const loginInput=document.getElementById("login");
const passwordInput=document.getElementById("password");


const info=document.getElementById("info");


const messages=document.getElementById("messages");

const users=document.getElementById("users");


const message=document.getElementById("message");





document.getElementById("registerBtn").onclick=function(){


socket.emit("register",{

login:loginInput.value,

password:passwordInput.value

});


};






document.getElementById("loginBtn").onclick=function(){


socket.emit("login",{

login:loginInput.value,

password:passwordInput.value

});


};






socket.on("register success",()=>{


info.innerHTML="✅ Регистрация успешна";


});




socket.on("register error",(text)=>{


info.innerHTML="❌ "+text;


});






socket.on("login success",(name)=>{


nickname=name;


auth.style.display="none";


chat.style.display="block";


});






socket.on("login error",(text)=>{


info.innerHTML="❌ "+text;


});








document.getElementById("sendBtn").onclick=function(){


let text=message.value.trim();


if(!text)return;



socket.emit("chat message",{

nick:nickname,

text:text

});



message.value="";


};








socket.on("chat message",(data)=>{


let div=document.createElement("div");


div.innerHTML=
"<b>"+data.nick+
":</b> "+
data.text;


messages.appendChild(div);


});







socket.on("old messages",(list)=>{


list.forEach(data=>{


let div=document.createElement("div");


div.innerHTML=
"<b>"+data.nick+
":</b> "+
data.text;


messages.appendChild(div);


});


});







socket.on("users online",(list)=>{


users.innerHTML="🟢 Онлайн:<br>";



list.forEach(user=>{


users.innerHTML+=
`
<img width="35" src="${user.avatar}">
${user.nick}<br>
`;



});


});