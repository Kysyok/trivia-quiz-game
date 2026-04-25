from api.slow_api.router import SlowAPIRouter
from app.game.engine import game_engine
from app.game.exceptions import JoinError


menu_router = SlowAPIRouter("Menu")


@menu_router.route("/join")
async def join_room(room_id, nickname):
    try:
        player_session_id = game_engine.create_player_in_room(room_id, nickname)
    except JoinError as error:
        return {
            "error": error.message
        }

    return {
        "session_id": player_session_id,
    }


@menu_router.route("/create")
async def create_game(nickname):
    room_id, player_session_id = game_engine.create_room(nickname)

    return {
        "room_number": room_id,
        "session_id": player_session_id
    }
