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

export const LOBBY = 0;
export const STARTING = 1;
export const PICKING = 2;
export const CHOOSING = 3;
export const CHOSEN = 4;
export const LEADERBOARD = 5;