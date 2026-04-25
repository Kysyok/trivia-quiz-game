class GameError(Exception):
    def __init__(self, message):
        super().__init__()
        self.add_note(message)
        self.message = message


class JoinError(GameError):
    def __init__(self, message):
        super().__init__(message)

class StartError(GameError):
    def __init__(self, message):
        super().__init__(message)
