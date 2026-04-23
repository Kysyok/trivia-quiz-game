from api.slow_api.router import Router
from app.game import game


router = Router()


@router.route("/join")
async def join_a_game(room_number, nickname):
    game.rooms[room_number].append(nickname)
    return {
        "joined_game_number": room_number
    }

