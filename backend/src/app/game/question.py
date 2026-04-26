import time

from app.game.exceptions import QuestionError


class Question:
    def __init__(self, question, reasoning_time=10):
        self._question = question
        self.expiration_date = time.monotonic() + reasoning_time
        self.players_who_saw = list()

    def get(self, player):
        if player in self.players_who_saw:
            raise QuestionError("You have already saw this question")
        self.players_who_saw.append(player)
        return self._question if time.monotonic() < self.expiration_date else None
