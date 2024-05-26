//Variables principales para el juego
let gameStats = {
    gamesPlayed: 0,
    wins: 0,
    rights: 0,
    loses: 0,
    wrongs: 0
};

// Carga los datos del almacenamiento interno
const savedInfo = localStorage.getItem("hangmanStats");
if (savedInfo) {
    gameStats = JSON.parse(savedInfo);
    updateStats();
}

// Actualiza las estadisticas locales
function updateStats() {
    document.querySelector(".number-of-games").innerText = gameStats.gamesPlayed;
    document.querySelector(".number-wins").innerText = gameStats.wins;
    document.querySelector(".rights").innerText = gameStats.rights;
    document.querySelector(".number-loses").innerText = gameStats.loses;
    document.querySelector(".wrongs").innerText = gameStats.wrongs;
}

// Salva el historial local
function updateStatsLocal() {
    updateStats();
    localStorage.setItem("hangmanStats", JSON.stringify(gameStats));
}

// Limpia el historial y reinicia el juego
function clearLocal() {
    localStorage.removeItem("hangmanStats");
    alert("Se ha borrado tú historial de juego");
    location.reload();
}

// Elementos necesarios para que corra el juego
const wordDisplay = document.querySelector('.word-display');
const hintText = document.querySelector('.hint-text b');
const guessesText = document.querySelector('.guesses-text b span');
const keyboard = document.querySelector('.keyboard');
const hangmanImage = document.querySelector('.hangman-image');
const modalImage = document.querySelector('.modal-image');
const modalTitle = document.querySelector('.modal-title');
const modalText = document.querySelector('.modal-text');
const playAgainBtn = document.querySelector('.play-again');

// Variables del juego
let word, hint, wrongGuesses, rightGuesses, gameOver, gameWon;

// Function to start a new game
function startGame() {
    // Reinicia las variables del juego
    wrongGuesses = 0;
    rightGuesses = 0;
    gameOver = false;
    gameWon = false;

    // Selecciona una palabra random y muestra su pista
    const randomIndex = Math.floor(Math.random() * words.length);
    word = words[randomIndex].word.toUpperCase();
    hint = words[randomIndex].hint;

    // Muestra la palabra como guiones bajos
    wordDisplay.innerHTML = '';
    for (let i = 0; i < word.length; i++) {
        const letter = document.createElement('li');
        letter.textContent = '_';
        wordDisplay.appendChild(letter);
    }
    // Muestra la pista
    hintText.textContent = hint;
    // Rsetea el tablero
    keyboard.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
        const button = document.createElement('button');
        button.textContent = String.fromCharCode(i);
        button.addEventListener('click', handleGuess);
        keyboard.appendChild(button);
    }
    // reinicia la imagen del ahorcado
    hangmanImage.src = 'imagenes/hangman-0.svg';
}

// Función que maneja las adivinanzas por las letras
function handleGuess(event) {
    if (!gameOver && !gameWon) {
        const guessedLetter = event.target.textContent;
        event.target.disabled = true;
        if (word.includes(guessedLetter)) {
            // advininanzas correctas
            for (let i = 0; i < word.length; i++) {
                if (word[i] === guessedLetter) {
                    const letter = wordDisplay.children[i];
                    letter.textContent = guessedLetter;
                    rightGuesses++;
                }
            }
            if (rightGuesses === word.length) {
                // Jugador gana
                gameWon = true;
                gameOver = true;
                showModal('Victory', 'Felicades, ganaste');
            }
        } else {
            // Adivinanzas erroneas
            wrongGuesses++;
            guessesText.textContent = `${wrongGuesses}`;
            hangmanImage.src = `imagenes/hangman-${wrongGuesses}.svg`;
            if (wrongGuesses === 6) {
                // El jugador pierde
                gameOver = true;
                showModal('Lost', `Sigue intentandolo, la palabra era: "${word}".`);
            }
        }
    }
}
// Función para mostrar el juego sobre modal
function showModal(result, message) {
    if (result === 'Victory') {
        modalImage.src = 'imagenes/victory.gif';
        gameStats.wins++;
        gameStats.rights += word.length;
    } else {
        modalImage.src = 'imagenes/lost.gif';
        gameStats.loses++;
    }
    modalTitle.textContent = message;
    document.querySelector('.hangman-modal').style.display = 'flex';
    // Actualiza las estadisticas del juego
    gameStats.gamesPlayed++;
    gameStats.wrongs += wrongGuesses;
    updateStatsLocal();
}
// Función para confirmar el reinicio de las estadisticas del juego
function confirmClear() {
    if (confirm('¿Estás seguro de que quieres borrar el record?')) {
        clearLocal();
    }
}
// Event listener for the play again button
playAgainBtn.addEventListener('click', () => {
    document.querySelector('.hangman-modal').style.display = 'none';
    startGame();
});
// Array de las palabras con sus pistas respectivas
const words = [
    { word: 'javascript', hint: 'Un lenguaje de programación' },
    { word: 'pizza', hint: 'Comida Italiana' },
    { word: 'msi', hint: 'Marca de computadora' },
    { word: 'sergio', hint: 'Chad' },
    { word: 'michelle', hint: 'el mejor preparador de Sistemas de info' },
    { word: 'andres', hint: 'fan de cr7' },
    { word: 'css', hint: 'se usa para darle estilo a las paginas web' },
    { word: 'kotlin', hint: 'Lenguaje de programación de Android' },
    { word: 'react', hint: 'Biblioteca de JavaScript' },
    { word: 'javier', hint: 'El preparador del pueblo' },
    { word: 'keyla', hint: 'la profe de ingeniería de software' },
    { word: 'ghoul', hint: 'Personaje de fallout' },
    { word: 'godzilla', hint: 'Icono popular, proveniente de japón' },
    { word: 'Dota', hint: 'Juego MOBA' },
    { word: 'futbol', hint: 'El deporte rey' }
];
// Inicia el juego
startGame();