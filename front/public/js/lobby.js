//управление лобби

// redirection to the join page if sessionStorage is incomplete
import {clientLeaveGame, clientPlayersAndStatus, clientStartGame} from "/js/tools/api_client.js";
import {redirectIfUnstarted} from "/js/tools/mixed.js";

if (![true, "roomNumber", "playerNickname", "sessionToken", "isAdmin"].reduce(
    (a, b) => a && (sessionStorage.getItem(b) != null)
)) window.location.href = 'join.html'

// set the room number
const roomNumber = sessionStorage.getItem('roomNumber');
document.getElementById('displayRoom').textContent = `Room ${roomNumber}`;

const startButton = document.querySelector("#start")
const waitBar = document.querySelector(".waiting-indicator")
function makeAdmin() {
    startButton.classList.remove("disappeared")
    waitBar.classList.add("disappeared")
}
const playersTable = document.querySelector(".player-room-info")
async function playerListUpdateCycle() {
    const playersAndStatus = await clientPlayersAndStatus(
        sessionStorage.getItem("sessionToken"),
        sessionStorage.getItem("roomNumber"))
    redirectIfUnstarted(playersAndStatus.status)
    playersTable.innerHTML = ''
    if (playersAndStatus.players[0] === sessionStorage.getItem("playerNickname"))
        makeAdmin()
    for (let player of playersAndStatus.players) {
        const playerMark = document.createElement("span")
        playerMark.classList.add("info-label")
        playerMark.textContent = "player"
        const playerName = document.createElement("span")
        playerName.classList.add("info-value")
        playerName.textContent = player
        const informationRow = document.createElement("div")
        informationRow.classList.add("info-row")
        informationRow.appendChild(playerMark)
        informationRow.appendChild(playerName)
        playersTable.appendChild(informationRow)
    }
    setTimeout(playerListUpdateCycle, 1000)
}
playerListUpdateCycle()

startButton.addEventListener("click", async (e) => {
    e.preventDefault()
    await clientStartGame(sessionStorage.getItem("sessionToken"), sessionStorage.getItem("roomNumber"))
})

document.querySelector("#leave").addEventListener("click", async (e) => {
    e.preventDefault()
    await clientLeaveGame(sessionStorage.getItem("sessionToken"), sessionStorage.getItem("roomNumber"))
    sessionStorage.clear()
    window.location.href = 'join.html';
})
