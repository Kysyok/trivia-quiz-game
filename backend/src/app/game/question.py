import time
import copy


class Question:
    def __init__(self, question, reasoning_time=20, gap_time=5):
        self.question = question
        self.expiration_date = time.monotonic() + reasoning_time
        self.gap_time = gap_time

    def mark_answered(self, answer):
        if "answered" in self.question:
            return False
        self.question["answered"] = int(answer)
        return self.question["answered"] == self.question["correct"]

    def get(self):
        if condition_1 := time.monotonic() < self.expiration_date + self.gap_time:
            return None
        if "answered" in self.question and condition_1:
            return self.question
        if time.monotonic() > self.expiration_date:
            self.mark_answered(-1)
            return self.question
        question = copy.deepcopy(self.question)
        del question["correct"]
        return self.question
