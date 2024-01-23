let container = document.getElementById("container");
let numPost = 0;
let commTar;
let postMem;
let commentMem;
let art;
let titArt;
let a;
let coll;
let clColl;
let linkArt;
let mostr = false;
let btnSub;
let btnDel;

async function getPosts() {
  let posts = await fetch("https://jsonplaceholder.typicode.com/posts").then(
    (Response) => Response.json()
  );
  /*.catch(
      (container.innerHTML = `<p id="error-mess">Si è verificato un errore</p>`)
    );*/
  return posts;
}

async function getComments() {
  let comments = await fetch(
    "https://jsonplaceholder.typicode.com/comments"
  ).then((Response) => Response.json());
  /*.catch(
      (container.innerHTML = `<p id="error-mess">Si è verificato un errore</p>`)
    );*/
  return comments;
}

function goToArt() {
  if (localStorage.artCorr != this.innerHTML) {
    document.getElementById(localStorage.artCorr).style.visibility = "hidden";
    for (let i = 0; i < linkArt.length; i++)
      if (linkArt[i].innerHTML == localStorage.artCorr) {
        linkArt[i].style.color = "#ffffff";
        break;
      }
    localStorage.artCorr = this.innerHTML;
    document.getElementById(this.innerHTML).style.visibility = "visible";
  }
  this.style.color = "#ff0077";
  document.getElementById("menu").style.display = "none";
  document.getElementById("freccia").style.rotate = 0 + "deg";
  mostr = false;
}

function showMenu() {
  if (mostr == false) {
    document.getElementById("menu").style.display = "flex";
    document.getElementById("menu").style.zIndex = "1";
    document.getElementById("freccia").style.rotate = 180 + "deg";
    mostr = true;
  } else {
    document.getElementById("menu").style.display = "none";
    document.getElementById("menu").style.zIndex = "0";
    document.getElementById("freccia").style.rotate = 0 + "deg";
    mostr = false;
  }
}

function scriviDoc() {
  if (!localStorage.posts && !localStorage.comments) {
    Promise.all([getPosts(), getComments()]).then(([post, comment]) => {
      postMem = post;
      commentMem = comment;
      localStorage.setItem("posts", JSON.stringify(postMem));
      localStorage.setItem("comments", JSON.stringify(commentMem));
      localStorage.setItem("artCorr", "Articolo1");
      scriviDoc();
    });
  }

  postMem = JSON.parse(localStorage.getItem("posts"));
  commentMem = JSON.parse(localStorage.getItem("comments"));
  for (let i = 0; i < postMem.length; i++) {
    numPost = parseInt(i + 1);
    commTar = commentMem.filter((comm) => {
      if (comm.postId == postMem[i].id) return true;
      else return false;
    });
    art = document.createElement("li");
    a = document.createElement("a");
    coll = document.createAttribute("href");
    coll.value = "#";
    clColl = document.createAttribute("class");
    clColl.value = "link-art";
    a.setAttributeNode(coll);
    a.setAttributeNode(clColl);
    titArt = document.createTextNode("Articolo" + numPost);
    a.appendChild(titArt);
    art.appendChild(a);
    document.getElementById("list-art").appendChild(art);
    let commOut = "";
    for (let j = 0; j < commTar.length; j++)
      if (commOut != "")
        commOut += `<div class="comments" id="${commTar[j].id}"><div class="comm-dates"><div id="cont-email"><b id="email-comm">${commTar[j].email}</b></div><b id="tit-comm">${commTar[j].name}</b></div><p id="b-comm">${commTar[j].body}</p><div id="cont-del"><button type="button" class= "delete">ELIMINA</button></div></div></br>`;
      else
        commOut = `<div class="comments" id="${commTar[j].id}"><div class="comm-dates"><div id="cont-email"><b id="email-comm">${commTar[j].email}</b></div><b id="tit-comm">${commTar[j].name}</b></div><p id="b-comm">${commTar[j].body}</p><div id="cont-del"><button type="button" class= "delete">ELIMINA</button></div></div></br>`;

    container.innerHTML += `<div class="cont-post" id="Articolo${numPost}"><div id="post-dates"><h1>${postMem[i].title}</h1><p>${postMem[i].body}</p></div><b id="sect-comm">COMMENTI:</b>
        <div id="cont-comments"><p>${commOut}</p></div> <div class="Commenta"><p id="comm-invite">LASCIA UN COMMENTO</p> <div class="cont-newEmail"><p>EMAIL</p><input type="email" placeholder="Scrivi la tua email" required></div> <div class="cont-tit"><p>TITOLO</p><input type="text" placeholder="Scrivi il titolo del commento"></div><div class="cont-newComm"><p>SCRIVI COMMENTO</p><textarea class="newComm" placeholder="Scrivi un commento..."></textarea></div> <div class="cont-btn"> <button type="button" class="btn-sub">INVIA</button></div>  </div>
      </div></br></br>`;
  }
  document.getElementById(localStorage.artCorr).style.visibility = "visible";
  linkArt = document.getElementsByClassName("link-art");

  for (let i = 0; i < linkArt.length; i++) {
    linkArt[i].addEventListener("click", goToArt);
    if (linkArt[i].innerHTML == localStorage.artCorr)
      linkArt[i].style.color = "#ff0077";
    //});
  }

  btnSub = document.getElementsByClassName("btn-sub");
  for (let i = 0; i < btnSub.length; i++)
    btnSub[i].addEventListener("click", scriviComm);

  btnDel = document.getElementsByClassName("delete");
  for (let i = 0; i < btnDel.length; i++)
    btnDel[i].addEventListener("click", deleteComm);
}

