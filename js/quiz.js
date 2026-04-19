// js/quiz.js — логика экрана вопроса

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что мы на странице квиза
    const questionText = document.getElementById('questionText');
    if (!questionText) return;

    // ===== НАСТРОЙКИ =====
    // Булева переменная: true = ваш ход, false = ход другого игрока
    const IS_MY_TURN = false;
    
    const TIME_LIMIT = 15; // секунд
    
    // Тестовые данные
    const currentPlayer = IS_MY_TURN ? 'you' : 'alice';
    const question = {
        text: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid']
    };
    
    // ===== DOM элементы =====
    const timerProgress = document.getElementById('timerProgress');
    const timerText = document.getElementById('timerText');
    const turnIndicator = document.getElementById('turnIndicator');
    const currentPlayerSpan = document.getElementById('currentPlayer');
    const answersContainer = document.getElementById('answersContainer');
    const waitingMessage = document.getElementById('waitingMessage');
    
    // ===== Переменные состояния =====
    let timeLeft = TIME_LIMIT;
    let timerInterval = null;
    let selectedAnswer = null;
    let canAnswer = IS_MY_TURN;
    
    // ===== Инициализация =====
    function init() {
        // Устанавливаем текст вопроса
        questionText.textContent = question.text;
        
        // Устанавливаем имя текущего игрока
        currentPlayerSpan.textContent = currentPlayer;
        
        // Настраиваем индикатор хода
        if (IS_MY_TURN) {
            turnIndicator.classList.add('my-turn');
        }
        
        // Показываем/скрываем элементы в зависимости от того, чей ход
        if (IS_MY_TURN) {
            renderAnswers();
            waitingMessage.classList.add('hidden');
            startTimer();
        } else {
            answersContainer.classList.add('hidden');
            waitingMessage.classList.remove('hidden');
            // Таймер не запускаем, но показываем что время идет
            startTimer(); // можно убрать если не нужно
        }
    }
    
    // ===== Отрисовка вариантов ответов =====
    function renderAnswers() {
        const markers = ['A', 'B', 'C', 'D'];
        
        answersContainer.innerHTML = question.options.map((option, index) => `
            <button class="answer-btn" data-answer-index="${index}">
                <span class="answer-marker">${markers[index]}</span>
                <span class="answer-text">${option}</span>
            </button>
        `).join('');
        
        // Добавляем обработчики
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', handleAnswerClick);
        });
    }
    
    // ===== Обработка выбора ответа =====
    function handleAnswerClick(e) {
        if (!canAnswer) return;
        
        const btn = e.currentTarget;
        const answerIndex = parseInt(btn.dataset.answerIndex);
        
        // Убираем выделение с предыдущего ответа
        document.querySelectorAll('.answer-btn').forEach(b => {
            b.classList.remove('selected');
        });
        
        // Выделяем выбранный ответ
        btn.classList.add('selected');
        selectedAnswer = answerIndex;
        
        // Блокируем повторный выбор
        canAnswer = false;
        
        // Отключаем все кнопки
        document.querySelectorAll('.answer-btn').forEach(b => {
            b.disabled = true;
        });
        
        // Останавливаем таймер
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        // Показываем результат (для демо)
        console.log('Selected answer:', question.options[selectedAnswer]);
        
        // Здесь будет переход к результатам
        setTimeout(() => {
            // window.location.href = 'scoreboard.html';
            console.log('Moving to scoreboard...');
        }, 1000);
    }
    
    // ===== Таймер =====
    function startTimer() {
        timeLeft = TIME_LIMIT;
        updateTimerDisplay();
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            // Предупреждение когда осталось мало времени
            if (timeLeft <= 5) {
                timerProgress.classList.add('warning');
            }
            
            // Время вышло
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerText.textContent = '0s';
                timerProgress.style.width = '0%';
                
                // Если это был наш ход и мы не ответили
                if (IS_MY_TURN && canAnswer) {
                    handleTimeout();
                }
            }
        }, 1000);
    }
    
    function updateTimerDisplay() {
        timerText.textContent = `${timeLeft}s`;
        const percentage = (timeLeft / TIME_LIMIT) * 100;
        timerProgress.style.width = `${percentage}%`;
    }
    
    // ===== Обработка истечения времени =====
    function handleTimeout() {
        canAnswer = false;
        
        // Отключаем кнопки
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        console.log('Time is up!');
        
        // Переход к следующему экрану
        setTimeout(() => {
            // window.location.href = 'scoreboard.html';
            console.log('Timeout - moving to scoreboard...');
        }, 1000);
    }
    
    // ===== Запуск =====
    init();
    
    // Экспорт для отладки
    console.log('Quiz initialized. IS_MY_TURN =', IS_MY_TURN);
});