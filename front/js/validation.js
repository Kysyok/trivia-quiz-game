//валидация для страницы входа

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.join-form');
    const roomInput = document.getElementById('roomNumber');
    const nicknameInput = document.getElementById('nickname');
    //проверка что мы на странице входа
    if (!form || !roomInput || !nicknameInput) {
        return; //выходим если это другая страница
    }
    
    //функция проверки пустых полей
    function validateForm() {
        let isValid = true;
        
        //проверка поля room number
        if (!roomInput.value.trim()) {
            roomInput.classList.add('error');
            isValid = false;
        } else {
            roomInput.classList.remove('error');
        }
        
        //проверка поля nickname
        if (!nicknameInput.value.trim()) {
            nicknameInput.classList.add('error');
            isValid = false;
        } else {
            nicknameInput.classList.remove('error');
        }
        
        return isValid;
    }
    
    //обработка отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            //если поля заполнены значит перенаправляем в лобби игрока
            const roomNumber = roomInput.value.trim();
            const nickname = nicknameInput.value.trim();
            
            //сохраняем данные в sessionStorage для использования на других страницах
            sessionStorage.setItem('playerNickname', nickname);
            sessionStorage.setItem('roomNumber', roomNumber);
            
            //перенаправление на страницу ожидания игрока
            window.location.href = 'player-lobby.html';
        }
    });
    
    //убираем красную подсветку при вводе
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
    
    //только цифры для номера комнаты
    roomInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 6);
    });
});