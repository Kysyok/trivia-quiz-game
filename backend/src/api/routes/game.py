from api.slow_api.router import SlowAPIRouter
from api.routes.checks import check_game_started, check_host, check_player_in_room, check_session, get_room
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
async def answer_question(room_number, session_id, answer):
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

    error = check_game_started(room)
    if error:
        return error

    if room.finished or room.current_question >= len(room.questions):
        return {"error": "Game already finished"}

    current_player = get_current_player(room)

    if session_id != current_player:
        return {"error": "It is not your turn"}

    question = room.questions[room.current_question]

    try:
        answer = int(answer)
    except ValueError:
        return {"error": "Invalid answer"}

    if answer < 0 or answer >= len(question["options"]):
        return {"error": "Invalid answer"}

    correct = answer == question["correct"]
    if correct:
        room.scores[session_id] = room.scores.get(session_id, 0) + 1

    return {
        "correct": correct,
        "correct_answer": question["correct"]
    }


@game_router.route("/results")
async def game_results(room_number, session_id):
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

    results = [
        {
            "nickname": game.sessions[player]["nickname"],
            "score": room.scores.get(player, 0)
        }
        for player in room.players
    ]

    results.sort(key=lambda player: player["score"], reverse=True)

    return {
        "finished": room.finished,
        "results": results
    }
