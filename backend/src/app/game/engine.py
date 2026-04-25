import random

from app.game.exceptions import JoinError, StartError, RoomError
from app.game.room import Room


class Engine:
    def __init__(self):
        self.rooms = dict()
        self.rooms_id_range = [100_000, 1_000_000]

    def create_player_in_room(self, room_id, nickname):
        room_id = int(room_id)
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

    def start_room(self, player_session_token, room_id):
        room_id = int(room_id)
        if room_id not in self.rooms:
            raise StartError("There is no such room")
        if self.rooms[room_id].host_session_token != player_session_token:
            raise StartError("Only host can start the game")
        if self.rooms[room_id].get_players_count() < 2:
            raise StartError("At least two players have to be joined to the room")
        self.rooms[room_id].start()

    def remove_player_from_room(self, player_session_token, room_id, nickname):
        room_id = int(room_id)
        if room_id not in self.rooms:
            raise RoomError("There is no such room")
        self.rooms[room_id].remove_player(player_session_token, nickname)


game_engine = Engine()
