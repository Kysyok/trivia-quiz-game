import uuid


class Player:
    def __init__(self, nickname):
        self.nickname = nickname
        self.session_token = uuid.uuid4()
        self.score = int()
        self.answering = False

