var obstacle = document.getElementById("obstacle");
var space = document.getElementById("space");
var player = document.getElementById("player");
var currentUsername = "";
var game = document.getElementById("game");
var jumping = 0;
var menu = document.getElementById("menu");
let score = 0;
let gameStart = 0;

function startGame(){
    gameStart = 1;
    /* Ta funckija se ponovi po vsaki iteraciji animacije */
    /* Random variacija razmaka med ovirami */
    space.addEventListener('animationiteration', () => {
        var random = 0;
        random = -((Math.random()*60)+30);
        console.log(random);
        space.style.top = random + "vh";
        score++;
    });

    /* to teče vsakih 10 ms */
    /* trenutno stanje igralca */
    /* simulacija gravitacije --> igralca potiskamo navzdol */
    setInterval(function(){
        var playerTop = parseInt(window.getComputedStyle(player).getPropertyValue("top"));
        /* če skočimo nočemo, da gre žogca še zmjra dol */
        if(jumping == 0)
            player.style.top = (playerTop+3)+"px";
        /* detekcija ovir */
        var obstacleLeft = convertPXToVH(parseInt(window.getComputedStyle(obstacle).getPropertyValue("left")));
        var spaceTop = convertPXToVH(parseInt(window.getComputedStyle(space).getPropertyValue("top")));
        /* koliko od vrha je igralec */
        var vhWidth = convertPXToVH(game.clientWidth);
        var vhHeight = convertPXToVH(game.clientHeight);
        var playerTopVh = convertPXToVH(playerTop);
        var cTop = -(vhWidth-playerTopVh);
        /*
        console.log("pxW"+game.clientWidth);
        console.log("pxH"+game.clientHeight);

        console.log();
        console.log("vhW"+vhWidth);
        console.log("vhH"+vhHeight);
        console.log();
        console.log(obstacleLeft);
        
        console.log("cTop: "+cTop);
        console.log("spaceTop: "+spaceTop);
        */
        /* collision */
        /* cTop --> gor je minus dol je + */
        if((playerTopVh > 90)||((obstacleLeft < 3.9) && (obstacleLeft > -13.87) && ((cTop < spaceTop + 33.4) || (cTop > spaceTop + 53.1)))){
            player.style.top = (playerTop+5)+"vh";
            /* prepreči, da se currentUsername sprazni */
            if(currentUsername == "")
                currentUsername = document.querySelector("#userName").value;
            /* preverimo ali ta igralec že obstaja */    
            /* če ne ga dodamo */
            //sortPlayers(1);
            if(findIndeks(currentUsername) == -1){
                createPlayer();
            } 
            /* ča pa ja mu le spremenimo točke */
            else{
                updatePlayer(currentUsername);
            }
            alert("Game over. Score: "+ score)
            player.style.top = 30 + "vh";
            score = 0;
            window.location.reload(); 
        }
    },10);
}

function jump(){
    if(gameStart == 1){
        jumping = 1;
        let jumpCount = 0;
        var jumpInterval = setInterval(function(){
            var playerTop = parseInt(window.getComputedStyle(player).getPropertyValue("top"));
            /* Onemogočimo, da gre igralec ven iz okna --> pri 0 je gornji rob*/
            /* 1 interval pustimo, da se nič ne zgodi */
            if((playerTop > 81) && (jumpCount < 19))
                player.style.top = (playerTop-5)+"px";
            /* ko se interval izvede 20-ič, se ustavi */
            /* console.log(playerTop); */
            if(jumpCount > 20){
                clearInterval(jumpInterval);
                jumping = 0;
                jumpCount = 0;
            }   
            jumpCount ++;
        },10)
    }
}

function convertPXToVH(px) {
	return 100 * (px / document.documentElement.clientHeight);
}

function start(){
    // preveri ali je uporabnik vpisal ime in ali ni predolgo
    let name = document.querySelector("#userName").value;
    if(name == ""){
        alert("Invalid input");
    }
    else if(name.length > 15){
        alert("Username too long, max length is 15 letters");
    }
    else{
        /*
        console.log(players.length);
        console.log(name);
        console.log(findIndeks(name));
        */
        if(findIndeks(name) == -1 && players.length > 4){
            alert("Reached max players: 5, play as an exsisting player or delete one");
        }
        else{
            // Začni igro
            game.style.display = "block";
            menu.style.display = "none";
            startGame(); 
        }
    }
}

"use strict";
let players = [];

function addPlayer(player, st) {
    const table = document.querySelector("#scoreBoard");
    const tr = document.createElement("tr");
    table.appendChild(tr);

    for(const key in player){
        const td = document.createElement("td");
        //.key nej delou kr key je string ("neku_ime")
        td.innerText = player[key];
        tr.appendChild(td);
    }
    /* brisanje */
    tr.ondblclick = function doubleClick(){
        let ime = tr.childNodes[0].innerText;
        var answer = window.confirm("Are you sure you want to delete "+ime+" ?");
        let indeks = tr.rowIndex - 1;
        if(answer){
            tr.remove();
            //console.log(indeks);
            // zbriše iz players (JSON) kliknjenega igralca
            players.splice(indeks, 1);
            for(let a of players){
                //console.log(a);
            }
            localStorage.setItem("players", JSON.stringify(players));
            //localStorage.setItem("players", JSON.stringify(players));
        }
    }
    if(st == 1){
        players.push(player);
        localStorage.setItem("players", JSON.stringify(players));
    }
}

