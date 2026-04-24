import random
import uuid

from api.slow_api.router import SlowAPIRouter
from app.game.game import Room, game


menu_router = SlowAPIRouter("Menu")


@menu_router.route("/join")
async def join_a_game(room_number, nickname):
    room_number = str(room_number)

    if room_number not in game.rooms:
        return {
            "error": "There is no such game"
        }
    
    if game.rooms[room_number].started:
        return {
            "error": "Game already started"
        }

    room = game.rooms[room_number]

    if any(game.sessions[s]["nickname"] == nickname for s in room.players):
        return {"error": "Nickname already exists in this room"}
    
    session_id = str(uuid.uuid4())

    game.sessions[session_id] = {
        "nickname": nickname,
        "room": room_number
    }

    room.players.append(session_id)
    return {
        "room_number": room_number,
        "session_id": session_id,
        "players": [
            game.sessions[s]["nickname"] for s in room.players
        ]
    }

@menu_router.route("/create")
async def create_a_game(nickname):
    session_id = str(uuid.uuid4())

    while True:
        room_number = str(random.randint(100000, 999999))

        if room_number not in game.rooms:
            break

    game.sessions[session_id] = {
        "nickname": nickname,
        "room": room_number
    }

    game.rooms[room_number] = Room(host_session=session_id)

    return {
        "room_number": room_number,
        "session_id": session_id
    }
