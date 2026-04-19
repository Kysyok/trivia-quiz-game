// js/main.js — общие функции для всего проекта

// Функция для получения данных игрока
function getPlayerData() {
    return {
        nickname: sessionStorage.getItem('playerNickname') || 'Player',
        roomNumber: sessionStorage.getItem('roomNumber') || '000000',
        isAdmin: sessionStorage.getItem('isAdmin') === 'true'
    };
}

// Функция для получения кода комнаты
function getRoomCode() {
    return sessionStorage.getItem('adminRoomCode') || 
           sessionStorage.getItem('roomNumber') || 
           '000000';
}

// Функция для очистки данных (при выходе)
function clearPlayerData() {
    sessionStorage.removeItem('playerNickname');
    sessionStorage.removeItem('roomNumber');
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('adminRoomCode');
    sessionStorage.removeItem('gamePlayers');
}

// Функция для проверки авторизации
function checkAuth() {
    const nickname = sessionStorage.getItem('playerNickname');
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    
    if (!nickname && !isAdmin) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Добавляем обработчик для кнопки "leave lobby"
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-leave') || 
        (e.target.tagName === 'A' && e.target.href.includes('index.html'))) {
        clearPlayerData();
    }
});