scriviDoc();

function scriviComm() {
  let contComm =
    this.parentNode.previousSibling.previousSibling.childNodes[1].value;

  let titComm =
    this.parentNode.previousSibling.previousSibling.previousSibling
      .childNodes[1].value;

  let emailComm =
    this.parentNode.previousSibling.previousSibling.previousSibling
      .previousSibling.previousSibling.childNodes[1].value;

  let emailPatt = /\w+@\w+\.\w{2,4}/i;

  if (contComm != "" && titComm != "" && emailComm != "") {
    if (emailPatt.test(emailComm) == true) {
      let postId = this.parentNode.parentNode.parentNode.id;
      let newCommPostId = postId.slice(8, postId.length);
      let newCommId = parseInt(commentMem[commentMem.length - 1].id) + 1;

      let newComment = {
        postId: newCommPostId,
        id: newCommId,
        name: titComm,
        email: emailComm,
        body: contComm,
      };

      for (let i = 0; i < btnDel.length; i++)
        btnDel[i].removeEventListener("click", deleteComm);

      //alert(newComment.id);

      this.parentNode.previousSibling.previousSibling.childNodes[1].value = "";

      this.parentNode.previousSibling.previousSibling.previousSibling.childNodes[1].value =
        "";

      this.parentNode.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.childNodes[1].value =
        "";

      commentMem.push(newComment);
      this.parentNode.parentNode.previousSibling.previousSibling.innerHTML += `<div class="comments" id="${newComment.id}"><div class="comm-dates"><div id="cont-email"><b id="email-comm">${newComment.email}</b></div><b id="tit-comm">${newComment.name}</b></div><p id="b-comm">${newComment.body}</p><div id="cont-del"><button type="button" class="delete">ELIMINA</button></div></div></br>`;

      btnDel = document.getElementsByClassName("delete");

      //alert(btnDel.length);

      for (let i = 0; i < btnDel.length; i++)
        btnDel[i].addEventListener("click", deleteComm);

      localStorage.setItem("comments", JSON.stringify(commentMem));
    } else alert("Inserire indirizzo email valido!");
  } else alert("Compilare tutti i campi");
}

function deleteComm() {
  for (let i = 0; i < commentMem.length; i++)
    if (parseInt(commentMem[i].id) == parseInt(this.parentNode.parentNode.id)) {
      commentMem.splice(i, 1);

      for (let i = 0; i < btnDel.length; i++)
        btnDel[i].removeEventListener("click", deleteComm);

      this.parentNode.parentNode.remove();
      localStorage.setItem("comments", JSON.stringify(commentMem));

      btnDel = document.getElementsByClassName("delete");

      for (let i = 0; i < btnDel.length; i++)
        btnDel[i].addEventListener("click", deleteComm);

      break;
    }
}

/*let btnSub = document.getElementsByClassName("btn-sub");
for (let i = 0; i < btnSub.length; i++)
  btnSub[i].addEventListener("click", scriviComm);*/

/*function mostra() {
  alert(commentMem.length);
}

let cClass = document.getElementsByClassName("comments");

for (let i = 0; i < cClass.length; i++)
  cClass[i].addEventListener("click", mostra);*/
