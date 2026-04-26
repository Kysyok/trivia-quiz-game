import random
import time

from app.game.exceptions import StartError, SessionError, RoomError
from app.game.player import Player
from app.game.question import Question
from app.game.questions import QUESTIONS


class Room:
    def __init__(self):
        self.host_session_token = None
        self.players = list()
        self.questions = set()
        self.question = Question(None)
        self.state = None  # None = not started, True = started, False = finished

    def choose_questions(self, questions_per_player):
        self.questions = set(random.sample(QUESTIONS, k=len(self.players) * questions_per_player))

    def raise_started_exception(self):
        if self.state:
            raise StartError("The room is started already")

    def raise_not_started_exception(self):
        if not self.state:
            raise StartError(f"The room is {"not started yet" if self.state is None else "finished"}")

    def add_player(self, nickname):
        self.raise_started_exception()
        player = Player(nickname)
        self.players.append(player)
        return player.session_token

    def remove_player(self, player_session_token):
        self.raise_started_exception()
        if not (player := self.get_player_by_token(player_session_token)):
            raise SessionError("Player session tokens mismatch")
        self.players.remove(player)
        if self.host_session_token == player_session_token:
            self.host_session_token = self.players[0].session_token

    def get_player_nicknames(self):
        return [elem.nickname for elem in self.players]

    def get_player_tokens(self):
        return [elem.session_token for elem in self.players]

    def get_player_by_token(self, token):
        return {t: p for t, p in zip(self.get_player_tokens(), self.players)}.get(token)

    def get_players_count(self):
        return len(self.players)

    def players_rotation(self):
        self.players[0].answering = False
        self.players.insert(0, self.players.pop(-1))
        self.players[0].answering = True

    def start(self, questions_per_player):
        self.raise_started_exception()
        self.state = True
        self.choose_questions(questions_per_player)

        return {
            "questions_count": len(self.questions)
        }

    def get_question(self):
        self.raise_not_started_exception()
        self.raise_started_exception()
        question = self.question.get()
        if not question:
            self.players_rotation()
            self.question = Question(self.questions.pop())
            question = self.question.get()
        return {
            "question": question,
            "answering": self.players[0].nickname
        }

    def propose_answer(self, player_session_token, answer):
        self.raise_not_started_exception()
        self.raise_started_exception()
        if not self.get_player_by_token(player_session_token).answering:
            raise RoomError("You are not answering")
        self.players[0].answer(self.question, answer)
        return self.question.get()


timer = time.monotonic()
print(timer)
