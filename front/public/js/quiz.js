import {answerQuestion, clientNextQuestion} from "/js/tools/api_client.js";
import {syncTimeout, reasoningTime} from "/js/tools/mixed.js";

if (![true, "roomNumber", "playerNickname", "sessionToken", "isAdmin", "questionsCount"].reduce(
    (a, b) => a && (sessionStorage.getItem(b) != null)
)) window.location.href = 'lobby.html'

const turnIndicator = document.getElementById('turnIndicator')
const answersContainer = document.getElementById('answersContainer')
const questionText = document.getElementById('questionText')
const currentPlayerSpan = document.getElementById('currentPlayer')
const options = document.querySelectorAll(".answer-text")
const timerProgress = document.getElementById('timerProgress')
const timerText = document.getElementById('timerText')
const questionCounter = document.querySelector(".question-number")
questionCounter.textContent = `question 0 / ${sessionStorage.getItem("questionsCount")}`

function setVariantsVisibility(isAnswering) {
    if (isAnswering) {
        turnIndicator.classList.add('my-turn');
        answersContainer.classList.remove("disappeared_semi")
    } else {
        turnIndicator.classList.remove('my-turn');
        answersContainer.classList.add('disappeared_semi');
    }
}
let doOnce = true
function setAnswered(answered, correct) {
    if (answered === undefined) {
        if (doOnce) {
            questionCounter.textContent =
                `question ${parseInt(questionCounter.textContent.split(' ')[1]) + 1} / 
                ${sessionStorage.getItem("questionsCount")}`
            doOnce = false
        }
        options.forEach((option) => {
            option.parentElement.classList.remove("answer-btn_correct")
            option.parentElement.classList.remove("answer-btn_incorrect")
            option.parentElement.classList.remove('answer-btn_selected');
        })
    } else {
        doOnce = true
        if (answered === correct) {
            options[parseInt(correct)].parentElement.classList.add("answer-btn_correct")
        } else {
            options[parseInt(correct)].parentElement.classList.add("answer-btn_correct")
            if (answered !== -1) {
                options[parseInt(answered)].parentElement.classList.add("answer-btn_incorrect")
            }
        }
    }
}
let fakeTimer = reasoningTime
function timerLoop() {
    timerText.textContent = `${fakeTimer}s`
    timerProgress.style.width = `${(fakeTimer / 20) * 100}%`
    if (fakeTimer <= 5)
        timerProgress.classList.add('warning')
    else
        timerProgress.classList.remove('warning')
    fakeTimer = Math.max(0, fakeTimer - 1)
    setTimeout(timerLoop, 1000)
}
timerLoop()
async function quizLoop() {
    let time = performance.now()
    const response = await clientNextQuestion(sessionStorage.getItem("sessionToken"), sessionStorage.getItem("roomNumber"))
    if (response.error?.includes("No more"))
        window.location.href = 'leader_board.html'
    time = performance.now() - time
    setVariantsVisibility(response.answering === sessionStorage.getItem("playerNickname"))
    questionText.textContent = response.question.text
    currentPlayerSpan.textContent = response.answering
    options.forEach((option, i) => option.textContent = response.question.options[i])

    const timeLeft = Math.max(0, parseFloat(response.time) - time / 2 / 1000)
    if (Math.abs(timeLeft - fakeTimer) >= 1) {
        fakeTimer = Math.round(timeLeft)
    }

    setAnswered(response.question.answered, response.question.correct)

    setTimeout(quizLoop, syncTimeout)
}
quizLoop()

for (const [i, option] of options.entries()) {
    option.parentElement.addEventListener("click", async () => {
        option.parentElement.classList.add('answer-btn_selected');
        await answerQuestion(
            sessionStorage.getItem("sessionToken"),
            sessionStorage.getItem("roomNumber"),
            i)
    })
}
