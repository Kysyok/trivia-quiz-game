import random
import uuid

from app.game.exceptions import StartError, SessionError, RoomError
from app.game.player import Player
from app.game.questions import QUESTIONS


class Room:
    def __init__(self):
        self.host_session_token = None
        self.players = list()
        self.questions = set()
        self.state = None  # None = not started, True = started, False = finished

    def choose_questions(self, count_per_player):
        self.questions = set(random.sample(QUESTIONS, k=len(self.players) * count_per_player))

    def raise_started_exception(self):
        raise StartError("The room is started already")

    def add_player(self, nickname):
        if self.state:
            self.raise_started_exception()
        player = Player(nickname)
        self.players.append(player)
        return player.session_token

    def remove_player(self, player_session_token, nickname):
        if self.state:
            self.raise_started_exception()
        for player in self.players:
            if player.nickname == nickname:
                if player.session_token != player_session_token:
                    raise SessionError("Player session tokens mismatch")
                self.players.remove(player)
                if self.host_session_token == player_session_token:
                    self.host_session_token = self.players[0].session_token
                break
        else:
            raise RoomError("There is no such player")

    def get_player_nicknames(self):
        return [elem.nickname for elem in self.players]

    def get_players_count(self):
        return len(self.players)

    def start(self):
        if self.state:
            self.raise_started_exception()
        self.state = True
        
