export function redirectIfUnstarted(status) {
    if (status)
        window.location.href = 'quiz.html'
    if (status === false)
        window.location.href = 'leader_board.html'
}