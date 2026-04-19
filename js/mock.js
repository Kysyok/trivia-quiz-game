// js/mock.js — моковые данные для демонстрации

// Моковые игроки
const mockPlayers = [
    { id: 1, nickname: 'alice', score: 0 },
    { id: 2, nickname: 'bob', score: 0 },
    { id: 3, nickname: 'charlie', score: 0 },
    { id: 4, nickname: 'diana', score: 0 }
];

// Моковые вопросы
const mockQuestions = [
    {
        id: 1,
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correct: 2,
        timeLimit: 20
    },
    {
        id: 2,
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correct: 1,
        timeLimit: 20
    },
    {
        id: 3,
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correct: 1,
        timeLimit: 15
    }
];

// Моковые результаты
const mockResults = {
    players: mockPlayers,
    questions: mockQuestions
};

// Экспорт для использования (если используете модули)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mockPlayers, mockQuestions, mockResults };
}