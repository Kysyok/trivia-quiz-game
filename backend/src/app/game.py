from question import QUESTIONS 

class Room:
    def __init__(self, host_session):
        self.host = host_session
        self.players = [host_session]
        self.started = False
        self.current_question = 0
        self.answers = {}
        self.scores = {host_session: 0}
        self.finished = False
        self.questions = []

        for question in QUESTIONS:
            self.questions.append(question.copy())
        
    def append(self, nickname):
        self.players.append(nickname)

    def start_game(self):
        self.started = True
        self.current_question = 0
        self.answers = {}
        self.finished = False
        self.scores = {}

        for player_session in self.players:
            self.scores[player_session] = 0

class Game:
    def __init__(self):
        self.rooms = {}
        self.sessions = {}


game = Game()
