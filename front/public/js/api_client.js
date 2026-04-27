const SERVER_ADDRESS = "localhost:12338"


export async function clientJoinGame(roomId, nickname) {
    const response = await fetch(`http://${SERVER_ADDRESS}/join`, {
        method: "POST",
        body: JSON.stringify({
            "room_id": roomId,
            "nickname": nickname
        })
    })
    return await response.json();
}
