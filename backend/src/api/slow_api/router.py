class Router:
    def __init__(self):
        self.function_lookup = dict()

    def route(self, route):
        def decorator(function):
            self.function_lookup[route] = function
            return function
        return decorator

    def __getitem__(self, item):
        return self.function_lookup[item]
