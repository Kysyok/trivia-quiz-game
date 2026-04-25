from api.slow_api.router import SlowAPIRouter
from api.routes.checks import check_player_in_room, check_session, get_room
from app.game.engine import game_engine
from app.game.exceptions import StartError, RoomError


lobby_router = SlowAPIRouter("Lobby")


@lobby_router.route("/start")
async def start_game(player_session_token, room_id):
    try:
        game_engine.start_room(player_session_token, room_id)
    except StartError as error:
        return {"error": error.message}

    return {"message": "The room has been started"}


@lobby_router.route("/leave")
async def leave_game(player_session_token, room_id, nickname):
    try:
        game_engine.remove_player_from_room(player_session_token, room_id, nickname)
    except RoomError as error:
        return {"error": error.message}
    
    room.players.remove(session_id)

    if room.host == session_id and room.players:
        room.host = room.players[0]

    if len(room.players) == 0:
        del game.rooms[room_number]
        del game.sessions[session_id]
        return {"message": "Room deleted"}
    
    del game.sessions[session_id]

    return {
        "message": "Left room",
        "players": [
            game.sessions[s]["nickname"]
            for s in room.players
        ],
        "host": game.sessions[room.host]["nickname"]
    }
