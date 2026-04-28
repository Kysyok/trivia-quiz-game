const PROTOCOL = "http"
const SERVER_ADDRESS = "localhost:12338"
const questionsCount = 5


function formFetch(endpoint, jsonBody) {
    return fetch(`${PROTOCOL}://${SERVER_ADDRESS}${endpoint}`, {
        method: "POST",
        body: JSON.stringify(jsonBody)
    })
}


function writeErrors(response) {
    if (response.error)
        console.log(response.error)
}


export async function clientJoinGame(roomId, nickname) {
    let response = await formFetch("/join", {
        "room_id": roomId,
        "nickname": nickname
    })
    response = await response.json(); writeErrors(response)
    return response;
}

export async function clientLeaveGame(playerSessionToken, roomId) {
    let response = await formFetch("/leave", {
        "player_session_token": playerSessionToken,
        "room_id": roomId
    })
    response = await response.json(); writeErrors(response)
    return response;
}

export async function clientStartGame(playerSessionToken, roomId, questionsPerPlayer=questionsCount) {
    let response = await formFetch("/start", {
        "player_session_token": playerSessionToken,
        "room_id": roomId,
        "questions_per_player": questionsPerPlayer
    })
    response = await response.json(); writeErrors(response)
    return response;
}

export async function clientCreateGame(nickname) {
    let response = await formFetch("/create", {
        "nickname": nickname
    })
    response = await response.json(); writeErrors(response)
    return response;
}

export async function clientPlayersAndStatus(playerSessionToken, roomId) {
    let response = await formFetch("/players", {
        "player_session_token": playerSessionToken,
        "room_id": roomId
    })
    response = await response.json(); writeErrors(response)
    return response;
}

export async function clientNextQuestion(playerSessionToken, roomId) {
    let response = await formFetch("/next", {
        "player_session_token": playerSessionToken,
        "room_id": roomId
    })
    response = await response.json(); writeErrors(response)
    return response;
}

export async function answerQuestion(playerSessionToken, roomId, optionIndex) {
    let response = await formFetch("/answer", {
        "player_session_token": playerSessionToken,
        "room_id": roomId,
        "answer": optionIndex
    })
    response = await response.json(); writeErrors(response)
    return response;
}

export async function clientGetResults(playerSessionToken, roomId) {
    let response = await formFetch("/results", {
        "player_session_token": playerSessionToken,
        "room_id": roomId
    })
    response = await response.json(); writeErrors(response)
    return response;
}
