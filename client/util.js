export const LOBBY = 0;
export const STARTING = 1;
export const PICKING = 2;
export const CHOOSING = 3;
export const CHOSEN = 4;
export const LEADERBOARD = 5;

export function shuffle(arr) {
    let cur = arr.length - 1, ind, temp;
    while (cur > 0) {
        ind = Math.floor(Math.random() * arr.length);
        temp = arr[cur];
        arr[cur--] = arr[ind];
        arr[ind] = temp;
    }
    return arr;
}

export function parseTime(ms) {
    return Math.floor(ms / 60000) + ":" + ("" + Math.floor(ms / 1000) % 60).padStart(2, "0");
}

export function getOrdinal(n) {
    if (n % 100 < 11 || n % 100 > 13) {
        if (n % 10 == 1) return "st";
        if (n % 10 == 2) return "nd";
        if (n % 10 == 3) return "rd"
    }
    return "th";
}

export const blacks = await fetch("/api/blacks").then(x => x.text().then(x => x.split("\n").map(x => x.trim())));
export const whites = await fetch("/api/whites").then(x => x.text().then(x => x.split("\n").map(x => x.trim())));