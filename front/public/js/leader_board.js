import {clientGetResults} from "/js/tools/api_client.js";

if (![true, "roomNumber", "playerNickname", "sessionToken", "isAdmin", "questionsCount"].reduce(
    (a, b) => a && (sessionStorage.getItem(b) != null)
)) window.location.href = 'quiz.html'

function getStatusStyle(rank) {
    if (rank === 1) return { class: "first-place", text: "★ 1st place" };
    if (rank === 2) return { class: "second-place", text: "★ 2nd place" };
    if (rank === 3) return { class: "third-place", text: "★ 3rd place" };
    return { color: "another-place", text: rank + "th place" };
}
const result = Object.entries(await clientGetResults(
    sessionStorage.getItem("sessionToken"),
    sessionStorage.getItem("roomNumber")))
result.sort((a, b) => parseInt(b[1]) - parseInt(a[1]))
document.querySelector("#playerCount").textContent = result.length
for (const [i, [nickname, sc]] of result.entries()) {
    const item = document.createElement("div")
    item.classList.add("player-item")
    const info = document.createElement("div")
    info.classList.add("player-info")
    const score = document.createElement("div")
    score.classList.add("player-score")
    score.textContent = sc
    const avatar = document.createElement("div")
    avatar.classList.add("player-avatar")
    avatar.textContent = nickname.charAt(0).toUpperCase()
    info.appendChild(avatar)
    const div = document.createElement("div")
    const name = document.createElement("div")
    name.classList.add("player-name")
    name.textContent = nickname
    const status = document.createElement("div")
    status.classList.add("player-status")
    status.classList.add(getStatusStyle(i + 1).class)
    status.textContent = getStatusStyle(i + 1).text
    div.appendChild(name)
    div.appendChild(status)
    info.appendChild(div)
    item.appendChild(info)
    item.appendChild(score)
    document.querySelector("#playersList").appendChild(item)
}

document.querySelector("button").addEventListener("click", () => {
    sessionStorage.clear()
    window.location.href = 'join.html'
})