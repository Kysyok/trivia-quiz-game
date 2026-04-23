class Room:
    def __init__(self, host_session):
        self.host = host_session
        self.players = [host_session]
        self.started = False
        
    def append(self, nickname):
        self.players.append(nickname)

class Game:
    def __init__(self):
        self.rooms = {}
        self.sessions = {}


game = Game()
