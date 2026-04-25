class JoinError(Exception):
    def __init__(self, message):
        super().__init__()
        self.add_note(message)
        self.message = message
