const socket = io();


let currentUser = null;



// элементы

const auth = document.getElementById("auth");
const chat = document.getElementById("chat");


const loginInput = document.getElementById("login");
const passwordInput = document.getElementById("password");
const avatarInput = document.getElementById("avatar");


const info = document.getElementById("info");


const messagesBox = document.getElementById("messages");
const usersBox = document.getElementById("users");


const messageInput = document.getElementById("message");



const myAvatar = document.getElementById("myAvatar");
const myName = document.getElementById("myName");
const myDate = document.getElementById("myDate");



const settings = document.getElementById("settings");



console.log("script.js загружен");






// =====================
// РЕГИСТРАЦИЯ
// =====================


const registerBtn =
document.getElementById("registerBtn");


if(registerBtn){

registerBtn.onclick = ()=>{


socket.emit("register",{


login:loginInput.value.trim(),

password:passwordInput.value,

avatar:avatarInput.value.trim()


});


};


}







socket.on("register success",()=>{


info.innerHTML="✅ Регистрация успешна";


});



socket.on("register error",(text)=>{


info.innerHTML="❌ "+text;


});









// =====================
// ВХОД
// =====================



const loginBtn =
document.getElementById("loginBtn");



if(loginBtn){


loginBtn.onclick=()=>{


socket.emit("login",{


login:loginInput.value.trim(),

password:passwordInput.value


});


};


}








socket.on("login success",(user)=>{


currentUser=user;



auth.style.display="none";


chat.style.display="flex";



showProfile();



});







socket.on("login error",(text)=>{


info.innerHTML="❌ "+text;


});









// =====================
// ПРОФИЛЬ
// =====================


function showProfile(){


if(!currentUser)return;



myAvatar.src=currentUser.avatar;


myName.innerHTML=currentUser.login;


myDate.innerHTML=
"📅 "+currentUser.created;



}









// кнопка профиль


const editBtn =
document.getElementById("editBtn");



if(editBtn){


editBtn.onclick=()=>{


console.log("Профиль открыт");


settings.style.display="block";



document.getElementById("newLogin").value =
currentUser.login;



document.getElementById("newAvatar").value =
currentUser.avatar;



};


}











// закрыть профиль


const closeSettings =
document.getElementById("closeSettings");



if(closeSettings){


closeSettings.onclick=()=>{


settings.style.display="none";


};


}










// сохранить профиль


const saveProfile =
document.getElementById("saveProfile");



if(saveProfile){


saveProfile.onclick=()=>{


socket.emit(
"update profile",
{


login:
document.getElementById("newLogin").value,


avatar:
document.getElementById("newAvatar").value


});


};


}







socket.on("profile updated",(user)=>{


currentUser=user;


showProfile();


settings.style.display="none";


});









// =====================
// СООБЩЕНИЯ
// =====================


const sendBtn =
document.getElementById("sendBtn");



if(sendBtn){


sendBtn.onclick=sendMessage;


}





function sendMessage(){


let text =
messageInput.value.trim();



if(!text)return;



socket.emit(
"chat message",
{


nick:currentUser.login,

text:text


}
);



messageInput.value="";


}








messageInput.addEventListener(
"keydown",
(e)=>{


if(e.key==="Enter"){


sendMessage();


}


});









function addMessage(data){



let div=document.createElement("div");


div.className="message";



div.innerHTML=`

<b>${data.nick}</b>: 
${data.text}

<br>

<small>
${data.time || ""}
</small>

`;



messagesBox.appendChild(div);



messagesBox.scrollTop =
messagesBox.scrollHeight;



}








socket.on("chat message",(data)=>{


addMessage(data);


});







socket.on("old messages",(list)=>{


messagesBox.innerHTML="";


list.forEach(
m=>addMessage(m)
);


});









// =====================
// ОНЛАЙН
// =====================


socket.on("users online",(list)=>{


if(!usersBox)return;



usersBox.innerHTML=
"<h3>🟢 Онлайн</h3>";



list.forEach(user=>{


usersBox.innerHTML += `

<div class="user">

<img src="${user.avatar}">

<span>${user.login}</span>

</div>

`;


});


});