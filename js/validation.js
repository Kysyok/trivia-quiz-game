// js/validation.js — валидация для страницы входа

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.join-form');
    const roomInput = document.getElementById('roomNumber');
    const nicknameInput = document.getElementById('nickname');
    
    // Проверяем, что мы на странице входа (есть форма)
    if (!form || !roomInput || !nicknameInput) {
        return; // Выходим если это другая страница
    }
    
    // Функция проверки пустых полей
    function validateForm() {
        let isValid = true;
        
        // Проверка поля room number
        if (!roomInput.value.trim()) {
            roomInput.classList.add('error');
            isValid = false;
        } else {
            roomInput.classList.remove('error');
        }
        
        // Проверка поля nickname
        if (!nicknameInput.value.trim()) {
            nicknameInput.classList.add('error');
            isValid = false;
        } else {
            nicknameInput.classList.remove('error');
        }
        
        return isValid;
    }
    
    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Поля заполнены - перенаправляем в лобби игрока
            const roomNumber = roomInput.value.trim();
            const nickname = nicknameInput.value.trim();
            
            // Сохраняем данные в sessionStorage для использования на других страницах
            sessionStorage.setItem('playerNickname', nickname);
            sessionStorage.setItem('roomNumber', roomNumber);
            
            // Перенаправление на страницу ожидания игрока
            window.location.href = 'player-lobby.html';
        }
    });
    
    // Убираем красную подсветку при вводе
    roomInput.addEventListener('input', function() {
        if (this.value.trim()) {
            this.classList.remove('error');
        }
    });
    
    nicknameInput.addEventListener('input', function() {
        if (this.value.trim()) {
            this.classList.remove('error');
        }
    });
    
    // Дополнительно: только цифры для номера комнаты
    roomInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 6);
    });
});