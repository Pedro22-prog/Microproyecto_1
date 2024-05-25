let gameStats = {
    gamesPlayed: 0,
    wins: 0,
    rights: 0,
    loses: 0,
    wrongs: 0
}
const savedInfo = localStorage.getItem("hangmanStats")
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
        clearclaerLocal();
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
const word = document.querySelector("");

const keyboardDiv = document.querySelector(".keyboard");
for (let i = 97; i < 122; index++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
}