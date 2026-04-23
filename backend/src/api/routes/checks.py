from app.game import game


def check_session(session_id):
    if session_id not in game.sessions:
        return {"error": "Invalid session"}

    return None


def get_room(room_number):
    room_number = str(room_number)
    room = game.rooms.get(room_number)

    if not room:
        return None, {"error": "No such room"}

    return room, None


def check_player_in_room(room, session_id):
    if session_id not in room.players:
        return {"error": "Player not in room"}

    return None


def check_game_started(room):
    if not room.started:
        return {"error": "Game not started"}

    return None


def check_host(room, session_id):
    if room.host != session_id:
        return {"error": "Only host can do this"}

    return None
