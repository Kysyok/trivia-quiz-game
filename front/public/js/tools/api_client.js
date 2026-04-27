const PROTOCOL = "http"
const SERVER_ADDRESS = "localhost:12338"


function formFetch(endpoint, jsonBody) {
    return fetch(`${PROTOCOL}://${SERVER_ADDRESS}${endpoint}`, {
        method: "POST",
        body: JSON.stringify(jsonBody)
    })
}


export async function clientJoinGame(roomId, nickname) {
    const response = await formFetch("/join", {
        "room_id": roomId,
        "nickname": nickname
    })
    return await response.json();
}

export async function clientLeaveGame(playerSessionToken, roomId) {
    const response = await formFetch("/leave", {
        "player_session_token": playerSessionToken,
        "room_id": roomId
    })
    return await response.json();
}

export async function clientStartGame(playerSessionToken, roomId, questionsPerPlayer=15) {
    const response = await formFetch("/start", {
        "player_session_token": playerSessionToken,
        "room_id": roomId,
        "questions_per_player": questionsPerPlayer
    })
    return await response.json();
}

export async function clientCreateGame(nickname) {
    const response = await formFetch("/create", {
        "nickname": nickname
    })
    return await response.json();
}

export async function clientPlayersAndStatus(playerSessionToken, roomId) {
    const response = await formFetch("/players", {
        "player_session_token": playerSessionToken,
        "room_id": roomId
    })
    return await response.json();
}
