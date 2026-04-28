import {clientCreateGame, clientJoinGame} from "/js/tools/api_client.js";

if ([true, "roomNumber", "playerNickname", "sessionToken", "isAdmin"].reduce(
    (a, b) => a && (sessionStorage.getItem(b) != null)
)) window.location.href = 'lobby.html'
else sessionStorage.clear()

//валидация для страницы входа

const form = document.querySelector('.join-form');
const roomInput = document.getElementById('roomNumber');
const nicknameInput = document.getElementById('nickname');

//validation function
function validateForm() {
    let isValid = true;

    //room number field validation
    if (document.activeElement.textContent === "join" && !roomInput.value.trim()) {
        roomInput.classList.add('error');
        isValid = false;
    } else {
        roomInput.classList.remove('error');
    }

    //nickname field
    if (!nicknameInput.value.trim()) {
        nicknameInput.classList.add('error');
        isValid = false;
    } else {
        nicknameInput.classList.remove('error');
    }

    return isValid;
}

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (validateForm()) {
        const roomNumber = roomInput.value.trim();
        const nickname = nicknameInput.value.trim();

        const response = document.activeElement.textContent === "join" ?
            await clientJoinGame(roomNumber, nickname) : await clientCreateGame(nickname)
        if (response.error) {
            return
        }

        sessionStorage.setItem('playerNickname', nickname);
        if (document.activeElement.textContent === "join") {
            sessionStorage.setItem('roomNumber', roomNumber)
            sessionStorage.setItem('isAdmin', '0')
        } else {
            sessionStorage.setItem('roomNumber', response.room_number)
            sessionStorage.setItem('isAdmin', '1')
        }
        sessionStorage.setItem('sessionToken', response.session_token)

        //roud to waiting page
        window.location.href = 'lobby.html';
    }
});

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

roomInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '').slice(0, 6);
});
