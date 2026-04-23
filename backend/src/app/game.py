class Room:
    def __init__(self, players=list()):
        self.players = players

    def append(self, nickname):
        self.players.append(nickname)


class Game:
    def __init__(self):
        self.rooms = {416: Room()}


game = Game()
