from api.slow_api.router import Router
from app.game import Room, game

router = Router()

@router.route("/start")
async def start_game(room_number, session_id):
    room_number = str(room_number)

    if session_id not in game.sessions:
        return {"error": "Invalid session"}

    room = game.rooms.get(room_number)
    if not room:
        return {"error": "No such room"}

    if room.host != session_id:
        return {"error": "Only host can start the game"}

    if len(room.players) < 2:
        return {"error": "Need at least 2 players"}

    room.started = True

    return {"message": "Game started"}

@router.route("/leave")
async def leave_game(room_number, session_id):
    room_number = str(room_number)

    if session_id not in game.sessions:
        return {"error": "Invalid session"}

    room = game.rooms.get(room_number)
    if not room:
        return {"error": "No such room"}
    
    if session_id not in room.players:
        return {"error": "Player not in room"}
    
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

