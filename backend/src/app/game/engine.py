import asyncio
import random
import time

from app.game.exceptions import JoinError, StartError, RoomError, SessionError
from app.game.room import Room


class Engine:
    def __init__(self):
        self.rooms = dict()
        self.rooms_id_range = [100_000, 1_000_000]
        self.room_delete_tasks = set()
        self.room_expiration_time = 3600 / 2

    def create_player_in_room(self, room_id, nickname):
        room_id = int(room_id)
        if room_id not in self.rooms:
            raise JoinError("There is no such game")
        room_to_be_joined_to = self.rooms[room_id]
        if room_to_be_joined_to.state:
            raise JoinError("The game has been already started")
        if nickname in room_to_be_joined_to.get_player_nicknames():
            raise JoinError("Joined already")
        return room_to_be_joined_to.add_player(nickname)

    async def delete_expired_room(self, room_id):
        await asyncio.sleep(self.room_expiration_time)
        if time.monotonic() - self.rooms[room_id].last_accessed_time >= self.room_expiration_time:
            del self.rooms[room_id]
            return
        task = asyncio.create_task(self.delete_expired_room(room_id))
        task.add_done_callback(lambda t: self.room_delete_tasks.discard(t))
        self.room_delete_tasks.add(task)

    def create_room(self, nickname):
        while (room_id := random.randrange(*self.rooms_id_range)) in self.rooms:
            continue
        self.rooms[room_id] = Room()
        host_session_token = self.rooms[room_id].add_player(nickname)
        self.rooms[room_id].host_session_token = host_session_token
        task = asyncio.create_task(self.delete_expired_room(room_id))
        task.add_done_callback(lambda t: self.room_delete_tasks.discard(t))
        self.room_delete_tasks.add(task)
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
        try:
            self.rooms[room_id].remove_player(player_session_token)
        except RoomError as exception:
            del self.rooms[room_id]
            raise exception

    def get_next_question(self, player_session_token, room_id):
        room_id = self.room_id_process(room_id)
        self.token_process(player_session_token, room_id)
        return self.rooms[room_id].get_question()

    def answer_question(self, player_session_token, room_id, answer):
        room_id = self.room_id_process(room_id)
        self.token_process(player_session_token, room_id)
        return self.rooms[room_id].propose_answer(player_session_token, answer)

    def get_results(self, player_session_token, room_id):
        room_id = self.room_id_process(room_id)
        self.token_process(player_session_token, room_id)
        return self.rooms[room_id].get_results()

    def get_room_players_and_status(self, player_session_token, room_id):
        room_id = self.room_id_process(room_id)
        self.token_process(player_session_token, room_id)
        return {
            "players": self.rooms[room_id].get_player_nicknames(),
            "status": self.rooms[room_id].state
        }


game_engine = Engine()
