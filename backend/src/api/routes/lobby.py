from api.slow_api.router import SlowAPIRouter
from app.game.engine import game_engine
from app.game.exceptions import StartError, RoomError, SessionError

lobby_router = SlowAPIRouter("Lobby")


@lobby_router.route("/players")
async def get_players(player_session_token, room_id):
    try:
        players_and_status = game_engine.get_room_players_and_status(player_session_token, room_id)
    except StartError as error:
        return {"error": error.message}

    return players_and_status


@lobby_router.route("/start")
async def start_game(player_session_token, room_id, questions_per_player):
    try:
        questions_count_information = game_engine.start_room(player_session_token, room_id, questions_per_player)
    except StartError as error:
        return {"error": error.message}

    return questions_count_information


@lobby_router.route("/leave")
async def leave_game(player_session_token, room_id):
    try:
        game_engine.remove_player_from_room(player_session_token, room_id)
    except (RoomError, SessionError) as error:
        return {"error": error.message}

    return {
        "message": "The room has been left"
    }
