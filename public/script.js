const socket = io();



let currentUser = null;



// элементы

const auth = document.getElementById("auth");
const chat = document.getElementById("chat");


const login = document.getElementById("login");
const password = document.getElementById("password");
const avatar = document.getElementById("avatar");


const info = document.getElementById("info");


const messages = document.getElementById("messages");
const users = document.getElementById("users");


const message = document.getElementById("message");



const myAvatar = document.getElementById("myAvatar");
const myName = document.getElementById("myName");
const myDate = document.getElementById("myDate");



const settings = document.getElementById("settings");







// ========================
// РЕГИСТРАЦИЯ
// ========================


document
.getElementById("registerBtn")
.onclick = ()=>{


socket.emit("register",{

login:login.value.trim(),

password:password.value,

avatar:avatar.value.trim()

});


};






socket.on(
"register success",
()=>{


info.innerHTML="✅ Аккаунт создан";


});






socket.on(
"register error",
(text)=>{


info.innerHTML="❌ "+text;


});









// ========================
// ВХОД
// ========================


document
.getElementById("loginBtn")
.onclick = ()=>{


socket.emit("login",{


login:login.value.trim(),


password:password.value


});


};








socket.on(
"login success",
(user)=>{


currentUser=user;


auth.style.display="none";


chat.style.display="flex";


updateProfile();



});









socket.on(
"login error",
(text)=>{


info.innerHTML="❌ "+text;


});









// ========================
// ПРОФИЛЬ
// ========================



function updateProfile(){


if(!currentUser)return;



myAvatar.src=currentUser.avatar;


myName.innerHTML=currentUser.login;


myDate.innerHTML=
"📅 "+currentUser.created;





document.getElementById(
"profileAvatar"
).src=currentUser.avatar;



document.getElementById(
"profileName"
).innerHTML=currentUser.login;



document.getElementById(
"profileDate"
).innerHTML=
"📅 "+currentUser.created;



}











// открыть профиль


document
.getElementById("editBtn")
.onclick=()=>{


settings.style.display="flex";



document.getElementById(
"newLogin"
).value=currentUser.login;



document.getElementById(
"newAvatar"
).value=currentUser.avatar;



};









// закрыть


document
.getElementById("closeSettings")
.onclick=()=>{


settings.style.display="none";


};









// сохранить профиль


document
.getElementById("saveProfile")
.onclick=()=>{


socket.emit(
"update profile",
{


login:
document.getElementById("newLogin").value,


avatar:
document.getElementById("newAvatar").value


});


};







socket.on(
"profile updated",
(user)=>{


currentUser=user;


updateProfile();


settings.style.display="none";


});











// ========================
// ПАРОЛЬ
// ========================



document
.getElementById("changePassword")
.onclick=()=>{


let pass=
document.getElementById(
"newPassword"
).value;



if(pass.length<3)return;



socket.emit(
"change password",
pass
);



};







socket.on(
"password changed",
()=>{


alert(
"Пароль изменён"
);


});











// ========================
// ВЫХОД
// ========================


document
.getElementById("logout")
.onclick=()=>{


socket.emit("logout");


location.reload();


};











// ========================
// ЧАТ
// ========================



document
.getElementById("sendBtn")
.onclick=sendMessage;





message.addEventListener(
"keydown",
(e)=>{


if(e.key==="Enter"){

sendMessage();

}


});







function sendMessage(){


let text =
message.value.trim();



if(!text)return;



socket.emit(
"chat message",
{


nick:currentUser.login,

text:text


}
);



message.value="";


}









function addMessage(data){


let div=document.createElement("div");


div.className="message";



div.innerHTML=`

<b>${data.nick}</b>

:

${data.text}

<br>

<small>
${data.time || ""}
</small>

`;



messages.appendChild(div);



messages.scrollTop=
messages.scrollHeight;


}








socket.on(
"chat message",
(data)=>{


addMessage(data);


});








socket.on(
"old messages",
(list)=>{


messages.innerHTML="";


list.forEach(
m=>addMessage(m)
);


});









// ========================
// ОНЛАЙН
// ========================


socket.on(
"users online",
(list)=>{


users.innerHTML=
"<h3>🟢 Онлайн</h3>";



list.forEach(
u=>{


users.innerHTML+=`

<div class="user">

<img src="${u.avatar}">

${u.login}

</div>

`;


});


});