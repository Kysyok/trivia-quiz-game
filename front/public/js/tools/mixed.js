export function redirectIfUnstarted(status) {
    if (status) {
        sessionStorage.setItem("questionsCount", status)
        window.location.href = 'quiz.html'
    }
    if (status === false)
        window.location.href = 'leader_board.html'
}
