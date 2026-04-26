import random

from app.game.exceptions import JoinError, StartError, RoomError, SessionError
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

    def room_id_process(self, room_id):
        room_id = int(room_id)
        if room_id not in self.rooms:
            raise StartError("There is no such room")
        return room_id

    def token_process(self, player_session_token, room_id):
        if player_session_token not in self.rooms[room_id].get_player_tokens():
            raise SessionError("Invalid player session token")

    def start_room(self, player_session_token, room_id, questions_per_player):
        room_id = self.room_id_process(room_id)
        if self.rooms[room_id].host_session_token != player_session_token:
            raise StartError("Only host can start the game")
        if self.rooms[room_id].get_players_count() < 2:
            raise StartError("At least two players have to be joined to the room")
        return self.rooms[room_id].start(questions_per_player)

    def remove_player_from_room(self, player_session_token, room_id):
        room_id = self.room_id_process(room_id)
        self.rooms[room_id].remove_player(player_session_token)
        if not self.rooms[room_id].players:
            del self.rooms[room_id]
            raise RoomError("No players left")

    def get_next_question(self, player_session_token, room_id):
        room_id = self.room_id_process(room_id)
        self.token_process(player_session_token, room_id)
        return self.rooms[room_id].get_question()

    def answer_question(self, player_session_token, room_id, answer):
        room_id = self.room_id_process(room_id)
        self.token_process(player_session_token, room_id)
        return self.rooms[room_id].propose_answer(player_session_token, answer)

game_engine = Engine()
