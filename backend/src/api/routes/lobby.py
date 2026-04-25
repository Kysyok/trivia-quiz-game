from api.slow_api.router import SlowAPIRouter
from app.game.engine import game_engine
from app.game.exceptions import StartError, RoomError, SessionError

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
    except (RoomError, SessionError) as error:
        return {"error": error.message}

    return {
        "message": "The room has been left"
    }
