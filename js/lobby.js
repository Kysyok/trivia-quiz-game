// js/lobby.js — управление лобби администратора

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что мы на странице лобби
    const playersList = document.getElementById('playersList');
    if (!playersList) return;

    // Генерируем случайный код комнаты
    const roomCode = generateRoomCode();
    document.getElementById('roomCodeDisplay').textContent = roomCode;
    
    // Сохраняем код комнаты
    sessionStorage.setItem('adminRoomCode', roomCode);

    // Массив игроков
        let players = [
        { id: 1, nickname: 'alice', joinedAt: new Date() },
        { id: 2, nickname: 'bob', joinedAt: new Date() },
        { id: 3, nickname: 'charlie', joinedAt: new Date() },
        { id: 4, nickname: 'diana', joinedAt: new Date() },
        { id: 5, nickname: 'eve', joinedAt: new Date() }
    ];
    
    // DOM элементы
    const playerCountSpan = document.getElementById('playerCount');
    const startGameBtn = document.getElementById('startGameBtn');

    // Генерация кода комнаты
    function generateRoomCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Добавление игрока (публичная функция для демо)
    window.addPlayer = function(nickname) {
        const player = {
            id: Date.now() + Math.random(),
            nickname: nickname || `player_${players.length + 1}`,
            joinedAt: new Date()
        };
        
        players.push(player);
        renderPlayers();
    };

    // Удаление игрока (без подтверждения)
    function removePlayer(playerId) {
        players = players.filter(p => p.id !== playerId);
        renderPlayers();
    }

    // Отрисовка списка игроков
    function renderPlayers() {
        // Обновляем счетчик
        playerCountSpan.textContent = players.length;
        
        // Включаем/выключаем кнопку старта
        startGameBtn.disabled = players.length === 0;
        
        // Если нет игроков — показываем пустое состояние
        if (players.length === 0) {
            playersList.innerHTML = `
                <div class="empty-state">
                    <p>waiting for players...</p>
                    <p class="empty-hint">share the room code to invite</p>
                </div>
            `;
            return;
        }
        
        // Отрисовываем игроков
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

    // Обработчик удаления (глобальная функция для onclick)
    window.removePlayerHandler = function(playerId) {
        removePlayer(playerId);
    };

    // Обработчик кнопки Start Game
    startGameBtn.addEventListener('click', function() {
        if (players.length === 0) {
            alert('Cannot start game with no players');
            return;
        }
        
        // Сохраняем список игроков
        sessionStorage.setItem('gamePlayers', JSON.stringify(players));
        sessionStorage.setItem('isAdmin', 'true');
        
        // Переходим к первому вопросу
        window.location.href = 'quiz.html';
    });

    // Инициализация — пустой список
    renderPlayers();

    // Для демонстрации добавляем функцию в консоль
    console.log('Admin Lobby ready. Room code:', roomCode);
    console.log('Use addPlayer("nickname") in console to simulate new player');
});