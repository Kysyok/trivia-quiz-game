from api.slow_api.router import SlowAPIRouter
from app.game import game
from api.routes.checks import check_host, check_player_in_room, check_session, get_room

lobby_router = SlowAPIRouter("Lobby")

@lobby_router.route("/start")
async def start_game(room_number, session_id):
    room_number = str(room_number)

    error = check_session(session_id)
    if error:
        return error

    room, error = get_room(room_number)
    if error:
        return error

    error = check_host(room, session_id)
    if error:
        return {"error": "Only host can start the game"}

    if len(room.players) < 2:
        return {"error": "Need at least 2 players"}

    room.started = True
    room.current_question = 0
    room.finished = False
    room.scores = {}

    for player_session in room.players:
        room.scores[player_session] = 0

    return {"message": "Game started"}

@lobby_router.route("/leave")
async def leave_game(room_number, session_id):
    room_number = str(room_number)

    error = check_session(session_id)
    if error:
        return error

    room, error = get_room(room_number)
    if error:
        return error
    
    error = check_player_in_room(room, session_id)
    if error:
        return error
    
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
