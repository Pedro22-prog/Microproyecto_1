// define las estadisticas y los estados del juego
let gameStats = {
    gamesPlayed: 0,
    wins: 0,
    rights: 0,
    loses: 0,
    wrongs: 0
};

// carga los datos del almacenamiento local
const savedInfo = localStorage.getItem("hangmanStats");
if (savedInfo) {
    gameStats = JSON.parse(savedInfo);
}

// Maneja los datos mostrados
function updateStats() {
    document.querySelector(".number-of-games").innerText = gameStats.gamesPlayed;
    document.querySelector(".number-wins").innerText = gameStats.wins;
    document.querySelector(".rights").innerText = gameStats.rights;
    document.querySelector(".number-loses").innerText = gameStats.loses;
    document.querySelector(".wrongs").innerText = gameStats.wrongs;
}

// Salva las estadisticas locales 
function updateStatsLocal() {
    gameStats.gamesPlayed++;
    updateStats();
    localStorage.setItem("hangmanStats", JSON.stringify(gameStats));
}

// Borra los datos locales y reinicia el juego
function clearLocal() {
    localStorage.removeItem("hangmanStats");
    alert("Se ha eliminado su historial");
    location.reload();
}

const word = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-image");
const hangmanModal = document.querySelector(".hangman-modal");
const playAgain = document.querySelector(".play-again");
const hintText = document.querySelector(".hint-text b");

// variables del juego
let currentWord, correctLetters, wrongTries;
const maxGuesses = 6;

// reinicia el juego
function reset() {
    correctLetters = [];
    wrongTries = 0;
    hangmanImage.src = "imagenes/hangman-0.svg";
    guessesText.querySelector("span").innerText = wrongTries;
    word.innerHTML = "";
    currentWord.split("").forEach(() => {
        word.innerHTML += '<li class="letter"></li>';
    });
    keyboardDiv.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
    hangmanModal.classList.remove("show");
}

// recibe una letra random de la base de datos
function getRandomWord() {
    const { wordact, hint } = hangmanDB[Math.floor(Math.random() * hangmanDB.length)];
    currentWord = wordact;
    hintText.textContent = hint;
    reset();
    updateStats();
}

// final del juego
function gameOver(isVictory) {
    const modalText = isVictory ? 'Buen trabajo, la palabra correcta era:' : 'Buen intento, quizás lo logres la próxima vez. La palabra era:';
    hangmanModal.querySelector(".modal-image").src = `imagenes/${isVictory ? "victory" : "lost"}.gif`;
    hangmanModal.querySelector(".modal-title").innerText = isVictory ? "Felicidades" : "Suerte para la próxima. Fin del juego";
    hangmanModal.querySelector(".modal-text").innerHTML = `${modalText} <b>${currentWord}</b>`;
    hangmanModal.classList.add("show");
    if (isVictory) {
        gameStats.wins++;
    } else {
        gameStats.loses++;
    }
    updateStatsLocal();
}

// Maneja la letra que se ha ingresado
function handleGuess(button, clickedLetter) {
    if (currentWord.includes(clickedLetter)) {
        currentWord.split("").forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                word.querySelectorAll("li")[index].innerText = letter;
                word.querySelectorAll("li")[index].classList.add("guessed");
                gameStats.rights++;
            }
        });
    } else {
        wrongTries++;
        hangmanImage.src = `imagenes/hangman-${wrongTries}.svg`;
        gameStats.wrongs++;
    }
    button.disabled = true;
    guessesText.querySelector("span").innerText = wrongTries;
    if (wrongTries === maxGuesses) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
}

// crea botones del teclado
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.append(button);
    button.addEventListener("click", (e) => handleGuess(e.target, String.fromCharCode(i)));
}

// Inicio del juego
getRandomWord();

// Boton de jugar otra vez
playAgain.addEventListener("click", getRandomWord);

// Input del teclado
document.addEventListener("keydown", (e) => {
    const selectedLetter = e.key.toLowerCase();
    if (/^[a-z]$/.test(selectedLetter)) {
        const button = Array.from(keyboardDiv.querySelectorAll("button")).find((btn) => btn.innerText.toLowerCase() === selectedLetter && !btn.disabled);
        if (button) {
            handleGuess(button, selectedLetter);
        }
    }
});