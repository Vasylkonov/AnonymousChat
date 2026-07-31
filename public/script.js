const socket = io();


let currentUser = null;



// ======================
// ЭЛЕМЕНТЫ
// ======================


const auth = document.getElementById("auth");
const chat = document.getElementById("chat");


const loginInput = document.getElementById("login");
const passwordInput = document.getElementById("password");
const avatarInput = document.getElementById("avatar");


const info = document.getElementById("info");


const messagesBox = document.getElementById("messages");
const usersBox = document.getElementById("users");


const messageInput = document.getElementById("message");





// профиль


const myAvatar =
document.getElementById("myAvatar");


const myName =
document.getElementById("myName");


const myDate =
document.getElementById("myDate");









// ======================
// РЕГИСТРАЦИЯ
// ======================


document.getElementById("registerBtn").onclick = ()=>{


socket.emit("register",{

login:loginInput.value.trim(),

password:passwordInput.value,

avatar:avatarInput.value.trim()

});


};





socket.on("register success",()=>{


info.innerHTML="✅ Регистрация успешна";


});





socket.on("register error",(msg)=>{


info.innerHTML="❌ "+msg;


});









// ======================
// ВХОД
// ======================


document.getElementById("loginBtn").onclick = ()=>{


socket.emit("login",{

login:loginInput.value.trim(),

password:passwordInput.value

});


};







socket.on("login success",(user)=>{


console.log("USER:",user);


currentUser=user;


auth.style.display="none";


chat.style.display="flex";


updateProfile();



});







socket.on("login error",(msg)=>{


info.innerHTML="❌ "+msg;


});









// ======================
// ПРОФИЛЬ
// ======================


function updateProfile(){


if(!currentUser)return;



let img =
currentUser.avatar ||
"https://api.dicebear.com/7.x/bottts/svg?seed="+currentUser.login;



myAvatar.src=img;


myName.innerHTML=currentUser.login;


myDate.innerHTML=
"📅 "+currentUser.created;



document.getElementById("profileAvatar").src=img;


document.getElementById("profileName").innerHTML=
currentUser.login;


document.getElementById("profileDate").innerHTML=
"📅 "+currentUser.created;


}









document.getElementById("editBtn").onclick=()=>{


document.getElementById("settings").style.display="flex";


document.getElementById("newLogin").value=
currentUser.login;


document.getElementById("newAvatar").value=
currentUser.avatar || "";


};







document.getElementById("closeSettings").onclick=()=>{


document.getElementById("settings").style.display="none";


};








document.getElementById("saveProfile").onclick=()=>{


socket.emit("update profile",{

login:
document.getElementById("newLogin").value.trim(),


avatar:
document.getElementById("newAvatar").value.trim()


});


};








socket.on("profile updated",(user)=>{


currentUser=user;


updateProfile();


document.getElementById("settings").style.display="none";


});











// ======================
// ПАРОЛЬ
// ======================


document.getElementById("changePassword").onclick=()=>{


let pass =
document.getElementById("newPassword").value;



socket.emit(
"change password",
pass
);



};









// ======================
// ВЫХОД
// ======================


document.getElementById("logout").onclick=()=>{


socket.emit("logout");


location.reload();


};









// ======================
// ЧАТ
// ======================


document.getElementById("sendBtn").onclick=sendMessage;




messageInput.addEventListener(
"keydown",
(e)=>{


if(e.key==="Enter"){

sendMessage();

}


});





function sendMessage(){


if(!currentUser){

alert("Войдите в аккаунт");

return;

}



let text =
messageInput.value.trim();



if(text==="")return;



socket.emit("chat message",{

nick:currentUser.login,

text:text

});



messageInput.value="";


}









// сообщения


function addMessage(data){


let div=document.createElement("div");


div.className="message";


div.innerHTML=`

<b>${data.nick}</b>:

${data.text}

<br>

<small>${data.time || ""}</small>

`;



messagesBox.appendChild(div);


messagesBox.scrollTop=
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









// ======================
// ОНЛАЙН
// ======================


socket.on("users online",(list)=>{


usersBox.innerHTML=
"<h3>🟢 Онлайн</h3>";



list.forEach(user=>{


usersBox.innerHTML += `

<div class="user">

<img src="${user.avatar}">

<span>
${user.login || user.nick}
</span>

</div>

`;


});


});