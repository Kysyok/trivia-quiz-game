const PROTOCOL = "http"
const SERVER_ADDRESS = "localhost:12338"
const questionsCount = 5

let msEntireLatency = 0
let latencyMeasurementsCount = 0

async function fetchBody(endpoint, jsonBody) {
    try {
        let startTime = performance.now()
        let response = await fetch(`${PROTOCOL}://${SERVER_ADDRESS}${endpoint}`, {
            method: "POST",
            body: JSON.stringify(jsonBody)
        })
        response = await response.json()
        if (response.error)
            console.log(response.error)
        msEntireLatency += performance.now() - startTime
        latencyMeasurementsCount++
        console.log(`Current Latency: ${Math.round(performance.now() - startTime)}ms\nAverage Latency: ${Math.round(msEntireLatency / latencyMeasurementsCount)}ms`)
        return response
    } catch(e) {
        console.log(`A polling error occurred! For${PROTOCOL}://${SERVER_ADDRESS}${endpoint} — ${e}`)
        return {
            "error": "polling error"
        }
    }
}


export async function clientJoinGame(roomId, nickname) {
    return await fetchBody("/join", {
        "room_id": roomId,
        "nickname": nickname
    })
}

export async function clientLeaveGame(playerSessionToken, roomId) {
    return await fetchBody("/leave", {
        "player_session_token": playerSessionToken,
        "room_id": roomId
    })
}

export async function clientStartGame(playerSessionToken, roomId, questionsPerPlayer=questionsCount) {
    return await fetchBody("/start", {
        "player_session_token": playerSessionToken,
        "room_id": roomId,
        "questions_per_player": questionsPerPlayer
    })
}

export async function clientCreateGame(nickname) {
    return await fetchBody("/create", {
        "nickname": nickname
    })
}

export async function clientPlayersAndStatus(playerSessionToken, roomId) {
    return await fetchBody("/players", {
        "player_session_token": playerSessionToken,
        "room_id": roomId
    })
}

export async function clientNextQuestion(playerSessionToken, roomId) {
    return await fetchBody("/next", {
        "player_session_token": playerSessionToken,
        "room_id": roomId
    })
}

export async function answerQuestion(playerSessionToken, roomId, optionIndex) {
    return await fetchBody("/answer", {
        "player_session_token": playerSessionToken,
        "room_id": roomId,
        "answer": optionIndex
    })
}

export async function clientGetResults(playerSessionToken, roomId) {
    return await fetchBody("/results", {
        "player_session_token": playerSessionToken,
        "room_id": roomId
    })
}
