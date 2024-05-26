let gameStats = {
    gamesPlayed: 0,
    wins: 0,
    rights: 0,
    loses: 0,
    wrongs: 0
}
const savedInfo = localStorage.getItem("hangmanStats");
if (savedInfo){
    gameStats = JSON.parse(savedInfo)
}
function updateStats(){
    document.querySelector(".number-of-games").innerText = gameStats.gamesPlayed; 
    document.querySelector(".number-wins").innerText = gameStats.wins;
    document.querySelector(".rights").innerText = gameStats.rights;
    document.querySelector(".number-loses").innerText = gameStats,loses;
    document.querySelector(".wrongs").innerText = gameStats.wrongs;
}
function updateStatsLocal(){
    gameStats.gamesPlayed++;
    updateStats();
    localStorage.setItem("hagmanStats", JSON.stringify(gameStats))
}
function confirmClear(){
    const confirmation = confirm("Seguro que quieres borrar tus datos?");
    if (confirmation){
        clearLocal();
    }else{
        alert("Tu historial sigue intacto!");
    }
}
function clearLocal(){
    localStorage.removeItem("hangmanStats")
    localStorage.removeItem("wins")
    localStorage.removeItem("rights")
    localStorage.removeItem("loses")
    localStorage.removeItem("wrongs")
    alert("Se ha eliminado su historial")
    location.reload()
}
const word = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text")
const keyboardDiv = document.querySelector(".heyboard")
const hangmanImage = document.querySelector(".hangman-box")
const hangmanModal = document.querySelector(".hangman-modal")
const playAgain = document.querySelector("button")
document.querySelector(".download.btn-cn")?.remove();
let currentW, correctL, wrongtry;
const maxGuess = 6;
const reset =() => {
    correctL = []
    wrongtry = 0
    hangmanImage.src = "imagenes/hangman-0.svg"
    guessesText.innerText = `${wrongtry}/${maxGuess}`;
    word.innerHTML = currentW
        .split("")
        .map(() => `<li class="letter"></li>`)
        .join("")
    keyboardDiv
        .querySelectorAll("button")
        .forEach((btn) => (btn.disabled = false))
    hangmanModal.classList.remove("show")
};
const getRanWord = () => {
    const {wordact, hint} = hangmanDB[Math.floor(Math.random() * hangmanDB.length)];
    currentW = wordact;
    document.querySelector(".hint-text").innerText = hint;
    reset();
    updateStats();
};
const gameover = (isVictory) => {
    const modalText = isVictory? 'Buen trabajo la palabra correcta era:' : 'Buen intento quizas lo logres la proxima vez! La palabra era:';
    hangmanModal.querySelector("img").src = `imagenes/${isVictory ? "victory":"lost"}.gif`;
    hangmanModal.querySelector("h4").innerText = isVictory ? "Felicidades" : "Suerte para la procima. Fin del juego";
    hangmanModal.querySelector("p").innerHTML = `${modalText} <b>${currentW}<b>`;
    hangmanModal.classList.add("show");
    if (isVictory){
        gameStats.wins++;
    }else{
        gameStats.loses++;
    }
    updateStatsLocal();
};
const StartGame(button, clickedL){
    if(currentW.includes(clickedL)){
        [...currentW].forEach((letter, index) => {
            if (let === clickedL){
                correctL.push(letter)
                word.querySelectorAll("li")[index].innerText = letter;
                word.querySelectorAll("li")[index].classList.add(guessed)
                gameStats.rights++;
            }
        })
    } else{
        wrongtry++;
        hangmanImage.src = `imagenes/hangman-${wrongtry}.svg`
        gameStats.wrongs++;
    }
    button.disabled = true;
    guessesText.innerText = `${wrongtry}/${maxGuess}`;
    if (wrongtry === maxGuess) return gameover(false);
    if (correctL.length === currentW.length) return gameover(true);
};
for (let i = 97; i <= 122; i++){
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.append(button);
    button.addEventListener("click", (e) => StartGame(e.target, String.fromCharCode(i)));
}
getRanWord();
playAgain.addEventListener("click", getRanWord)
document.addEventListener("keydown", (e) => {
    const select = e.key.toLowerCase()
    if(/^[a-z]$/.test(select)){
        const button = Array.from(keyboardDiv.querySelectorAll("button")).find((btn)=>btn.innerText.toLowerCase() === select && !btn.disabled);
        if (button){
            StartGame(button, select);
        }
    }
});
NodeList.prototype.contains = function (text){
    return Array.from(this).some((element) => element.innerText.toLowerCase() === text.toLowerCase())  
}
document.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && hangmanModal.classList.contains("show")){
        getRanWord()
    }
});