function addPlayer2(player, st) {
    const table = document.querySelector("#scoreBoard");
    const tr = document.createElement("tr");
    table.appendChild(tr);

    for(const key in player){
        const td = document.createElement("td");
        //.key nej delou kr key je string ("neku_ime")
        td.innerText = player[key];
        tr.appendChild(td);
    }

    if(st == 1){
        players.push(player);
        localStorage.setItem("players", JSON.stringify(players));
    }
}

function updatePlayer(username){
    let i = findIndeks(username);
    //console.log("i:"+i);
    if(i != -1){
        var tab = document.getElementById("scoreBoard");
        var rows = tab.rows;
        var row = rows[i+1];
        let retrieved = JSON.parse(localStorage.getItem("players"));
        var cell = row.cells[1];
        let previousScore = cell.innerText;
        /* popravimo le, če ni prazno in, česo nove točke večje od prejšnjih */
        if(retrieved != null && score > previousScore){
            /* pobrišemo igralca */
            row.remove();
            players.splice(i, 1);
            localStorage.setItem("players", JSON.stringify(players));
            let table = document.querySelector("#scoreBoard");
            let tr = document.createElement("tr");
            table.appendChild(tr);
            /* ustvarimo igralca z istim imenom nazaj */
            let td = document.createElement("td");
            td.innerText = username;
            tr.appendChild(td);
            /* nove točke */
            td = document.createElement("td");
            td.innerText = score;
            tr.appendChild(td);
            /* nazaj v localStorage */
            let player = {
                username: username,
                score: score 
            };

            players.push(player);
            localStorage.setItem("players", JSON.stringify(players));
        }
    }   
}

function findIndeks(username){
    let retrieved = JSON.parse(localStorage.getItem("players"));
    let st = 0;
    if(retrieved != null){
        for(const r of retrieved){
            if(r["username"] == username){
                return st;
            }
            st++;
        }
    }
    return -1
}

function createPlayer2(u, s) {
    const player = {
        username: u,
        score: s 
    };
    addPlayer2(player, 1);
}

function createPlayer() {
    const player = {
        username: currentUsername,
        score: score 
    };
    addPlayer(player, 1);
}

function sortBtn1(){
    sortPlayers(0);
}

function sortBtn2(){
    sortPlayers(1);
}

function sortPlayers(i){
    // se le izvede, če tabela ni prazna
    let retrieved = JSON.parse(localStorage.getItem("players"));
    var tab = document.getElementById("scoreBoard");
    /* console.log("rLen "+ retrieved.length);
    console.log("tLen "+ tab.rows.length); */
    if(retrieved != null && tab.rows.length > 1){
        players = [];
        let allPl = [];
        if(retrieved != null){
            for(const r of retrieved){
                let pl = [];
                for(const key in r){
                    //console.log("ej: "+r[key]);
                    pl.push(r[key]);
                }
                // da bodo najprej točke v tabeli, .sort dela po 1. elementu najprej
                if(i == 1)
                    pl.reverse();
                allPl.push(pl);
                //console.log();
            }
        }
        for(const j of allPl){
            console.log("prej: "+j[0]+" "+j[1]);
        }
        
        // če sortiramo po točkah, želimo da je padajoče
        // potrebno je določiti kako sortira
        if(i == 1){
            allPl.sort((a, b) => {
                if (a[0] < b[0]) {
                  return -1;
                }
                if (a[0] > b[0]) {
                  return 1;
                }
                return 0;
              });
            allPl.reverse();
        }
        else{
            allPl.sort();
        }
        for(const j of allPl){
            console.log("po: "+j[0]+" "+j[1]);
        }
        // počistimo localStorage in tabelo
        var tab = document.getElementById("scoreBoard");
        var tRows = tab.rows;
        console.log("r length: "+tRows.length);
        while(tRows.length > 1)
            tRows[1].remove();
        localStorage.clear("players");
        players = [];
        // napolnimo z novimi vrednostmi
        for(const j of allPl){
            //console.log("ti "+j[1]+j[0]);
            // j[0] == score
            if(i == 1){
                createPlayer2(j[1], j[0]);
            }
            // j[0] == username
            else{
                createPlayer2(j[0], j[1]);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // This function is run after the page contents have been loaded
    // Put your initialization code here
    let retrieved = JSON.parse(localStorage.getItem("players"));
    //retrieved = players;
    //localStorage.setItem("players", JSON.stringify(players));
    if(retrieved != null){
        players = retrieved;
        for(const r of retrieved){
            addPlayer(r,0);
        }
    }
})