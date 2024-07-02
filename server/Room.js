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

// class Room {
//     name;
//     channelId;
//     state = LOBBY;
//     users = new Set();
//     userData = Object.create(null);
//     nextTimestamp = -1;
//     starting = false;
//     started = false;
//     roundsLeft = 10;
//     whiteCards = shuffle([...whiteInds]);
//     blackCards = shuffle([...blackInds]);
//     cardsPerUser = 10;
//     promptCard;
//     history = [];
//     needed = 0;
//     host = 0;
//     winner = null;
//     betWon = false;
//     constructor(name, channelId, host) {
//         this.name = name;
//         this.channelId = channelId;
//     }
//     static numPick(card) {
//         return blacks[card].match(/ *_+ */g)?.length || 0;
//     }
//     updateUsers() {
//         for (const user of this.users) {
//             // send lobby to users
//         }
//     }
//     isHost(id) {
//         let i = 0;
//         for (let user of this.users)
//             if (i++ == this.host)
//                 return user == id;
//         // return id == [...this.users][this.host]
//     }
//     addUser(id, avatar, name) {
//         this.userData[id] = {
//             deck: [],
//             score: 0,
//             cards: [],
//             bet: [],
//             ready: false,
//             avatar,
//             name
//         }
//         this.users.add(id);
//         this.cardsPerUser = Math.min(10, Math.floor(whites.length / (this.users.size - 1)));
//         this.updateUsers();
//     }
//     removeUser(id) {
//         delete this.userData[id];
//         this.users.delete(id);
//         this.cardsPerUser = Math.min(10, Math.floor(whites.length / (this.users.size - 1)));
//         this.updateUsers();
//     }
//     startingTimeout = null;
//     readyUser(id, state = true) {


//         this.userData[id].ready = state;
//         clearTimeout(this.startingTimeout);
//         if (this.state == PICKING) {
//             if (this.userData[id].cards.length != this.needed) this.userData[id].ready = false;
//         } else if (this.state == CHOOSING) {
//             if (this.isHost(id)) {
//                 clearTimeout(this.winnerTimeout);
//                 this.nextTimestamp = -1;
//             }
//         } else if (this.started) {
//             if (this.everyoneReady()) {
//                 this.state = CHOOSING;
//             }
//         } else if (state && this.everyoneReady()) {
//             this.nextTimestamp = Date.now() + 5000;
//             this.starting = true;
//             this.state = STARTING;
//             this.startingTimeout = setTimeout(() => {
//                 this.state = PICKING;
//                 this.nextTimestamp = -1;
//                 this.startRound();
//                 this.updateUsers();
//             }, 5000);
//         } else {
//             this.nextTimestamp = -1;
//             this.starting = false;
//             this.state = LOBBY;
//         }
//         this.updateUsers();
//     }
//     winnerTimeout = null;
//     chooseWinner(id, winner, bet = false) {
//         if (!this.isHost(id) || this.state != CHOOSING) return;
//         this.nextTimestamp = Date.now() + 5000;
//         this.winnerTimeout = setTimeout(() => {
//             this.state = CHOSEN;
//             this.winner = winner;
//             this.betWon = bet;

//             this.userData[winner].score++;
//             this.history.push([this.promptCard, winner, this.userData[winner][bet ? "bet" : "cards"]]);

//             this.nextTimestamp = Date.now() + 10000;
//             this.winnerTimeout = setTimeout(() => {
//                 this.state = PICKING;
//                 this.host = (this.host + 1) % this.users.size;
//                 this.nextTimestamp = -1;
//                 if (--this.roundsLeft == 0) this.state = LEADERBOARD;
//                 else this.startRound();
//                 this.updateUsers();
//             }, 10000)
//             this.updateUsers();
//         }, 5000);
//         this.updateUsers();
//     }
//     everyoneReady() {
//         for (const user of this.users)
//             if (!this.userData[user].ready)
//                 return false;
//         return true;
//     }
//     setRounds(id, n) {
//         if (!this.isHost(id) || this.state != LOBBY) return;
//         this.roundsLeft = n;
//         this.updateUsers();
//     }
//     startRound() {
//         for (const user of this.users) {
//             this.userData[user].ready = false;
//             while (this.userData[user].deck.length < this.cardsPerUser)
//                 this.userData[user].deck.push(this.whiteCards.pop());
//             this.userData[user].cards = this.userData[user].bet = [];
//         }
//         this.promptCard = this.blackCards.pop();
//         this.needed = Room.numPick(this.promptCard);
//         this.updateUsers();
//     }
//     submitCards(id, cards) {
//         if (this.isHost(id)) return;
//         this.userData[id].cards = cards;
//         this.userData[id].bet = [];
//         this.updateUsers();
//     }
//     betCards(id, cards) {
//         if (cards.length != this.needed) return;
//         let same = true;
//         for (let i = 0; i < cards.length; i++)
//             if (cards[i] != this.userData[id].cards[i]) {
//                 same = false;
//                 break;
//             }
//         if (same) return;
//         this.userData[id].bet = cards;
//         this.updateUsers();
//     }
// }