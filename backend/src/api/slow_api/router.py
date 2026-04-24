from api.slow_api.exceptions import SameEndpoints


class SlowAPIRouter:
    def __init__(self, name):
        self.name = name
        self.function_lookup = dict()

    def route(self, route):
        def decorator(function):
            self.function_lookup[route] = function
            return function
        return decorator

    def __getitem__(self, item):
        return self.function_lookup[item]

    def __iadd__(self, other):
        for key in other.function_lookup:
            if key in self.function_lookup:
                raise SameEndpoints
        self.function_lookup.update(other.function_lookup)
        self.name += f"+{other.name}"
        return self
