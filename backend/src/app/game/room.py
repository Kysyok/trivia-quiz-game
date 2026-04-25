import random
import uuid

from app.game.player import Player
from app.game.questions import QUESTIONS


class Room:
    def __init__(self):
        self.host_session_token = None
        self.players = list()
        self.questions = set()
        self.started = False
        self.finished = False

    def choose_questions(self, count_per_player):
        self.questions = set(random.sample(QUESTIONS, k=len(self.players) * count_per_player))

    def add_player(self, nickname):
        player = Player(nickname)
        self.players.append(player)
        return player.session_token

    def get_player_nicknames(self):
        return [elem.nickname for elem in self.players]
