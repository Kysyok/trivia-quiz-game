from api.slow_api.router import SlowAPIRouter
from api.routes.checks import check_player_in_room, check_session, get_room
from app.game.engine import game_engine
from app.game.exceptions import RoomError, QuestionError

game_router = SlowAPIRouter("Game")


@game_router.route("/next")
async def next_question(player_session_token, room_id):
    try:
        question = game_engine.get_next_question(player_session_token, room_id)
    except (RoomError, QuestionError) as error:
        return {"error": error.message}

    return question


@game_router.route("/answer")
async def answer_question(player_session_token, room_id, answer):
    try:
        result = game_engine.answer_question(player_session_token, room_id, answer)
    except (RoomError, QuestionError) as error:
        return {"error": error.message}

    return result


@game_router.route("/results")
async def game_results(player_session_token, room_id):
    try:
        results = game_engine.get_results(player_session_token, room_id)
    except (RoomError, QuestionError) as error:
        return {"error": error.message}

    return results
