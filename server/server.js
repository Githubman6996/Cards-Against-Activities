import express from "express";
import expressWs from "express-ws";
import dotenv from "dotenv";
import fetch from "node-fetch";

import fs from "fs";
import { CHOOSING, CHOSEN, LEADERBOARD, LOBBY, PICKING, STARTING, shuffle } from "./util.js";

const whites = fs.readFileSync("./whites.txt", { encoding: "utf-8" });
const blacks = fs.readFileSync("./blacks.txt", { encoding: "utf-8" });

const whitesArr = whites.split("\n").map((x) => x.trim());
const blacksArr = blacks.split("\n").map((x) => x.trim());

const whiteInds = Array.from({ length: whitesArr.length }, (x, i) => i);
const blackInds = Array.from({ length: blacksArr.length }, (x, i) => i);

dotenv.config({ path: "../.env" });

const app = express();
expressWs(app);
const router = express.Router();
const port = 3001;

// Allow express to parse JSON bodies
// app.use(express.json());

router.use(express.json());

router.post("/api/token", async (req, res) => {
    // Exchange the code for an access_token
    const response = await fetch(`https://discord.com/api/oauth2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: process.env.VITE_DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: "authorization_code",
            code: req.body.code,
        }),
    });

    // Retrieve the access_token from the response
    const { access_token } = await response.json();

    // Return the access_token to our client as { access_token: "..."}
    res.send({ access_token });
});

class JSet extends Set {
    constructor(...a) {
        super(...a);
    }
    toJSON() {
        return [...this];
    }
}

/**
 * @type {Object.<string, WebSocket>}
 */
const clients = (global.clients = Object.create(null));
/**
 * @type {Set.<string>}
 */
const uids = new Set();
/**
 * @type {Object.<string, Room>}
 */
const rooms = Object.create(null);
/**
 * @type {Object.<string, string>}
 */
const ids = Object.create(null);

const TimeoutClass = setTimeout(() => {}, 0).constructor;

class Room {
    name;
    channelId;
    state = LOBBY;
    users = new JSet();
    userData = Object.create(null);
    nextTimestamp = -1;
    starting = false;
    started = false;
    roundsLeft = 10;
    whiteCards = shuffle([...whiteInds]);
    blackCards = shuffle([...blackInds]);
    cardsPerUser = 20;
    promptCard;
    history = [];
    needed = 0;
    host = 0;
    winner = null;
    betWon = false;
    rounds = 10;
    shuffled = [];
    constructor(name, channelId) {
        this.name = name;
        this.channelId = channelId;
        this.roundsLeft = this.rounds = 10;
    }
    static numPick(card) {
        return Math.max(blacksArr[card].match(/ *_+ */g)?.length || 1, 1);
    }
    updateUsers() {
        this.host = Math.max(0, this.host % this.users.size);
        const data = Object.assign({}, this);
        let s = JSON.stringify({ event: "roomData", data }, (key, value) => {
            if (value instanceof TimeoutClass) return;
            return value;
        });
        for (const user of this.users) clients[ids[user]].send(s);
    }
    isHost(id) {
        let i = 0;
        for (let user of this.users) if (i++ == this.host) return user == id;
        // return id == [...this.users][this.host]
    }
    getHost() {
        let i = 0;
        for (let user of this.users) if (i++ == this.host) return user;
        // return id == [...this.users][this.host]
    }
    addUser(id, avatar, name) {
        this.users.add(id);
        this.cardsPerUser = Math.min(20, Math.floor(whitesArr.length / (this.users.size - 1)));
        if (!(id in this.userData)) {
            this.userData[id] = {
                deck: [],
                score: 0,
                cards: [],
                bet: [],
                ready: false,
                avatar,
                name,
            };
            while (this.userData[id].deck.length < this.cardsPerUser) this.userData[id].deck.push(this.whiteCards.pop());
        }
        this.shuffled = shuffle(this.shuffled.concat(id));
        this.updateUsers();
    }
    removeUser(id) {
        // while (this.userData[id].deck.length > 0) this.whiteCards.unshift(this.userData[id].deck.pop());
        // delete this.userData[id];
        if ([...this.users].indexOf(id) < this.host) this.host--;
        this.users.delete(id);
        this.shuffled.splice(this.shuffled.indexOf(id), 1);
        this.cardsPerUser = Math.min(20, Math.floor(whitesArr.length / (this.users.size - 1)));
        this.updateUsers();
    }
    startingTimeout = null;
    readyUser(id, state = true) {
        this.userData[id].ready = state;
        clearTimeout(this.startingTimeout);
        if (this.state == PICKING) {
            if (this.userData[id].cards.length != this.needed) this.userData[id].ready = false;
            else {
                this.userData[this.getHost()] && (this.userData[this.getHost()].ready = false);
                if (this.numReady() == this.users.size - 1) {
                    this.state = CHOOSING;
                }
            }
        } else if (this.state == CHOOSING) {
            if (this.isHost(id) && !state) {
                clearTimeout(this.winnerTimeout);
                this.nextTimestamp = -1;
            }
        } else if (state && this.everyoneReady()) {
            this.nextTimestamp = Date.now() + 5000;
            this.starting = true;
            this.state = STARTING;
            this.history = [];
            for (const user of this.users) this.userData[user].score = 0;
            this.startingTimeout = setTimeout(() => {
                this.state = PICKING;
                this.nextTimestamp = -1;
                this.startRound();
                this.updateUsers();
            }, 5000);
        } else {
            this.nextTimestamp = -1;
            this.starting = false;
            this.state = LOBBY;
        }
        this.updateUsers();
    }
    winnerTimeout = null;
    chooseWinner(id, winner, bet = false) {
        if (!this.isHost(id) || this.state != CHOOSING) return;
        this.nextTimestamp = Date.now() + 5000;
        this.winnerTimeout = setTimeout(() => {
            this.state = CHOSEN;
            this.winner = winner;
            this.betWon = bet;

            this.userData[winner].score++;
            this.history.push([this.promptCard, winner, [...this.userData[winner].cards]]);

            this.nextTimestamp = Date.now() + 10000;
            this.winnerTimeout = setTimeout(() => {
                this.state = PICKING;
                this.host = (this.host + 1) % this.users.size;
                this.nextTimestamp = -1;
                if (--this.roundsLeft == 0) {
                    this.state = LEADERBOARD;
                    this.roundsLeft = this.rounds;
                    for (const user in this.userData) {
                        while (this.userData[user].deck.length) this.whiteCards.unshift(this.userData[user].deck.pop());
                        Object.assign(this.userData[user], {
                            cards: [],
                            bet: [],
                            ready: false,
                        });
                    }
                } else this.startRound();
                this.updateUsers();
            }, 10000);
            this.updateUsers();
        }, 5000);
        this.updateUsers();
    }
    numReady() {
        let num = 0;
        for (const user of this.users) if (this.userData[user].ready) num++;
        return num;
    }
    everyoneReady() {
        for (const user of this.users) if (!this.userData[user].ready) return false;
        return true;
    }
    setRounds(id, n) {
        if (!this.isHost(id) || this.state != LOBBY || !n) return;
        this.rounds = this.roundsLeft = n;
        this.updateUsers();
    }
    startRound() {
        for (const user of this.users) {
            this.userData[user].ready = false;
            this.userData[user].deck = this.userData[user].deck.filter((x) => !this.userData[user].cards.includes(x) && !this.userData[user].bet.includes(x));
            while (this.userData[user].deck.length < this.cardsPerUser) this.userData[user].deck.push(this.whiteCards.pop());
            while (this.userData[user].cards.length > 0) this.whiteCards.unshift(this.userData[user].cards.pop());
            while (this.userData[user].bet.length > 0) this.whiteCards.unshift(this.userData[user].bet.pop());
        }
        shuffle(this.shuffled);
        this.promptCard = this.blackCards.pop();
        this.needed = Room.numPick(this.promptCard);
        this.updateUsers();
    }
    submitCards(id, cards) {
        if (this.isHost(id) || this.userData[id]?.ready) return;
        this.userData[id].cards = cards;
        this.userData[id].bet = [];
        this.updateUsers();
    }
    betCards(id, cards) {
        if (cards.length != this.needed) return;
        let same = true;
        for (let i = 0; i < cards.length; i++)
            if (cards[i] != this.userData[id].cards[i]) {
                same = false;
                break;
            }
        if (same) return;
        this.userData[id].bet = cards;
        this.updateUsers();
    }
}

function guid() {
    return `${randHex(8)}-${randHex(4)}-${randHex(4)}-${randHex(4)}-${randHex(12)}`;
}

function randHex(length) {
    return Math.random()
        .toString(16)
        .slice(2, 2 + length);
}

setInterval(
    (s) => {
        for (const uid of uids) clients[uid].send(s);
    },
    30000,
    '{"event":"ping"}'
);

router.get("/api/whites", (req, res) => {
    res.status(200).send(whites);
});
router.get("/api/blacks", (req, res) => {
    res.status(200).send(blacks);
});

router.ws(
    "/api/ws",
    /**@param {WebSocket} ws*/ (ws) => {
        const uuid = guid();
        clients[uuid] = ws;
        uids.add(uuid);
        ws.send(JSON.stringify({ event: "clientId", data: uuid }));
        ws.on("message", (data) => {
            if (data == '{"event":"pong"}') return;
            let msg;
            try {
                msg = JSON.parse(data);
            } catch {
                msg = data;
            }
            if (msg.event) {
                switch (msg.event) {
                    case "userData":
                        ws.data = msg.data;
                        ids[msg.data.userId] = uuid;
                        if (!(msg.data.channelId in rooms)) rooms[msg.data.channelId] = new Room(msg.data.roomName, msg.data.channelId);
                        const room = rooms[msg.data.channelId];
                        room.addUser(msg.data.userId, msg.data.avatar, msg.data.name);
                        return;
                    case "ready":
                        rooms[ws.data.channelId].readyUser(ws.data.userId, msg.data);
                        return;
                    case "reqUserData": {
                        ws.send(JSON.stringify({ event: "resUserData", data: clients[ids[msg.data]].data }));
                        return;
                    }
                    case "submitCards": {
                        rooms[ws.data.channelId].submitCards(ws.data.userId, msg.data);
                        return;
                    }
                    case "setRounds": {
                        rooms[ws.data.channelId].setRounds(ws.data.userId, msg.data);
                        return;
                    }
                    case "chooseWinner": {
                        rooms[ws.data.channelId].chooseWinner(ws.data.userId, msg.data);
                        return;
                    }
                }
            }
            console.log(msg, JSON.stringify(data));
        });
        ws.on("close", () => {
            delete clients[uuid];
            uids.delete(uuid);
            if (ws.data?.channelId in rooms) {
                const room = rooms[ws.data.channelId];
                room.removeUser(ws.data.userId);
                if (room.users.size == 0) {
                    delete rooms[ws.data.channelId];
                }
            }
        });
    }
);

// app.use("/discord/*", function (req, res) {
//     console.log(`https://discord.com/${req.originalUrl.slice("/discord/".length)}`);
//     res.redirect(`https://discord.com/${req.originalUrl.slice("/discord/".length)}`);
// })

app.use("/", router);
// app.use("/api/whites", function (req, res) {
//     res.send(whites)
// });
// app.use("/api/blacks", function (req, res) {
//     res.send(blacks)
// });

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
