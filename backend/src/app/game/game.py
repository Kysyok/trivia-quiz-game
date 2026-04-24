from app.game.question import QUESTIONS

class Room:
    def __init__(self, host_session):
        self.host = host_session
        self.players = [host_session]
        self.started = False
        self.current_question = 0
        self.scores = {host_session: 0}
        self.finished = False
        self.questions = []

        for question in QUESTIONS:
            self.questions.append(question.copy())
        
    def append(self, nickname):
        self.players.append(nickname)

class Game:
    def __init__(self):
        self.rooms = {}
        self.sessions = {}


game = Game()
