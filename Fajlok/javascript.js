var kepek = ['sarga', 'kek', 'lila', 'piros', 'zold']
var board = []
var rows = 8
var columns = 8
var score = 0;
var selectedCell = null;

window.onload = function (){
    updateTable();
    start();


    window.setInterval(function (){
        checkMatchesForThree();
        lecsuszas();
        randomKepGeneralas();

        document.getElementById("pont").innerText = score;
    }, 400);
}

window.addEventListener('click', () => {
    document.getElementById("bg-music").play();
})
function random() {
    return kepek[Math.floor(Math.random() * kepek.length)];
}

function swap(cell1, cell2) {
    let temp = board[cell1.row][cell1.col].src;
    board[cell1.row][cell1.col].src = board[cell2.row][cell2.col].src;
    board[cell2.row][cell2.col].src = temp;

    // ellenőrizni kell, hogy a cserével három egyforma lesz-e
    if (checkMatchesForThree()) {
    } else {
        // ha nem lesz három egyforma, visszacseréljük a két elemet
        temp = board[cell1.row][cell1.col].src;
        board[cell1.row][cell1.col].src = board[cell2.row][cell2.col].src;
        board[cell2.row][cell2.col].src = temp;
    }
}

function checkMatchesForThree() {
    let foundMatch = false;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns - 2; j++) {
            let cell1 = board[i][j];
            let cell2 = board[i][j + 1];
            let cell3 = board[i][j + 2];

            if (cell1.src === cell2.src && cell2.src === cell3.src && !cell1.src.includes("ures")) {
                cell1.src = "./EEUCFW/ures.png";
                cell2.src = "./EEUCFW/ures.png";
                cell3.src = "./EEUCFW/ures.png";
                foundMatch = true;
                score += 3;
            }
        }
    }

    for (let i = 0; i < rows - 2; i++) for (let j = 0; j < columns; j++) {
        let cell1 = board[i][j];
        let cell2 = board[i + 1][j];
        let cell3 = board[i + 2][j];

        if (cell1.src === cell2.src && cell2.src === cell3.src && !cell1.src.includes("ures")) {
            cell1.src = "./EEUCFW/ures.png";
            cell2.src = "./EEUCFW/ures.png";
            cell3.src = "./EEUCFW/ures.png";
            foundMatch = true;
            score += 3;
        }
    }

    return foundMatch;
}

function lecsuszas(){
    for (let i = 0; i < columns; i++) {
        let index = rows - 1;
        for (let j = columns - 1; j >= 0 ; j--) {
            if (!board[j][i].src.includes("ures")){
                board[index][i].src = board[j][i].src;
                index -= 1;
            }
        }

        for (let j = index; j >= 0 ; j--) {
            board[j][i].src = "./EEUCFW/ures.png";
        }
    }
}

function randomKepGeneralas(){
    for (let i = 0; i < columns; i++) {
        if(board[0][i].src.includes("ures")){
            board[0][i].src = "./EEUCFW/" + random() + ".png";
        }
    }
}

function start() {
    for (let i = 0; i < rows ; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            let kep = document.createElement("img");
            kep.src = "./EEUCFW/" + random() + ".png";

            const clickSound = document.getElementById("click-sound");

            kep.addEventListener('click', () => {
                clickSound.play();
                if (selectedCell == null) {
                    selectedCell = {row: i, col: j};
                    kep.classList.add("selected");
                } else {
                    if (selectedCell.row === i || selectedCell.col === j) {
                        swap(selectedCell, {row: i, col: j});
                        kep.classList.add("selected");
                        checkMatchesForThree();

                    }
                    selectedCell = null;
                }
            });

            document.getElementById("game").append(kep);
            row.push(kep);
        }
        board.push(row);
    }

    console.log(board);

    checkMatchesForThree();
}

// Betöltjük a táblázatot local storageból
let table = JSON.parse(localStorage.getItem("toplista"));

// Ha a tábla nem létezik, létrehozunk egy új, üreset
if (!table) {
    table = [];
}

// új pont hozzáadása a táblához
function addScore(name, score) {
    table.push({
        name: name,
        score: score
    });

    // pont szerinti rendezés
    table.sort((a, b) => b.score - a.score);

    // top 5-öt mutatja
    table.splice(5);

    // Elmenti az updatelt táblát local storageba
    localStorage.setItem("toplista", JSON.stringify(table));

    updateTable();
}

// Updateli a táblázatot az oldalon
function updateTable() {
    let tbody = document.createElement("tbody");
    for (let i = 0; i < table.length; i++) {
        let tr = document.createElement("tr");
        let tdName = document.createElement("td");
        let tdScore = document.createElement("td");
        tdName.textContent = table[i].name;
        tdScore.textContent = table[i].score;
        tr.appendChild(tdName);
        tr.appendChild(tdScore);
        tbody.appendChild(tr);
    }
    document.getElementById("toplista").replaceChild(tbody, document.getElementById("toplista").lastElementChild);
}

// Elmenti a jelenlegi pontszámot a táblázatba
function saveScore() {
    let name = document.getElementById("nev").value;
    if (name) {
        addScore(name, score);
        alert("Pont elmentve!");
    } else {
        alert("Írd be a neved!");
    }
}






