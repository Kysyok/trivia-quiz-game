import random

from app.game.exceptions import JoinError
from app.game.room import Room


class Engine:
    def __init__(self):
        self.rooms = dict()
        self.rooms_id_range = [100_000, 1_000_000]

    def create_player_in_room(self, room_id, nickname):
        if room_id not in self.rooms:
            raise JoinError("There is no such game")
        room_to_be_joined_to = self.rooms[room_id]
        if room_to_be_joined_to.started:
            raise JoinError("The game has been already started")
        if nickname in room_to_be_joined_to.get_player_nicknames():
            raise JoinError("Joined already")
        return room_to_be_joined_to.add_player(nickname)

    def create_room(self, nickname):
        while (room_id := random.randrange(*self.rooms_id_range)) in self.rooms:
            continue
        self.rooms[room_id] = Room()
        host_session_token = self.rooms[room_id].add_player(nickname)
        self.rooms[room_id].host_session_token = host_session_token
        return room_id, host_session_token


game_engine = Engine()
