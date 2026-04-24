from api.slow_api.router import SlowAPIRouter
from app.game import game
from api.routes.checks import check_game_started, check_host, check_player_in_room, check_session, get_room

game_ep_router = SlowAPIRouter("GameEp")


def get_current_player(room):
    if not room.players:
        return None
    
    players = room.players
    number_of_plaers = len(players)
    index = room.current_question % number_of_plaers
    current_player = players[index]

    return current_player

@game_ep_router.route("/state")
async def game_state(room_number, session_id):
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
        return {
            "finished": True,
            "scores": {
                game.sessions[player]["nickname"]: room.scores.get(player, 0)
                for player in room.players
            }
        }

    question = room.questions[room.current_question]
    current_player = get_current_player(room)

    return {
        "finished": False,
        "question_index": room.current_question,
        "question_number": room.current_question + 1,
        "total_questions": len(room.questions),
        "question": {
            "text": question["text"],
            "options": question["options"]
        },
        "current_player": game.sessions[current_player]["nickname"],
        "your_turn": current_player == session_id,
        "players": [
            game.sessions[player]["nickname"]
            for player in room.players
        ],
        "scores": {
            game.sessions[player]["nickname"]: room.scores.get(player, 0)
            for player in room.players
        }
    }


@game_ep_router.route("/answer")
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


@game_ep_router.route("/next")
async def next_question(room_number, session_id):
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

    error = check_host(room, session_id)
    if error:
        return {"error": "Only host can switch question"}

    if room.finished:
        return {"error": "Game already finished"}

    room.current_question += 1

    if room.current_question >= len(room.questions):
        room.finished = True
        return {"message": "Game finished"}

    question = room.questions[room.current_question]
    current_player = get_current_player(room)

    return {
        "message": "Next question",
        "question_number": room.current_question + 1,
        "current_player": game.sessions[current_player]["nickname"],
        "question": {
            "text": question["text"],
            "options": question["options"]
        }
    }


@game_ep_router.route("/results")
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
