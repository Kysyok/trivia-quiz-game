//управление лобби

// redirection to the join page if sessionStorage is incomplete
import { clientPlayersAndStatus } from "/js/tools/api_client.js";
import { redirectIfUnstarted } from "/js/tools/mixed.js";

if (![1, "roomNumber", "playerNickname", "sessionToken", "isAdmin"].reduce(
    (a, b) => a && sessionStorage.getItem(b)
)) window.location.href = 'join.html'

// set the room number
const roomNumber = sessionStorage.getItem('roomNumber');
document.getElementById('displayRoom').textContent = `Room ${roomNumber}`;

const playersTable = document.querySelector(".player-room-info")
async function playerListUpdateCycle() {
    const playersAndStatus = await clientPlayersAndStatus(
        sessionStorage.getItem("sessionToken"),
        sessionStorage.getItem("roomNumber"))
    redirectIfUnstarted(playersAndStatus.status)
    playersTable.innerHTML = ''
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
    setTimeout(playerListUpdateCycle, 10000)
}

playerListUpdateCycle()

//проверка что мы на странице лобби
const playersList = document.getElementById('playersList');

//случайный код комнаты
const roomCode = generateRoomCode();
document.getElementById('roomCodeDisplay').textContent = roomCode;

sessionStorage.setItem('adminRoomCode', roomCode);
//массив игроков
let players = [
    {id: 1, nickname: 'alice', joinedAt: new Date(), score: 0},
    {id: 2, nickname: 'bob', joinedAt: new Date(), score: 0},
    {id: 3, nickname: 'charlie', joinedAt: new Date(), score: 0},
    {id: 4, nickname: 'diana', joinedAt: new Date(), score: 0},
    {id: 5, nickname: 'eve', joinedAt: new Date(), score: 0}
];

const playerCountSpan = document.getElementById('playerCount');
const startGameBtn = document.getElementById('startGameBtn');

//генерация кода комнаты
function generateRoomCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

//добавление игрока
window.addPlayer = function (nickname) {
    const player = {
        id: Date.now() + Math.random(),
        nickname: nickname || `player_${players.length + 1}`,
        joinedAt: new Date(),
        score: 0
    };

    players.push(player);
    renderPlayers();
};

//удаление игрока
function removePlayer(playerId) {
    players = players.filter(p => p.id !== playerId);
    renderPlayers();
}

//отрисовка списка игроков
function renderPlayers() {
    //обновление счетчика
    playerCountSpan.textContent = players.length;

    startGameBtn.disabled = players.length === 0;

    //если нет игроков показываем пустое состояние
    if (players.length === 0) {
        playersList.innerHTML = `
               <div class="empty-state">
                   <p>waiting for players...</p>
                   <p class="empty-hint">share the room code to invite</p>
               </div>
           `;
        return;
    }

    //сортировка игроков
    playersList.innerHTML = players.map(player => `
           <div class="player-item" data-player-id="${player.id}">
               <div class="player-info">
                   <div class="player-avatar">${player.nickname.charAt(0)}</div>
                   <div class="player-details">
                       <div class="player-name">${player.nickname}</div>
                       <div class="player-status">joined</div>
                   </div>
               </div>
               <button class="btn-remove" onclick="removePlayerHandler(${player.id})" title="remove player">×</button>
           </div>
       `).join('');
}

//обработчик удаления
window.removePlayerHandler = function (playerId) {
    removePlayer(playerId);
};
//обработчик кнопки Start Game
startGameBtn.addEventListener('click', function () {
    if (players.length === 0) {
        alert('Cannot start game with no players');
        return;
    }

    //сохранение списка игроков с начальными очками (0)
    const playersForGame = players.map(p => ({
        id: p.id,
        nickname: p.nickname,
        score: 0
    }));

    sessionStorage.setItem('gamePlayers', JSON.stringify(playersForGame));
    sessionStorage.setItem('isAdmin', 'true');

    //переходим к первому вопросу
    window.location.href = 'quiz.html';
});
//инициализация пустого списока игроков
renderPlayers();
