//общие функции для всего проекта

//функция для получения данных игрока
function getPlayerData() {
    return {
        nickname: sessionStorage.getItem('playerNickname') || 'Player',
        roomNumber: sessionStorage.getItem('roomNumber') || '000000',
        isAdmin: sessionStorage.getItem('isAdmin') === 'true'
    };
}

//функция для получения кода комнаты
function getRoomCode() {
    return sessionStorage.getItem('adminRoomCode') || 
           sessionStorage.getItem('roomNumber') || 
           '000000';
}

//функция для очистки данных при выхлде
function clearPlayerData() {
    sessionStorage.removeItem('playerNickname');
    sessionStorage.removeItem('roomNumber');
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('adminRoomCode');
    sessionStorage.removeItem('gamePlayers');
}

//функция для проверки авторизации (нельзя оставить поля незаполненными)
function checkAuth() {
    const nickname = sessionStorage.getItem('playerNickname');
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    
    if (!nickname && !isAdmin) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

//обработчик для кнопки leave lobby
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-leave') || 
        (e.target.tagName === 'A' && e.target.href.includes('index.html'))) {
        clearPlayerData();
    }
});



