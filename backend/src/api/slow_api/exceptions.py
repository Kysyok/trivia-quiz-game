class SameEndpoints(Exception):
    def __init__(self):
        super().__init__()
        self.add_note("Routers to be merged have same endpoints")
