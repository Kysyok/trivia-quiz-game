import {clientCreateGame, clientJoinGame} from "/js/tools/api_client.js";

if ([true, "roomNumber", "playerNickname", "sessionToken", "isAdmin"].reduce(
    (a, b) => a && (sessionStorage.getItem(b) != null)
)) window.location.href = 'lobby.html'
else sessionStorage.clear()

//валидация для страницы входа

const form = document.querySelector('.join-form');
const roomInput = document.getElementById('roomNumber');
const nicknameInput = document.getElementById('nickname');

//функция проверки пустых полей
function validateForm() {
    let isValid = true;

    //проверка поля room number
    if (document.activeElement.textContent === "join" && !roomInput.value.trim()) {
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
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log("here")

    if (validateForm()) {
        //если поля заполнены значит перенаправляем в лобби игрока
        const roomNumber = roomInput.value.trim();
        const nickname = nicknameInput.value.trim();

        const response = document.activeElement.textContent === "join" ?
            await clientJoinGame(roomNumber, nickname) : await clientCreateGame(nickname)
        if (response.error) {
            console.log(`Error! ${response.error}`)
            return
        }

        //сохраняем данные в sessionStorage для использования на других страницах
        sessionStorage.setItem('playerNickname', nickname);
        if (document.activeElement.textContent === "join") {
            sessionStorage.setItem('roomNumber', roomNumber)
            sessionStorage.setItem('isAdmin', '0')
        } else {
            sessionStorage.setItem('roomNumber', response.room_number)
            sessionStorage.setItem('isAdmin', '1')
        }
        sessionStorage.setItem('sessionToken', response.session_token)

        //перенаправление на страницу ожидания
        window.location.href = 'lobby.html';
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
